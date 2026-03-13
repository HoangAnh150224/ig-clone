package com.instagram.be.base.response;

import java.util.List;

public record CursorResponse<T>(List<T> content, String nextCursor, boolean hasMore) {
}
