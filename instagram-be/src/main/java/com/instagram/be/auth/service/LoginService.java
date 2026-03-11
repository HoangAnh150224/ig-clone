package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.LoginRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LoginService extends BaseService<LoginRequest, AuthResponse> {

    private static final String RATE_LIMIT_PREFIX = "rate:login:";
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_MINUTES = 15;

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    @Override
    protected AuthResponse doProcess(LoginRequest request) {
        String ip = request.getUserContext() != null ? request.getUserContext().getIpAddress() : "unknown";
        String rateLimitKey = RATE_LIMIT_PREFIX + ip;

        String attempts = redisTemplate.opsForValue().get(rateLimitKey);
        if (attempts != null && Integer.parseInt(attempts) >= MAX_ATTEMPTS) {
            throw new BusinessException("Too many login attempts. Please try again later.",
                    HttpStatus.TOO_MANY_REQUESTS);
        }

        UserProfile user = authRepository.findByUsername(request.getIdentifier())
                .or(() -> authRepository.findByEmail(request.getIdentifier()))
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            Long newCount = redisTemplate.opsForValue().increment(rateLimitKey);
            if (Long.valueOf(1).equals(newCount)) {
                redisTemplate.expire(rateLimitKey, LOCKOUT_MINUTES, TimeUnit.MINUTES);
            }
            throw new BusinessException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new BusinessException("Account is inactive");
        }

        redisTemplate.delete(rateLimitKey);

        String token = jwtUtil.generateToken(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()
        );

        return AuthResponse.of(
                token,
                jwtUtil.getRemainingTtlSeconds(token),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
