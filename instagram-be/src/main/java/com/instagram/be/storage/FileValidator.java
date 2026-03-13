package com.instagram.be.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileValidator {
    void validate(MultipartFile file);
}
