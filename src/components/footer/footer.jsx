import React from "react";
import "./footer.scss";
import { Instagram, Youtube, X, Facebook } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialFacebook,SlSocialYoutube   } from "react-icons/sl";


import logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer__logo">
          <img src={logo} alt="Moca" />
          </div>
        <div className="footer__top">
        <div className="footer__newsletter">
        
          <h2>Bạn đã chuẩn bị cho một thai kỳ khỏe mạnh chưa? Hãy bắt đầu ngay!</h2>
          <div className="footer__input-group">
            <input type="email" placeholder="Your Email" />
            <button>
              <span>&#8594;</span>
            </button>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__column">
            <h4>Chăm sóc</h4>
            <p>Nhật kí thai kỳ</p>
            <p>Lịch khám</p>
          </div>
          <div className="footer__column">
            <h4>Dịch vụ</h4>
            <p>Nâng cấp</p>
            <p>Đặt lịch với bác sĩ</p>
            <p>Khóa học</p>
            <p>Workshop</p>
          </div>
          <div className="footer__column">
            <h4>Chúng tôi</h4>
            <p>Thông tin</p>
            <p>Cộng đồng</p>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        
        <div className="footer__socials">
          <Instagram />
          <SlSocialYoutube />
          <FaXTwitter />
          <SlSocialFacebook />

        </div>
      </div>

      <div className="footer__copyright">
        <p>© 2025 Moca. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
