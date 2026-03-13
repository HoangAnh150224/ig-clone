package com.instagram.be.follow.repository;

import com.instagram.be.follow.Follow;
import com.instagram.be.follow.enums.FollowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface FollowRepository extends JpaRepository<Follow, UUID> {

    Optional<Follow> findByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    @Query("SELECT f.following.id FROM Follow f WHERE f.follower.id = :followerId AND f.following.id IN :targetIds AND f.status = 'ACCEPTED'")
    Set<UUID> findFollowedIds(@Param("followerId") UUID followerId, @Param("targetIds") Set<UUID> targetIds);

    long countByFollowingIdAndStatus(UUID followingId, FollowStatus status);

    long countByFollowerIdAndStatus(UUID followerId, FollowStatus status);

    @Query("SELECT f FROM Follow f JOIN FETCH f.follower WHERE f.following.id = :userId AND f.status = :status")
    Page<Follow> findFollowersByUserId(@Param("userId") UUID userId,
                                       @Param("status") FollowStatus status,
                                       Pageable pageable);

    @Query("SELECT f FROM Follow f JOIN FETCH f.following WHERE f.follower.id = :userId AND f.status = :status")
    Page<Follow> findFollowingByUserId(@Param("userId") UUID userId,
                                       @Param("status") FollowStatus status,
                                       Pageable pageable);

    @Query("DELETE FROM Follow f WHERE (f.follower.id = :a AND f.following.id = :b) OR (f.follower.id = :b AND f.following.id = :a)")
    @org.springframework.data.jpa.repository.Modifying
    void deleteAllBetween(@Param("a") UUID userA, @Param("b") UUID userB);
}
