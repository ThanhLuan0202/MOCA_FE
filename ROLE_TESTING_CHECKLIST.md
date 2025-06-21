# Role-Based Routing Testing Checklist

## 🔍 Để kiểm tra hệ thống role-based routing hoạt động đúng:

### 1. **Kiểm tra trước khi test:**
- [ ] Đảm bảo có tài khoản bác sĩ với role "Doctor" trong database
- [ ] Đảm bảo API trả về token với role claim đúng
- [ ] Kiểm tra console browser để xem debug logs

### 2. **Test đăng nhập với tài khoản bác sĩ:**
- [ ] Mở trang login
- [ ] Đăng nhập với email/password của bác sĩ
- [ ] Kiểm tra console logs:
  - `Decoded Token Object:` - xem role trong token
  - `Mapped roleId:` - phải là 4 cho Doctor
  - `User roleId after login:` - phải là 4
- [ ] Kiểm tra redirect - phải chuyển đến `/doctor`

### 3. **Kiểm tra Debug Panel (góc trái dưới):**
- [ ] Panel hiển thị màu xanh (🟢 Authentication Debug)
- [ ] Role: 4 (Doctor)
- [ ] User: tên bác sĩ
- [ ] Email: email bác sĩ
- [ ] Token Info: có userId và roleId = 4

### 4. **Kiểm tra trang Doctor:**
- [ ] URL phải là `/doctor`
- [ ] Tiêu đề: "Xin chào, Bác sĩ [tên]!"
- [ ] Debug info box hiển thị thông tin user
- [ ] Không có thông báo "Access denied"

### 5. **Test bảo mật:**
- [ ] Thử truy cập `/admin-dashboard` - phải bị redirect về `/`
- [ ] Thử truy cập `/doctor` với tài khoản khác role - phải bị redirect
- [ ] Đăng xuất và thử truy cập `/doctor` - phải redirect về `/login`

### 6. **Kiểm tra các role khác:**
- [ ] Test với tài khoản Admin (roleId = 1) - phải redirect đến `/admin-dashboard`
- [ ] Test với tài khoản Mom (roleId = 3) - phải redirect đến `/`
- [ ] Test với tài khoản User (roleId = 5) - phải redirect đến `/`

## 🐛 Nếu có lỗi, kiểm tra:

### Lỗi role mapping:
```javascript
// Trong console, kiểm tra:
console.log('Role from token:', role); // Phải là "Doctor"
console.log('Mapped roleId:', roleId); // Phải là 4
```

### Lỗi redirect:
```javascript
// Trong Login.jsx, kiểm tra:
console.log('User roleId after login:', roleId); // Phải là 4
```

### Lỗi ProtectedRoute:
```javascript
// Trong console, kiểm tra:
console.log('DoctorPage - currentUser:', currentUser);
console.log('DoctorPage - isLoggedIn:', isLoggedIn);
```

## 📝 Ghi chú:
- Debug Panel sẽ hiển thị ở góc trái dưới màn hình
- Có thể xóa DebugPanel và debug info sau khi test xong
- Role mapping trong `auth.js` có thể cần điều chỉnh tùy theo API response 