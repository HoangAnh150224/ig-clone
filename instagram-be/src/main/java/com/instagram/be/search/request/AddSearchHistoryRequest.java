package com.instagram.be.search.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.exception.AppValidationException;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AddSearchHistoryRequest extends BaseRequest {

  private UUID searchedUserId;
  private UUID hashtagId;

  @Override
  public void validate() {
    super.validate();
    if (searchedUserId == null && hashtagId == null) {
      throw new AppValidationException("Either searchedUserId or hashtagId must be provided");
    }
    if (searchedUserId != null && hashtagId != null) {
      throw new AppValidationException("Only one of searchedUserId or hashtagId can be provided");
    }
  }
}
