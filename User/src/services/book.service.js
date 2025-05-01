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

    const getBorrowingHistory = async () => {
        try {
            return await baseService.get('/borrowing/history')
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
            console.log('Raw fines response:', JSON.stringify(apiResponse, null, 2));

            // Kiểm tra phản hồi rỗng
            if (!apiResponse) {
                console.warn('Empty response received from fines API');
                return { total_fine: 0, fine_details: [], message: 'No fine data received' };
            }

            // Dựa vào ảnh, API trả về { success: true, data: [...] }
            let finesData;
            
            if (apiResponse.success === true && Array.isArray(apiResponse.data)) {
                console.log('Processing API response with success:true and data array');
                finesData = apiResponse.data;
            } else if (apiResponse.data && Array.isArray(apiResponse.data)) {
                console.log('Processing API response with data array');
                finesData = apiResponse.data;
            } else if (Array.isArray(apiResponse)) {
                console.log('Processing API response as direct array');
                finesData = apiResponse;
            } else {
                console.log('Unknown API response format, using empty array');
                finesData = [];
            }

            // Kiểm tra xem có dữ liệu không
            if (!Array.isArray(finesData) || finesData.length === 0) {
                console.log('No fines data found in API response');
                return { total_fine: 0, fine_details: [] };
            }

            console.log(`Processing ${finesData.length} fine records`);

            // Chuyển đổi dữ liệu thành định dạng mong muốn
            let totalFine = 0;
            const fineDetails = [];

            // Xử lý từng khoản phạt
            finesData.forEach((fine, index) => {
                console.log(`Processing fine ${index + 1}:`, fine);
                
                // Không bỏ qua bất kỳ trạng thái phạt nào
                // Tính tổng tiền phạt (chỉ tính cho các khoản pending)
                const amount = parseFloat(fine.amount || 0);
                if (fine.status === 'pending') {
                    totalFine += amount;
                }

                // Tạo đối tượng chi tiết phạt
                const fineDetail = {
                    id: fine.id,
                    fine_amount: amount,
                    status: fine.status || 'pending'
                };

                // Thêm thông tin mượn sách nếu có
                if (fine.borrowing) {
                    const dueDate = fine.borrowing.due_date;
                    fineDetail.book_title = fine.borrowing.book?.title || 'Unknown Book';
                    fineDetail.due_date = dueDate;

                    // Tính số ngày quá hạn
                    if (dueDate) {
                        const today = new Date();
                        const dueDateTime = new Date(dueDate);
                        const timeDiff = today.getTime() - dueDateTime.getTime();
                        const daysOverdue = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
                        fineDetail.days_overdue = daysOverdue;
                        
                        // Tính tiền phạt mỗi ngày
                        fineDetail.fine_per_day = daysOverdue > 0 ? amount / daysOverdue : 0;
                    }
                } else {
                    console.warn(`Fine ${fine.id} has no borrowing data`);
                    fineDetail.book_title = 'Unknown Book';
                }

                fineDetails.push(fineDetail);
            });

            const formattedResponse = {
                total_fine: totalFine,
                fine_details: fineDetails
            };

            console.log('Formatted fines response:', formattedResponse);
            
            // Kiểm tra xem có dữ liệu chi tiết không
            if (formattedResponse.fine_details.length === 0) {
                console.log('No fine details after processing');
            } else {
                console.log(`Returning ${formattedResponse.fine_details.length} fine details with total ${formattedResponse.total_fine}`);
            }
            
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
        getBorrowingHistory,
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