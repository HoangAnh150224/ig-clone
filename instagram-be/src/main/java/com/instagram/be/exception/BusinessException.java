package com.instagram.be.exception;

import com.instagram.be.base.exception.BaseException;
import org.springframework.http.HttpStatus;

public class BusinessException extends BaseException {

    public BusinessException(String message) {
        super(message, "BUSINESS_ERROR", HttpStatus.BAD_REQUEST);
    }

    public BusinessException(String message, HttpStatus httpStatus) {
        super(message, "BUSINESS_ERROR", httpStatus);
    }
}
