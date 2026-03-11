# 🎨 Instagram Clone — Frontend Implementation Roadmap (v4.0)
> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending
> **Stack:** React 19, Redux Toolkit, Tailwind v4, Chakra UI v3, STOMP.js — Desktop Only

---

## ⚠️ Field Name Migration Reference (MANDATORY)
Every agent modifying a component MUST use the new API field names:

| ❌ Old (mock/wrong) | ✅ New (API) |
|---|---|
| `post.user.avatar` | `post.author.avatarUrl` |
| `post.user.username` | `post.author.username` |
| `post.user.id` | `post.author.id` |
| `post.imageUrl` | `post.media[0].url` |
| `post.images[]` | `post.media[]` array of `{url, mediaType, displayOrder}` |
| `post.videoUrl` | `post.media[0].url` where `media[0].mediaType === 'VIDEO'` |
| `post.likedBy[]` | **GONE** — use `post.isLiked` (bool) + `post.likeCount` (number) |
| `post.type === 'reel'` | `post.type === 'REEL'` (Java enum uppercase) |
| `user.avatar` | `user.avatarUrl` |
| `user.highlights` | NOT in UserProfileResponse — fetch separately |
| `story.hasStory` | `story.hasUnseenStory` from StoryFeedResponse |
| `story.avatar` | `story.avatarUrl` from StoryFeedResponse |
| `reel.videoUrl` | `reel.media[0].url` |

---

## Phase 0: Infrastructure ✅
- [x] Environment sync, Tailwind v4, loading system

---

## Phase 1: Auth ✅
- [x] authService, persistent session, global error interceptor

---

## Phase 2: Social Identity 🔄
- [x] Dynamic profile with real data, follow/unfollow optimistic
- [x] Search panel + history
- [ ] **Task 2.1: Follower/Following Modals** — wire click on follower/following COUNT in ProfileHeader
      → opens UserListModal → GET /users/{userId}/followers or /following
- [ ] **Task 2.2: postsCount** — display in ProfileHeader (backend adding this field to UserProfileResponse)

---

## Phase 3: Posts + Feed + Comments + Profile Wiring ⬜

### Pre-requisite: Fix postSlice (do this first)
- [ ] Replace `page: number` with `nextCursor: string|null` in state
- [ ] `fetchFeed(cursor)` thunk → GET /feed?cursor=&size=20
- [ ] `toggleLike` thunk: use `LikeResponse.likeCount` directly (NOT ±1 math)
- [ ] Remove `addMockPosts` / `setMockPosts` reducers

### Pre-requisite: Fix Service Layer
- [ ] `postService.getFeedPosts(cursor, size)` — change from page/size offset
- [ ] `postService.updatePost(id, data)` — ADD missing method → PUT /posts/{id}
- [ ] `postService.reportPost(postId, reason)` — FIX signature (was `userId`)
       → POST /reports/posts/{postId} { reason }
- [ ] `postService.getLikers(postId, page)` — ADD → GET /posts/{id}/likers
- [ ] `postService.getSavedPosts(page)` — ADD → GET /posts/saved
- [ ] `postService.getTaggedPosts(userId, page)` — ADD → GET /posts/tagged/{userId}

### Task 3.1: Home.jsx — Feed
- [ ] Switch to cursor-based: `postService.getFeedPosts(nextCursor, 20)` → FeedResponse
- [ ] Store `nextCursor` from response, pass as param for next load
- [ ] `hasMore=false` → show "You've seen all new posts"
- [ ] Stories bar: replace mock storyService → real `GET /stories/feed`
      StoryFeedResponse: `{ userId, username, avatarUrl, hasUnseenStory, stories[] }`
- [ ] Own story bubble: first item, gradient ring if authUser has active stories, + icon if not
- [ ] Seen/unseen ring: `hasUnseenStory=true` → gradient; false → gray border
- [ ] RightSidebar suggestions: wire to `GET /users/suggestions` (profileService.getSuggestions ✓)
      Fix field: `user.avatarUrl` not `user.avatar`

