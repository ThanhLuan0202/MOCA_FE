import React from 'react';
import './form.scss'; // Import the SCSS file

const ContactFormSection = () => {
  return (
    <div className="contact-form-section">
      <div className="container">
        <div className="text-content">
          <h2>Chúng tôi ở đây để lắng nghe và hỗ trợ bạn!</h2>
        </div>
        <div className="form-content">
          <form>
            <div className="form-group">
              <label htmlFor="name">Tên của bạn</label>
              <input type="text" id="name" name="name" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Địa chỉ email</label>
              <input type="email" id="email" name="email" placeholder="Your email address" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Hãy cho chúng tôi biết bạn suy nghĩ và cảm xúc của bạn!</label>
              <textarea id="message" name="message" rows="5" placeholder="Your email address"></textarea>
            </div>
            <button type="submit" className="submit-button">Gửi</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormSection;