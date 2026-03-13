package com.instagram.be.auth.request;

import com.instagram.be.base.request.BaseRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ResetPasswordRequest extends BaseRequest {

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  private String email;

  @NotBlank(message = "OTP is required")
  private String otp;

  @NotBlank(message = "New password is required")
  @Size(min = 8, message = "New password must be at least 8 characters")
  private String newPassword;
}
