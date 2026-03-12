package com.instagram.be.post.response;

import java.util.List;

public record FeedResponse(List<PostResponse> posts, String nextCursor, boolean hasMore) {
}
