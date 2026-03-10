package com.instagram.be.integration.keycloak;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KeycloakRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private boolean enabled;
}
