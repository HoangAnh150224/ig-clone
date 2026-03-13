package com.instagram.be.search.response;

import com.instagram.be.follow.response.FollowUserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultResponse {
    private List<FollowUserResponse> users;
    private List<HashtagInfo> hashtags;
    private List<PostInfo> posts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HashtagInfo {
        private String name;
        private long postCount;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PostInfo {
        private java.util.UUID id;
        private String caption;
    }
}
