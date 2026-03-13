package com.instagram.be.auth.request;

import com.instagram.be.base.request.BaseRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ForgotPasswordRequest extends BaseRequest {

  @NotBlank(message = "Email is required")
  @Email(message = "Invalid email format")
  private String email;
}
