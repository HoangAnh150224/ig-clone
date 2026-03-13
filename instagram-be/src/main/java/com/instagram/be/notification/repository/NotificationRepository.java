package com.instagram.be.notification.repository;

import com.instagram.be.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

  @Query(value = "SELECT n FROM Notification n JOIN FETCH n.actor LEFT JOIN FETCH n.post LEFT JOIN FETCH n.comment WHERE n.recipient.id = :userId ORDER BY n.createdAt DESC",
         countQuery = "SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId")
  Page<Notification> findByRecipientId(@Param("userId") UUID userId, Pageable pageable);

  long countByRecipientIdAndReadFalse(UUID recipientId);

  @Modifying
  @Query("UPDATE Notification n SET n.read = true WHERE n.recipient.id = :userId AND n.read = false")
  void markAllReadByUserId(@Param("userId") UUID userId);
}
