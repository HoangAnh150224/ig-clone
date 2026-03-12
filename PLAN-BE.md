# Backend Implementation Plan (PLAN-BE.md) — v4.0
> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending
> **Arch rules:** Controller → Service → Repository | All services extend `BaseService<REQ,RES>` | `@Transactional` on `execute()` only | All endpoints return `ApiResponse<T>` | Schema changes via Flyway only | `ddl-auto: validate` | `open-in-view: false`

---

## Phase 1: Authentication ✅

- [x] `RegisterService` — POST /auth/register (201 AuthResponse)
- [x] `LoginService` — POST /auth/login (200 AuthResponse); Redis rate-limit `rate:login:{ip}` max 5 / 15 min TTL
- [x] `LogoutService` — POST /auth/logout (200); Redis blacklist `blacklist:{jti}` with remaining-TTL expiry
- [x] `GetMeService` — GET /auth/me (200 MeResponse)
- [x] `JwtAuthenticationFilter`, `JwtUtil`, `UserPrincipal`, `UserDetailsServiceImpl`, `SecurityUtils`

---

## Phase 2: User Profile & Social ✅

### Done
- [x] `GetUserProfileService` — GET /users/**{username}**; privacy+block check; returns UserProfileResponse (isFollowing, isPending, canViewContent)
- [x] `FollowService` — POST /users/{userId}/follow; toggle follow/unfollow; PENDING for private accounts, ACCEPTED for public
- [x] `GetFollowersService` — GET /users/{userId}/followers (paginated FollowUserResponse)
- [x] `GetFollowingService` — GET /users/{userId}/following (paginated FollowUserResponse)
- [x] Search history CRUD — GET/POST/DELETE /search-history
- [x] `BlockRepository` — `existsBlockBetween(a, b)` query present
- [x] `GetSuggestionsService` — GET /users/suggestions (returns list of users not followed by current user)
- [x] **`postsCount` in `UserProfileResponse`** — add field; count non-archived posts via `PostRepository.countByUserIdAndArchivedFalse(UUID)`; FE blocker
- [x] **`UpdateUserProfileService`** — PATCH /users/me; updatable fields: fullName, bio, website, gender, avatarUrl, privateAccount, showActivityStatus, tagPermission; no username change; owner-only; returns MeResponse
- [x] **`BlockService`** — POST /users/{userId}/block; toggle block/unblock; on block → delete Follow records in both directions; returns `{ blocked: boolean }`; add `BlockController`

### Pending (complete before starting Phase 3)
(Empty)

### Phase 2 API Endpoints (complete)
```
POST   /auth/register                    201 AuthResponse
POST   /auth/login                       200 AuthResponse
POST   /auth/logout                      200
GET    /auth/me                          200 MeResponse
GET    /users/{username}                 200 UserProfileResponse
PATCH  /users/me                         200 MeResponse              ← pending
POST   /users/{userId}/follow            200 FollowResponse { following, status }
POST   /users/{userId}/block             200 { blocked }             ← pending
GET    /users/{userId}/followers         200 PaginatedResponse<FollowUserResponse>
GET    /users/{userId}/following         200 PaginatedResponse<FollowUserResponse>
GET    /search-history                   200 List<SearchHistoryResponse>
POST   /search-history                   200 SearchHistoryResponse
DELETE /search-history/{id}              200
DELETE /search-history                   200  (clear all)
```

---

## Phase 3: Posts + Comments + Feed + Stories Minimal ✅

**Build in this order:** Shared Utilities → Post CRUD → Post Actions → Feed → Comments → Hashtag → Stories Minimal → Highlights List

### Shared Utilities (build first — everything depends on these)
- [ ] `PostRepository` (JpaRepository<Post, UUID>) — include `countByUserIdAndArchivedFalse(UUID userId)` (needed by Phase 2 postsCount fix)
- [ ] `PostAccessGuard` @Component — `void checkAccess(UUID postOwnerId, UUID viewerId)`:
  1. `blockRepository.existsBlockBetween(postOwnerId, viewerId)` → throws `NotFoundException` (not 403, prevents info leakage)
  2. If owner's profile is private AND viewer is not owner AND not ACCEPTED follower → throws `NotFoundException`
- [ ] `HashtagUpsertService` @Service — `Set<Hashtag> upsertAll(Set<String> names)`:
  1. `hashtagRepository.findByNameIn(names)`
  2. Insert missing names; catch `DataIntegrityViolationException` from concurrent insert → retry `findByNameIn`

### Post CRUD
- [ ] `CreatePostService` — JSON body (URLs only, no multipart); parse `#hashtag` via regex from caption; call `HashtagUpsertService`; validate tagPermission per tagged user → collect `skippedTagIds`; returns `CreatePostResponse { id, createdAt }`
- [ ] `GetPostService` — call `PostAccessGuard`; fetch media (ORDER BY displayOrder ASC), hashtags, tags; compute isLiked/isSaved/isOwner (null viewerId → false for all); returns `PostResponse`
- [ ] `UpdatePostService` — PUT; owner-only → 403; updatable: caption, locationName, commentsDisabled, hideLikeCount; re-parse hashtags on caption change; returns `PostResponse`
- [ ] `DeletePostService` — hard delete; owner-only → 403
- [ ] `ArchivePostService` — PATCH /posts/{id}/archive; toggle `archived`; owner-only; returns `PostResponse`

**PostResponse (locked shape — version before modifying):**
```
id, type, caption, locationName, music, hideLikeCount, commentsDisabled, archived,
author: { id, username, fullName, avatarUrl, verified, isFollowing },
media: [{ url, mediaType, displayOrder }]        ← sorted ASC by displayOrder,
hashtags: [String],
taggedUsers: [{ id, username, avatarUrl }],
skippedTagIds: [UUID],
likeCount, commentCount, viewCount,
isLiked, isSaved, isOwner                        ← always false when unauthenticated,
createdAt, updatedAt
```

**N+1 rule for list endpoints returning PostResponse:** batch-load `isLiked` and `isSaved` for a page of posts using `WHERE post_id IN (...)` — never per-post lookups.

### Post Actions
- [ ] `LikePostService` — toggle; call `PostAccessGuard`; returns `LikeResponse { liked, likeCount }` (fresh `COUNT(*)` after toggle)
- [ ] `ViewPostService` — upsert `post_view`; viewerId optional (anonymous ok); 204; no auth required
- [ ] `SavePostService` — toggle `saved_post`; returns `SaveResponse { saved }`
- [ ] `GetLikersService` — GET /posts/{id}/likers; 403 if `hideLikeCount=true` AND viewer ≠ owner; paginated `FollowUserResponse`
- [ ] `GetSavedPostsService` — GET /posts/saved; current user only; paginated `PostResponse`

### Feed
- [ ] `GetFeedService` — cursor-based; cursor format: Base64(`{epochMillis}_{UUID}`); decode on input, encode on output; ACCEPTED follows only; exclude `archived=true`; optional `?type=REEL`; returns `FeedResponse { posts[], nextCursor: String|null, hasMore: boolean }`
- [ ] `GetUserPostsService` — GET /users/{username}/posts; offset paginated; non-owner hides archived; calls `PostAccessGuard` for privacy
- [ ] `GetArchivedPostsService` — GET /archive/posts; owner-only; `archived=true`

### Comments
- [ ] `CommentRepository` (JpaRepository<Comment, UUID>)
- [ ] `AddCommentService` — validate `commentsDisabled=false`; call `PostAccessGuard`; enforce max depth 1 (parentComment must have `parentCommentId=null`); 201 `CommentResponse`
- [ ] `GetCommentsService` — `?parentId` absent → top-level (pinned first, then createdAt DESC); `?parentId={id}` → replies; paginated
- [ ] `DeleteCommentService` — comment owner OR post owner may delete
- [ ] `PinCommentService` — post owner only; unpin current pinned (if any) before setting new; max 1 pinned per post; returns `CommentResponse`
- [ ] `LikeCommentService` — toggle `comment_like`; returns `LikeResponse`

**CommentResponse (locked):**
```
id, content, parentCommentId,
author: { id, username, avatarUrl, verified },
replyCount, likeCount, isLiked, isPinned, isOwner, createdAt
```

### Hashtag & Tagged
- [ ] `HashtagSearchService` — GET /hashtags/search?q=&limit=; default limit 10, max 20; empty q → empty list; returns `List<HashtagSuggestionResponse { name, postCount }>`
- [ ] `GetTaggedPostsService` — GET /posts/tagged/{userId}; privacy-filtered via `PostAccessGuard`; paginated `PostResponse`

### Stories Minimal (FE blocker — unlocks Home page)
- [ ] `StoryRepository` (JpaRepository<Story, UUID>)
- [ ] `GetFeedStoriesService` (minimal) — GET /stories/feed; filter: `expires_at > now()`, `archived=false`, from ACCEPTED follows + self; group by user; `hasUnseenStory` = any story_id not in `story_view` for current viewer; returns `List<StoryFeedResponse>`
- [ ] `ViewStoryService` (minimal) — POST /stories/{id}/view; upsert `story_view`; 204

**StoryFeedResponse:**
```
{ userId, username, avatarUrl, hasUnseenStory,
  stories: [{ id, mediaUrl, mediaType, createdAt }] }
```

### Highlights List (FE blocker — unlocks Profile page)
- [ ] `HighlightRepository` (JpaRepository<Highlight, UUID>)
- [ ] `GetUserHighlightsService` — GET /users/{username}/highlights; returns `List<HighlightResponse { id, title, coverUrl, storiesCount }>`

### Phase 3 API Endpoints
```
POST   /posts                              201 CreatePostResponse
GET    /posts/{id}                         200 PostResponse
PUT    /posts/{id}                         200 PostResponse
DELETE /posts/{id}                         200
PATCH  /posts/{id}/archive                 200 PostResponse
POST   /posts/{id}/like                    200 LikeResponse { liked, likeCount }
POST   /posts/{id}/view                    204
POST   /posts/{id}/save                    200 SaveResponse { saved }
GET    /posts/{id}/likers                  200 PaginatedResponse<FollowUserResponse>
GET    /posts/saved                        200 PaginatedResponse<PostResponse>
GET    /posts/tagged/{userId}              200 PaginatedResponse<PostResponse>
GET    /archive/posts                      200 PaginatedResponse<PostResponse>
GET    /feed?cursor=&size=&type=           200 FeedResponse
GET    /users/{username}/posts?page=&size= 200 PaginatedResponse<PostResponse>
GET    /posts/{id}/comments?parentId=      200 PaginatedResponse<CommentResponse>
POST   /posts/{id}/comments                201 CommentResponse
DELETE /posts/{id}/comments/{cid}          200
POST   /posts/{id}/comments/{cid}/like     200 LikeResponse
POST   /posts/{id}/comments/{cid}/pin      200 CommentResponse
GET    /hashtags/search?q=&limit=          200 List<HashtagSuggestionResponse>
GET    /stories/feed                       200 List<StoryFeedResponse>
POST   /stories/{id}/view                  204
GET    /users/{username}/highlights        200 List<HighlightResponse>
```

---

## Phase 4: Stories CRUD + Highlights Full ✅

- [ ] `CreateStoryService` — POST /stories; `expires_at = now() + 24h`; Cloudinary URL; returns `StoryResponse`
- [ ] `DeleteStoryService` — DELETE /stories/{id}; owner-only
- [ ] `ArchiveStoryService` — PATCH /stories/{id}/archive; toggle `archived`
- [ ] `GetStoryViewersService` — GET /stories/{id}/viewers; owner-only; returns `List<StoryViewResponse { viewer: FollowUserResponse, viewedAt, liked }>`
- [ ] `LikeStoryService` — POST /stories/{id}/like; upsert `story_view` with `liked=true`
- [ ] `ReplyToStoryService` — POST /stories/{id}/reply { text }; saves `story_reply`; triggers STORY_REPLY notification
- [ ] `GetFeedStoriesService` (full upgrade) — add close-friends filter: stories with `close_friends_only=true` visible only to `favorite_user` list of story owner
- [ ] `GetArchivedStoriesService` — GET /archive/stories; owner-only
- [ ] `CreateHighlightService` — POST /highlights { title, coverUrl, storyIds[] }; storyIds must be owner's own stories
- [ ] `AddStoryToHighlightService` — POST /highlights/{id}/stories { storyId }
- [ ] `DeleteHighlightService` — DELETE /highlights/{id}; cascade deletes join records

**Phase 4 API Endpoints:**
```
POST   /stories                            201 StoryResponse
DELETE /stories/{id}                       200
PATCH  /stories/{id}/archive               200
GET    /stories/{id}/viewers               200 List<StoryViewResponse>
POST   /stories/{id}/like                  200
POST   /stories/{id}/reply                 201 StoryReplyResponse
GET    /archive/stories                    200 List<StoryResponse>
POST   /highlights                         201 HighlightResponse
POST   /highlights/{id}/stories            200
DELETE /highlights/{id}                    200
```

---

## Phase 5: Messaging (WebSocket + STOMP) 🔄

- [x] `WebSocketConfig` — STOMP `/ws` endpoint; app prefix `/app`; simple broker `/topic`
- [ ] **[CRITICAL]** `WebSocketAuthInterceptor` — Implements `ChannelInterceptor` to extract JWT from STOMP `CONNECT` frame, validate it, and set `UserPrincipal` to the STOMP session.
- [ ] **[CRITICAL]** `WebSocketChatController` — `@MessageMapping("/chat")` to handle incoming STOMP messages, save to DB via `SendMessageService`, and push to recipient via `SimpMessagingTemplate` (`/user/queue/messages`).
- [ ] **[CRITICAL]** `WebSocketTypingController` — `@MessageMapping("/chat.typing")` to broadcast typing status.
- [x] `ConversationRepository`, `MessageRepository`
- [x] `GetConversationsService` — GET /messages/primary; participant `is_accepted=true`; ordered by latest message desc; `ConversationResponse`
- [x] `GetMessageRequestsService` — GET /messages/requests; participant `is_accepted=false` for current user as non-initiating side
- [x] `GetMessagesService` — GET /messages/{convId}?page=; offset paginated DESC; 403 if not participant
- [x] `SendMessageService` (REST) — POST /messages/send
- [x] `MarkReadService` — POST /messages/{convId}/read; updates `last_read_at = now()`
- [x] `AcceptMessageRequestService` — POST /messages/requests/{convId}/accept; sets participant `is_accepted=true`
- [x] `DeleteMessageService` — DELETE /messages/{msgId}; sets `is_deleted=true` (soft delete)
- [ ] Online presence — Redis `online:{userId}` set on WS connect, expire/delete on disconnect; `isOnline` shown in `UserProfileResponse` only if `showActivityStatus=true`; own profile always sees own real status

**ConversationResponse:**
```
{ id, participant: FollowUserResponse, isOnline,
  lastMessage: { content, type, createdAt },
  unreadCount,   ← messages.createdAt > last_read_at
  isAccepted }
```

**Phase 5 API Endpoints:**
```
GET    /messages/primary                   200 List<ConversationResponse>
GET    /messages/requests                  200 List<ConversationResponse>
GET    /messages/requests/count            200 { count }
GET    /messages/{convId}?page=            200 PaginatedResponse<MessageResponse>
POST   /messages/send                      201 MessageResponse
POST   /messages/{convId}/read             200
POST   /messages/requests/{convId}/accept  200
DELETE /messages/{msgId}                   200
WS:    /app/chat → /user/queue/messages
WS:    /app/chat.typing → /user/queue/typing
```

---

## Phase 6: Notifications ⬜

- [ ] `NotificationRepository` (JpaRepository<Notification, UUID>)
- [ ] `CreateNotificationService` — internal `@Service`; no-op if actor == recipient; called from other services (not an API endpoint)
- [ ] `GetNotificationsService` — GET /notifications?page=; paginated DESC by createdAt
- [ ] `MarkNotificationReadService` — single `POST /notifications/{id}/read` and bulk `POST /notifications/read-all`
- [ ] WebSocket push — on `CreateNotificationService` → publish to `/topic/notifications/{recipientId}` (requires `WebSocketAuthInterceptor`)

**Notification triggers:**
| Event | Type | Triggered in |
|---|---|---|
| Post liked | LIKE | LikePostService |
| Followed | FOLLOW | FollowService (public) |
| Follow request | FOLLOW_REQUEST | FollowService (private) |
| Comment on post | COMMENT | AddCommentService |
| @mention in comment | MENTION | AddCommentService |
| Tagged in post | TAG | CreatePostService |
| Story reply | STORY_REPLY | ReplyToStoryService |

**NotificationResponse:**
```
{ id, type, actor: FollowUserResponse,
  postId?, commentId?,
  isRead, createdAt }
```

**Phase 6 API Endpoints:**
```
GET    /notifications?page=                200 PaginatedResponse<NotificationResponse>
GET    /notifications/unread-count         200 { count }
POST   /notifications/read-all             200
POST   /notifications/{id}/read            200
WS:    /topic/notifications/{userId}
```

---

## Phase 7: Favorites ✅
Note: `POST /posts/{id}/save` (toggle) in Phase 3. Archive endpoints in Phase 3+4.

- [ ] `ToggleFavoritePostService` — POST /favorites/posts/{postId}; returns `{ favorited: boolean }`
- [ ] `GetFavoritePostsService` — GET /favorites/posts; current user; paginated `PostResponse`
- [ ] `ToggleFavoriteUserService` — POST /users/favorites/{userId}; close-friends list; returns `{ favorited: boolean }`
- [ ] `GetFavoriteUsersService` — GET /users/favorites; returns `List<FollowUserResponse>`

**Phase 7 API Endpoints:**
```
POST   /favorites/posts/{postId}           200 { favorited }
GET    /favorites/posts                    200 PaginatedResponse<PostResponse>
POST   /users/favorites/{userId}           200 { favorited }
GET    /users/favorites                    200 List<FollowUserResponse>
```

---

## Phase 8: Search & Explore ✅

- [ ] `SearchService` — GET /search?query=&page=; users by username/fullName ILIKE + hashtags by name; returns `SearchResultResponse { users: Page<FollowUserResponse>, hashtags: Page<HashtagSuggestionResponse> }`
- [ ] `GetExplorePostsService` — GET /posts/explore?page=; public posts not from accounts current user follows; exclude archived; ordered by recent
- [ ] `GetHashtagPostsService` — GET /hashtags/{name}/posts?page=; public posts with that hashtag; paginated `PostResponse`

**Phase 8 API Endpoints:**
```
GET    /search?query=&page=                200 SearchResultResponse
GET    /posts/explore?page=                200 PaginatedResponse<PostResponse>
GET    /hashtags/{name}/posts?page=        200 PaginatedResponse<PostResponse>
```

---

## Phase 9: Report ✅
Note: Block service added to Phase 2 pending above.

- [ ] `CreateReportService` — POST /reports/posts/{postId} { reason }; once per user per post; throw `DuplicateResourceException` if already reported; 201

**Phase 9 API Endpoint:**
```
POST   /reports/posts/{postId}             201 { reason }
```

---

## Verification Protocol (enforce on every feature)
1. Every mutating endpoint has `@PreAuthorize` — no unprotected mutations
2. No N+1 queries — batch `IN (postIds)` for viewer-context fields in all list endpoints
3. All schema changes via Flyway only — `ddl-auto: validate`
4. `open-in-view: false` always
5. `AppValidationException` for input validation, `BusinessException` for logic errors, `NotFoundException` for missing/inaccessible resources
6. `@Transactional` only on `execute()` in each service — never on `doProcess()`
7. All relations `FetchType.LAZY` — never eager loading
8. Deny info leakage: blocked/private resources return 404, not 403
