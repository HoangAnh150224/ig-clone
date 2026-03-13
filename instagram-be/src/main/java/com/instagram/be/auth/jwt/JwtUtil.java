package com.instagram.be.auth.jwt;

import com.instagram.be.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtUtil {

  private final JwtProperties jwtProperties;

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(UUID userId, String username, String email, String role) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());
    return Jwts.builder()
      .id(UUID.randomUUID().toString())
      .subject(userId.toString())
      .claim("username", username)
      .claim("email", email)
      .claim("role", role)
      .issuedAt(now)
      .expiration(expiry)
      .signWith(getSigningKey())
      .compact();
  }

  public Claims extractAllClaims(String token) {
    return Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  public UUID extractUserId(String token) {
    return UUID.fromString(extractAllClaims(token).getSubject());
  }

  public String extractUsername(String token) {
    return extractAllClaims(token).get("username", String.class);
  }

  public String extractEmail(String token) {
    return extractAllClaims(token).get("email", String.class);
  }

  public String extractRole(String token) {
    return extractAllClaims(token).get("role", String.class);
  }

  public String extractJti(String token) {
    return extractAllClaims(token).getId();
  }

  public Date extractExpiration(String token) {
    return extractAllClaims(token).getExpiration();
  }

  public boolean isTokenValid(String token) {
    try {
      Claims claims = extractAllClaims(token);
      return !claims.getExpiration().before(new Date());
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public long getRemainingTtlSeconds(String token) {
    Date expiration = extractExpiration(token);
    long remainingMs = expiration.getTime() - System.currentTimeMillis();
    return Math.max(0, remainingMs / 1000);
  }
}
