package com.instagram.be.auth.response;

import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.Gender;
import com.instagram.be.userprofile.enums.TagPermission;
import com.instagram.be.userprofile.enums.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public record MeResponse(
  UUID id,
  String username,
  String email,
  String fullName,
  String bio,
  String avatarUrl,
  String website,
  String pronouns,
  String profileCategory,
  Gender gender,
  String phoneNumber,
  boolean verified,
  boolean privateAccount,
  boolean showActivityStatus,
  TagPermission tagPermission,
  UserRole role,
  LocalDateTime createdAt) {

  public static MeResponse from(UserProfile user) {
    return new MeResponse(
      user.getId(),
      user.getUsername(),
      user.getEmail(),
      user.getFullName(),
      user.getBio(),
      user.getAvatarUrl(),
      user.getWebsite(),
      user.getPronouns(),
      user.getProfileCategory(),
      user.getGender(),
      user.getPhoneNumber(),
      user.isVerified(),
      user.isPrivateAccount(),
      user.isShowActivityStatus(),
      user.getTagPermission(),
      user.getRole(),
      user.getCreatedAt()
    );
  }
}
