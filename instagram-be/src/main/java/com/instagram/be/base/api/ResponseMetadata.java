package com.instagram.be.base.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMetadata {
    private String requestId;
    private String apiVersion;
    private String traceId;
}
