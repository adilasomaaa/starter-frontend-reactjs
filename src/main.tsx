import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HeroUIProvider } from '@heroui/system'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { ToastProvider } from '@heroui/react'
import { RegistrationProvider } from './context/RegistrationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement="top-right" toastOffset={24} />
        <AuthProvider>
          <RegistrationProvider>
            <App />
          </RegistrationProvider>
        </AuthProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
)
