package com.instagram.be.search.repository;

import com.instagram.be.search.SearchHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, UUID> {

    @Query("SELECT s FROM SearchHistory s WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<SearchHistory> findRecentByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT s FROM SearchHistory s WHERE s.user.id = :userId AND s.searchedUser.id = :searchedUserId")
    Optional<SearchHistory> findByUserIdAndSearchedUserId(@Param("userId") UUID userId,
                                                           @Param("searchedUserId") UUID searchedUserId);

    @Query("SELECT s FROM SearchHistory s WHERE s.user.id = :userId AND s.hashtag.id = :hashtagId")
    Optional<SearchHistory> findByUserIdAndHashtagId(@Param("userId") UUID userId,
                                                      @Param("hashtagId") UUID hashtagId);

    Optional<SearchHistory> findByIdAndUserId(UUID id, UUID userId);
}
