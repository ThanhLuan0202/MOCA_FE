import apiClient from './api';
import { jwtDecode } from 'jwt-decode';

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

      console.log('Full API Response from apiClient.post:', response); // Enhanced log

      // Correctly check if response or token is missing, assuming data is directly in response
      if (!response || (!response.Token && !response.token)) {
        console.error('API response or token is missing.');
        throw new Error('Invalid response from server: Token missing.');
      }

      // Access token directly from response, not response.data
      const token = response.Token || response.token;
      console.log('Extracted token from response (fixed):', token);

      // No need for a separate check for token, as it's handled above

      localStorage.setItem('authToken', token);
      console.log('Saved token in localStorage:', localStorage.getItem('authToken'));

      console.log('Successfully processed login, returning response:', response);
      return response; // Return the entire response object if it contains all necessary data

    } catch (error) {
      console.error('Login Error Details in authService:', { // Enhanced log
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('authToken'); // Xóa token khỏi localStorage
  },

  // Kiểm tra trạng thái đăng nhập bằng cách kiểm tra token trong localStorage
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Lấy thông tin user hiện tại (nếu được lưu trong localStorage)
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserInfoFromToken: (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Decoded Token Object:', decodedToken);
      console.log('UserId from token:', userId);
      console.log('Role from token:', role);
      
      // Improved role mapping
      let roleId = null;
      if (role === 'Admin') {
        roleId = 1;
      } else if (role === 'Doctor') {
        roleId = 4;
      } else if (role === 'Mom') {
        roleId = 3;
      } else if (role === 'Manager') {
        roleId = 2;
      } else if (role === 'User') {
        roleId = 5;
      } else if (role === 'Guest') {
        roleId = 6;
      }
      
      console.log('Mapped roleId:', roleId);
      return { userId, roleId };
    } catch (error) {
      console.error("Lỗi giải mã token hoặc không lấy được UserId/Role từ token.", error);
      return { userId: null, roleId: null };
    }
  },

  isTokenExpired: (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  },
};

export default authService; 