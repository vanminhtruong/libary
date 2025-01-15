import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { ROUTES } from './constants/routes'
import useLoading from './hooks/useLoading'
import { RequireAuth, RequireGuest } from './middleware/auth.middleware.jsx'
import { Toast } from 'primereact/toast'
import { useRef, useEffect, useState } from 'react'
import { apiMiddleware } from './middleware/api.middleware.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookList from './pages/books/BookList'
import BookDetail from './pages/books/BookDetail'
import CurrentBorrowings from './pages/borrowings/CurrentBorrowings'
import Profile from './pages/profile/Profile'

function App() {
  const toast = useRef(null)
  const [authKey, setAuthKey] = useState(0)

  useEffect(() => {
    // Set toast reference for API middleware
    apiMiddleware.setToast(toast)

    // Listen for auth changes
    const handleAuthChange = () => {
      setAuthKey(prev => prev + 1)
    }
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  return (
    <Router>
      <div key={authKey} className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Toast ref={toast} />
        <Routes>
          <Route path={ROUTES.LOGIN} element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          } />
          <Route path={ROUTES.REGISTER} element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          } />

          <Route path={ROUTES.HOME} element={<MainLayout><Home /></MainLayout>} />

          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route path={ROUTES.BOOKS} element={<BookList />} />
            <Route path={ROUTES.BOOK_DETAIL} element={<BookDetail />} />
            <Route path={ROUTES.CURRENT_BORROWINGS} element={<CurrentBorrowings />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>

        </Routes>
      </div>
    </Router>
  )
}

export default App