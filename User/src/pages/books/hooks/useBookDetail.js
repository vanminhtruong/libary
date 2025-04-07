import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';
import borrowingService from '../../../services/borrowing.service';
import { API_CONFIG } from '../../../config/api.config';

const useBookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [borrowLoading, setBorrowLoading] = useState(false);
    const [reserveLoading, setReserveLoading] = useState(false);
    const [borrowDuration, setBorrowDuration] = useState(7);
    const [borrowDate, setBorrowDate] = useState(new Date());
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };
        
        checkAuth();
        window.addEventListener('auth-change', checkAuth);
        
        return () => window.removeEventListener('auth-change', checkAuth);
    }, []);

    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true);
            try {
                const data = await bookService.getBookById(id);
                setBook(data);
                
                if (data.category && data.category.id) {
                    const relatedData = await bookService.getBooksByCategory(data.category.id);
                    if (relatedData && relatedData.data) {
                        const filteredBooks = relatedData.data
                            .filter(relatedBook => relatedBook.id !== data.id)
                            .slice(0, 4);
                        setRelatedBooks(filteredBooks);
                    }
                }
            } catch (error) {
                console.error('Error fetching book details:', error);
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('book.message.error.load'),
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchBookDetails();
        }
    }, [id, t]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace('profile_image/', '');
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`;
    };

    const handleImageError = (e) => {
        e.target.src = '/default-book-cover.jpg';
    };

    const handleBorrow = async () => {
        if (!isAuthenticated) {
            toast.current.show({
                severity: 'warn',
                summary: t('common.authentication_required'),
                detail: t('book.message.error.login_required'),
                life: 3000
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        
        setBorrowLoading(true);
        try {
            const response = await borrowingService.borrowBook({
                book_id: id,
                duration: borrowDuration,
                borrow_date: borrowDate.toISOString().split('T')[0]
            });
            
            setShowBorrowModal(false);
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('book.message.success.borrow'),
                life: 3000
            });
            
            // Refresh book details to get updated status
            const updatedBook = await bookService.getBookById(id);
            setBook(updatedBook);
            
        } catch (error) {
            console.error('Error borrowing book:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('book.message.error.borrow'),
                life: 3000
            });
        } finally {
            setBorrowLoading(false);
        }
    };

    const handleReserve = async () => {
        if (!isAuthenticated) {
            toast.current.show({
                severity: 'warn',
                summary: t('common.authentication_required'),
                detail: t('book.message.error.login_required'),
                life: 3000
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        
        setReserveLoading(true);
        try {
            const response = await bookService.reserveBook(id);
            
            setShowReserveModal(false);
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('book.message.success.reserve'),
                life: 3000
            });
            
            // Refresh book details
            const updatedBook = await bookService.getBookById(id);
            setBook(updatedBook);
            
        } catch (error) {
            console.error('Error reserving book:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('book.message.error.reserve'),
                life: 3000
            });
        } finally {
            setReserveLoading(false);
        }
    };

    const navigateToBookDetail = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    return {
        book,
        loading,
        relatedBooks,
        showBorrowModal,
        setShowBorrowModal,
        showReserveModal,
        setShowReserveModal,
        borrowLoading,
        reserveLoading,
        borrowDuration,
        setBorrowDuration,
        borrowDate,
        setBorrowDate,
        isAuthenticated,
        toast,
        getImageUrl,
        handleImageError,
        handleBorrow,
        handleReserve,
        navigateToBookDetail
    };
};

export default useBookDetail; 