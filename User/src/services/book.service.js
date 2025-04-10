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
            console.log('Requesting fines data from API');
            const apiResponse = await baseService.get('/fines');
            console.log('Raw fines response:', apiResponse);
            
            // Handle empty response
            if (!apiResponse) {
                console.warn('Empty response received from fines API');
                return { total_fine: 0, fine_details: [], message: 'No fine data received' };
            }
            
            // Extract the actual data from the response
            // The API might return data in the "data" property if it follows Laravel API conventions
            const finesData = apiResponse.data || [];
            
            // Transform the data into the expected format
            let totalFine = 0;
            const fineDetails = [];
            
            if (Array.isArray(finesData)) {
                // Iterate through each fine to calculate the total and format details
                finesData.forEach(fine => {
                    if (fine.status !== 'paid' && fine.status !== 'cancelled') {
                        const amount = parseFloat(fine.amount || 0);
                        totalFine += amount;
                        
                        // If the fine has associated borrowing data, add it to details
                        if (fine.borrowing) {
                            const dueDate = fine.borrowing.due_date;
                            
                            // Calculate days overdue
                            let daysOverdue = 0;
                            if (dueDate) {
                                const today = new Date();
                                const dueDateTime = new Date(dueDate);
                                const timeDiff = today.getTime() - dueDateTime.getTime();
                                daysOverdue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                                daysOverdue = Math.max(0, daysOverdue);
                            }
                            
                            // Assume fine per day is either stored or can be calculated
                            const finePerDay = fine.amount_per_day || (daysOverdue > 0 ? amount / daysOverdue : 0);
                            
                            fineDetails.push({
                                id: fine.id,
                                book_title: fine.borrowing.book?.title || 'Unknown Book',
                                due_date: dueDate,
                                days_overdue: daysOverdue,
                                fine_per_day: finePerDay,
                                fine_amount: amount,
                                status: fine.status
                            });
                        }
                    }
                });
            } else if (apiResponse.success && apiResponse.data) {
                // Handle if the API returns with a different structure
                console.log('API returned data in an unexpected format, trying to adapt');
                if (Array.isArray(apiResponse.data)) {
                    return checkFines(); // Retry with the new format
                }
            }
            
            const formattedResponse = {
                total_fine: totalFine,
                fine_details: fineDetails
            };
            
            console.log('Formatted fines response:', formattedResponse);
            return formattedResponse;
        } catch (error) {
            console.error('Error fetching fines:', error);
            throw error;
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

    const deleteBorrowing = async (borrowId) => {
        try {
            return await baseService.delete(`/borrowing/${borrowId}`)
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
        returnBook,
        deleteBorrowing
    }
}

// Create a singleton instance
const bookService = createBookService()

export default bookService 