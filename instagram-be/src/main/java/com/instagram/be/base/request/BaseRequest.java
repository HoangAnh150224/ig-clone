package com.instagram.be.base.request;

import com.instagram.be.base.UserContext;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseRequest {

    @Schema(hidden = true)
    private UUID requestId;

    @Schema(hidden = true)
    private UserContext userContext;

    @Schema(hidden = true)
    private LocalDateTime createdAt;

    public void validate() { }

    public String toLogString() {
        return String.format("%s[requestId=%s]", this.getClass().getSimpleName(), requestId);
    }

    public void initialize() {
        if (requestId == null) requestId = UUID.randomUUID();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
