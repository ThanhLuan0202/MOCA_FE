import React, { useState } from 'react';
import './Register.scss';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';
import apiClient from '../../services/api';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        dateOfBirth: null
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDoctorRegister, setShowDoctorRegister] = useState(false);
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            dateOfBirth: date
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setLoading(false);
            return;
        }
        if (!formData.password || formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            setLoading(false);
            return;
        }

        try {
            const form = new FormData();
            form.append("RoleId", 5);
            form.append("FullName", formData.fullName);
            form.append("Email", formData.email);
            form.append("Password", formData.password);
            form.append("PhoneNumber", formData.phoneNumber);
            if (image) form.append("Image", image);

            for (let pair of form.entries()) {
                console.log(pair[0], pair[1]);
            }

            await apiClient.post("/api/Authen/Register", form);
            setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email và nhấn vào link xác nhận để hoàn tất đăng ký.");
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '', dateOfBirth: null });
            setImage(null);
        } catch (error) {
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    setError(error.response.data);
                } else if (error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError(JSON.stringify(error.response.data));
                }
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                {showDoctorRegister ? (
                  <DoctorRegisterForm />
                ) : (
                  <>
                    <h1>Tạo tài khoản</h1>
                    <p>Chào mừng bạn đến với Moca! Chúc bạn và bé một ngày vui vẻ và tràn đầy sức khỏe!</p>

                    {successMessage && <div className="success-message">{successMessage}</div>}
                    {error && <div className="error-message" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="fullName">Họ và tên</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Họ và tên của bạn"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email của bạn"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phoneNumber">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Số điện thoại của bạn"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-col">
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Ngày sinh</label>
                                    <div className="input-with-icon">
                                        <DatePicker
                                            selected={formData.dateOfBirth}
                                            onChange={handleDateChange}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="DD/MM/YYYY"
                                            customInput={<input type="text" id="dateOfBirth" />}
                                            showIcon
                                            icon={<FaCalendarAlt className="icon" />}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Mật khẩu"
                                            required
                                        />
                                        <span
                                            onClick={togglePasswordVisibility}
                                            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Xác nhận mật khẩu"
                                            required
                                        />
                                        <span
                                            onClick={toggleConfirmPasswordVisibility}
                                            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' }}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image">Ảnh đại diện</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="image-input"
                                    />
                                    {image && (
                                        <div className="image-preview">
                                            <img src={URL.createObjectURL(image)} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>
                  </>
                )}
            </div>
        </div>
    );
}

export default Register;
