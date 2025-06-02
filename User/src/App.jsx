import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { ROUTES } from './constants/routes'
import useLoading from './hooks/useLoading'
import { RequireAuth, RequireGuest } from './middleware/auth.middleware.jsx'
import { Toast } from 'primereact/toast'
import { useRef, useEffect, useState } from 'react'
import { apiMiddleware } from './middleware/api.middleware.jsx'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import BookList from './pages/books/BookList'
import BookDetail from './pages/books/BookDetail'
import CurrentBorrowings from './pages/borrowings/CurrentBorrowings'
import BorrowingHistory from './pages/borrowings/BorrowingHistory'
import Profile from './pages/profile/Profile'

function App() {
  const toast = useRef(null)
  const [authKey, setAuthKey] = useState(0)

  useEffect(() => {
    apiMiddleware.setToast(toast)

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
      <div key={authKey} className="min-h-screen bg-white dark:bg-black transition-colors duration-200">
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
          <Route path={ROUTES.FORGOT_PASSWORD} element={
            <RequireGuest>
              <ForgotPassword />
            </RequireGuest>
          } />

          <Route path={ROUTES.HOME} element={<MainLayout><Home /></MainLayout>} />

          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route path={ROUTES.BOOKS} element={<BookList />} />
            <Route path={ROUTES.BOOK_DETAIL} element={<BookDetail />} />
            <Route path={ROUTES.CURRENT_BORROWINGS} element={<CurrentBorrowings />} />
            <Route path={ROUTES.BORROWING_HISTORY} element={<BorrowingHistory />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>

        </Routes>
      </div>
    </Router>
  )
}

export default App
