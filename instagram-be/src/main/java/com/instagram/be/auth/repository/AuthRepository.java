package com.instagram.be.auth.repository;

import com.instagram.be.userprofile.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<UserProfile, UUID> {

  Optional<UserProfile> findByUsername(String username);

  Optional<UserProfile> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);
}
