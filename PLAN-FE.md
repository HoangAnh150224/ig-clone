# 🎨 Instagram Clone — Frontend Implementation Roadmap (v3.0)

> **Status key:** ✅ Done | 🔄 In Progress | ⬜ Pending | 🚀 Feature Gap (New)

---

## 🏗️ Technical Context & Strategy
- **Framework:** React 19 (Sử dụng `useOptimistic`, `useActionState` cho UX mượt mà).
- **Styling:** Tailwind CSS v4 (Chủ đạo) + Chakra UI v3 (Hạn chế & Cô lập).
- **State:** Redux Toolkit (Quản lý Auth, Posts, Messages).
- **Real-time:** STOMP.js + SockJS cho WebSocket.
- **Contract:** Toàn bộ Service phải unbox `ApiResponse<T>` từ `axiosClient`.

---

## 🛠️ Phase 0: Infrastructure & UI Baseline
**Mục tiêu:** Đồng bộ hóa cấu hình và dọn dẹp xung đột thư viện.

- [ ] **Task 0.1: Environment Sync**
    - **Action:** Sửa `.env` thành `VITE_API_BASE_URL=http://localhost:8080/api`.
    - **Verify:** `axiosClient` gọi đúng URL gốc.
- [ ] **Task 0.2: Layout Refactor (Anti-Chakra Bloat)**
    - **Action:** Thay thế `Box` của Chakra trong `App.jsx` và `MainLayout.jsx` bằng CSS Grid/Flex của Tailwind v4.
    - **Reason:** Tránh xung đột CSS Variable và tăng hiệu suất render.
- [ ] **Task 0.3: Skeleton System**
    - **Action:** Tạo `components/skeletons/` (PostSkeleton, ProfileSkeleton).
    - **Verify:** Thay thế chữ "Loading..." trong `Suspense` fallback.

---

## 🔐 Phase 1: Authentication & Secure Gateway
**Mục tiêu:** Xóa bỏ Mock Auth, thiết lập bảo mật thực tế.

- [ ] **Task 1.1: Auth Service Integration**
    - **Action:** Kết nối `POST /auth/login` và `POST /auth/signup`.
    - **Logic:** Lưu `token` vào `localStorage`, cập nhật `authSlice`.
- [ ] **Task 1.2: Persistent Session**
    - **Action:** Kết nối `GET /auth/me` trong `useEffect` tại `App.jsx` để giữ login khi F5.
- [ ] **Task 1.3: Global Error Interceptor**
    - **Action:** Nâng cấp `axiosClient` để hiển thị `toast` (thông báo) khi Backend trả về lỗi 4xx, 5xx.

---

## 🔍 Phase 2: Social Identity & Discovery
**Mục tiêu:** Hiển thị dữ liệu người dùng thật và hệ thống tìm kiếm thông minh.

- [ ] **Task 2.1: Dynamic Profile**
    - **Action:** Kết nối `GET /users/{username}/profile`.
    - **Logic:** Xử lý logic `isFollowing` và `isPrivate` (ẩn bài viết nếu chưa follow tài khoản private).
- [ ] **Task 2.2: Search History 🚀**
    - **Action:** 
        - UI: Hiện danh sách "Recent Searches" khi mở Sidebar Search.
        - API: `GET /search/history`, `DELETE /search/history/{id}`.
- [ ] **Task 2.3: User Search Integration**
    - **Action:** Kết nối `GET /users/search?query=...` với cơ chế `debounce` (tránh spam API).

---

## 📸 Phase 3: Content Stream & Interaction
**Mục tiêu:** Feed bài viết mượt mà và tương tác "vô độ trễ".

- [ ] **Task 3.1: Infinite Scroll Feed**
    - **Action:** Kết nối `GET /posts/feed`. Implement `useInView` để tự động load trang tiếp theo.
- [ ] **Task 3.2: Optimistic Interactions**
    - **Action:** Sử dụng `useOptimistic` cho Like và Comment.
    - **UX:** Icon tim đỏ ngay lập tức, đếm số like tăng/giảm trước khi API phản hồi.
- [ ] **Task 3.3: Post Sharing via DM 🚀**
    - **Component:** Tạo `ShareModal.jsx` tích hợp danh sách "Recent Followers".
    - **Service:** Cập nhật `messageService.sendMessage` để nhận `sharedPostId`.

---

## 💬 Phase 4: Real-time Messaging (STOMP)
**Mục tiêu:** Nhắn tin thời gian thực và hiển thị đa phương tiện.

- [ ] **Task 4.1: WebSocket Bridge**
    - **Action:** Tạo `services/websocketService.js` quản lý kết nối STOMP.
    - **Logic:** Tự động reconnect khi mất mạng.
- [ ] **Task 4.2: Rich Message Window 🚀**
    - **Action:** Render `PostPreview` (ảnh bài viết, avatar chủ post) bên trong khung chat nếu tin nhắn chứa `sharedPostId`.
- [ ] **Task 4.3: Presence Indicator 🚀**
    - **Action:** Hiển thị dấu chấm xanh Online dựa trên trạng thái WebSocket/Redis.

---

## 🎥 Phase 5: Media Pipeline & Stories
**Mục tiêu:** Tải lên nội dung và hệ thống Stories biến mất sau 24h.

- [ ] **Task 5.1: Create Post with Progress 🚀**
    - **Action:** Hiển thị `% upload` bài viết sử dụng `onUploadProgress` của Axios.
- [ ] **Task 5.2: Story Integration**
    - **Action:** Kết nối `GET /stories/feed`.
    - **Logic:** Group stories theo User, tự động chuyển story tiếp theo.

---

## 🧪 Verification Protocol (Dành cho Agents)
1. **Linting:** `npm run lint` không được có lỗi.
2. **Responsive:** Kiểm tra trên 3 breakpoint (Mobile, Tablet, Desktop).
3. **Network:** Kiểm tra tab Network để đảm bảo không có API gọi thừa (Duplicate calls).
4. **Consistency:** Kiểm tra màu sắc chuẩn Instagram (Background `#fafafa`, Blue `#0095f6`).

---
*Created by Antigravity Orchestrator (Project Planner & Frontend Specialist)*
