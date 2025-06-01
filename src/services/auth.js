import apiClient from './api';
import Cookies from 'js-cookie';

const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/Authen/Login', {
        email,
        password
      });
      
      // Lưu token vào cookies nếu login thành công
      // Reqres.in trả về token trong response.data.token
      if (response.data && response.data.token) { 
        Cookies.set('token', response.data.token, { expires: 7 }); // Lưu token 7 ngày, có thể điều chỉnh
        // Có thể lưu thêm thông tin user vào localStorage nếu cần
        // if (response.data.user) {
        //   localStorage.setItem('user', JSON.stringify(response.data.user));
        // }
      }
      
      return response.data;
    } catch (error) {
      // Log lỗi chi tiết hơn
      console.error('API Login Error:', error.response?.data || error.message);
      throw error; // Ném lỗi để component gọi có thể xử lý
    }
  },

  // Đăng xuất
  logout: () => {
    Cookies.remove('token'); // Xóa token khỏi cookies
    localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage (nếu có)
    // Chuyển hướng về trang login
    window.location.href = '/login';
  },

  // Kiểm tra trạng thái đăng nhập bằng cách kiểm tra token trong cookies
  isAuthenticated: () => {
    return !!Cookies.get('token');
  },

  // Lấy thông tin user hiện tại (nếu được lưu trong localStorage)
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService; 