package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.ForgotPasswordRequest;
import com.instagram.be.base.service.BaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForgotPasswordService extends BaseService<ForgotPasswordRequest, Void> {

  static final String OTP_PREFIX = "reset:otp:";
  static final long OTP_TTL_MINUTES = 15;
  private static final SecureRandom RANDOM = new SecureRandom();

  private final AuthRepository authRepository;
  private final StringRedisTemplate redisTemplate;
  private final JavaMailSender mailSender;

  @Override
  protected Void doProcess(ForgotPasswordRequest request) {
    String email = request.getEmail().toLowerCase().trim();

    // Always return success to prevent email enumeration
    authRepository.findByEmail(email).ifPresent(user -> {
      String otp = String.format("%06d", RANDOM.nextInt(1_000_000));
      String redisKey = OTP_PREFIX + email;
      redisTemplate.opsForValue().set(redisKey, user.getId().toString() + ":" + otp,
        OTP_TTL_MINUTES, TimeUnit.MINUTES);

      try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp
          + "\nThis OTP expires in " + OTP_TTL_MINUTES + " minutes."
          + "\nIf you did not request this, please ignore this email.");
        mailSender.send(message);
        log.debug("Password reset OTP sent to: {}", email);
      } catch (Exception e) {
        log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
      }
    });

    return null;
  }
}
