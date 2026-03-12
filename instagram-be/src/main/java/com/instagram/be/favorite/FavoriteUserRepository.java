package com.instagram.be.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteUserRepository extends JpaRepository<FavoriteUser, UUID> {

    Optional<FavoriteUser> findByUserIdAndFavoriteId(UUID userId, UUID favoriteId);

    @Query("SELECT fu FROM FavoriteUser fu JOIN FETCH fu.favorite WHERE fu.user.id = :userId ORDER BY fu.createdAt DESC")
    List<FavoriteUser> findByUserId(@Param("userId") UUID userId);
}
