# 🛠️ Backend Implementation Plan (PLAN-BE.md) — v3.0
> **Sync:** PLAN-FE v4.0 | **Principle:** RESTful, Security-First, Redis Caching
> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending

---

## Phase 1: Authentication ✅
- [x] JWT filter, register/login/logout
- [x] GET /auth/me
- [x] Redis blacklist + rate limiting

---

## Phase 2: User Profile & Social ✅ (+ pending addition)
- [x] GET /users/{id}, UserProfileResponse with isFollowing/canViewContent
- [x] POST /users/{userId}/follow (PENDING→ACCEPTED logic)
- [x] GET /users/{userId}/followers & following (paginated)
- [x] Search history CRUD
- [ ] **Add `postsCount` to UserProfileResponse** ← FE blocker (count non-archived posts)

---

## Phase 3: Posts + Comments + Feed + Stories Minimal ⬜

### Shared Utilities (build first)
- [ ] `PostAccessGuard` @Component — privacy + block check, reused by all post services
- [ ] `HashtagUpsertService` — thread-safe upsert (DataIntegrityViolationException retry)

### Post CRUD
- [ ] `CreatePostService` — JSON body (URLs only, no multipart), parse hashtags from caption,
      validate tagPermission, collect skippedTagIds
- [ ] `GetPostService` — PostAccessGuard check → 404 if denied
- [ ] `UpdatePostService` — PUT, owner-only → 403, fields: caption/locationName/commentsDisabled/hideLikeCount
- [ ] `DeletePostService` — hard delete, owner-only
- [ ] `ArchivePostService` — toggle is_archived, returns PostResponse

**PostResponse (locked shape):**
```
id, type, caption, locationName, music, hideLikeCount, commentsDisabled, archived,
author: { id, username, fullName, avatarUrl, verified, isFollowing },
media: [{ url, mediaType, displayOrder }]  ← sorted ASC,
hashtags: [String], taggedUsers: [{ id, username, avatarUrl }], skippedTagIds: [UUID],
likeCount, commentCount, viewCount,
isLiked, isSaved, isOwner  ← false when unauthenticated,
createdAt, updatedAt
```

### Post Actions
- [ ] `LikePostService` — toggle, LikeResponse { liked, likeCount } (fresh COUNT always)
- [ ] `ViewPostService` — upsert, 204 silent
- [ ] `SavePostService` — toggle saved_post, SaveResponse { saved }
- [ ] `GetLikersService` — paginated; 403 if hideLikeCount=true AND not owner
- [ ] `GetSavedPostsService` — GET /posts/saved, current user only

### Feed
- [ ] `GetFeedService` — cursor-based (createdAt+id), ACCEPTED follows only, exclude archived
      Optional filter: ?type=REEL for Reels page
      Returns FeedResponse { posts[], nextCursor: String|null, hasMore: boolean }
- [ ] `GetUserPostsService` — offset paginated; non-owner excludes archived
- [ ] `GetArchivedPostsService` — owner-only, is_archived=true ← moved from Phase 7

### Comments
- [ ] `AddCommentService` — max 1 reply level, commentsDisabled check, PostAccessGuard
- [ ] `GetCommentsService` — parentId=null (top-level) or ?parentId=X (replies); pinned first
- [ ] `DeleteCommentService` — comment owner OR post owner
- [ ] `PinCommentService` — post owner only; unpin previous before pinning new (max 1 pinned)
- [ ] `LikeCommentService` — toggle, LikeResponse

**CommentResponse (locked):**
```
id, content, parentCommentId,
author: { id, username, avatarUrl, verified },
replyCount, likeCount, isLiked, isPinned, isOwner, createdAt
```

### Hashtag & Tagged
- [ ] `HashtagSearchService` — GET /hashtags/search?q=&limit=, capped at 20, empty q → empty list
- [ ] `GetTaggedPostsService` — GET /posts/tagged/{userId}, privacy-filtered PostResponse list

### Stories Minimal (FE blocker — unlocks Home page)
- [ ] `GetFeedStoriesService` — GET /stories/feed
      Returns List<StoryFeedResponse { userId, username, avatarUrl, hasUnseenStory,
                                       stories[{id, mediaUrl, mediaType, createdAt}] }>
      Rule: non-expired, non-archived, from ACCEPTED follows only
      hasUnseenStory = any story without a story_view record for viewer
