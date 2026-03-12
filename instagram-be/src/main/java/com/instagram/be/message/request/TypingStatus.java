package com.instagram.be.message.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingStatus {
    private UUID recipientId;
    private boolean typing;
    private String username; // Sender's username
}
