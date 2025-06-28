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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate form
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            // Prepare data to send to API, matching backend expected casing based on error messages
            const userDataToSend = {
                // Include required fields with matching case from error messages
                Email: formData.email,
                FullName: formData.fullName,
                Password: formData.password,
                PhoneNumber: formData.phoneNumber,
                
                // Include optional fields based on the provided JSON structure
                Image: "", // Assuming 'image' maps to 'Image'
                Status: "active" // Assuming 'status' maps to 'Status'
                
                // dateOfBirth is not included at the top level based on the provided JSON structure
            };

            await authService.register(userDataToSend);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            // Display specific validation errors if backend sends them
            if (error.response?.data?.errors) {
                console.error('Validation errors:', error.response.data.errors);
                const validationErrors = error.response.data.errors;
                
                // Iterate through errors and format messages, handling non-array values safely
                const messages = Object.entries(validationErrors)
                    .map(([field, errors]) => {
                        // Capitalize the first letter of the field name for display
                        const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
                        
                        if (Array.isArray(errors)) {
                            // Join array error messages
                            return `${formattedField}: ${errors.join(', ')}`;
                        } else if (errors !== null && errors !== undefined) {
                            // Handle non-array, non-null/undefined errors as a single string
                             return `${formattedField}: ${errors}`;
                        }
                         // Return empty string for null/undefined errors
                        return '';
                    })
                    .filter(message => message !== '') // Filter out empty messages
                    .join('\n'); // Join valid messages with newline
                
                // Only update error state if there are actual validation messages
                if (messages) {
                    setError(`Đăng ký thất bại:\n${messages}`);
                } else if (error.response?.data?.message) {
                     // Fallback to a generic message from the backend if no specific field errors
                    setError(`Đăng ký thất bại: ${error.response.data.message}`);
                } else {
                    // Final fallback for unexpected error structure
                    setError('Đăng ký thất bại. Vui lòng thử lại.');
                }

            } else if (error.response?.data?.message) {
                 // Fallback to a generic message from the backend if no errors object
                setError(`Đăng ký thất bại: ${error.response.data.message}`);
            } else {
                 // Final fallback for unexpected error structure
                setError('Đăng ký thất bại. Vui lòng thử lại.');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <div style={{display:'flex', justifyContent:'center', gap:16, marginBottom:24}}>
                  <button type="button" className={showDoctorRegister ? '' : 'active'} style={{padding:'8px 18px', borderRadius:8, border:'none', background:!showDoctorRegister?'#6a5af9':'#eee', color:!showDoctorRegister?'#fff':'#333', fontWeight:600, cursor:'pointer'}} onClick={()=>setShowDoctorRegister(false)}>Đăng ký người dùng</button>
                  <button type="button" className={showDoctorRegister ? 'active' : ''} style={{padding:'8px 18px', borderRadius:8, border:'none', background:showDoctorRegister?'#6a5af9':'#eee', color:showDoctorRegister?'#fff':'#333', fontWeight:600, cursor:'pointer'}} onClick={()=>setShowDoctorRegister(true)}>Đăng ký bác sĩ</button>
                </div>
                {showDoctorRegister ? (
                  <DoctorRegisterForm />
                ) : (
                  <>
                    <h1>Tạo tài khoản</h1>
                    <p>Chào mừng bạn đến với Moca! Chúc bạn và bé một ngày vui vẻ và tràn đầy sức khỏe!</p>

                    {error && <div className="error-message" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                            <div className="input-with-icon">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu"
                                    required
                                />
                                <span className="icon" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <div className="input-with-icon">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Xác nhận mật khẩu"
                                    required
                                />
                                <span className="icon" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="register-button" disabled={loading}>
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>

                        <div className="login-with-google">
                            <p>Đăng nhập với</p>
                            <FcGoogle className="google-icon-2" />
                        </div>
                    </form>
                  </>
                )}
            </div>
        </div>
    );
}

export default Register;
