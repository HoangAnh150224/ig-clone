# 🎨 Instagram Clone — Frontend Implementation Roadmap (v3.1)

> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending | 🚀 Feature Gap (New) | 🖥️ Desktop Only

---

## 🏗️ Technical Context & Strategy
- **Framework:** React 19 (Sử dụng `useOptimistic`, `useActionState` cho UX mượt mà).
- **Styling:** Tailwind CSS v4 (Chủ đạo) + Chakra UI v3 (Hạn chế & Cô lập). **KHÔNG HỖ TRỢ RESPONSIVE (Desktop Only).**
- **State:** Redux Toolkit (Quản lý Auth, Posts, Messages, UI).
- **Real-time:** STOMP.js + SockJS cho WebSocket.
- **Contract:** Toàn bộ Service phải unbox `ApiResponse<T>` từ `axiosClient`.

---

## 🛠️ Phase 0: Infrastructure & UI Baseline ✅
**Mục tiêu:** Đồng bộ hóa cấu hình và dọn dẹp xung đột thư viện.

- [x] **Task 0.1: Environment Sync**
- [x] **Task 0.2: Layout Refactor (Tailwind v4 Optimization)**
- [x] **Task 0.3: Loading System**

---

## 🔐 Phase 1: Authentication & Secure Gateway ✅
**Mục tiêu:** Xóa bỏ Mock Auth, thiết lập bảo mật thực tế.

- [x] **Task 1.1: Auth Service Integration**
- [x] **Task 1.2: Persistent Session**
- [x] **Task 1.3: Global Error Interceptor**

---

## 🔍 Phase 2: Social Identity & Discovery 🔄
**Mục tiêu:** Hiển thị dữ liệu người dùng thật và hệ thống tìm kiếm thông minh.

- [x] **Task 2.1: Dynamic Profile (Real Data)**
    - **Action:** Kết nối `GET /users/{username}/profile`.
    - **Done:** Follow/Unfollow Optimistic logic in `userSlice` & `ProfileHeader`.
- [ ] **Task 2.2: Follower/Following Modals 🚀**
    - **Action:** Xây dựng Modal hiển thị danh sách người dùng khi click vào số lượng Follower/Following trên Profile.
    - **Status:** Service APIs ready, UI integration pending.
- [x] **Task 2.3: User Search & History 🚀**
    - **Action:** Search Panel with recent history and real-time user search.

---

## 📸 Phase 3: Content Stream & Interaction 🔄
**Mục tiêu:** Feed bài viết mượt mà và tương tác "vô độ trễ".

- [x] **Task 3.1: Infinite Scroll Feed (Real API)**
    - **Action:** `Home.jsx` connected to `getFeedPosts` with pagination.
- [ ] **Task 3.2: Optimistic Interactions 🔄**
    - **Like/Unlike:** Logic ready in `postSlice`, pending `PostCard.jsx` update.
    - **Save/Bookmark 🚀:** Pending.
    - **Comment:** Pending.
- [ ] **Task 3.3: Home Sidebar Suggestions 🚀**
- [ ] **Task 3.4: Video Autoplay Logic 🚀**

---

## 💬 Phase 4: Real-time Messaging (STOMP)
**Mục tiêu:** Nhắn tin thời gian thực và hiển thị đa phương tiện.

- [ ] **Task 4.1: WebSocket Bridge**
- [ ] **Task 4.2: Real-time Notifications 🚀**

---

## 🎥 Phase 5: Media Pipeline & Create Post
**Mục tiêu:** Tải lên nội dung và hệ thống Stories.

- [ ] **Task 5.1: Create Post with Progress 🚀**
- [ ] **Task 5.2: Avatar Update 🚀**

---

## 🧪 Verification Protocol (Dành cho Agents)
1. **Linting:** `npm run lint` không được có lỗi.
2. **Desktop Layout:** Kiểm tra chuẩn khung hình Desktop.
3. **Optimistic Check:** Verify Follow/Like toggle UI before API response.
4. **Consistency:** Bỏ hoàn toàn bo góc (`borderRadius: 0`).

---
*Updated by Antigravity Orchestrator (Project Planner)*
