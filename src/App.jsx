import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/routes'
import { AuthProvider } from './auth/AuthContext'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
