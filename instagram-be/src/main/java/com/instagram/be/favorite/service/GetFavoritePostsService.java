package com.instagram.be.favorite.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.favorite.FavoritePostRepository;
import com.instagram.be.post.PostRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetFavoritePostsService extends BaseService<UserOnlyRequest, List<PostResponse>> {

    private final FavoritePostRepository favoritePostRepository;
    private final PostRepository postRepository;
    private final PostResponseAssembler assembler;
    private final SavedPostRepository savedPostRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> execute(UserOnlyRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<PostResponse> doProcess(UserOnlyRequest request) {
        UUID userId = request.getUserContext().getUserId();
        var favoritePosts = favoritePostRepository.findByUserId(userId);
        if (favoritePosts.isEmpty()) return List.of();

        var posts = favoritePosts.stream().map(fp -> fp.getPost()).collect(Collectors.toList());
        Set<UUID> postIds = posts.stream().map(p -> p.getId()).collect(Collectors.toSet());

        Set<UUID> likedIds = postRepository.findLikedPostIds(userId, postIds);
        Set<UUID> savedIds = savedPostRepository.findSavedPostIds(userId, postIds);

        return assembler.toResponseList(posts, userId, likedIds, savedIds);
    }
}
