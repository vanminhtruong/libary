import { useEffect } from 'react';
import useViewMode from './useViewMode';
import useThemeMode from './useThemeMode';
import useBookFilter from './useBookFilter';
import useCategories from './useCategories';
import usePagination from './usePagination';
import useBookData from './useBookData';
import useBookImages from './useBookImages';

const useBookList = () => {
    // Sử dụng các hook nhỏ hơn để phân tách logic
    const viewModeData = useViewMode();
    const { darkMode } = useThemeMode();
    const filterData = useBookFilter();
    const categoryData = useCategories(filterData.categorySearchQuery);
    const paginationData = usePagination();
    
    const bookData = useBookData(
        filterData.searchQuery, 
        filterData.selectedCategory, 
        filterData.selectedStatus, 
        paginationData.pagination
    );
    
    const imageUtils = useBookImages();

    // Effect để tải sách khi các điều kiện lọc thay đổi
    useEffect(() => {
        const fetchBooks = async () => {
            const result = await bookData.loadBooks();
            if (result) {
                paginationData.setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: result.totalRecords 
                }));
            }
        };
        
        fetchBooks();
    }, [
        paginationData.pagination.page, 
        paginationData.pagination.rows, 
        filterData.searchQuery, 
        filterData.selectedCategory, 
        filterData.selectedStatus
    ]);

    return {
        ui: {
            viewMode: viewModeData.viewMode,
            setViewMode: viewModeData.setViewMode,
            darkMode,
            loading: bookData.loading
        },
        books: bookData.books,
        filter: {
            ...filterData,
            categories: categoryData.categories,
        },
        pagination: {
            ...paginationData,
        },
        images: imageUtils,
        actions: {
            navigateToDetail: bookData.navigateToBookDetail
        },
        toast: bookData.toast
    };
};

export default useBookList; 