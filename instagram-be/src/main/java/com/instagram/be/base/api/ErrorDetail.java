package com.instagram.be.base.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetail {
  private String field;           // null for general errors
  private Object rejectedValue;
  private String message;
  private String code;            // e.g. "FIELD_REQUIRED", "DUPLICATE_ENTRY"

  public static ErrorDetail fieldError(String field, Object rejectedValue, String message, String code) {
    return ErrorDetail.builder()
      .field(field)
      .rejectedValue(rejectedValue)
      .message(message)
      .code(code)
      .build();
  }

  public static ErrorDetail generalError(String message, String code) {
    return ErrorDetail.builder()
      .message(message)
      .code(code)
      .build();
  }
}
