import createBaseService from './base.service'

const createAuthService = () => {
    const baseService = createBaseService('')

    // Login
    const login = async (credentials, toast) => {
        try {
            const response = await baseService.post('/login', credentials)
            
            // Make sure response exists before checking properties
            if (!response) {
                // Return rejected promise instead of throwing error
                return Promise.reject(new Error("Email hoặc mật khẩu không đúng"));
            }
            
            // Handle failed login with status: false
            if (response.status === false) {
                return Promise.reject(new Error(response.message || "Email hoặc mật khẩu không đúng"));
            }
            
            // Validate successful response format
            if (!response?.data?.access_token) {
                // Return rejected promise instead of throwing error
                return Promise.reject(new Error("Email hoặc mật khẩu không đúng"));
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
            }

            window.dispatchEvent(new Event('auth-change'))
            
            return response.data
        } catch (error) {
            // If error has response with status: false, return rejected promise
            if (error.response?.data?.status === false) {
                return Promise.reject(new Error(error.response.data.message || "Email hoặc mật khẩu không đúng"));
            }
            // Always return a rejected promise so the catch in Login.jsx can handle it
            return Promise.reject(error);
        }
    }

    // Register
    const register = async (userData) => {
        try {
            const response = await baseService.post('/register', userData)
            
            // Đợi toast hiển thị
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            return response.data
        } catch (error) {
            throw error
        }
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