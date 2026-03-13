package com.instagram.be.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class FileValidationService implements FileValidator {

    private static final long MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    private static final long MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList("video/mp4", "video/quicktime", "video/webm");

    @Override
    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or null.");
        }

        String mimeType = file.getContentType();
        if (mimeType == null) {
            throw new InvalidFileException("Could not determine file's MIME type.");
        }

        boolean isImage = ALLOWED_IMAGE_TYPES.stream().anyMatch(mimeType::equalsIgnoreCase);
        boolean isVideo = ALLOWED_VIDEO_TYPES.stream().anyMatch(mimeType::equalsIgnoreCase);

        if (!isImage && !isVideo) {
            throw new InvalidFileException("Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, QuickTime, WebM) are allowed.");
        }

        if (isImage && file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new InvalidFileException("Image size exceeds the limit of 10 MB.");
        }

        if (isVideo && file.getSize() > MAX_VIDEO_SIZE_BYTES) {
            throw new InvalidFileException("Video size exceeds the limit of 50 MB.");
        }
        
        // Placeholder for virus scan
        mockVirusScan(file);
    }
    
    private void mockVirusScan(MultipartFile file) {
        // In a real application, this would integrate with a virus scanning service (e.g., ClamAV).
        // For this task, we'll just simulate a successful scan.
        // To simulate a failure, you could throw an exception here.
        // For example:
        // if (file.getOriginalFilename() != null && file.getOriginalFilename().contains("virus")) {
        //     throw new InvalidFileException("Virus detected in file.");
        // }
    }
}
