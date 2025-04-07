import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';
import { API_CONFIG } from '../../../config/api.config';

const useBookList = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [categories, setCategories] = useState([]);
    const [categorySearchQuery, setCategorySearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 12,
        page: 0,
        totalRecords: 0
    });
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const statuses = [
        { label: t('common.all_statuses'), value: null },
        { label: t('status.available'), value: 'available' },
        { label: t('status.borrowed'), value: 'borrowed' }
    ];

    const loadCategories = async () => {
        try {
            let response;
            if (categorySearchQuery) {
                response = await bookService.searchCategories(categorySearchQuery);
            } else {
                response = await bookService.getCategories();
            }
            const categoriesList = response || [];
            setCategories([
                { label: t('common.all_categories'), value: 'all' },
                ...categoriesList.map(cat => ({
                    label: cat.name,
                    value: cat.id
                }))
            ]);
        } catch (error) {
            console.error('Load categories error:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('book.message.error.loadCategories'),
                life: 3000
            });
        }
    };

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
                    setPagination(prev => ({ 
                        ...prev, 
                        totalRecords: data.original.total || 0
                    }));
                } else {
                    setBooks([]);
                    setPagination(prev => ({ ...prev, totalRecords: 0 }));
                }
            } else if (selectedCategory && selectedCategory !== 'all') {
                // Use getBooksByCategory when a specific category is selected
                data = await bookService.getBooksByCategory(selectedCategory);
                console.log('GetBooksByCategory API response:', data);
                
                // Kiểm tra data.data là array và có phần tử
                const booksList = data?.data || [];
                setBooks(booksList);
                setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: booksList.length
                }));
                
                if (booksList.length === 0) {
                    toast.current.show({
                        severity: 'info',
                        summary: t('common.info'),
                        detail: t('common.no_results'),
                        life: 3000
                    });
                }
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
                    setPagination(prev => ({ 
                        ...prev, 
                        totalRecords: data.total || 0
                    }));
                } else {
                    setBooks([]);
                    setPagination(prev => ({ ...prev, totalRecords: 0 }));
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
        } finally {
            if (isInitialLoad) {
                setLoading(false);
                setIsInitialLoad(false);
            }
        }
    };

    useEffect(() => {
        loadBooks();
    }, [pagination.page, pagination.rows, searchQuery, selectedCategory, selectedStatus]);

    useEffect(() => {
        loadCategories();
    }, [categorySearchQuery]);

    const onPageChange = (event) => {
        setPagination(prev => ({ ...prev, ...event }));
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace('profile_image/', '');
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`;
    };

    const handleImageError = (e) => {
        e.target.src = '/default-book-cover.jpg';
    };

    const navigateToBookDetail = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    return {
        books,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        viewMode,
        setViewMode,
        categories,
        setCategorySearchQuery,
        pagination,
        statuses,
        toast,
        onPageChange,
        getImageUrl,
        handleImageError,
        navigateToBookDetail
    };
};

export default useBookList; 