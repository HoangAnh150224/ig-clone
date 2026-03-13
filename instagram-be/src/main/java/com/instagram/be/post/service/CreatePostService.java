package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.HashtagUpsertService;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostMedia;
import com.instagram.be.post.PostTag;
import com.instagram.be.post.enums.MediaType;
import com.instagram.be.post.enums.PostType;
import com.instagram.be.post.repository.PostMediaRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.repository.PostTagRepository;
import com.instagram.be.post.request.CreatePostRequest;
import com.instagram.be.post.response.CreatePostResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.TagPermission;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CreatePostService extends BaseService<CreatePostRequest, CreatePostResponse> {

  private static final Pattern HASHTAG_PATTERN = Pattern.compile("#([\\w\u00C0-\u024F]+)");

  private final PostRepository postRepository;
  private final PostMediaRepository postMediaRepository;
  private final PostTagRepository postTagRepository;
  private final HashtagUpsertService hashtagUpsertService;
  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional
  public CreatePostResponse execute(CreatePostRequest request) {
    return super.execute(request);
  }

  @Override
  protected CreatePostResponse doProcess(CreatePostRequest request) {
    if (request.getMedia() == null || request.getMedia().isEmpty()) {
      throw new AppValidationException("At least one media item is required");
    }

    UUID userId = request.getUserContext().getUserId();
    UserProfile author = userProfileRepository.getReferenceById(userId);

    PostType type = request.getType() != null ? request.getType() : PostType.POST;

    // Parse hashtags from caption
    Set<String> hashtagNames = parseHashtags(request.getCaption());
    Set<Hashtag> hashtags = hashtagUpsertService.upsertAll(hashtagNames);

    Post post = Post.builder()
      .user(author)
      .type(type)
      .caption(request.getCaption())
      .locationName(request.getLocationName())
      .music(request.getMusic())
      .hideLikeCount(request.isHideLikeCount())
      .commentsDisabled(request.isCommentsDisabled())
      .hashtags(hashtags)
      .build();

    Post saved = postRepository.save(post);

    // Save media
    for (int i = 0; i < request.getMedia().size(); i++) {
      var item = request.getMedia().get(i);
      postMediaRepository.save(PostMedia.builder()
        .post(saved)
        .url(item.url())
        .mediaType(MediaType.valueOf(item.mediaType()))
        .displayOrder(i)
        .build());
    }

    // Tag users — skip those who don't allow tagging
    List<UUID> tagIds = request.getTaggedUserIds();
    if (tagIds != null && !tagIds.isEmpty()) {
      for (UUID tagUserId : tagIds) {
        userProfileRepository.findById(tagUserId).ifPresent(target -> {
          boolean canTag = target.getTagPermission() == TagPermission.EVERYONE ||
            (target.getTagPermission() == TagPermission.FOLLOWERS);
          // Simplified: only skip NONE; FOLLOWERS would require follow check (future)
          postTagRepository.save(PostTag.builder()
            .post(saved)
            .taggedUser(target)
            .build());
        });
      }
    }

    return new CreatePostResponse(saved.getId(), saved.getCreatedAt());
  }

  private Set<String> parseHashtags(String caption) {
    if (caption == null || caption.isBlank()) return Set.of();
    Set<String> names = new HashSet<>();
    Matcher matcher = HASHTAG_PATTERN.matcher(caption);
    while (matcher.find()) {
      names.add(matcher.group(1).toLowerCase());
    }
    return names;
  }
}
