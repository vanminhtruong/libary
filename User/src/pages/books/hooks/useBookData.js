import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import bookService from '../../../services/book.service';

const useBookData = (searchQuery, selectedCategory, selectedStatus, pagination) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const toast = useRef(null);

    const loadBooks = async () => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            }
            let data;
            if (searchQuery && searchQuery.length >= 2) {
                console.log('Calling search with query:', searchQuery);
                data = await bookService.searchBooks(searchQuery.trim());
                console.log('Search API response:', data);
                if (data && data.original && data.original.data) {
                    setBooks(data.original.data);
                    return {
                        totalRecords: data.original.total || 0,
                        books: data.original.data
                    };
                } else {
                    setBooks([]);
                    return { totalRecords: 0, books: [] };
                }
            } else if (selectedCategory && selectedCategory !== 'all') {
                // Use getBooksByCategory when a specific category is selected
                data = await bookService.getBooksByCategory(selectedCategory);
                console.log('GetBooksByCategory API response:', data);
                
                // Kiểm tra data.data là array và có phần tử
                const booksList = data?.data || [];
                setBooks(booksList);
                
                if (booksList.length === 0) {
                    toast.current.show({
                        severity: 'info',
                        summary: t('common.info'),
                        detail: t('common.no_results'),
                        life: 3000
                    });
                }
                
                return { totalRecords: booksList.length, books: booksList };
            } else {
                // Khi chọn "All Categories" hoặc chưa chọn category
                data = await bookService.getAllBooks({
                    page: pagination.page + 1,
                    limit: pagination.rows,
                    status: selectedStatus
                });
                console.log('GetAllBooks API response:', data);
                
                if (data && data.data) {
                    setBooks(data.data);
                    return { totalRecords: data.total || 0, books: data.data };
                } else {
                    setBooks([]);
                    return { totalRecords: 0, books: [] };
                }
            }
        } catch (error) {
            console.error('Load books error:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message,
                life: 3000
            });
            return { totalRecords: 0, books: [] };
        } finally {
            if (isInitialLoad) {
                setLoading(false);
                setIsInitialLoad(false);
            }
        }
    };

    const navigateToBookDetail = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    return {
        books,
        loading,
        loadBooks,
        navigateToBookDetail,
        toast
    };
};

export default useBookData; 