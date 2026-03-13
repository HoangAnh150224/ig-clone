package com.instagram.be.favorite.request;

import com.instagram.be.base.request.BaseRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class FavoriteRequest extends BaseRequest {

  private UUID targetId;
}
