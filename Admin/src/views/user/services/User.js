import { GET, POST, PUT, DELETE } from '../../../service/ApiService'

export const UserService = {
    // Lấy danh sách người dùng
    getUsers() {
        return GET('/admin/users')
    },

    // Lấy thông tin một người dùng cụ thể
    getUser(id) {
        return GET(`/admin/users/${id}`)
    },

    // Tạo một người dùng mới
    createUser(data) {
        return POST('/admin/users', data)
    },

    // Cập nhật thông tin người dùng
    updateUser(id, data) {
        return POST(`/admin/users/${id}/update`, data)
    },

    // Xóa một người dùng
    deleteUser(id) {
        return DELETE(`/admin/users/${id}`)
    },
    
    // Kích hoạt hoặc vô hiệu hóa tài khoản người dùng
    toggleActive(id) {
        return POST(`/admin/users/${id}/toggle-active`)
    }
}

export default UserService