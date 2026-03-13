package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.RegisterRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.base.redis.RedisKeys;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.DuplicateResourceException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RegisterService extends BaseService<RegisterRequest, AuthResponse> {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RateLimiter rateLimiter;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional
    public AuthResponse execute(RegisterRequest request) {
        return super.execute(request);
    }

    @Override
    protected AuthResponse doProcess(RegisterRequest request) {
        String ip = request.getUserContext() != null ? request.getUserContext().getIpAddress() : "unknown";
        rateLimiter.check(RedisKeys.rateRegister(ip), 5, 60);

        if (authRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }
        if (authRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        UserProfile user = UserProfile.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.USER)
                .build();

        user = authRepository.save(user);

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
