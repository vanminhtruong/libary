import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';

export const useBorrowingActions = (toast, onActionSuccess) => {
    const { t } = useTranslation();
    
    const [showExtendDialog, setShowExtendDialog] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showReasonDialogVisible, setShowReasonDialogVisible] = useState(false);
    
    const [selectedBorrowing, setSelectedBorrowing] = useState(null);
    const [rejectedBorrowing, setRejectedBorrowing] = useState(null);

    const handleExtend = async () => {
        try {
            await bookService.extendBorrowing(selectedBorrowing.id);
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('borrowings.extend_success'),
                life: 3000
            });
            setShowExtendDialog(false);
            if (onActionSuccess) onActionSuccess();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.extend_error'),
                life: 3000
            });
        }
    };

    const handleReturn = async () => {
        try {
            await bookService.returnBook(selectedBorrowing.id);
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('borrowings.return_success'),
                life: 3000
            });
            setShowReturnDialog(false);
            if (onActionSuccess) onActionSuccess();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.return_error'),
                life: 3000
            });
        }
    };


    const confirmExtend = (borrowing) => {
        setSelectedBorrowing(borrowing);
        setShowExtendDialog(true);
    };

    const confirmReturn = (borrowing) => {
        setSelectedBorrowing(borrowing);
        setShowReturnDialog(true);
    };

    const showReasonDialog = (borrowing) => {
        console.log("Rejected borrowing data:", borrowing);
        console.log("Rejection reason:", borrowing.reason);
        setRejectedBorrowing(borrowing);
        setShowReasonDialogVisible(true);
    };

    const handleDelete = async (borrowing) => {
        try {
            await bookService.deleteBorrowing(borrowing.id);
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('borrowings.delete_success'),
                life: 3000
            });
            if (onActionSuccess) onActionSuccess();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.delete_error'),
                life: 3000
            });
        }
    };

    return {
        selectedBorrowing,
        showExtendDialog,
        showReturnDialog,
        showReasonDialogVisible,
        rejectedBorrowing,
        setShowExtendDialog,
        setShowReturnDialog,
        setShowReasonDialogVisible,
        handleExtend,
        handleReturn,
        confirmExtend,
        confirmReturn,
        showReasonDialog,
        handleDelete
    };
}; 