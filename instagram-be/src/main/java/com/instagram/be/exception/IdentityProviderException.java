package com.instagram.be.exception;

import com.instagram.be.base.exception.BaseException;
import org.springframework.http.HttpStatus;

public class IdentityProviderException extends BaseException {

  public IdentityProviderException(String message) {
    super(message, "IDENTITY_PROVIDER_ERROR", HttpStatus.BAD_GATEWAY);
  }
}
