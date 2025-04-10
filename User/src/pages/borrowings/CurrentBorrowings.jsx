import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BorrowingCard from './components/BorrowingCard';
import EmptyBorrowingsState from './components/EmptyBorrowingsState';
import BorrowingDialogs from './components/BorrowingDialogs';
import BorrowingHeader from './components/BorrowingHeader';
import FinesDialog from './components/FinesDialog';
import { API_CONFIG } from '../../config/api.config'

import { useBorrowingsList, useBorrowingActions, useFines, useBookImage } from './hooks';

const CurrentBorrowings = () => {
    const toastRef = useRef(null);
    
    const { 
        borrowings, 
        loading, 
        loadBorrowings 
    } = useBorrowingsList();
    
    const { 
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
    } = useBorrowingActions(toastRef, loadBorrowings);
    
    const {
        finesData,
        showFinesDialog,
        loadingFines,
        setShowFinesDialog,
        handleViewFines
    } = useFines(toastRef);
    
    const { getImageUrl } = useBookImage();

    const getImageUrlFromAPI = (imagePath) => {
        if (!imagePath) return '/book-placeholder.png'
        if (imagePath.startsWith('http')) return imagePath
        const filename = imagePath.split('/').pop()
        return `${API_CONFIG.BASE_URL}/books/image/${filename}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast ref={toastRef} />
            
            <div className="container mx-auto px-4 py-6">
                <BorrowingHeader 
                    onViewFines={handleViewFines} 
                    loadingFines={loadingFines} 
                />
                
                {borrowings.length === 0 ? (
                    <EmptyBorrowingsState />
                ) : (
                    <div className="space-y-4">
                        {borrowings.map(borrowing => (
                            <BorrowingCard
                                key={borrowing.id}
                                borrowing={borrowing}
                                onExtend={confirmExtend}
                                onReturn={confirmReturn}
                                onViewFines={handleViewFines}
                                onDelete={handleDelete}
                                getImageUrl={getImageUrlFromAPI}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BorrowingDialogs
                showExtendDialog={showExtendDialog}
                setShowExtendDialog={setShowExtendDialog}
                showReturnDialog={showReturnDialog}
                setShowReturnDialog={setShowReturnDialog}
                showReasonDialogVisible={showReasonDialogVisible}
                setShowReasonDialogVisible={setShowReasonDialogVisible}
                selectedBorrowing={selectedBorrowing}
                rejectedBorrowing={rejectedBorrowing}
                handleExtend={handleExtend}
                handleReturn={handleReturn}
                getImageUrl={getImageUrlFromAPI}
            />

            <FinesDialog
                visible={showFinesDialog}
                onHide={() => setShowFinesDialog(false)}
                finesData={finesData}
            />
        </div>
    );
};

export default CurrentBorrowings; 