package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.RefreshTokenRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.redis.RedisKeys;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService extends BaseService<RefreshTokenRequest, AuthResponse> {

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final AuthRepository authRepository;

    @Override
    protected AuthResponse doProcess(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // Validate it's a valid, non-expired refresh token
        if (!jwtUtil.isTokenValid(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new BusinessException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }

        UUID userId = jwtUtil.extractUserId(refreshToken);

        // Check Redis — token must match stored value
        String storedToken = redisTemplate.opsForValue().get(RedisKeys.refresh(userId));
        if (!refreshToken.equals(storedToken)) {
            throw new BusinessException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }

        UserProfile user = authRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.UNAUTHORIZED));

        if (!user.isActive()) {
            throw new BusinessException("Account is deactivated", HttpStatus.FORBIDDEN);
        }

        // Generate new token pair (rotation)
        String newAccessToken = jwtUtil.generateToken(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole().name()
        );
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Update Redis with new refresh token
        long refreshTtlSeconds = jwtUtil.getRefreshExpirationMs() / 1000;
        redisTemplate.opsForValue().set(RedisKeys.refresh(userId), newRefreshToken, refreshTtlSeconds, TimeUnit.SECONDS);

        return AuthResponse.of(
                newAccessToken,
                newRefreshToken,
                jwtUtil.getRemainingTtlSeconds(newAccessToken),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
