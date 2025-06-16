import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/Login";
import RegisterPage from "../pages/RegisterPage/Register";
import PregnancyDiary from "../pages/PregnancyDiaryPage/pregnancyDiary";
import ServicePage from "../pages/ServicePage/ServicePage";
import WaitConfirmPage from "../pages/WaitConfirmPage/WaitConfirmPage";
import BabyTrackingPage from "../pages/BabyTrackingPage/BabyTrackingPage";
import UserpregnancyPage from '../pages/UserpregnancyPage/UserpregnancyPage';
import PregnancyTrackingPage from '../pages/PregnancyTrackingPage/PregnancyTrackingPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import CoachPage from '../pages/CoachPage/CoachPage';
import ProfileCoach from '../pages/ProfileCoach/ProfileCoach';
import BookingPage from "../pages/BookingPage/BookingPage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
// import thêm các page khác nếu có

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />{" "}
      {/* Đảm bảo route trang chủ tồn tại */}
      {/* Các routes khác */}
      <Route path="/services" element={<ServicePage />} />
      <Route path="/pregnancy-diary" element={<PregnancyDiary />} />
      <Route path="/wait-confirm" element={<WaitConfirmPage />} />
      <Route path="/baby-tracking" element={<BabyTrackingPage />} />
      <Route path="/user-pregnancy" element={<UserpregnancyPage />} />
      <Route path="/pregnancy-tracking" element={<PregnancyTrackingPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/coach" element={<CoachPage />} />
      <Route path="/profile-coach" element={<ProfileCoach />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/About-us" element={<AboutUsPage />} />
      <Route path="/Community" element={<CommunityPage />} />

    </Routes>
  );
};

export default AppRoutes;
