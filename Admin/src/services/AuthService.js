import { POST } from '@/service/ApiService'

const AuthService = {
    async logout() {
        try {
            const response = await POST('/admin/logout')
            
            if (response.status === 200) {
                return response.data
            }
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
            
            return null
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }
}

export default AuthService 