package com.instagram.be.integration.keycloak;

import com.instagram.be.exception.IdentityProviderException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final KeycloakConfig keycloakConfig;

    private Keycloak getAdminClient() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakConfig.getServerUrl())
                .realm("master")
                .clientId(keycloakConfig.getAdmin().getClientId())
                .username(keycloakConfig.getAdmin().getUsername())
                .password(keycloakConfig.getAdmin().getPassword())
                .build();
    }

    public String createUser(KeycloakRequest request) {
        try (Keycloak keycloak = getAdminClient()) {
            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEnabled(request.isEnabled());
            user.setEmailVerified(true);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getPassword());
            credential.setTemporary(false);
            user.setCredentials(List.of(credential));

            Response response = keycloak.realm(keycloakConfig.getRealm()).users().create(user);
            if (response.getStatus() != 201) {
                throw new IdentityProviderException("Failed to create user in Keycloak: " + response.getStatus());
            }

            String locationHeader = response.getHeaderString("Location");
            return locationHeader.substring(locationHeader.lastIndexOf("/") + 1);
        } catch (IdentityProviderException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating user in Keycloak", e);
            throw new IdentityProviderException("Failed to communicate with Keycloak: " + e.getMessage());
        }
    }

    public void deleteUser(String keycloakId) {
        try (Keycloak keycloak = getAdminClient()) {
            keycloak.realm(keycloakConfig.getRealm()).users().get(keycloakId).remove();
            log.info("Deleted Keycloak user: {}", keycloakId);
        } catch (Exception e) {
            log.error("Error deleting Keycloak user {}", keycloakId, e);
        }
    }

    public void assignRoleToUser(String keycloakId, String roleName) {
        try (Keycloak keycloak = getAdminClient()) {
            RoleRepresentation role = keycloak.realm(keycloakConfig.getRealm())
                    .roles().get(roleName).toRepresentation();
            keycloak.realm(keycloakConfig.getRealm()).users()
                    .get(keycloakId).roles().realmLevel().add(List.of(role));
            log.info("Assigned role {} to Keycloak user {}", roleName, keycloakId);
        } catch (Exception e) {
            log.error("Error assigning role {} to Keycloak user {}", roleName, keycloakId, e);
            throw new IdentityProviderException("Failed to assign role in Keycloak: " + e.getMessage());
        }
    }

    public void updatePassword(String keycloakId, String newPassword) {
        try (Keycloak keycloak = getAdminClient()) {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(newPassword);
            credential.setTemporary(false);
            keycloak.realm(keycloakConfig.getRealm()).users().get(keycloakId).resetPassword(credential);
            log.info("Updated password for Keycloak user {}", keycloakId);
        } catch (Exception e) {
            log.error("Error updating password for Keycloak user {}", keycloakId, e);
            throw new IdentityProviderException("Failed to update password in Keycloak: " + e.getMessage());
        }
    }
}
