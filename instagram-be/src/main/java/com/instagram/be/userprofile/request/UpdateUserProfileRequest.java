package com.instagram.be.userprofile.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.userprofile.enums.Gender;
import com.instagram.be.userprofile.enums.TagPermission;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdateUserProfileRequest extends BaseRequest {
    private String fullName;
    private String bio;
    private String website;
    private Gender gender;
    private String avatarUrl;
    private boolean privateAccount;
    private boolean showActivityStatus;
    private TagPermission tagPermission;
}
