package com.instagram.be.exception;

import com.instagram.be.base.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BaseException {

  public DuplicateResourceException(String message) {
    super(message, "RESOURCE_EXISTED", HttpStatus.CONFLICT);
  }
}
