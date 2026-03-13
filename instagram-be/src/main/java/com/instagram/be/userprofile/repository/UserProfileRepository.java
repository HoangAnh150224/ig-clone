package com.instagram.be.userprofile.repository;

import com.instagram.be.userprofile.UserProfile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    Optional<UserProfile> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("SELECT u FROM UserProfile u WHERE u.active = true AND (LOWER(u.username) LIKE LOWER(CONCAT(:q, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%'))) ORDER BY u.verified DESC, u.username ASC")
    List<UserProfile> searchByKeyword(@Param("q") String q, Pageable pageable);

    @Query("SELECT u, (SELECT COUNT(f2.id) FROM Follow f2 WHERE f2.following.id = u.id AND f2.status = 'ACCEPTED' AND f2.follower.id IN (SELECT f1.following.id FROM Follow f1 WHERE f1.follower.id = :currentUserId AND f1.status = 'ACCEPTED')) as mutualCount " +
            "FROM UserProfile u " +
            "WHERE u.id != :currentUserId " +
            "AND u.active = true " +
            "AND u.id NOT IN (SELECT f3.following.id FROM Follow f3 WHERE f3.follower.id = :currentUserId) " +
            "AND u.id NOT IN (SELECT b.blocked.id FROM Block b WHERE b.blocker.id = :currentUserId) " +
            "AND u.id NOT IN (SELECT b.blocker.id FROM Block b WHERE b.blocked.id = :currentUserId) " +
            "ORDER BY mutualCount DESC, u.verified DESC, u.createdAt DESC")
    List<Object[]> findSuggestions(@Param("currentUserId") UUID currentUserId, Pageable pageable);
}