### Task 3.2: PostCard.jsx — Field Names + All Actions
- [ ] Fix author fields: `post.author.avatarUrl`, `post.author.username`, `post.author.isFollowing`
- [ ] Fix media: render `post.media[0].url` for thumbnail, detect type via `post.media[0].mediaType`
- [ ] Fix type check: `post.type === 'REEL'` not `'reel'`
- [ ] Wire save toggle: `postService.savePost(post.id)` → SaveResponse → update `post.isSaved` in store
- [ ] Wire double-tap like (already in PostDetailModal, add to PostCard too)
- [ ] Comment input: add submit handler → `commentService.addComment(post.id, text)`
- [ ] Send/DM icon: opens user picker modal → `messageService.send({ recipientId, sharedPostId })`
- [ ] Like count: hide if `post.hideLikeCount && !post.isOwner`
- [ ] Use `post.isLiked` (from API) as initial liked state, not computed from likedBy[]

### Task 3.3: PostDetailModal.jsx — Full Wiring
- [ ] Fix all field names (author.*, media[], type uppercase)
- [ ] Like button: wire to `postService.likePost(post.id)` → LikeResponse → update likeCount + isLiked
- [ ] Comment "Post" button: wire to `commentService.addComment(post.id, text)`
      → prepend to comment list + clear input
