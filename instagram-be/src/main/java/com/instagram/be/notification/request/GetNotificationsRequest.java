package com.instagram.be.notification.request;

import com.instagram.be.base.request.BaseRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GetNotificationsRequest extends BaseRequest {

  private int page = 0;
  private int size = 20;
}
