package com.instagram.be.follow.request;

import com.instagram.be.base.request.PaginatedRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FollowListRequest extends PaginatedRequest {

  private UUID targetUserId;
}
