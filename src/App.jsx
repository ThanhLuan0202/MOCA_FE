import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import ChatAI from './components/ChatAI/ChatAI'

function App() {
  return (
    <AuthProvider>
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <AppRoutes />
        </main>
        <Footer />
        <ChatAI />
      </div>
    </AuthProvider>
  )
}

export default App
