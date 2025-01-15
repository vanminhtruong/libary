import { GET, POST, DELETE } from '../../../service/ApiService'

export const BookService = {
  // Lấy danh sách sách với phân trang và bộ lọc
  getBooks(params) {
    return GET('/books', params)
  },

  // Lấy danh sách categories cho dropdown
  getCategories() {
    return GET('/categories/dropdown')
  },

  // Tìm kiếm sách
  searchBooks(query) {
    return GET('/books/search', { query })
  },

  // Lấy chi tiết một cuốn sách
  getBook(id) {
    return GET(`/books/${id}`)
  },

  // Thêm sách mới
  createBook(bookData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return POST('/admin/books', bookData, config)
  },

  // Cập nhật thông tin sách
  updateBook(id, bookData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return POST(`/admin/books/${id}`, bookData, config)
  },

  // Xóa sách
  deleteBook(id) {
    return DELETE(`/admin/books/${id}`)
  },

  // Kiểm tra tình trạng sách
  checkAvailability(id) {
    return GET(`/books/${id}/availability`)
  }
}

export default BookService