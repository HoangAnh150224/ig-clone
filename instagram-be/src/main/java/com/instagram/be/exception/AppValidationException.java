package com.instagram.be.exception;

import com.instagram.be.base.exception.BaseException;
import org.springframework.http.HttpStatus;

public class AppValidationException extends BaseException {

    public AppValidationException(String message) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }
}
