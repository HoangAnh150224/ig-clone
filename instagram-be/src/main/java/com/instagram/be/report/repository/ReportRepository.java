package com.instagram.be.report.repository;

import com.instagram.be.report.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

  boolean existsByReporterIdAndPostId(UUID reporterId, UUID postId);
}
