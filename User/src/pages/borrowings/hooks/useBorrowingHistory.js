import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { format as dateFormat } from 'date-fns';
import bookService from '../../../services/book.service';
import { API_CONFIG } from '../../../config/api.config';

/**
 * Hook quản lý logic cho trang lịch sử mượn sách
 * @returns {Object} Các state và hàm xử lý cho trang lịch sử mượn sách
 */
const useBorrowingHistory = () => {
    const toast = useRef(null);
    const { t } = useTranslation();
    const [borrowingHistory, setBorrowingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });

    // Quản lý hiển thị cột responsive
    const [visibleColumns, setVisibleColumns] = useState({
        book: true,
        borrow_date: true,
        due_date: true,
        return_date: true,
        status: true,
        actions: true
    });

    // Load dữ liệu lịch sử mượn sách
    useEffect(() => {
        loadBorrowingHistory();
    }, [lazyParams]);

    // Cập nhật visible columns dựa trên kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 640) { // Small mobile
                setVisibleColumns({
                    book: true,
                    borrow_date: false,
                    due_date: false,
                    return_date: false,
                    status: true,
                    actions: true
                });
            } else if (width < 768) { // Mobile
                setVisibleColumns({
                    book: true,
                    borrow_date: true,
                    due_date: false,
                    return_date: false,
                    status: true,
                    actions: true
                });
            } else if (width < 1024) { // Tablet
                setVisibleColumns({
                    book: true,
                    borrow_date: true,
                    due_date: true,
                    return_date: false,
                    status: true,
                    actions: true
                });
            } else { // Desktop
                setVisibleColumns({
                    book: true,
                    borrow_date: true,
                    due_date: true,
                    return_date: true,
                    status: true,
                    actions: true
                });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Lấy dữ liệu lịch sử mượn sách từ API
     */
    const loadBorrowingHistory = async () => {
        try {
            setLoading(true);
            const response = await bookService.getBorrowingHistory();

            if (response && Array.isArray(response)) {
                setBorrowingHistory(response);
                setTotalRecords(response.length);
            } else if (response && response.data && Array.isArray(response.data)) {
                setBorrowingHistory(response.data);
                setTotalRecords(response.total || response.data.length);
            } else {
                setBorrowingHistory([]);
                setTotalRecords(0);
                if (toast.current) {
                    toast.current.show({
                        severity: 'info',
                        summary: t('common.info'),
                        detail: t('borrowings.no_history'),
                        life: 3000
                    });
                }
            }
        } catch (error) {
            console.error('Error loading borrowing history:', error);
            setBorrowingHistory([]);
            setTotalRecords(0);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: error.message || t('borrowings.history_load_error'),
                    life: 3000
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Xử lý sự kiện phân trang
     * @param {Object} event - Sự kiện phân trang từ DataTable
     */
    const onPage = (event) => {
        setLazyParams(event);
    };

    /**
     * Format ngày tháng
     * @param {string} dateString - Chuỗi ngày cần format
     * @returns {string} Ngày đã được format
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateFormat(new Date(dateString), 'dd/MM/yyyy');
    };

    /**
     * Lấy severity cho trạng thái mượn sách
     * @param {string} status - Trạng thái mượn sách
     * @returns {string} Severity tương ứng
     */
    const getStatusSeverity = (status) => {
        switch (status) {
            case 'borrowed':
                return 'info';
            case 'returned':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    /**
     * Lấy URL hình ảnh sách
     * @param {string} imagePath - Đường dẫn hình ảnh
     * @returns {string} URL đầy đủ của hình ảnh
     */
    const getBookImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_CONFIG.BASE_URL}/books/image/${imagePath.split('/').pop()}`;
    };

    return {
        toast,
        borrowingHistory,
        loading,
        totalRecords,
        lazyParams,
        visibleColumns,
        loadBorrowingHistory,
        onPage,
        formatDate,
        getStatusSeverity,
        getBookImageUrl
    };
};

export default useBorrowingHistory;
