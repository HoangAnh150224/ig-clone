package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.ResetPasswordRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResetPasswordService extends BaseService<ResetPasswordRequest, Void> {

    private final AuthRepository authRepository;
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Void execute(ResetPasswordRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(ResetPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String redisKey = ForgotPasswordService.OTP_PREFIX + email;

        String stored = redisTemplate.opsForValue().get(redisKey);
        if (stored == null) {
            throw new AppValidationException("OTP has expired or is invalid");
        }

        String[] parts = stored.split(":", 2);
        if (parts.length != 2 || !parts[1].equals(request.getOtp())) {
            throw new AppValidationException("Invalid OTP");
        }

        UUID userId = UUID.fromString(parts[0]);
        UserProfile user = authRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User", userId));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        authRepository.save(user);
        redisTemplate.delete(redisKey);

        log.debug("Password reset successful for: {}", email);
        return null;
    }
}
