# 🚩 DUMMY DATA LOG
Tệp này ghi lại các vị trí đang sử dụng dữ liệu giả (Mock Data) để dễ dàng thay thế bằng API Spring Boot sau này.

| File Path | Description | Action Required |
| :--- | :--- | :--- |
| `src/api/authService.js` | Mock API Login/Signup | Thay thế bằng endpoint Spring Boot thực tế |
| `src/api/profileService.js` | Mock Profile & User Posts | Thay thế bằng API lấy profile & post theo username |
| `src/pages/Home.jsx` | Mảng `mockPosts` trong `useEffect` | Thay thế bằng `dispatch(fetchPosts())` |
| `src/store/slices/postSlice.js` | Action `setMockPosts` | Xóa hoàn toàn action này |
| `src/components/feed/Stories.jsx` | Mảng `mockStories` | Thay thế bằng API lấy danh sách story |
| `src/components/layout/RightSidebar.jsx` | Mảng `suggestions` | Thay thế bằng API gợi ý user |

*Lưu ý: Khi xóa, hãy đảm bảo các interface dữ liệu khớp với Response từ Spring Boot.*
