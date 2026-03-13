package com.instagram.be.highlight.repository;

import com.instagram.be.highlight.Highlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, UUID> {

    @Query("SELECT DISTINCT h FROM Highlight h LEFT JOIN FETCH h.stories WHERE h.user.id = :userId ORDER BY h.createdAt DESC")
    List<Highlight> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT h FROM Highlight h LEFT JOIN FETCH h.stories s LEFT JOIN FETCH s.user WHERE h.id = :id")
    java.util.Optional<Highlight> findByIdWithStories(@Param("id") UUID id);
}
