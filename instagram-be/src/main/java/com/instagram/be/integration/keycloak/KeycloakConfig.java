package com.instagram.be.integration.keycloak;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.keycloak")
public class KeycloakConfig {
    private String serverUrl;
    private String realm;
    private String clientId;
    private String clientSecret;
    private Admin admin = new Admin();

    @Data
    public static class Admin {
        private String username;
        private String password;
        private String clientId = "admin-cli";
    }
}
