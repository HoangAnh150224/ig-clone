package com.instagram.be.report.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.report.Report;
import com.instagram.be.report.repository.ReportRepository;
import com.instagram.be.report.request.CreateReportRequest;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateReportService extends BaseService<CreateReportRequest, Void> {

  private final ReportRepository reportRepository;
  private final PostRepository postRepository;
  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional
  public Void execute(CreateReportRequest request) {
    return super.execute(request);
  }

  @Override
  protected Void doProcess(CreateReportRequest request) {
    UUID reporterId = request.getUserContext().getUserId();
    UUID postId = request.getPostId();

    if (reportRepository.existsByReporterIdAndPostId(reporterId, postId)) {
      throw new BusinessException("You have already reported this post");
    }

    UserProfile reporter = userProfileRepository.getReferenceById(reporterId);
    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new NotFoundException("Post", postId));

    reportRepository.save(Report.builder()
      .reporter(reporter)
      .post(post)
      .reason(request.getReason())
      .build());

    return null;
  }
}
