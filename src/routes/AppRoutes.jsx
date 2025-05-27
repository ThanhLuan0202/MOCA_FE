import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
// import thêm các page khác nếu có

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/gioi-thieu" element={<AboutPage />} /> */}
      {/* Thêm route khác ở đây */}
    </Routes>
  );
};

export default AppRoutes;