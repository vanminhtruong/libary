import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import borrowingService from '../../../services/borrowing.service';
import { API_CONFIG } from '../../../config/api.config';

const useBorrowings = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    
    const [borrowings, setBorrowings] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [returnConfirmDialog, setReturnConfirmDialog] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState(null);
    const [returnLoading, setReturnLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 10,
        page: 0,
        totalRecords: 0
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return false;
            }
            return true;
        };
        
        if (checkAuth()) {
            loadBorrowingsData();
        }
    }, [navigate, activeTab, pagination.page, pagination.rows]);

    const loadBorrowingsData = async () => {
        setLoading(true);
        try {
            if (activeTab === 0) {
                const data = await borrowingService.getUserBorrowings({
                    page: pagination.page + 1,
                    limit: pagination.rows
                });
                
                setBorrowings(data.data || []);
                setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: data.total || 0
                }));
            } else if (activeTab === 1) {
                const data = await borrowingService.getUserReservations({
                    page: pagination.page + 1,
                    limit: pagination.rows
                });
                
                setReservations(data.data || []);
                setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: data.total || 0
                }));
            } else if (activeTab === 2) {
                const data = await borrowingService.getBorrowingHistory({
                    page: pagination.page + 1,
                    limit: pagination.rows
                });
                
                setHistory(data.data || []);
                setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: data.total || 0
                }));
            }
        } catch (error) {
            console.error('Error loading borrowings data:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('borrowing.error.load'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (borrowingId) => {
        setReturnLoading(true);
        try {
            const response = await borrowingService.returnBook(borrowingId);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('borrowing.success.return'),
                life: 3000
            });
            
            setReturnConfirmDialog(false);
            setSelectedBorrowing(null);
            loadBorrowingsData();
            
        } catch (error) {
            console.error('Error returning book:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('borrowing.error.return'),
                life: 3000
            });
        } finally {
            setReturnLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        setCancelLoading(true);
        try {
            const response = await borrowingService.cancelReservation(reservationId);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response.message || t('reservation.success.cancel'),
                life: 3000
            });
            
            loadBorrowingsData();
            
        } catch (error) {
            console.error('Error canceling reservation:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.response?.data?.message || t('reservation.error.cancel'),
                life: 3000
            });
        } finally {
            setCancelLoading(false);
        }
    };

    const navigateToBook = (bookId) => {
        navigate(`/books/${bookId}`);
    };

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

    const confirmReturn = (borrowing) => {
        setSelectedBorrowing(borrowing);
        setReturnConfirmDialog(true);
    };

    return {
        borrowings,
        reservations,
        history,
        loading,
        activeTab,
        setActiveTab,
        returnConfirmDialog,
        setReturnConfirmDialog,
        selectedBorrowing,
        returnLoading,
        cancelLoading,
        pagination,
        toast,
        onPageChange,
        getImageUrl,
        handleImageError,
        handleReturn,
        handleCancel,
        navigateToBook,
        confirmReturn
    };
};

export default useBorrowings; 