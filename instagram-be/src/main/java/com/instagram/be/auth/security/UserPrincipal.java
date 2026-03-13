package com.instagram.be.auth.security;

import com.instagram.be.userprofile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails, Principal {

  private final UUID userId;
  private final String username;
  private final String email;
  private final String password;
  private final boolean active;
  private final Collection<? extends GrantedAuthority> authorities;

  public static UserPrincipal from(UserProfile user) {
    List<GrantedAuthority> authorities = List.of(
      new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
    );
    return new UserPrincipal(
      user.getId(),
      user.getUsername(),
      user.getEmail(),
      user.getPasswordHash(),
      user.isActive(),
      authorities
    );
  }

  @Override
  public String getName() {
    return userId.toString();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return active;
  }
}
