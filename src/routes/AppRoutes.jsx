import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/Login";
import RegisterPage from "../pages/RegisterPage/Register";
import PregnancyDiary from "../pages/PregnancyDiaryPage/pregnancyDiary";
import ServicePage from "../pages/ServicePage/ServicePage";
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
    </Routes>
  );
};

export default AppRoutes;
