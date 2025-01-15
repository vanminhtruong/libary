import AuthService from '@/services/AuthService'

export const logout = async () => {
    try {
        const response = await AuthService.logout()
        return {
            status: 200,
            data: response
        }
    } catch (error) {
        console.error('Logout error:', error)
        throw error
    }
}
