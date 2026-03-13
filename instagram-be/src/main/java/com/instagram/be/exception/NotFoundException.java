package com.instagram.be.exception;

import com.instagram.be.base.exception.BaseException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

public class NotFoundException extends BaseException {

    public NotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    public NotFoundException(String resourceName, UUID id) {
        super(resourceName + " not found with id: " + id, "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
