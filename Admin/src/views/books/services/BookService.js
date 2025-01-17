import { GET, POST, DELETE } from '../../../service/ApiService'

export const BookService = {
  getBooks(params) {
    return GET('/books', params)
  },

  getCategories() {
    return GET('/categories/dropdown')
  },

  searchBooks(query) {
    return GET('/books/search', { query })
  },

  getBook(id) {
    return GET(`/books/${id}`)
  },

  createBook(bookData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return POST('/admin/books', bookData, config)
  },

  updateBook(id, bookData) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return POST(`/admin/books/${id}`, bookData, config)
  },

  deleteBook(id) {
    return DELETE(`/admin/books/${id}`)
  },

  checkAvailability(id) {
    return GET(`/books/${id}/availability`)
  }
}

export default BookService