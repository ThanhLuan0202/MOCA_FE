import apiClient from './api';
import Cookies from 'js-cookie';

const authService = {
  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/Authen/Register', userData);
      console.log('Register Response:', response);
      return response;
    } catch (error) {
      console.error('Register Error:', error);
      throw error;
    }
  },

  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/api/Authen/Login', {
        email,
        password
      });
      
      console.log('Full API Response:', response); // Log toàn bộ response để debug
      
      // Kiểm tra cấu trúc response.data
      if (response.data) {
        console.log('Response data structure:', response.data);
        
        // Kiểm tra token trong response
        const token = response.data.Token || response.data.token;
        console.log('Extracted token:', token);
        
        if (token) {
          // Lưu token vào cookie
          Cookies.set('authToken', token, {
            expires: 7,
            path: '/',
            sameSite: 'Lax'
          });
          
          // Verify token was set
          const savedToken = Cookies.get('authToken');
          console.log('Saved token in cookie:', savedToken);
          
          // Lưu thông tin user nếu có
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }

          // Dispatch custom event for login success
          window.dispatchEvent(new Event('loginSuccess'));
          
          return response.data;
        } else {
          console.error('No token found in response');
          throw new Error('No token received from server');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    Cookies.remove('authToken'); // Xóa token khỏi cookies
    localStorage.removeItem('user'); // Xóa thông tin user khỏi localStorage (nếu có)
    // Dispatch custom event for logout
    window.dispatchEvent(new Event('logoutSuccess'));
  },

  // Kiểm tra trạng thái đăng nhập bằng cách kiểm tra token trong cookies
  isAuthenticated: () => {
    return !!Cookies.get('authToken');
  },

  // Lấy thông tin user hiện tại (nếu được lưu trong localStorage)
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService; 