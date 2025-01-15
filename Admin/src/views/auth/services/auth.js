import { GET, POST, PUT, DELETE } from '../../../service/ApiService'

export const AuthService = {
    login(data) {
        return POST('/admin/login', data)
    }
}

export default AuthService
