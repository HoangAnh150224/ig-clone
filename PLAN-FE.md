# 🎨 Instagram Clone — Frontend Implementation Roadmap (v4.0)
> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending
> **Stack:** React 19, Redux Toolkit, Tailwind v4, Chakra UI v3, STOMP.js — Desktop Only

---

## ⚠️ MANDATORY RULES
1. **NO Mock Data:** All data must come from Redux store or Services calling axiosClient.
2. **Standard API Shape:** Always expect `{ status, message, data }` wrapper (handled by axiosClient).
3. **Cursor Pagination:** Use `nextCursor` for Feed, Explore, and Comments.
4. **Optimistic UI:** Toggle like/save pattern: update store immediately, reconcile with API response.
5. **Real-time:** Use STOMP.js for messages and notifications.
6. **Geometry:** `borderRadius: 0` on all custom components.

---

## Phase 2: Social Identity & Discovery ✅

- [x] **Task 2.1: Follower/Following Modals** — wire click on follower/following COUNT in ProfileHeader → opens UserListModal → GET /users/{userId}/followers or /following
- [x] **Task 2.2: postsCount in ProfileHeader** — display `user.postsCount` field

---

## Phase 3: Posts + Feed + Comments (Real API) ✅

- [x] **Fix postSlice (do this first)** — replace `page` with `nextCursor: string|null`; `fetchFeed(cursor)` thunk; `toggleLike` thunk uses `LikeResponse` directly.
- [x] **Task 3.1: Home.jsx — Feed** — implement cursor-based scroll; Stories bar uses `storyService.getFeedStories()`.
- [x] **Task 3.2: PostCard.jsx — Field Names** — use `post.author.avatarUrl`, `post.media[0].url`, etc. Wire Like/Save/Comment actions.
- [x] **Task 3.3: PostDetailModal.jsx — Full Wiring** — fetch comments on open; handle like/save inside modal; wire "Post" button.
- [x] **Task 3.4: Profile.jsx — Full Page Wiring** — fetch highlights via `profileService.getUserHighlights`; wire "Saved" and "Tagged" tabs to real API.
- [x] **Task 3.5: EditPostModal.jsx — All 4 Fields** — caption, locationName, commentsDisabled, hideLikeCount → PUT /posts/{id}.
- [x] **Task 3.6: MoreOptionsModal.jsx — Action Fixes** — Archive (PATCH), Report (POST), Block (POST).
- [x] **Task 3.7: CreatePostModal.jsx — Cloudinary Flow** — File picker → `cloudinaryService.upload(file)` → `POST /posts` with URL.
- [x] **Task 3.8: App.jsx — Add Missing Route** — add `/archive` route for Post/Story Archive page.

---

## Phase 4: Reels + Archive ✅

- [x] **Task 4.1: Reels.jsx — Full Wiring** — GET /feed?type=REEL (cursor-based); use `postService.likePost`; Intersection Observer autoplay.
- [x] **Task 4.2: Archive.jsx — Full Page** — fetch archived posts and stories from `storyService.getArchivedStories()` and `postService.getArchivedPosts()`.

---

## Phase 5: Explore ✅

- [x] **Task 5.1: Explore.jsx — Cursor-based** — GET /posts/explore (cursor-based); infinite scroll wiring.
- [x] **Task 5.2: Hierarchical Grid indicator** — show Reel icon if `post.type === 'REEL'`.

---

## Phase 6: Messages (Real-time) 🔄

- [ ] **Task 6.1: Messages.jsx — STOMP integration** — use `useStomp` hook; GET /messages/primary; subscribe to `/user/queue/messages`. (Awaiting Backend WebSocket Auth)
- [x] **Task 6.2: ReelCommentPanel.jsx — Cursor-based** — GET /posts/{id}/comments (cursor-based); wire "Post" button.
- [ ] **Task 6.3: Responsive Messages** — Refactor Desktop split-screen chat into 2 separate mobile views (ChatList / ChatWindow) when on small screens.

---

## Phase 7: Settings + Search + Global UI ✅

- [x] **Task 7.1: Settings.jsx — PATCH /users/me** — wire all fields; bio, website, gender, privateAccount.
- [x] **Task 7.2: Search.jsx — REST flow** — wire search input to `userService.searchUsers(query)`.
- [x] **Task 7.3: Avatar Update — Cloudinary flow** — change photo → upload to Cloudinary → PATCH /users/me { avatarUrl }.

---

## Phase 8: Search History & Real-time Refinement ⬜

- [x] **Task 8.1: Search History Wiring** — GET /search/history; POST on result click; DELETE on X click.
- [ ] **Task 8.2: Real-time likes/comments** — on message from `/topic/notifications/{userId}` → update post in store.
- [ ] **Task 8.3: Typing indicators** — publish to `/app/chat.typing` on input change; show "Typing..." in ChatWindow. (Awaiting Backend)

---

## Phase 9: Verification & Cleanup ✅

- [x] **Task 9.1: Remove all Mock Data logs** — check `DUMMY_DATA_LOG.md` and purge.
- [x] **Task 9.2: Test Cloudinary Flow** — ensure `.env` has cloud name and preset.
- [x] **Task 9.3: Validate Infinite Scroll performance** — ensure no double-fetching.

---

## Phase 10: Mobile Responsiveness & Layout ⬜

- [ ] **Task 10.1: Bottom Navigation Bar** — Build `BottomNav.jsx` for mobile screens, replacing `Sidebar.jsx`.
- [ ] **Task 10.2: Mobile Header** — Add Instagram text logo and Notification/Message icons to the top of mobile screens.
- [ ] **Task 10.3: Modals on Mobile** — Convert desktop Modals (e.g. PostDetail, MoreOptions) to slide-up Bottom Sheets or full-screen overlays for mobile.

---

## Phase 11: Complete Authentication Flow ⬜

- [ ] **Task 11.1: Sign Up API Wiring** — Connect `POST /auth/register` to the Register form in `Auth.jsx`.
- [ ] **Task 11.2: Form Validation** — Display proper 400 Bad Request error messages (e.g., username taken, email invalid).
- [ ] **Task 11.3: Logout Logic** — Wire the "Log out" button in `MoreOptionsModal` to `POST /auth/logout`, clear Redux state, and disconnect STOMP.
