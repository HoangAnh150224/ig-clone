package com.instagram.be.message.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.instagram.be.base.request.BaseRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SendMessageRequest extends BaseRequest {

    private UUID recipientId;
    private String content;
    private String mediaUrl;
    private String mediaType;
    private UUID sharedPostId;
}
