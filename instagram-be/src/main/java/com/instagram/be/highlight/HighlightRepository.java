package com.instagram.be.highlight;

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
}
