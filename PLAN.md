# Instagram Clone — Full Development Plan

> **Status key:** ✅ Done &nbsp;|&nbsp; 🔄 In Progress &nbsp;|&nbsp; ⬜ Pending

---

## Table of Contents
1. [Current State](#1-current-state)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Phase 0 — Infrastructure Fixup](#phase-0--infrastructure-fixup)
5. [Phase 1 — Authentication (JWT)](#phase-1--authentication-jwt)
6. [Phase 2 — User Profile & Social](#phase-2--user-profile--social)
7. [Phase 3 — Post & Reel](#phase-3--post--reel)
8. [Phase 4 — Comment](#phase-4--comment)
9. [Phase 5 — Story & Highlight](#phase-5--story--highlight)
10. [Phase 6 — Messaging (WebSocket)](#phase-6--messaging-websocket)
11. [Phase 7 — Notifications](#phase-7--notifications)
12. [Phase 8 — Saved, Favorites & Archive](#phase-8--saved-favorites--archive)
13. [Phase 9 — Search & Explore](#phase-9--search--explore)
14. [Phase 10 — Block & Report](#phase-10--block--report)
15. [API Contract Reference](#api-contract-reference)
16. [Database Summary](#database-summary)

---

## 1. Current State

### Backend (`instagram-be/`)
| Component | Status | Notes |
|---|---|---|
| Base infrastructure | ✅ Done | BaseEntity, BaseService, ApiResponse, exceptions |
| Flyway V1 migration | ✅ Done | `user_profile` table |
| Flyway V2 migration | ✅ Done | All 26 tables |
| Entity classes (23) | ✅ Done | All feature packages created |
| Keycloak integration | ⬜ Remove | Replace with custom JWT |
| Auth (JWT) | ⬜ Pending | |
| All feature services | ⬜ Pending | |

### Frontend (`instagram-fe/`)
| Component | Status | Notes |
|---|---|---|
| UI pages (8 pages) | ✅ Done | All pages render with mock data |
| axiosClient | ✅ Done | JWT auto-attach, response unwrapping |
| Redux store (auth) | ✅ Done | authSlice integrated with authService |
| All services | ⬜ Mock only | 95% use `dummyData.js`, 1 real API call |
| WebSocket client | ⬜ Pending | Needed for messaging |

### Critical Fix Needed
> **URL mismatch:** Frontend `axiosClient` uses base URL `/api/v1` but backend context path is `/api`.
> Fix: Change frontend `.env` → `VITE_API_URL=http://localhost:8080/api`

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **BE Framework** | Spring Boot 3.4.3, Java 17 |
| **BE Database** | MySQL 8, Spring Data JPA, Flyway |
| **BE Auth** | Custom JWT (jjwt), Spring Security, bcrypt |
| **BE Cache** | Redis (JWT blacklist, rate limiting, presence, cache) |
| **BE Real-time** | Spring WebSocket (STOMP protocol) |
| **BE File Storage** | Cloudinary SDK (store URLs in DB) |
| **BE Mapping** | MapStruct, Lombok |
| **BE API Docs** | SpringDoc OpenAPI (Swagger UI at `/api/swagger-ui.html`) |
| **FE Framework** | React 19, Vite |
| **FE State** | Redux Toolkit |
| **FE HTTP** | Axios (`src/api/axiosClient.js`) |
| **FE Real-time** | STOMP.js / SockJS (WebSocket client) |
| **FE UI** | Chakra UI, Tailwind CSS |

---

## 3. Architecture Decisions

| Concern | Decision |
|---|---|
| Auth | Custom JWT — bcrypt in `user_profile.password_hash`, JWT filter replaces Keycloak |
| JWT blacklist | Redis key `blacklist:{jti}` with TTL on logout |
| Rate limiting | Redis counter `rate:login:{ip}` — 5 attempts / 60s |
| Online presence | Redis key `online:{userId}` with 5-min TTL |
| File uploads | Backend receives file → uploads to Cloudinary → stores URL in DB |
| View counting | `post_view` table (unique per user, no double-counting) |
| Message read | `conversation_participant.last_read_at` (unread = messages after this timestamp) |
| Message requests | Auto-accept if sender follows recipient; else `is_accepted=false` |
| Privacy | Service layer: private account → non-followers get 403 for content |
| Follow requests | Private account → `follow.status=PENDING` → owner approves → `ACCEPTED` |
| Close friends | `story.is_close_friends=true` → only users in `favorite_user` list can view |
| Favorite users | Used for (1) feed priority ranking + (2) close friends story visibility |
| Comment sort | Query-time: `TOP` = ORDER BY like count DESC, `NEWEST` = ORDER BY created_at DESC |
| Messaging | WebSocket (STOMP) + MySQL — real-time delivery + persistence |

---

## Phase 0 — Infrastructure Fixup

**Goal:** Remove Keycloak, wire up JWT deps, fix URL mismatch.

### Backend Tasks

| Task | File(s) | Notes |
|---|---|---|
| Add JWT dependency | `pom.xml` | Add `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (io.jsonwebtoken 0.12.x) |
| Add WebSocket dependency | `pom.xml` | Add `spring-boot-starter-websocket` |
| Add Cloudinary SDK | `pom.xml` | Add `cloudinary-http44` |
| Remove Keycloak dependency | `pom.xml` | Remove `keycloak-admin-client`, `spring-boot-starter-webflux` |
| Remove Keycloak config | `application.yml` | Remove `spring.security.oauth2` and `app.keycloak` sections |
| Add JWT + Cloudinary config | `application.yml` | Add `app.jwt.secret`, `app.jwt.expiration`, `app.cloudinary.*` |
| Delete Keycloak files | `integration/keycloak/` | Delete `KeycloakConfig`, `KeycloakService`, `KeycloakRequest` |
| Disable SecurityConfig | `config/SecurityConfig.java` | Temporarily permit all requests until JWT filter is added in Phase 1 |

### Frontend Tasks

| Task | File(s) | Notes |
|---|---|---|
| Fix base URL | `.env` | Change to `VITE_API_URL=http://localhost:8080/api` |

---

## Phase 1 — Authentication (JWT)

### Backend Tasks

**New files in `userprofile/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/UserProfileRepository.java` | `findByUsername`, `findByEmail`, `existsByUsername`, `existsByEmail` |
| Request | `request/SignupRequest.java` | record: `email, fullName, username, password` |
| Request | `request/LoginRequest.java` | record: `username, password` |
| Response | `response/AuthResponse.java` | record: `token, user(UserProfileResponse)` |
| Response | `response/UserProfileResponse.java` | record: all public profile fields |
| Service | `service/SignupService.java` | Validate unique, bcrypt password, save `UserProfile`, issue JWT |
| Service | `service/LoginService.java` | Load user, verify bcrypt, issue JWT |
| Service | `service/GetCurrentUserService.java` | Decode JWT subject → load UserProfile |
| Controller | `controller/AuthController.java` | `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |

**New files in `config/`:**

| File | Responsibility |
|---|---|
| `JwtUtil.java` | Generate token (subject=userId), parse claims, validate, extract jti |
| `JwtAuthFilter.java` | OncePerRequestFilter — parse JWT, check Redis blacklist, set SecurityContext |
| `SecurityConfig.java` | Rewrite: stateless, JWT filter, permit `/auth/**`, require auth for rest |

**Redis usage:**
- `POST /auth/logout` → store `blacklist:{jti}` in Redis with remaining TTL
- Login failed → increment `rate:login:{ip}` counter with 60s TTL

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Replace `authService.login()` | `services/authService.js` | `axiosClient.post('/auth/login', {username, password})` |
| Replace `authService.signup()` | `services/authService.js` | `axiosClient.post('/auth/signup', {...})` |
| Add `authService.logout()` | `services/authService.js` | `axiosClient.post('/auth/logout')` → clear localStorage |
| Add logout to authSlice | `store/slices/authSlice.js` | logout thunk calls `authService.logout()` |

### API Endpoints
```
POST /auth/signup          → { email, fullName, username, password }  → AuthResponse
POST /auth/login           → { username, password }                   → AuthResponse
POST /auth/logout          [AUTH] →                                   → void
GET  /auth/me              [AUTH] →                                   → UserProfileResponse
```

---

## Phase 2 — User Profile & Social

### Backend Tasks

**Files in `userprofile/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/UserProfileRepository.java` | `findByUsername`, `searchByUsernameOrFullName(query, pageable)` |
| Request | `request/UpdateProfileRequest.java` | record: `fullName, bio, website, pronouns, profileCategory, gender, phoneNumber` |
| Request | `request/UpdatePrivacyRequest.java` | record: `privateAccount, showActivityStatus, tagPermission` |
| Response | `response/UserProfileResponse.java` | record: all fields + `followersCount, followingCount, postsCount, isFollowing, isFollowedBy` |
| Service | `service/GetUserProfileService.java` | Get profile by username, include computed counts |
| Service | `service/UpdateProfileService.java` | Update profile fields, upload avatar to Cloudinary |
| Service | `service/UpdatePrivacyService.java` | Update privacy settings |
| Service | `service/SearchUsersService.java` | Paginated search by username/fullName |
| Service | `service/GetSuggestionsService.java` | Users followed by people you follow, not yet followed |
| Controller | `controller/UserProfileController.java` | All user profile endpoints |

**Files in `follow/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/FollowRepository.java` | `existsByFollowerAndFollowing`, `findFollowers`, `findFollowing`, `countFollowers`, `countFollowing` |
| Request | `request/FollowRequest.java` | record: `targetUserId` |
| Response | `response/FollowResponse.java` | record: `userId, username, avatarUrl, fullName, isFollowing` |
| Service | `service/FollowUserService.java` | Follow: if target is private → status=PENDING, else ACCEPTED; trigger notification |
| Service | `service/UnfollowUserService.java` | Delete follow row |
| Service | `service/GetFollowersService.java` | Paginated followers list with `isFollowing` flag |
| Service | `service/GetFollowingService.java` | Paginated following list |
| Service | `service/AcceptFollowRequestService.java` | Update follow status to ACCEPTED |
| Service | `service/RemoveFollowerService.java` | Delete follow row where following=currentUser |
| Controller | `controller/FollowController.java` | Follow/unfollow/followers/following/requests/accept/remove |

**Files in `favorite/`** (FavoriteUser only):

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/FavoriteUserRepository.java` | `findByUserOrderByCreatedAtDesc`, `existsByUserAndFavorite` |
| Service | `service/ToggleFavoriteUserService.java` | Add/remove from favorites list |
| Service | `service/GetFavoriteUsersService.java` | List of favorite users |
| Controller | `controller/FavoriteUserController.java` | `POST /users/favorites/{userId}`, `GET /users/favorites` |

**Files in `block/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/BlockRepository.java` | `findByBlockerOrderByCreatedAtDesc`, `existsByBlockerAndBlocked` |
| Service | `service/BlockUserService.java` | Block user (also removes follow both ways) |
| Service | `service/UnblockUserService.java` | Delete block row |
| Service | `service/GetBlockedUsersService.java` | List of blocked users |
| Controller | `controller/BlockController.java` | `POST /users/{userId}/block`, `DELETE /users/{userId}/block`, `GET /users/blocked` |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Replace all `userService` methods | `services/userService.js` | Replace dummy data with `axiosClient` calls |
| Replace all `profileService` methods | `services/profileService.js` | Replace dummy data with `axiosClient` calls |
| Add follow/unfollow thunks | `store/slices/userSlice.js` | Connect to follow endpoints |
| Profile page wired | `pages/Profile.jsx` | Load real profile, follow counts, posts |
| Settings page wired | `pages/Settings.jsx` | Connect profile edit, privacy, blocking |

### API Endpoints
```
GET    /users/me                    [AUTH] → UserProfileResponse
PUT    /users/profile               [AUTH] → UserProfileResponse        (edit profile)
PUT    /users/privacy               [AUTH] → void
GET    /users/search?query=&page=   [AUTH] → Page<UserProfileResponse>
GET    /users/suggestions           [AUTH] → List<UserProfileResponse>
GET    /users/{username}/profile    [AUTH] → UserProfileResponse

POST   /users/{userId}/follow       [AUTH] → FollowResponse
DELETE /users/{userId}/follow       [AUTH] → void
GET    /users/{userId}/followers    [AUTH] → Page<FollowResponse>
GET    /users/{userId}/following    [AUTH] → Page<FollowResponse>
POST   /users/{userId}/follow/accept [AUTH] → void               (accept follow request)
DELETE /users/{userId}/followers    [AUTH] → void                (remove a follower)
GET    /users/follow-requests       [AUTH] → List<FollowResponse>

POST   /users/favorites/{userId}    [AUTH] → void   (toggle)
GET    /users/favorites             [AUTH] → List<UserProfileResponse>

POST   /users/{userId}/block        [AUTH] → void
DELETE /users/{userId}/block        [AUTH] → void
GET    /users/blocked               [AUTH] → List<UserProfileResponse>
```

---

## Phase 3 — Post & Reel

### Backend Tasks

**Files in `post/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/PostRepository.java` | `findFeedPosts(userId, pageable)`, `findByUser`, `findExplore` |
| Repository | `repository/PostLikeRepository.java` | `existsByPostAndUser`, `countByPost` |
| Repository | `repository/PostViewRepository.java` | `existsByPostAndViewer`, `countByPost` |
| Repository | `repository/PostTagRepository.java` | `findByPost`, `findByTaggedUser` |
| Request | `request/CreatePostRequest.java` | record: `caption, type, locationName, taggedUserIds, hashtagNames` |
| Request | `request/UpdatePostRequest.java` | record: `caption, locationName, commentsDisabled, hideLikeCount` |
| Response | `response/PostResponse.java` | record: all post fields + `likeCount, commentCount, viewCount, isLiked, isSaved` |
| Response | `response/PostMediaResponse.java` | record: `url, mediaType, displayOrder` |
| Service | `service/CreatePostService.java` | Upload media to Cloudinary, save post + media + hashtags + tags |
| Service | `service/GetFeedPostsService.java` | Followers' posts + favorites boosted, paginated |
| Service | `service/GetExplorePostsService.java` | Public posts not in feed, paginated |
| Service | `service/GetPostByIdService.java` | Single post with privacy check |
| Service | `service/GetUserPostsService.java` | User's posts (respect privacy) |
| Service | `service/UpdatePostService.java` | Update caption/settings (only post owner) |
| Service | `service/DeletePostService.java` | Soft-delete or hard-delete |
| Service | `service/TogglePostLikeService.java` | Add/remove post_like row; trigger notification |
| Service | `service/RecordPostViewService.java` | Insert post_view if not exists |
| Controller | `controller/PostController.java` | All post endpoints |

**Files in `hashtag/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/HashtagRepository.java` | `findByName`, `findOrCreate` |
| Service | `service/GetHashtagPostsService.java` | Posts by hashtag, paginated |
| Controller | `controller/HashtagController.java` | `GET /hashtags/{name}/posts` |

**Cloudinary integration:**

| File | Responsibility |
|---|---|
| `config/CloudinaryConfig.java` | Configure Cloudinary bean from `application.yml` |
| `integration/cloudinary/CloudinaryService.java` | Upload file → return URL |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Replace all `postService` methods | `services/postService.js` | All `axiosClient` calls |
| Replace `reelService` methods | `services/reelService.js` | |
| Integrate `postSlice.fetchPosts()` | `store/slices/postSlice.js` | Connect to feed API |
| CreatePostModal connected | `components/CreatePostModal.jsx` | Upload + create post |
| Home feed wired | `pages/Home.jsx` | Real feed posts |
| Explore wired | `pages/Explore.jsx` | Real explore posts |
| Reels wired | `pages/Reels.jsx` | Real reels |
| PostDetail wired | `pages/PostDetail.jsx` | Real post detail |

### API Endpoints
```
POST   /posts                       [AUTH] multipart  → PostResponse          (create)
GET    /posts/feed?page=            [AUTH]            → Page<PostResponse>
GET    /posts/explore?page=         [AUTH]            → Page<PostResponse>
GET    /posts/{postId}              [AUTH]            → PostResponse
PATCH  /posts/{postId}              [AUTH]            → PostResponse
DELETE /posts/{postId}              [AUTH]            → void
GET    /users/{username}/posts?page= [AUTH]           → Page<PostResponse>

POST   /posts/{postId}/like         [AUTH] → void     (toggle)
POST   /posts/{postId}/view         [AUTH] → void

GET    /hashtags/{name}/posts?page= [AUTH] → Page<PostResponse>
```

---

## Phase 4 — Comment

### Backend Tasks

**Files in `comment/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/CommentRepository.java` | `findTopLevelByPost(pageable)`, `findRepliesByParent(pageable)`, `countByPost` |
| Repository | `repository/CommentLikeRepository.java` | `existsByCommentAndUser`, `countByComment` |
| Request | `request/CreateCommentRequest.java` | record: `content, parentCommentId(nullable)` |
| Response | `response/CommentResponse.java` | record: `id, user, content, isPinned, likeCount, replyCount, isLiked, createdAt` |
| Service | `service/CreateCommentService.java` | Create top-level comment or reply; trigger COMMENT/MENTION notification |
| Service | `service/GetPostCommentsService.java` | Paginated top-level comments (sort: top or newest) |
| Service | `service/GetCommentRepliesService.java` | Paginated replies for a comment |
| Service | `service/DeleteCommentService.java` | Delete (only owner or post owner) |
| Service | `service/PinCommentService.java` | Pin/unpin (only post owner) |
| Service | `service/ToggleCommentLikeService.java` | Add/remove comment_like |
| Controller | `controller/CommentController.java` | All comment endpoints |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Replace `commentService.getCommentsByPostId()` | `services/commentService.js` | axiosClient.get |
| Replace comment TODO methods | `services/commentService.js` | addComment, addReply, toggleLikeComment |

### API Endpoints
```
GET    /posts/{postId}/comments?page=&sort=TOP  [AUTH] → Page<CommentResponse>
POST   /posts/{postId}/comments                 [AUTH] → CommentResponse
GET    /comments/{commentId}/replies?page=      [AUTH] → Page<CommentResponse>
POST   /comments/{commentId}/like               [AUTH] → void   (toggle)
DELETE /comments/{commentId}                    [AUTH] → void
POST   /posts/{postId}/comments/{commentId}/pin [AUTH] → void   (toggle, post owner only)
```

---

## Phase 5 — Story & Highlight

### Backend Tasks

**Files in `story/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/StoryRepository.java` | `findFeedStories(userId)` — from followed users, not expired, not archived |
| Repository | `repository/StoryViewRepository.java` | `existsByStoryAndViewer`, `findByStory` |
| Request | `request/CreateStoryRequest.java` | record: `linkUrl, isCloseFriends` + media file |
| Response | `response/StoryResponse.java` | record: `id, user, mediaUrl, mediaType, expiresAt, viewCount, isViewed, isLiked, linkUrl` |
| Response | `response/StoryFeedResponse.java` | record: `user, stories, hasUnseenStory` |
| Service | `service/CreateStoryService.java` | Upload to Cloudinary, set `expiresAt = now + 24h`, save |
| Service | `service/GetFeedStoriesService.java` | Grouped by user; close friends filtered by `favorite_user` list |
| Service | `service/GetStoryViewersService.java` | List of viewers (only story owner can see) |
| Service | `service/ViewStoryService.java` | Upsert `story_view`; trigger STORY_REPLY if reply |
| Service | `service/LikeStoryService.java` | Update `story_view.liked = true` |
| Service | `service/ReplyToStoryService.java` | Save `story_reply`; trigger STORY_REPLY notification |
| Service | `service/DeleteStoryService.java` | Delete story |
| Service | `service/ArchiveStoryService.java` | Toggle `is_archived` |
| Controller | `controller/StoryController.java` | All story endpoints |

**Files in `highlight/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/HighlightRepository.java` | `findByUserOrderByCreatedAtDesc` |
| Request | `request/CreateHighlightRequest.java` | record: `title, coverUrl, storyIds` |
| Response | `response/HighlightResponse.java` | record: `id, title, coverUrl, storiesCount` |
| Service | `service/CreateHighlightService.java` | Create highlight + add stories |
| Service | `service/GetUserHighlightsService.java` | List highlights for a user |
| Service | `service/AddStoryToHighlightService.java` | Add story to existing highlight |
| Controller | `controller/HighlightController.java` | All highlight endpoints |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Replace `storyService` | `services/storyService.js` | Real API + story grouping logic moves to BE |
| Replace `profileService.addToHighlight()` | `services/profileService.js` | Real API call |
| StoryModal connected | `components/StoryModal.jsx` | Real views, replies, likes |

### API Endpoints
```
POST   /stories                         [AUTH] multipart → StoryResponse
GET    /stories/feed                    [AUTH] → List<StoryFeedResponse>
GET    /stories/{storyId}/viewers       [AUTH] → List<StoryViewResponse>   (owner only)
POST   /stories/{storyId}/view          [AUTH] → void
POST   /stories/{storyId}/like          [AUTH] → void
POST   /stories/{storyId}/reply         [AUTH] → void      { text }
DELETE /stories/{storyId}               [AUTH] → void
POST   /stories/{storyId}/archive       [AUTH] → void      (toggle)
GET    /stories/archive                 [AUTH] → List<StoryResponse>

POST   /highlights                      [AUTH] → HighlightResponse
GET    /users/{username}/highlights     [AUTH] → List<HighlightResponse>
POST   /highlights/{highlightId}/stories [AUTH] → void     { storyId }
DELETE /highlights/{highlightId}        [AUTH] → void
```

---

## Phase 6 — Messaging (WebSocket)

### Backend Tasks

**New config:**

| File | Responsibility |
|---|---|
| `config/WebSocketConfig.java` | Configure STOMP broker at `/ws`, app prefix `/app`, topic prefix `/topic` |

**Files in `message/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/ConversationRepository.java` | `findConversationBetween(userId1, userId2)`, `findUserConversations(userId)` |
| Repository | `repository/ConversationParticipantRepository.java` | `findByConversation`, `findByUserAndConversation` |
| Repository | `repository/MessageRepository.java` | `findByConversationOrderByCreatedAtAsc(pageable)`, `countUnread(conversationId, userId, lastReadAt)` |
| Request | `request/SendMessageRequest.java` | record: `recipientId, content, mediaUrl, mediaType, sharedPostId` |
| Response | `response/ConversationResponse.java` | record: `id, otherUser, lastMessage, lastMessageTime, unreadCount, isAccepted` |
| Response | `response/MessageResponse.java` | record: `id, sender, content, mediaUrl, mediaType, sharedPost, isDeleted, createdAt` |
| Service | `service/GetConversationsService.java` | Primary (accepted) chats with last message + unread count |
| Service | `service/GetMessageRequestsService.java` | Pending (is_accepted=false) conversations |
| Service | `service/GetMessagesService.java` | Paginated messages for a conversation |
| Service | `service/SendMessageService.java` | Find/create conversation, save message, publish to STOMP `/topic/messages/{conversationId}` |
| Service | `service/MarkConversationReadService.java` | Update `conversation_participant.last_read_at` |
| Service | `service/AcceptMessageRequestService.java` | Set `is_accepted=true` for participant |
| Service | `service/DeleteMessageService.java` | Set `is_deleted=true` on message |
| Controller | `controller/MessageController.java` | REST endpoints for conversation list, history, accept, delete |
| Controller | `controller/MessageWebSocketController.java` | `@MessageMapping("/chat.send")` — handles incoming WebSocket messages |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Install STOMP client | `package.json` | Add `@stomp/stompjs sockjs-client` |
| WebSocket service | `services/websocketService.js` | New file — connect, subscribe, disconnect |
| Replace `messageService` | `services/messageService.js` | All real API calls |
| Messages page wired | `pages/Messages.jsx` | Real conversations + WebSocket for new messages |

### API Endpoints
```
GET    /messages/primary            [AUTH] → List<ConversationResponse>
GET    /messages/requests           [AUTH] → List<ConversationResponse>
GET    /messages/requests/count     [AUTH] → { count: number }
GET    /messages/{conversationId}?page= [AUTH] → Page<MessageResponse>
POST   /messages/send               [AUTH] → MessageResponse          (also via WS)
POST   /messages/{conversationId}/read  [AUTH] → void
POST   /messages/requests/{conversationId}/accept [AUTH] → void
DELETE /messages/{messageId}        [AUTH] → void                     (unsend)

WS: /app/chat.send → /topic/messages/{conversationId}
```

---

## Phase 7 — Notifications

### Backend Tasks

**Files in `notification/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/NotificationRepository.java` | `findByRecipientOrderByCreatedAtDesc(pageable)`, `countUnread(recipientId)` |
| Response | `response/NotificationResponse.java` | record: `id, actor, type, post(nullable), comment(nullable), isRead, createdAt` |
| Service | `service/GetNotificationsService.java` | Paginated notifications grouped by day (Today/Yesterday/Earlier) |
| Service | `service/MarkNotificationReadService.java` | Mark single or all as read |
| Service | `service/CreateNotificationService.java` | Internal service — called from Like/Follow/Comment/Tag services |
| Controller | `controller/NotificationController.java` | `GET /notifications`, `POST /notifications/read-all`, `POST /notifications/{id}/read` |

**Notification triggers** (inside other services):
| Event | Type | Triggered in |
|---|---|---|
| Post liked | `LIKE` | `TogglePostLikeService` |
| Followed | `FOLLOW` | `FollowUserService` |
| Follow request | `FOLLOW_REQUEST` | `FollowUserService` (private account) |
| Comment on post | `COMMENT` | `CreateCommentService` |
| @mention in comment | `MENTION` | `CreateCommentService` |
| Tagged in post | `TAG` | `CreatePostService` |
| Story reply | `STORY_REPLY` | `ReplyToStoryService` |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| New notificationService | `services/notificationService.js` | GET notifications, mark read |
| Notifications panel wired | Sidebar/notification UI | Real notifications |

### API Endpoints
```
GET    /notifications?page=         [AUTH] → Page<NotificationResponse>
GET    /notifications/unread-count  [AUTH] → { count: number }
POST   /notifications/read-all      [AUTH] → void
POST   /notifications/{id}/read     [AUTH] → void
```

---

## Phase 8 — Saved, Favorites & Archive

### Backend Tasks

**Files in `saved/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/SavedPostRepository.java` | `findByUserOrderByCreatedAtDesc(pageable)`, `existsByUserAndPost` |
| Service | `service/ToggleSavedPostService.java` | Add/remove saved_post row |
| Service | `service/GetSavedPostsService.java` | Paginated saved posts |
| Controller | `controller/SavedPostController.java` | `POST /saved/posts/{postId}`, `GET /saved/posts` |

**Files in `favorite/`** (FavoritePost):

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/FavoritePostRepository.java` | `findByUserOrderByCreatedAtDesc(pageable)`, `existsByUserAndPost` |
| Service | `service/ToggleFavoritePostService.java` | Add/remove favorite_post row |
| Service | `service/GetFavoritePostsService.java` | Paginated favorite posts |
| Controller | `controller/FavoritePostController.java` | `POST /favorites/posts/{postId}`, `GET /favorites` |

**Archive** (add to existing PostService & StoryService):

| Service method | Responsibility |
|---|---|
| `ArchivePostService` | Toggle `post.is_archived` |
| `GetArchivedPostsService` | Posts where `is_archived=true AND user=current` |
| `GetArchivedStoriesService` | Stories where `is_archived=true AND user=current` |
| `ArchiveController` | `GET /archive/posts`, `GET /archive/stories`, `POST /posts/{id}/archive`, `POST /stories/{id}/archive` |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Wire save toggle | `services/postService.js` | `toggleSavePost` → real API |
| Wire favorite toggle | `services/postService.js` | `toggleFavorite` → real API |
| Archive page wired | `pages/Archive.jsx` | Real archived posts and stories |

### API Endpoints
```
POST   /saved/posts/{postId}        [AUTH] → void   (toggle)
GET    /saved/posts?page=           [AUTH] → Page<PostResponse>

POST   /favorites/posts/{postId}    [AUTH] → void   (toggle)
GET    /favorites?page=             [AUTH] → Page<PostResponse>

GET    /archive/posts?page=         [AUTH] → Page<PostResponse>
GET    /archive/stories             [AUTH] → List<StoryResponse>
POST   /posts/{postId}/archive      [AUTH] → void   (toggle)
POST   /stories/{storyId}/archive   [AUTH] → void   (toggle)
```

---

## Phase 9 — Search & Explore

### Backend Tasks

**Files in `search/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/SearchHistoryRepository.java` | `findByUserOrderByCreatedAtDesc(userId, pageable)`, `findRecent(userId, limit)` |
| Request | `request/SearchRequest.java` | record: `query, page, size` |
| Response | `response/SearchResultResponse.java` | record: `users(List), hashtags(List)` |
| Service | `service/SearchService.java` | Search users by username/fullName + hashtags by name |
| Service | `service/SaveSearchHistoryService.java` | Save to search_history after search |
| Service | `service/GetSearchHistoryService.java` | Recent searches (users + hashtags) |
| Service | `service/ClearSearchHistoryService.java` | Delete all search history for user |
| Controller | `controller/SearchController.java` | All search endpoints |

**Explore** (extends PostService):
- `GetExplorePostsService` already planned in Phase 3 — trending/random public posts

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Search wired | Sidebar search UI | Real user + hashtag search |
| Settings favorites search wired | `pages/Settings.jsx` | Real user search |

### API Endpoints
```
GET    /search?query=&page=         [AUTH] → SearchResultResponse
GET    /search/history              [AUTH] → List<SearchHistoryItem>
DELETE /search/history              [AUTH] → void   (clear all)
DELETE /search/history/{id}         [AUTH] → void   (remove one)
```

---

## Phase 10 — Block & Report

### Backend Tasks

*(Block already planned in Phase 2. Report is new.)*

**Files in `report/`:**

| Layer | File | Responsibility |
|---|---|---|
| Repository | `repository/ReportRepository.java` | `existsByReporterAndPost`, `findAll(pageable)` (admin) |
| Request | `request/CreateReportRequest.java` | record: `postId, reason` |
| Service | `service/CreateReportService.java` | Save report (once per user per post) |
| Controller | `controller/ReportController.java` | `POST /reports/posts/{postId}` |

### Frontend Tasks

| Task | File | Notes |
|---|---|---|
| Wire report post | `services/postService.js` | `reportPost` → real API |

### API Endpoints
```
POST   /reports/posts/{postId}      [AUTH] → void   { reason }
```

---

## API Contract Reference

### Response Envelope (all endpoints)
```json
{
  "status": "success",
  "data": { ... },
  "metadata": { "timestamp": "...", "path": "..." },
  "pagination": { "page": 0, "size": 20, "total": 100 }
}
```

### Common HTTP Status Codes
| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Validation error (AppValidationException) |
| `401` | Unauthenticated (no/invalid JWT) |
| `403` | Forbidden (private account, wrong owner) |
| `404` | Resource not found |
| `409` | Duplicate resource (already liked, already following) |

### Pagination Query Params
All paginated endpoints accept: `?page=0&size=20` (defaults)

---

## Database Summary

| Migration | Tables | Status |
|---|---|---|
| V1 | `user_profile` | ✅ Done |
| V2 | 25 new tables (alter + create) | ✅ Done |
| **Total** | **26 tables** | |

### Tables by Feature
```
userprofile:    user_profile
post:           post, post_media, post_like, post_view, post_tag
hashtag:        hashtag, post_hashtag
comment:        comment, comment_like
follow:         follow
story:          story, story_view, story_reply, story_mention
highlight:      highlight, highlight_story
saved:          saved_post
favorite:       favorite_post, favorite_user
block:          block
message:        conversation, conversation_participant, message
notification:   notification
report:         report
search:         search_history
```

---

## Implementation Priority

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
  (must be done in order — each phase depends on previous)

Phase 5, 6, 7, 8, 9, 10
  (can be done in parallel after Phase 4, but 7 depends on 3+4+2)
```

**Minimum viable product** (all frontend pages functional):
Phases 0 → 1 → 2 → 3 → 4 → 5 → 6
