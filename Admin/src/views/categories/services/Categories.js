import { GET, POST, PUT, DELETE } from '../../../service/ApiService'

export const CategoriesService = {
    // Lấy danh sách categories
    getCategories() {
        return GET('/admin/categories')
    },

    // Lấy chi tiết category
    getCategory(id) {
        return GET(`/admin/categories/${id}`)
    },

    // Thêm category mới
    createCategory(data) {
        return POST('/admin/categories', data)
    },

    // Cập nhật category
    updateCategory(id, data) {
        return PUT(`/admin/categories/${id}`, data)
    },

    // Xóa category
    deleteCategory(id) {
        return DELETE(`/admin/categories/${id}`)
    }
}

export default CategoriesService
