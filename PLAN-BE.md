# 🛠️ Kế hoạch Triển khai Backend (PLAN-BE.md) — Phiên bản v2.1

> **Trạng thái**: Đồng bộ hóa với PLAN-FE v3.1
> **Nguyên tắc**: RESTful API, Security-First, Redis Caching.

---

## 🏗️ Phase 1: Authentication (✅ HOÀN THÀNH)

- [x] JWT Integration (Login/Signup).
- [x] `GET /auth/me` endpoint.
- [x] Redis Blacklist for Logout.

---

## 👥 Phase 2: User Profile & Social Identity (✅ HOÀN THÀNH)

- [x] **Task 2.1: Advanced Profile Data**
    - **Logic:** `GetUserProfile` trả về thêm `isPrivate`, `isFollowing`, `canViewContent` (dựa trên follow/blocking).
- [x] **Task 2.2: Follow Management**
    - **API:** `POST /users/{userId}/follow` (Logic: Nếu private -> Pending, Nếu public -> Accepted).
    - **API 🚀:** `GET /users/{userId}/followers` & `GET /users/{userId}/following` (Phân trang).
- [x] **Task 2.3: Search History Service 🚀**
    - **API:** `GET /search/history` (Lấy danh sách gần đây từ DB/Redis).
    - **API:** `DELETE /search/history/{id}` & `POST /search/history`.

---

## 📸 Phase 3: Content & Interaction (Sắp tới)

- [ ] **Task 3.1: Newfeed Algorithm (Optimized)**
    - **Query:** Phân trang dùng `Slice` bài viết từ Following + Favorite.
- [ ] **Task 3.2: Interaction Gateway**
    - **API:** `POST /posts/{postId}/like` (Idempotent).
    - **API:** `POST /posts/{postId}/save` (Quản lý bài viết đã lưu).
    - **API:** `GET /posts/{postId}/comments` (Phân trang, hỗ trợ Nested Comments).

---

## 💬 Phase 4: Real-time & Media Pipeline

- [ ] **Task 4.1: Cloudinary Async Media**
    - **Action:** Upload avatar và bài viết. Hỗ trợ Callback để FE nhận biết trạng thái.
- [ ] **Task 4.2: WebSocket & Notification Event**
    - **Logic:** Khi có `LIKE` event -> Gửi STOMP message tới user chủ post.
- [ ] **Task 4.3: Presence Management**
    - **Redis:** Lưu trạng thái Online/Offline qua WebSocket session.

---

## 🧪 Verification Protocol (Backend)
1. **API Docs:** Luôn cập nhật `api-response-contract.md` cho các endpoint mới.
2. **Security:** Kiểm tra `@PreAuthorize` trên các endpoint nhạy cảm (Xóa bài, Xóa comment).
3. **Performance:** Query followers không được N+1 (Dùng Join Fetch hoặc Count Query).

---
*Updated by Antigravity Orchestrator (Project Planner)*
