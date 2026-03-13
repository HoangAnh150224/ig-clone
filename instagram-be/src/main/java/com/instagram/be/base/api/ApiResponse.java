package com.instagram.be.base.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;
    private String message;
    private int code;
    private T data;
    @Builder.Default
    private List<ErrorDetail> errors = new ArrayList<>();
    private ResponseMetadata metadata;
    private PaginationInfo pagination;
    @Builder.Default
    private List<Link> links = new ArrayList<>();
    @Builder.Default
    private Map<String, Object> additionalInfo = new HashMap<>();
    @Builder.Default
    private Instant timestamp = Instant.now();

    public static <T> ApiResponse<T> success(T data, String message, int code) {
        return ApiResponse.<T>builder()
                .status("SUCCESS")
                .message(message)
                .code(code)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message, int code, ResponseMetadata metadata) {
        return ApiResponse.<T>builder()
                .status("SUCCESS")
                .message(message)
                .code(code)
                .data(data)
                .metadata(metadata)
                .build();
    }

    public static <T> ApiResponse<T> error(String message, int code, ErrorDetail error) {
        return ApiResponse.<T>builder()
                .status("ERROR")
                .message(message)
                .code(code)
                .errors(List.of(error))
                .build();
    }

    public static <T> ApiResponse<T> error(String message, int code, List<ErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .status("ERROR")
                .message(message)
                .code(code)
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> simpleError(String message, int code) {
        return ApiResponse.<T>builder()
                .status("ERROR")
                .message(message)
                .code(code)
                .build();
    }
}
