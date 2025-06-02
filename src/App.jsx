import { useState } from 'react'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import ChatAI from './components/ChatAI/ChatAI';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {/* Page content goes here */}
          <AppRoutes /> {/* Đây là nơi hiển thị các route */}
        </main>
        <Footer />
      <ChatAI /> 

      </div>
    </AuthProvider>
  )
}

export default App
