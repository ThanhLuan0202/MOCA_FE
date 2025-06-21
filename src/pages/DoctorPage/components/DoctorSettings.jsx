import React from 'react';

const DoctorSettings = () => {
    return (
        <div className="doctor-settings">
            <h2>Cài đặt tài khoản</h2>
            <form className="settings-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fullName">Họ và tên</label>
                        <input type="text" id="fullName" defaultValue="Nguyễn Thanh Luân" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" defaultValue="luanne020203@gmail.com" readOnly />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="specialization">Chuyên khoa</label>
                    <input type="text" id="specialization" defaultValue="Sản phụ khoa" />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Tiểu sử ngắn</label>
                    <textarea id="bio" rows="4">Bác sĩ với hơn 10 năm kinh nghiệm trong lĩnh vực sản phụ khoa...</textarea>
                </div>
                <hr />
                <h3>Đổi mật khẩu</h3>
                <div className="form-row">
                     <div className="form-group">
                        <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                        <input type="password" id="currentPassword" />
                    </div>
                     <div className="form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input type="password" id="newPassword" />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="save-btn">Lưu thay đổi</button>
                </div>
            </form>
        </div>
    );
};

export default DoctorSettings; 