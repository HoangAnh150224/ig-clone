package com.instagram.be.storage;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class FileValidationServiceTest {

    private FileValidationService fileValidationService;

    @BeforeEach
    void setUp() {
        fileValidationService = new FileValidationService();
    }

    @DisplayName("Should pass for valid image files")
    @ParameterizedTest
    @ValueSource(strings = {"image/jpeg", "image/png", "image/gif", "image/webp"})
    void validate_ValidImage_ShouldPass(String mimeType) {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "hello.jpg",
                mimeType,
                new byte[1024] // 1 KB
        );
        assertDoesNotThrow(() -> fileValidationService.validate(file));
    }

    @DisplayName("Should pass for valid video files")
    @ParameterizedTest
    @ValueSource(strings = {"video/mp4", "video/quicktime", "video/webm"})
    void validate_ValidVideo_ShouldPass(String mimeType) {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "hello.mp4",
                mimeType,
                new byte[10 * 1024 * 1024] // 10 MB
        );
        assertDoesNotThrow(() -> fileValidationService.validate(file));
    }

    @Test
    @DisplayName("Should throw exception for empty file")
    void validate_EmptyFile_ShouldThrowException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.txt",
                "text/plain",
                new byte[0]
        );
        assertThrows(InvalidFileException.class, () -> fileValidationService.validate(file));
    }

    @Test
    @DisplayName("Should throw exception for invalid MIME type")
    void validate_InvalidMimeType_ShouldThrowException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "document.pdf",
                "application/pdf",
                new byte[1024]
        );
        assertThrows(InvalidFileException.class, () -> fileValidationService.validate(file));
    }

    @Test
    @DisplayName("Should throw exception for image exceeding size limit")
    void validate_ImageTooLarge_ShouldThrowException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.jpg",
                "image/jpeg",
                new byte[11 * 1024 * 1024] // 11 MB
        );
        assertThrows(InvalidFileException.class, () -> fileValidationService.validate(file));
    }

    @Test
    @DisplayName("Should throw exception for video exceeding size limit")
    void validate_VideoTooLarge_ShouldThrowException() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.mp4",
                "video/mp4",
                new byte[51 * 1024 * 1024] // 51 MB
        );
        assertThrows(InvalidFileException.class, () -> fileValidationService.validate(file));
    }
}
