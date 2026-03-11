# 🛠️ Kế hoạch Triển khai Chi tiết Backend (PLAN-BE.md)

> **Dự án**: Instagram Clone (Spring Boot + MySQL + Redis)
> **Trạng thái**: Sẵn sàng triển khai
> **Nguyên tắc**: Security-First, Clean Architecture, High Performance.

---

## 1. Cấu trúc Package & Tiêu chuẩn Code

Tất cả code sẽ nằm trong `com.instagram.be.[feature]`.

- `controller`: Tiếp nhận request, validation cơ bản.
- `service`: Chứa logic nghiệp vụ chính (Business Logic).
- `repository`: Truy vấn dữ liệu (Spring Data JPA).
- `entity`: Định nghĩa bảng DB (Lombok, BaseEntity).
- `request/response`: DTOs cho API (Sử dụng Java Records).
- `mapper`: Chuyển đổi Entity ↔ DTO (MapStruct).
- `exception`: Custom exceptions cho từng module.

---

## 2. Phase 0: Dọn dẹp & Hạ tầng (✅ HOÀN THÀNH)

**Mục tiêu**: Loại bỏ Keycloak, cấu hình các Bean cần thiết cho JWT và Cloudinary.

### Kết quả:
1.  **Cập nhật `pom.xml`**: Đã thêm Security, JWT (0.12.6), Cloudinary, WebSocket.
2.  **Cấu hình**: Sẵn sàng các property cho JWT và Cloudinary.
3.  **Xóa bỏ tệp cũ**: Đã dọn dẹp thư mục Keycloak integration.

---

## 3. Phase 1: Authentication & Security (Ngày 1 - Chiều)

**Mục tiêu**: Hệ thống Login/Signup bằng JWT và quản lý Session qua Redis.

### Chi tiết triển khai:
1.  **Security Core**:
    - `JwtUtil`: Tạo/Giải mã Token, quản lý Claim (userId, roles).
    - `JwtAuthFilter`: Interceptor kiểm tra JWT trên mỗi request.
    - `SecurityConfig`: Cấu hình Stateless, BCryptPasswordEncoder, và phân quyền endpoint.
2.  **Auth Logic**:
    - `SignupService`: Validate Email/Username (Unique), Hash password bằng BCrypt.
    - `LoginService`: Verify password, tạo Token.
    - `LogoutService`: Đưa JTI (JWT ID) vào **Redis Blacklist** với TTL bằng thời gian còn lại của Token.
3.  **Bảo mật nâng cao**:
    - `RateLimitingService`: Sử dụng Redis để giới hạn 5 lần login sai/60s cho mỗi IP.

---

## 4. Phase 2: User Profile & Social Network (Ngày 2)

**Mục tiêu**: Quản lý thông tin cá nhân và hệ thống Follow phức tạp.

### Chi tiết triển khai:
1.  **Profile Service**:
    - `UpdateProfile`: Tích hợp upload Avatar lên Cloudinary (Async).
    - `GetUserProfile`: Sử dụng `@Formula` hoặc Query JPQL tối ưu để lấy `followersCount`, `followingCount` mà không cần load toàn bộ list.
2.  **Hệ thống Follow (Quan trọng)**:
    - Logic: Nếu `targetUser.isPrivate == true` → `FollowStatus = PENDING`.
    - Trigger: Khi Unfollow, xóa row tương ứng trong DB.
    - API: `acceptFollowRequest` chuyển trạng thái từ `PENDING` sang `ACCEPTED`.
3.  **Privacy & Blocking**:
    - `BlockService`: Khi User A block User B → Xóa follow chéo (nếu có) và ngăn chặn mọi tương tác.
    - `PrivacyHelper`: Service dùng chung để kiểm tra xem User A có quyền xem nội dung của User B không (dựa trên trạng thái Follow/Block/Private).

---

## 5. Phase 3: Post, Reel & Cloudinary (Ngày 3)

**Mục tiêu**: Xử lý Media nặng và hệ thống Newfeed cơ bản.

### Chi tiết triển khai:
1.  **Post Creation**:
    - Multipart Request: Nhận File + Metadata (Caption, Location).
    - `CloudinaryService`: Upload file và lấy URL.
    - `PostMedia`: Lưu URL và `displayOrder` cho bài viết có nhiều ảnh/video.
2.  **Feed Algorithm (V1)**:
    - Query: `SELECT posts FROM Followings WHERE isArchived = false`.
    - Ưu tiên: Bài viết từ `FavoriteUsers` sẽ được đưa lên đầu trang.
    - Phân trang: Sử dụng `Slice` thay vì `Page` để tối ưu performance cho Infinite Scroll.
3.  **Interactions**:
    - `ToggleLike`: Idempotent API (Nhấn lần 1: Like, nhấn lần 2: Unlike).
    - `RecordView`: Tăng view count (Dùng Redis để tránh spam view từ cùng 1 user trong thời gian ngắn).

---

## 6. Phase 4: Comments & Notifications (Ngày 4)

**Mục tiêu**: Phản hồi người dùng và thông báo thời gian thực.

### Chi tiết triển khai:
1.  **Nested Comments**:
    - Schema: Bảng `comment` có `parent_id`.
    - Query: Lấy top-level comments trước, reply sẽ được load khi nhấn "View replies".
2.  **Notification System (DB-based)**:
    - `NotificationService.create(...)`: Hàm dùng chung cho toàn hệ thống.
    - Event-Driven: Sử dụng `ApplicationEventPublisher` của Spring để tạo thông báo bất đồng bộ, không làm chậm request chính (ví dụ: Like bài viết xong thì bắn event tạo Noti).

---

## 7. Phase 5 & 6: Messaging & WebSocket (Ngày 5)

**Mục tiêu**: Real-time chat chuẩn Instagram.

### Chi tiết triển khai:
1.  **WebSocket Configuration**:
    - Giao thức: STOMP over SockJS.
    - Security: JWT Authentication khi bắt đầu kết nối (Connect Frame).
2.  **Messaging Logic**:
    - `Conversation`: Tạo hội thoại nếu chưa tồn tại.
    - `Message`: Lưu tin nhắn vào MySQL trước khi bắn qua WebSocket.
    - `UnreadCount`: Cập nhật `last_read_at` trong bảng `conversation_participant`.

---

## 8. Danh sách Tech-Stack cần kiểm tra lại

- [ ] **Redis**: Đã cài đặt Docker/Local chưa?
- [ ] **Cloudinary**: Đã có API Key chưa?
- [ ] **MySQL**: Flyway V2 đã chạy ổn định với 26 bảng chưa? (Cần Verify lại quan hệ `Foreign Key`).

---
**Antigravity Orchestrator** - *Bản kế hoạch này là cam kết thực thi.*
