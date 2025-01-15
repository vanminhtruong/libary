import createBaseService from './base.service'

const createBookService = () => {
    const baseService = createBaseService('')

    // Get all books with pagination and filters
    const getAllBooks = async (params = {}) => {
        try {
            return await baseService.get('/books', { params })
        } catch (error) {
            throw error
        }
    }

    // Get book by ID
    const getBookById = async (id) => {
        try {
            console.log('Service: Fetching book with ID:', id)
            const response = await baseService.get(`/books/${id}`)
            console.log('Service: Raw response:', response)
            
            // Kiểm tra response từ API
            if (!response) {
                throw new Error('No response from API')
            }

            // Response trực tiếp là dữ liệu book
            return response
        } catch (error) {
            console.error('Service: Error fetching book:', error)
            throw error
        }
    }

    // Create new book
    const createBook = async (bookData) => {
        try {
            return await baseService.post('/books', bookData)
        } catch (error) {
            throw error
        }
    }

    // Update book
    const updateBook = async (id, bookData) => {
        try {
            return await baseService.put(`/books/${id}`, bookData)
        } catch (error) {
            throw error
        }
    }

    // Delete book
    const deleteBook = async (id) => {
        try {
            return await baseService.delete(`/books/${id}`)
        } catch (error) {
            throw error
        }
    }

    // Search books
    const searchBooks = async (searchQuery) => {
        try {
            return await baseService.get(`/books/search?query=${searchQuery}`)
        } catch (error) {
            console.error('Search error:', error);
            throw error
        }
    }

    // Get books by category
    const getBooksByCategory = async (categoryId) => {
        try {
            return await baseService.get(`/categories/${categoryId}/books`)
        } catch (error) {
            throw error
        }
    }

    const getCategories = async () => {
        try {
            return await baseService.get('/categories/dropdown')
        } catch (error) {
            throw error
        }
    };

    const searchCategories = async (query) => {
        try {
            return await baseService.get(`/categories/search?query=${query}`)
        } catch (error) {
            throw error
        }
    };

    const borrowBook = async (data) => {
        try {
            return await baseService.post('/borrowing/borrow', data)
        } catch (error) {
            throw error
        }
    };

    const getCurrentBorrowings = async () => {
        try {
            return await baseService.get('/borrowing/current')
        } catch (error) {
            throw error
        }
    };

    const extendBorrowing = async (borrowId) => {
        try {
            return await baseService.post(`/borrowing/extend/${borrowId}`)
        } catch (error) {
            throw error
        }
    };

    const checkFines = async () => {
        try {
            return await baseService.get('/fines')
        } catch (error) {
            throw error
        }
    };

    const getFineDetails = async (fineId) => {
        try {
            return await baseService.get(`/fines/${fineId}`)
        } catch (error) {
            throw error
        }
    };

    const returnBook = async (borrowId) => {
        try {
            return await baseService.post(`/borrowing/return/${borrowId}`)
        } catch (error) {
            throw error
        }
    };

    return {
        getAllBooks,
        getBookById,
        createBook,
        updateBook,
        deleteBook,
        searchBooks,
        getBooksByCategory,
        borrowBook,
        getCurrentBorrowings,
        extendBorrowing,
        checkFines,
        getFineDetails,
        getCategories,
        searchCategories,
        returnBook
    }
}

// Create a singleton instance
const bookService = createBookService()

export default bookService 