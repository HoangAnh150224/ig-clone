package com.instagram.be.userprofile.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.userprofile.enums.Gender;
import com.instagram.be.userprofile.enums.TagPermission;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdateUserProfileRequest extends BaseRequest {
    @Size(max = 100)
    private String fullName;
    @Size(max = 150)
    private String bio;
    @Size(max = 200)
    @org.hibernate.validator.constraints.URL
    private String website;
    private Gender gender;
    private String avatarUrl;
    private boolean privateAccount;
    private boolean showActivityStatus;
    private TagPermission tagPermission;
}
