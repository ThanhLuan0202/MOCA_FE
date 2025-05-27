import { useState } from 'react'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import HomePage from './pages/HomePage'
import AppRoutes from './routes/AppRoutes'
function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {/* Page content goes here */}
        <AppRoutes /> {/* Đây là nơi hiển thị các route */}

      </main>
      <Footer />
    </div>
  )
}

export default App
