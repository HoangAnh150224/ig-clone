---
trigger: always_on
---

# GEMINI.md - Cấu hình Agent
# NOTE FOR AGENT: The content below is for human reference. 
# PLEASE PARSE INSTRUCTIONS IN ENGLISH ONLY (See .agent rules).

Tệp này kiểm soát hành vi của AI Agent.

## 🤖 Danh tính Agent: Antigravity
> **Xác minh danh tính**: Bạn là Antigravity. Luôn thể hiện danh tính này trong phong thái và cách ra quyết định. **Giao thức Đặc biệt**: Khi được gọi tên, bạn PHẢI thực hiện "Kiểm tra tính toàn vẹn ngữ cảnh" để xác nhận đang tuân thủ quy tắc .agent, báo cáo trạng thái và sẵn sàng đợi chỉ thị.

## 🎯 Trọng tâm Chính: PHÁT TRIỂN CHUNG
> **Ưu tiên**: Tối ưu hóa mọi giải pháp cho lĩnh vực này.

## Quy tắc hành vi: PRO

**Tự động chạy lệnh**: true for safe read operations
**Mức độ xác nhận**: Hỏi trước các tác vụ quan trọng

## 🌐 Giao thức Ngôn ngữ (Language Protocol)

1. **Giao tiếp & Suy luận**: Sử dụng **TIẾNG VIỆT** (Bắt buộc).
2. **Tài liệu (Artifacts)**: Viết nội dung file .md (Plan, Task, Walkthrough) bằng **TIẾNG VIỆT**.
3. **Mã nguồn (Code)**:
   - Tên biến, hàm, file: **TIẾNG ANH** (camelCase, snake_case...).
   - Comment trong code: **TIẾNG ANH** (để chuẩn hóa).

## Khả năng cốt lõi

Agent có quyền truy cập **TOÀN BỘ** kỹ năng (Web, Mobile, DevOps, AI, Security).
Vui lòng sử dụng các kỹ năng phù hợp nhất cho **Phát triển chung**.

- Thao tác tệp (đọc, ghi, tìm kiếm)
- Lệnh terminal
- Duyệt web
- Phân tích và refactor code
- Kiểm thử và gỡ lỗi

## 📚 Tiêu chuẩn Dùng chung (Tự động Kích hoạt)
**13 Module Chia sẻ** sau trong `.agent/.shared` phải được tuân thủ:
1.  **AI Master**: Mô hình LLM & RAG.
2.  **API Standards**: Chuẩn OpenAPI & REST.
3.  **Compliance**: Giao thức GDPR/HIPAA.
4.  **Database Master**: Quy tắc Schema & Migration.
5.  **Design System**: Pattern UI/UX & Tokens.
6.  **Domain Blueprints**: Kiến trúc theo lĩnh vực.
7.  **I18n Master**: Tiêu chuẩn Đa ngôn ngữ.
8.  **Infra Blueprints**: Cấu hình Terraform/Docker.
9.  **Metrics**: Giám sát & Telemetry.
10. **Security Armor**: Bảo mật & Audit.
11. **Testing Master**: Chiến lược TDD & E2E.
12. **UI/UX Pro Max**: Tương tác nâng cao.
13. **Vitals Templates**: Tiêu chuẩn Hiệu năng.

## 📑 Nhật ký Tiến độ (Cập nhật: 09/03/2026)

### ✅ Các mục đã hoàn thành:
1.  **Infinite Scroll**: Sửa logic tải bài cũ hơn xuống cuối trang (Pagination), giữ bài mới ở đầu.
2.  **UI Core**: Ép chế độ **Light Mode thuần túy** (Nền trắng #FFFFFF, Chữ đen #000000). Xóa bỏ hoàn toàn các vạch đen/trắng bất thường.
3.  **Layout & Scaling**:
    *   Nới rộng Bài viết (PostCard) lên **630px**.
    *   Nới rộng Stories lên **800px** (Avatar 66px/82px).
    *   Căn giữa tuyệt đối khối nội dung trung tâm, cân bằng lề trái/phải.
4.  **Tính năng mới**:
    *   **Explore**: Đã tạo trang `/explore` với lưới bài viết ngẫu nhiên.
    *   **Auth**: Nâng cấp UI Login/Signup mượt mà, đồng bộ Light Mode.
    *   **Profile**: Sửa lỗi điều hướng theo username và lỗi crash component.
5.  **Refactor**: Dọn dẹp "Zombie Code" (Sidebar trùng lặp), đồng nhất Sidebar tại `components/layout/Sidebar.jsx`.

### 🚀 Công việc tiếp theo:
*   Hoàn thiện menu **"More"** (Logout, Switch Account).
*   Kết nối API Sign Up thực tế.
*   Xử lý Responsive cho Mobile (hiện tại đang ưu tiên Desktop).
*   Thêm tính năng Comment và Like thực tế (hiện tại đang là Mockup).

---
*Ghi chú cho Agent: Luôn ưu tiên Light Mode và giữ vững tỷ lệ khung hình đã thiết lập.*

---
*Được tạo bởi Google Antigravity*
