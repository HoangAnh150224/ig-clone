package com.instagram.be.base;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class UserContext {
    private UUID userId;
    private String username;
    private String email;
    private Set<String> roles;
    private String ipAddress;
    private String userAgent;

    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }

    public boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