- [ ] `ViewStoryService` (minimal) — POST /stories/{id}/view, upsert 204

### Highlights List (FE blocker — unlocks Profile page)
- [ ] `GetUserHighlightsService` — GET /users/{id}/highlights
      Returns List<HighlightResponse { id, title, coverUrl, storiesCount }>

### API Endpoints (Phase 3)
```
POST   /posts                            201 CreatePostResponse (JSON, URLs only)
GET    /posts/{id}                       200 PostResponse
PUT    /posts/{id}                       200 PostResponse
DELETE /posts/{id}                       200
PATCH  /posts/{id}/archive               200 PostResponse
POST   /posts/{id}/like                  200 LikeResponse { liked, likeCount }
POST   /posts/{id}/view                  204
POST   /posts/{id}/save                  200 SaveResponse { saved }
GET    /posts/{id}/likers                200 PaginatedResponse<LikerUserResponse>
GET    /posts/saved                      200 PaginatedResponse<PostResponse>
GET    /posts/tagged/{userId}            200 PaginatedResponse<PostResponse>
GET    /archive/posts                    200 PaginatedResponse<PostResponse>
GET    /feed?cursor=&size=&type=         200 FeedResponse
GET    /users/{id}/posts?page=&size=     200 PaginatedResponse<PostResponse>
GET    /posts/{id}/comments?parentId=    200 PaginatedResponse<CommentResponse>
POST   /posts/{id}/comments              201 CommentResponse
DELETE /posts/{id}/comments/{cid}        200
POST   /posts/{id}/comments/{cid}/like   200 LikeResponse
POST   /posts/{id}/comments/{cid}/pin    200 CommentResponse
GET    /hashtags/search?q=&limit=        200 List<HashtagSuggestionResponse>
GET    /stories/feed                     200 List<StoryFeedResponse>
POST   /stories/{id}/view                204
GET    /users/{id}/highlights            200 List<HighlightResponse>
```

---

## Phase 4: Stories CRUD + Highlights Full ⬜
- [ ] `CreateStoryService` — POST /stories, Cloudinary URL, expires_at = now+24h
- [ ] `DeleteStoryService` — DELETE /stories/{id}, owner only
- [ ] `ArchiveStoryService` — toggle is_archived
- [ ] `GetStoryViewersService` — GET /stories/{id}/viewers, owner only
- [ ] `LikeStoryService` — POST /stories/{id}/like, update story_view.liked=true
- [ ] `ReplyToStoryService` — POST /stories/{id}/reply { text }, save story_reply
- [ ] `GetFeedStoriesService` (full) — close friends filter via favorite_user
- [ ] `GetArchivedStoriesService` — GET /archive/stories
- [ ] `CreateHighlightService` — POST /highlights { title, coverUrl, storyIds[] }
- [ ] `AddStoryToHighlightService` — POST /highlights/{id}/stories { storyId }
- [ ] `DeleteHighlightService` — DELETE /highlights/{id}

**API Endpoints (Phase 4):**
```
POST   /stories                          201 StoryResponse
DELETE /stories/{id}                     200
PATCH  /stories/{id}/archive             200
GET    /stories/{id}/viewers             200 List<StoryViewResponse>
POST   /stories/{id}/like                200
POST   /stories/{id}/reply               201 { text }
GET    /archive/stories                  200 List<StoryResponse>
POST   /highlights                       201 HighlightResponse
POST   /highlights/{id}/stories          200 { storyId }
DELETE /highlights/{id}                  200
```

---

## Phase 5: Messaging (WebSocket + STOMP) ⬜
- [ ] `WebSocketConfig` — /ws endpoint, /app prefix, /topic broker
- [ ] `GetConversationsService` — GET /messages/primary
- [ ] `GetMessageRequestsService` — GET /messages/requests
- [ ] `GetMessagesService` — GET /messages/{convId}?page=
- [ ] `SendMessageService` — POST /messages/send + STOMP publish /topic/messages/{convId}
      Auto-accept if sender follows recipient; else is_accepted=false
