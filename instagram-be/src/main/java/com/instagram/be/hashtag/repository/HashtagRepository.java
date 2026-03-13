package com.instagram.be.hashtag.repository;

import com.instagram.be.hashtag.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, UUID> {

    Optional<Hashtag> findByName(String name);

    Set<Hashtag> findByNameIn(Set<String> names);

    @Query("SELECT h FROM Hashtag h WHERE LOWER(h.name) LIKE LOWER(CONCAT(:prefix, '%')) ORDER BY h.name ASC")
    List<Hashtag> findByNameStartingWith(@Param("prefix") String prefix, org.springframework.data.domain.Pageable pageable);
}
