import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.scss'; // Import the SCSS file
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Assuming react-icons is installed
import { FcGoogle } from "react-icons/fc"; // Assuming react-icons is installed
import authService from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData.email, formData.password);
            console.log('Response from authService.login in LoginPage:', response);
            const token = response?.Token || response?.token; // Extract token from response
            console.log('Extracted token in LoginPage:', token);

            if (token) {
                login(token); // Pass the token to AuthContext's login function
                
                // Get user role from token to determine redirect
                const { roleId } = authService.getUserInfoFromToken(token);
                console.log('User roleId after login:', roleId);
                
                // Redirect based on role
                if (roleId === 1) {
                    navigate('/admin-dashboard'); // Admin
                } else if (roleId === 4) {
                    navigate('/doctor'); // Doctor
                } else {
                    navigate('/'); // Default for other roles
                }
            } else {
                throw new Error('No token received after login.');
            }
        } catch (error) {
            console.error('Login failed in LoginPage.jsx:', error);
            setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="main-title">Chào mừng trở lại!</h1>
                <p className="subtitle">Chào mừng bạn đến với Moca! Chúc bạn và bé một ngày vui vẻ và tràn đầy sức khỏe!</p>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Địa chỉ email*</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu*</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Vui lòng điền mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="eye-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                        </div>
                    </div>

                    <Link to="/forgot-password" className="forgot-password">Quên mật khẩu?</Link>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <div className="social-login-divider">
                        <span>Đăng nhập với</span>
                    </div>

                    <button type="button" className="google-login-button">
                        <FcGoogle className="google-icon" />
                    </button>

                    <p className="signup-link">Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;