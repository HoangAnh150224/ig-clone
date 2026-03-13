package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.LoginRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.redis.RedisKeys;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LoginService extends BaseService<LoginRequest, AuthResponse> {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_MINUTES = 15;

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    protected AuthResponse doProcess(LoginRequest request) {
        String ip = request.getUserContext() != null ? request.getUserContext().getIpAddress() : "unknown";
        String rateLimitKey = RedisKeys.rateLogin(ip);

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
            throw new BusinessException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            user.setActive(true);
            authRepository.save(user);
        }

        redisTemplate.delete(rateLimitKey);

        String token = jwtUtil.generateToken(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()
        );

        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        long refreshTtlSeconds = jwtUtil.getRefreshExpirationMs() / 1000;
        redisTemplate.opsForValue().set(RedisKeys.refresh(user.getId()), refreshToken, refreshTtlSeconds, TimeUnit.SECONDS);

        return AuthResponse.of(
                token,
                refreshToken,
                jwtUtil.getRemainingTtlSeconds(token),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
