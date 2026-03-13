package com.instagram.be.auth.request;

import com.instagram.be.base.request.BaseRequest;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class RefreshTokenRequest extends BaseRequest {
    @NotBlank
    private String refreshToken;
}
