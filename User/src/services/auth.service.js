import createBaseService from './base.service'

const createAuthService = () => {
    const baseService = createBaseService('')

    // Login
    const login = async (credentials) => {
        try {
            const response = await baseService.post('/login', credentials)
            // Kiểm tra response format mới
            if (!response?.status || !response?.data?.access_token) {
                throw new Error('Invalid response format')
            }
            
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            window.dispatchEvent(new Event('auth-change'))
            
            return response.data
        } catch (error) {
            // Không cần xóa token vì chưa lưu
            throw error
        }
    }

    // Register
    const register = async (userData) => {
        return baseService.post('/register', userData)
    }

    // Get current user profile
    const getCurrentUser = async () => {
        return baseService.get('/user/profile')
    }

    // Update user profile
    const updateProfile = async (profileData) => {
        return baseService.post('/user/profile/update', profileData)
    }

    // Logout
    const logout = async () => {
        try {
            await baseService.post('/user/logout')
            localStorage.removeItem('token')
            window.dispatchEvent(new Event('auth-change'))
        } catch (error) {
            console.error('Logout error:', error)
            // Still remove token and trigger event even if API call fails
            localStorage.removeItem('token')
            window.dispatchEvent(new Event('auth-change'))
        }
    }

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!baseService.getAuthToken()
    }

    const getProfile = async () => {
        return await baseService.get('user/profile');
    };

    return {
        login,
        register,
        getCurrentUser,
        updateProfile,
        logout,
        isAuthenticated,
        getProfile
    }
}

// Create a singleton instance
const authService = createAuthService()
export default authService 