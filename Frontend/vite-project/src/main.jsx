import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import "./style.scss"
import { InterviewProvider } from './features/interview/interview.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  </StrictMode>,
)