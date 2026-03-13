package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.RegisterRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.DuplicateResourceException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegisterService extends BaseService<RegisterRequest, AuthResponse> {

  private final AuthRepository authRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  @Override
  @Transactional
  public AuthResponse execute(RegisterRequest request) {
    return super.execute(request);
  }

  @Override
  protected AuthResponse doProcess(RegisterRequest request) {
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
