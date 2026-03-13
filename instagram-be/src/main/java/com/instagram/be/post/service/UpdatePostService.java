package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.HashtagUpsertService;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.request.UpdatePostRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UpdatePostService extends BaseService<UpdatePostRequest, PostResponse> {

    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#([\\w\u00C0-\u024F]+)");

    private final PostRepository postRepository;
    private final HashtagUpsertService hashtagUpsertService;
    private final PostResponseAssembler assembler;
    private final SavedPostRepository savedPostRepository;

    @Override
    @Transactional
    public PostResponse execute(UpdatePostRequest request) {
        return super.execute(request);
    }

    @Override
    protected PostResponse doProcess(UpdatePostRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new NotFoundException("Post", request.getPostId()));

        if (!post.getUser().getId().equals(viewerId)) {
            throw new BusinessException("You do not have permission to update this post");
        }

        if (request.getCaption() != null) {
            post.setCaption(request.getCaption());
            Set<String> hashtagNames = parseHashtags(request.getCaption());
            Set<Hashtag> hashtags = hashtagUpsertService.upsertAll(hashtagNames);
            post.setHashtags(hashtags);
        }
        if (request.getLocationName() != null) post.setLocationName(request.getLocationName());
        if (request.getCommentsDisabled() != null) post.setCommentsDisabled(request.getCommentsDisabled());
        if (request.getHideLikeCount() != null) post.setHideLikeCount(request.getHideLikeCount());

        Post saved = postRepository.save(post);
        boolean isSaved = savedPostRepository.existsByUserIdAndPostId(viewerId, saved.getId());
        return assembler.toResponse(saved, viewerId, isSaved);
    }

    private Set<String> parseHashtags(String caption) {
        if (caption == null || caption.isBlank()) return Set.of();
        Set<String> names = new HashSet<>();
        Matcher matcher = HASHTAG_PATTERN.matcher(caption);
        while (matcher.find()) names.add(matcher.group(1).toLowerCase());
        return names;
    }
}
