package com.instagram.be.favorite.repository;

import com.instagram.be.favorite.FavoritePost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoritePostRepository extends JpaRepository<FavoritePost, UUID> {

    Optional<FavoritePost> findByUserIdAndPostId(UUID userId, UUID postId);

    @Query("SELECT fp FROM FavoritePost fp JOIN FETCH fp.post WHERE fp.user.id = :userId ORDER BY fp.createdAt DESC")
    List<FavoritePost> findByUserId(@Param("userId") UUID userId);
}
