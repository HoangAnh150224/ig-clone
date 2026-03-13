package com.instagram.be.auth.request;

import com.instagram.be.base.request.BaseRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoginRequest extends BaseRequest {

  @NotBlank(message = "Identifier is required")
  private String identifier;

  @NotBlank(message = "Password is required")
  private String password;
}
