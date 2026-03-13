package com.instagram.be.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.instagram.be.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

  private final Cloudinary cloudinary;

  /**
   * Upload a file to Cloudinary.
   *
   * @param file   the multipart file to upload
   * @param folder the Cloudinary folder (e.g. "posts", "stories", "avatars", "highlights")
   * @return UploadResult with the secure URL and public_id
   */
  public UploadResult upload(MultipartFile file, String folder) {
    try {
      Map<?, ?> result = cloudinary.uploader().upload(
        file.getBytes(),
        ObjectUtils.asMap(
          "folder", folder,
          "resource_type", "auto"
        )
      );
      String url = (String) result.get("secure_url");
      String publicId = (String) result.get("public_id");
      return new UploadResult(url, publicId);
    } catch (IOException e) {
      throw new BusinessException("Failed to upload file: " + e.getMessage());
    }
  }

  /**
   * Delete a file from Cloudinary by its public_id.
   */
  public void delete(String publicId) {
    try {
      cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "auto"));
    } catch (IOException e) {
      throw new BusinessException("Failed to delete file: " + e.getMessage());
    }
  }

  public record UploadResult(String url, String publicId) {
  }
}
