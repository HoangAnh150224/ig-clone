package com.instagram.be.storage;

import com.instagram.be.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFileException extends BusinessException {
    public InvalidFileException(String message) {
        super(message);
    }
}
