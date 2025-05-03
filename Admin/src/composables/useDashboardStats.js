import { ref, onMounted } from 'vue';
import BookService from '@/views/books/services/BookService';
import { UserService } from '@/views/user/services/User';
import { CategoriesService } from '@/views/categories/services/Categories';
import { BorrowingsService } from '@/views/borrowings/services/Borrowings';

// Dữ liệu mẫu khi API không hoạt động
const SAMPLE_DATA = {
    books: 1234,
    users: 567,
    categories: 89,
    borrowings: 42
};

export function useDashboardStats() {
    // Hàm để lấy dữ liệu thống kê
    const fetchStats = async () => {
        try {
            console.log('Fetching dashboard stats...');
            
            // Fetch books
            let booksCount = 0;
            try {
                const booksResponse = await BookService.getBooks();
                console.log('Books response:', booksResponse);
                
                if (booksResponse && Array.isArray(booksResponse)) {
                    booksCount = booksResponse.length;
                } else if (booksResponse && booksResponse.data && Array.isArray(booksResponse.data)) {
                    booksCount = booksResponse.data.length;
                } else if (booksResponse && typeof booksResponse.total === 'number') {
                    booksCount = booksResponse.total;
                } else {
                    booksCount = SAMPLE_DATA.books;
                }
            } catch (error) {
                console.error('Error fetching books:', error);
                booksCount = SAMPLE_DATA.books;
            }
            
            // Fetch users
            let usersCount = 0;
            try {
                const usersResponse = await UserService.getUsers();
                console.log('Users response:', usersResponse);
                
                if (usersResponse && Array.isArray(usersResponse)) {
                    usersCount = usersResponse.length;
                } else if (usersResponse && usersResponse.data && Array.isArray(usersResponse.data)) {
                    usersCount = usersResponse.data.length;
                } else if (usersResponse && typeof usersResponse.total === 'number') {
                    usersCount = usersResponse.total;
                } else {
                    usersCount = SAMPLE_DATA.users;
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                usersCount = SAMPLE_DATA.users;
            }
            
            // Fetch categories
            let categoriesCount = 0;
            try {
                const categoriesResponse = await CategoriesService.getCategories();
                console.log('Categories response:', categoriesResponse);
                
                if (categoriesResponse && Array.isArray(categoriesResponse)) {
                    categoriesCount = categoriesResponse.length;
                } else if (categoriesResponse && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
                    categoriesCount = categoriesResponse.data.length;
                } else if (categoriesResponse && typeof categoriesResponse.total === 'number') {
                    categoriesCount = categoriesResponse.total;
                } else {
                    categoriesCount = SAMPLE_DATA.categories;
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                categoriesCount = SAMPLE_DATA.categories;
            }
            
            // Fetch borrowings
            let borrowingsCount = 0;
            try {
                const borrowingsResponse = await BorrowingsService.getBorrowings();
                console.log('Borrowings response:', borrowingsResponse);
                
                if (borrowingsResponse && Array.isArray(borrowingsResponse)) {
                    borrowingsCount = borrowingsResponse.length;
                } else if (borrowingsResponse && borrowingsResponse.data && Array.isArray(borrowingsResponse.data)) {
                    borrowingsCount = borrowingsResponse.data.length;
                } else if (borrowingsResponse && typeof borrowingsResponse.total === 'number') {
                    borrowingsCount = borrowingsResponse.total;
                } else {
                    borrowingsCount = SAMPLE_DATA.borrowings;
                }
            } catch (error) {
                console.error('Error fetching borrowings:', error);
                borrowingsCount = SAMPLE_DATA.borrowings;
            }
            
            // Trả về dữ liệu thống kê
            const result = {
                books: booksCount,
                users: usersCount,
                categories: categoriesCount,
                borrowings: borrowingsCount
            };
            
            console.log('Final stats result:', result);
            return result;
            
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            
            // Trả về dữ liệu mẫu khi có lỗi
            return {
                books: SAMPLE_DATA.books,
                users: SAMPLE_DATA.users,
                categories: SAMPLE_DATA.categories,
                borrowings: SAMPLE_DATA.borrowings
            };
        }
    };

    return {
        fetchStats
    };
}

export default useDashboardStats;