- [ ] Load comments on open: `commentService.getComments(post.id)`
- [ ] Likers modal: wire to `postService.getLikers(post.id)` (not post.likedBy which doesn't exist)
- [ ] Follow button: show only if `!post.author.isFollowing && !post.isOwner`
      wire to `profileService.followUser(post.author.id)`
- [ ] "View X replies" on comment: show if `comment.replyCount > 0`
      load replies: `commentService.getComments(postId, comment.id)` → ?parentId=
- [ ] Comment like: wire `commentService.likeComment(postId, commentId)`
- [ ] Comment delete: show if `comment.isOwner`, wire `commentService.deleteComment(postId, commentId)`

### Task 3.4: Profile.jsx — Full Page Wiring
- [ ] Fetch highlights separately: `profileService.getHighlights(userId)` → GET /users/{id}/highlights
      `ProfileHighlights` receives `highlights[]` from state (not from user object)
- [ ] Highlights field fix: `highlight.coverUrl` not `highlight.cover`
- [ ] Add Tagged tab to ProfileTabs (id: "tagged", icon: BsPersonBoundingBox)
- [ ] Saved tab: only render for `isOwnProfile === true` (hide for others)
- [ ] Wire tab content:
      posts → GET /users/{id}/posts (already wired)
      reels → GET /feed?type=REEL&userId (or GET /users/{id}/posts filtered client-side by type)
      saved → GET /posts/saved (isOwnProfile check)
      tagged → GET /posts/tagged/{userId}
- [ ] Follow requests panel: if `isOwnProfile && userProfile.privateAccount`
      show "X Follow Requests" link → opens modal with GET /users/follow-requests
      accept: POST /users/{userId}/follow/accept | decline: DELETE /users/{userId}/follow
- [ ] ProfileHighlights "New" button: opens Create Highlight modal (Phase 8)

### Task 3.5: EditPostModal.jsx — All 4 Fields
- [ ] Send all fields: caption, commentsDisabled, hideLikeCount, locationName
      (currently only caption is sent)
- [ ] Wire to `postService.updatePost(post.id, { caption, commentsDisabled, hideLikeCount, locationName })`

### Task 3.6: MoreOptionsModal.jsx — Action Fixes
- [ ] Archive action: call `postService.archivePost(post.id)` (PATCH /posts/{id}/archive)
      NOT just navigate to /archive/stories
- [ ] Report: call `postService.reportPost(post.id, reason)` (fix: postId not userId)
- [ ] Edit post: open EditPostModal with current post data
- [ ] Add Unarchive option when `post.archived === true`

### Task 3.7: CreatePostModal.jsx — Cloudinary Flow
- [ ] File picker → `cloudinaryUpload(file)` → returns `{ url, mediaType }`
- [ ] Support multiple files (carousel), assign displayOrder 0,1,2...
- [ ] Caption with hashtag autocomplete: on `#` typed → GET /hashtags/search?q=&limit=10
- [ ] Tag users picker: search users inline
- [ ] Submit → POST /posts JSON body (not multipart)
- [ ] Show toast if `skippedTagIds.length > 0` → "X users could not be tagged"

### Task 3.8: App.jsx — Add Missing Route
- [ ] Add `/archive` route → `<Archive />`

---

## Phase 4: Reels + Archive ⬜

### Task 4.1: Reels.jsx — Full Wiring
- [ ] Fix field names: `reel.media[0].url` not `reel.videoUrl`
- [ ] Remove `reel.likedBy` references; use `reel.isLiked` + `reel.likeCount`
- [ ] Wire like: `postService.likePost(reel.id)` → LikeResponse → update count
- [ ] Wire save: `postService.savePost(reel.id)` → SaveResponse
- [ ] Wire follow: `profileService.followUser(reel.author.id)`, show if `!reel.author.isFollowing`
- [ ] **Intersection Observer autoplay**: play only visible reel, pause all others
      (prevents all 20 reels downloading + playing simultaneously off-screen)
- [ ] ReelCommentPanel: wire to `commentService.getComments(reel.id)`
      submit reply → `commentService.addComment(reel.id, text)`
- [ ] reelService.js: rewrite → GET /feed?type=REEL (cursor-based, same postSlice)

### Task 4.2: Archive.jsx — Real Data + Route
- [ ] Route already fixed in Phase 3 (App.jsx)
- [ ] Posts tab: wire to `postService.getArchivedPosts()` → GET /archive/posts
- [ ] Stories tab: placeholder "Stories archive coming soon" (Phase 8 wires this)
- [ ] Clicking archived post → PostDetailModal (properly wired from Task 3.3)
- [ ] Unarchive: add option in PostDetailModal/MoreOptionsModal for archived posts
      → `postService.archivePost(id)` toggles, returns `PostResponse { archived: false }`

---

## Phase 5: Messaging ⬜

### Task 5.1: websocketService.js (new file)
- [ ] Connect STOMP over SockJS to /ws with JWT auth header
- [ ] Subscribe to `/topic/messages/{conversationId}` on conversation open
- [ ] Subscribe to `/topic/notifications/{userId}` on connect
- [ ] Disconnect on logout / component unmount
- [ ] Publish send: `/app/chat.send` → `{ conversationId, content, mediaUrl, sharedPostId }`

### Task 5.2: messageService.js — Full Rewrite
- [ ] `getConversations()` → GET /messages/primary
- [ ] `getRequests()` → GET /messages/requests
- [ ] `getRequestsCount()` → GET /messages/requests/count
- [ ] `getMessages(convId, page)` → GET /messages/{convId}?page=
- [ ] `sendMessage(data)` → POST /messages/send
- [ ] `markRead(convId)` → POST /messages/{convId}/read
- [ ] `acceptRequest(convId)` → POST /messages/requests/{convId}/accept
- [ ] `deleteMessage(msgId)` → DELETE /messages/{msgId}

### Task 5.3: Messages.jsx — Wire UI
- [ ] Load conversation list on mount
- [ ] Separate tabs: Primary | Requests with unread count badge
- [ ] Select conversation → load messages, mark as read
- [ ] Real-time: new message arrives via WebSocket → append to chat
- [ ] Online presence: green dot if `user.isOnline && user.showActivityStatus`
- [ ] Share post via DM: `PostCard` send icon → open user picker → send with sharedPostId

---

## Phase 6: Notifications ⬜

### Task 6.1: notificationService.js (new file)
- [ ] `getNotifications(page)` → GET /notifications?page=
- [ ] `getUnreadCount()` → GET /notifications/unread-count
- [ ] `markAllRead()` → POST /notifications/read-all
- [ ] `markRead(id)` → POST /notifications/{id}/read

### Task 6.2: NotificationPanel.jsx — Wire Real Data
- [ ] Load notifications on panel open (paginated)
- [ ] Mark all as read on panel open
- [ ] Real-time: new notification via WebSocket → prepend + increment badge
- [ ] Render by type: LIKE → "liked your post", FOLLOW → "started following you",
      COMMENT → "commented: ...", MENTION → "mentioned you", TAG → "tagged you"
- [ ] Click notification: navigate to relevant post/profile

### Task 6.3: Sidebar — Unread Badge
- [ ] Bell icon: show red badge with unread count from `GET /notifications/unread-count`
- [ ] Messages icon: show badge from `GET /messages/requests/count`
- [ ] Both badges reset when panel/page opens

---

## Phase 7: Settings — Silent Bug Fixes ⬜

> All 3 settings bugs below are **silent data loss** — user changes something but it doesn't save.

### Task 7.1: Privacy Toggle
- [ ] `isPrivate` toggle → wire to `PUT /users/privacy { privateAccount: bool }`
      (currently only updates local React state — NEVER hits backend)

### Task 7.2: Unblock User
- [ ] Unblock button → wire to `DELETE /users/{userId}/block`
      then refetch blocked users list
      (currently only removes from local array — block persists in DB)

### Task 7.3: Avatar Update
- [ ] File input → Cloudinary upload → get URL → PUT /users/profile { avatarUrl }
      (currently no upload flow at all)

### Task 7.4: Activity Status + Notifications Paused
- [ ] Add `showActivityStatus` toggle → include in PUT /users/privacy payload
- [ ] Add `notificationsPaused` toggle → include in PUT /users/privacy payload

### Task 7.5: Close Friends (Favorite Users)
- [ ] GET /users/favorites → show list of close friends
- [ ] Add/remove: POST /users/favorites/{userId} toggle
- [ ] Explain: close friends see is_close_friends stories

---

## Phase 8: Stories + Highlights ⬜

### Task 8.1: Story Creation
- [ ] Own story bubble "+" in Stories bar → file picker → Cloudinary upload
      → POST /stories { mediaUrl, mediaType, isCloseFriends }
- [ ] After create → update own bubble to show gradient ring

### Task 8.2: StoryModal.jsx — Full Wiring
- [ ] On story open: POST /stories/{id}/view (currently missing entirely)
- [ ] Like button: wire to storyService.likeStory(id) → POST /stories/{id}/like
      (currently local state only)
- [ ] Reply input: wire submit → storyService.replyToStory(id, text) → POST /stories/{id}/reply
      (currently no submit handler)
- [ ] Delete own story: add option → DELETE /stories/{id}
- [ ] Viewers list (owner only): wire to storyService.getViewers(id) → GET /stories/{id}/viewers
      (currently shows mock story.views[])
- [ ] Archive.jsx stories tab: wire to storyService.getArchivedStories() → GET /archive/stories

### Task 8.3: storyService.js — Full Rewrite
- [ ] `getStoriesForFeed()` → GET /stories/feed
- [ ] `viewStory(id)` → POST /stories/{id}/view
- [ ] `likeStory(id)` → POST /stories/{id}/like
- [ ] `replyToStory(id, text)` → POST /stories/{id}/reply
- [ ] `deleteStory(id)` → DELETE /stories/{id}
- [ ] `getViewers(id)` → GET /stories/{id}/viewers
- [ ] `createStory(data)` → POST /stories
- [ ] `getArchivedStories()` → GET /archive/stories

### Task 8.4: Highlights Management
- [ ] "New" button on ProfileHighlights → Create Highlight modal
      title input + cover picker → POST /highlights
- [ ] Add story to highlight: in StoryModal own-story view → "Add to Highlight" button
      → POST /highlights/{id}/stories { storyId }
- [ ] Delete highlight: right-click/long-press → DELETE /highlights/{id}

---

## Verification Protocol
1. `npm run lint` — zero errors before marking any task complete
2. No `post.user.*` or `post.imageUrl` or `post.likedBy` — use migration reference table
3. No `setIsLiked(!isLiked)` without API call — every toggle hits backend
4. Optimistic update pattern: update store immediately, reconcile with API response
5. No mock data in production paths — storyService, reelService, messageService must all be real API
6. borderRadius: 0 on all custom components (Tailwind: rounded-none)
