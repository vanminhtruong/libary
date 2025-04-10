import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';

export const useBorrowingsList = () => {
    const toast = useRef(null);
    const { t } = useTranslation();
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBorrowings();
    }, []);

    const loadBorrowings = async () => {
        try {
            setLoading(true);
            const response = await bookService.getCurrentBorrowings();
            
            if (response && Array.isArray(response)) {
                console.log('Borrowings loaded:', response.length);
                setBorrowings(response);
            } else {
                setBorrowings([]);
                toast.current.show({
                    severity: 'info',
                    summary: t('common.info'),
                    detail: t('borrowings.no_borrowings'),
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error loading borrowings:', error);
            setBorrowings([]);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.load_error'),
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        borrowings,
        loading,
        loadBorrowings,
        toast,
    };
}; 