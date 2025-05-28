import React from 'react'
import logo from '../../assets/logo.png'
import './header.scss'

const Header = () => {
  return (
    <div className='header'>
      <img src={logo} alt='logo' className='logo' />

      <div className='nav-links'>
        <p>Nhật ký thai kỳ</p>
        <p>Dịch vụ</p>
        <p>Cộng đồng</p>
        <p>Chúng tôi</p>
      </div>

      <div className='auth-buttons'>
        <button className='login'>Đăng nhập</button>
        <button className='register'>Đăng ký</button>
        
      </div>
    </div>
  )
}

export default Header