- [ ] `MarkReadService` — POST /messages/{convId}/read (updates last_read_at)
- [ ] `AcceptMessageRequestService` — POST /messages/requests/{convId}/accept
- [ ] `DeleteMessageService` — is_deleted=true (soft)
- [ ] Online presence: Redis online:{userId}, set on WS connect, expire on disconnect

**isOnline in UserProfileResponse:** Check Redis online:{userId}. Only show true if
user.showActivityStatus=true. Own profile always sees own real status.

**API Endpoints (Phase 5):**
```
GET    /messages/primary                 200 List<ConversationResponse>
GET    /messages/requests                200 List<ConversationResponse>
GET    /messages/requests/count          200 { count }
GET    /messages/{convId}?page=          200 PaginatedResponse<MessageResponse>
POST   /messages/send                    201 MessageResponse
POST   /messages/{convId}/read           200
POST   /messages/requests/{convId}/accept 200
DELETE /messages/{msgId}                 200
WS: /app/chat.send → /topic/messages/{convId}
```

---

## Phase 6: Notifications ⬜
- [ ] `GetNotificationsService` — paginated
- [ ] `MarkNotificationReadService` — single or all
- [ ] `CreateNotificationService` — internal, called from Like/Follow/Comment/Tag/StoryReply services
- [ ] WebSocket push: on notification create → publish to /topic/notifications/{recipientId}

**Notification triggers:**
| Event | Type | Triggered in |
|---|---|---|
| Post liked | LIKE | LikePostService |
| Followed | FOLLOW | FollowService |
| Follow request | FOLLOW_REQUEST | FollowService (private) |
| Comment | COMMENT | AddCommentService |
| @mention | MENTION | AddCommentService |
| Tagged in post | TAG | CreatePostService |
| Story reply | STORY_REPLY | ReplyToStoryService |

**API Endpoints (Phase 6):**
```
GET    /notifications?page=              200 PaginatedResponse<NotificationResponse>
GET    /notifications/unread-count       200 { count }
POST   /notifications/read-all           200
POST   /notifications/{id}/read          200
WS: /topic/notifications/{userId}
```

---

## Phase 7: Saved / Favorites / Archive (remaining) ⬜
Note: GET /archive/posts and GET /archive/stories moved to Phase 3 and 4.
- [ ] `ToggleSavedPostService` — already in Phase 3 (POST /posts/{id}/save)
- [ ] `ToggleFavoritePostService` — POST /favorites/posts/{postId} toggle
- [ ] `GetFavoritePostsService` — GET /favorites/posts
- [ ] `ToggleFavoriteUserService` — POST /users/favorites/{userId} toggle (close friends + feed priority)
- [ ] `GetFavoriteUsersService` — GET /users/favorites

**API Endpoints (Phase 7):**
```
POST   /favorites/posts/{postId}         200 { favorited }
GET    /favorites/posts                  200 PaginatedResponse<PostResponse>
POST   /users/favorites/{userId}         200 { favorited }
GET    /users/favorites                  200 List<UserProfileResponse>
```

---

## Phase 8: Search & Explore ⬜
- [ ] `SearchService` — GET /search?query= (users + hashtags combined)
- [ ] `GetExplorePostsService` — public posts not in feed, paginated
- [ ] `GetHashtagPostsService` — GET /hashtags/{name}/posts

**API Endpoints (Phase 8):**
```
GET    /search?query=&page=              200 SearchResultResponse { users[], hashtags[] }
GET    /posts/explore?page=              200 PaginatedResponse<PostResponse>
GET    /hashtags/{name}/posts?page=      200 PaginatedResponse<PostResponse>
```

---

## Phase 9: Report ⬜
Note: Block already implemented in Phase 2.
- [ ] `CreateReportService` — POST /reports/posts/{postId} { reason }
      Once per user per post (DuplicateResourceException if already reported)

**API Endpoints (Phase 9):**
```
POST   /reports/posts/{postId}           200 { reason }
```

---

## Verification Protocol
1. Every endpoint has @PreAuthorize — no unprotected mutations
2. No N+1 queries — use batch IN queries for viewer-context fields in lists
3. All schema changes via Flyway — ddl-auto: validate
4. open-in-view: false always
5. AppValidationException for validation, BusinessException for logic errors
