package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.ChangePasswordRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChangePasswordService extends BaseService<ChangePasswordRequest, Void> {

  private final AuthRepository authRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public Void execute(ChangePasswordRequest request) {
    return super.execute(request);
  }

  @Override
  protected Void doProcess(ChangePasswordRequest request) {
    UUID userId = request.getUserContext().getUserId();
    UserProfile user = authRepository.findById(userId)
      .orElseThrow(() -> new NotFoundException("User", userId));

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
      throw new AppValidationException("Current password is incorrect");
    }

    if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
      throw new AppValidationException("New password must differ from current password");
    }

    user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
    authRepository.save(user);
    return null;
  }
}
