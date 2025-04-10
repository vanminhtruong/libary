import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';

export const useFines = (toast) => {
    const { t } = useTranslation();
    const [finesData, setFinesData] = useState(null);
    const [showFinesDialog, setShowFinesDialog] = useState(false);
    const [loadingFines, setLoadingFines] = useState(false);

    const handleViewFines = async () => {
        try {
            setLoadingFines(true);
            console.log('Sending request to get fines data');
            
            const response = await bookService.checkFines();
            console.log('Fines API response processed by service:', response);
            
            setFinesData(response);
            setShowFinesDialog(true);
        } catch (error) {
            console.error('Error loading fines:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.fines_load_error'),
                life: 3000
            });
            
            setFinesData({
                total_fine: 0,
                fine_details: [],
                message: error.message || t('borrowings.fines_load_error')
            });
        } finally {
            setLoadingFines(false);
        }
    };

    return {
        finesData,
        showFinesDialog,
        loadingFines,
        setShowFinesDialog,
        handleViewFines
    };
}; 