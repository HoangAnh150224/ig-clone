package com.instagram.be.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, UUID> {

    @Query("SELECT pt FROM PostTag pt JOIN FETCH pt.taggedUser WHERE pt.post.id = :postId")
    List<PostTag> findWithUserByPostId(@Param("postId") UUID postId);

    void deleteByPostId(UUID postId);

    @Query("SELECT pt FROM PostTag pt JOIN FETCH pt.post p JOIN FETCH p.user WHERE pt.taggedUser.id = :userId AND p.archived = false")
    Page<PostTag> findByTaggedUserIdAndNotArchived(@Param("userId") UUID userId, Pageable pageable);
}
