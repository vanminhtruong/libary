import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { useTranslation } from 'react-i18next';
import bookService from '../../services/book.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_CONFIG } from '../../config/api.config';

const CurrentBorrowings = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExtendDialog, setShowExtendDialog] = useState(false);
    const [showFinesDialog, setShowFinesDialog] = useState(false);
    const [selectedBorrowing, setSelectedBorrowing] = useState(null);
    const [finesData, setFinesData] = useState(null);
    const [loadingFines, setLoadingFines] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showReasonDialogVisible, setShowReasonDialogVisible] = useState(false);
    const [rejectedBorrowing, setRejectedBorrowing] = useState(null);

    useEffect(() => {
        loadBorrowings();
    }, []);

    const loadBorrowings = async () => {
        try {
            setLoading(true);
            const response = await bookService.getCurrentBorrowings();
            console.log('Borrowings response:', response);
            
            // Kiểm tra chi tiết từng borrowing để xác định có reason không
            if (response && Array.isArray(response)) {
                console.log('Dates of borrowings in order:');
                response.forEach((borrowing, index) => {
                    console.log(`${index}: ${borrowing.book.title} - Created: ${borrowing.created_at}, ID: ${borrowing.id}`);
                });
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
            loadBorrowings(); // Reload the list
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.extend_error'),
                life: 3000
            });
        }
    };

    const confirmExtend = (borrowing) => {
        setSelectedBorrowing(borrowing);
        setShowExtendDialog(true);
    };

    const handleViewFines = async () => {
        try {
            setLoadingFines(true);
            const response = await bookService.checkFines();
            setFinesData(response);
            setShowFinesDialog(true);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.fines_load_error'),
                life: 3000
            });
        } finally {
            setLoadingFines(false);
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
            loadBorrowings(); // Reload the list
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.return_error'),
                life: 3000
            });
        }
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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg'
        if (imagePath.startsWith('http')) return imagePath
        const cleanPath = imagePath.replace('profile_image/', '')
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`
    }

    const renderBorrowingCard = (borrowing) => (
        <Card key={borrowing.id} className="mb-4 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Book Image */}
                <div className="w-full md:w-48">
                    <img
                        src={getImageUrl(borrowing.book.image)}
                        alt={borrowing.book.title}
                        className="w-full h-64 md:h-48 object-cover rounded-lg shadow-sm dark:border-gray-700"
                        onError={(e) => e.target.src = '/images/book-placeholder.png'}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                {borrowing.book.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
                                <i className="pi pi-user"></i>
                                <span>{borrowing.book.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <i className="pi pi-bookmark"></i>
                                <span>{borrowing.book.category}</span>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-external-link"
                            onClick={() => navigate(`/books/${borrowing.book_id}`)}
                            className="p-button-rounded p-button-text dark:text-gray-300 dark:hover:text-white"
                            tooltip={t('common.view_details')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.borrow_date')}</p>
                            <p className="font-medium dark:text-white">
                                {new Date(borrowing.borrow_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.due_date')}</p>
                            <p className="font-medium dark:text-white">
                                {new Date(borrowing.due_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.status')}</p>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                borrowing.status === 'borrowed' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : borrowing.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                                {borrowing.status === 'borrowed'
                                    ? t('borrowings.status_active')
                                    : borrowing.status === 'rejected'
                                    ? t('borrowings.status_rejected')
                                    : t('borrowings.status_overdue')
                                }
                            </span>
                        </div>
                    </div>

                    {borrowing.status === 'rejected' && (
                        <div className="mt-3 flex justify-end">
                            <Button
                                label={t('borrowings.view_reason')}
                                icon="pi pi-info-circle"
                                className="p-button-info p-button-sm"
                                onClick={() => showReasonDialog(borrowing)}
                            />
                        </div>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        {borrowing.status !== 'rejected' && (
                            <>
                                <Button
                                    label={t('borrowings.return')}
                                    icon="pi pi-reply"
                                    severity="danger"
                                    className="dark:text-red-400 dark:hover:bg-red-900/30"
                                    onClick={() => confirmReturn(borrowing)}
                                />
                                <Button
                                    label={t('borrowings.extend')}
                                    icon="pi pi-calendar-plus"
                                    className="p-button-secondary dark:hover:bg-gray-700 dark:text-white"
                                    onClick={() => confirmExtend(borrowing)}
                                    disabled={borrowing.status !== 'borrowed'}
                                />
                            </>
                        )}
                    </div>

                    {borrowing.fine_amount > 0 && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <i className="pi pi-exclamation-circle"></i>
                                <span className="font-medium">
                                    {t('borrowings.fine_amount')}: ${borrowing.fine_amount}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />
            
            {/* Header with Fines Button */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        {t('borrowings.current_borrowings')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('borrowings.current_borrowings_description')}
                    </p>
                </div>
                <Button
                    label={t('borrowings.view_fines')}
                    icon="pi pi-money-bill"
                    className="p-button-secondary dark:hover:bg-gray-700"
                    onClick={handleViewFines}
                    loading={loadingFines}
                />
            </div>

            {/* Fines Dialog */}
            <Dialog
                visible={showFinesDialog}
                onHide={() => setShowFinesDialog(false)}
                header={t('borrowings.fines_title')}
                style={{ width: '50vw' }}
                className="dark:bg-gray-800"
                headerClassName="dark:bg-gray-800 dark:text-white"
                contentClassName="dark:bg-gray-800"
            >
                <div className="p-4">
                    {loadingFines ? (
                        <LoadingSpinner />
                    ) : finesData?.data ? (
                        <>
                            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                                    {t('borrowings.total_fines')}: ${finesData.data.reduce((total, fine) => total + fine.amount, 0)}
                                </h3>
                            </div>
                            {finesData.data.length > 0 ? (
                                <div className="space-y-4">
                                    {finesData.data.map((fine) => (
                                        <div key={fine.id} className="p-4 border dark:border-gray-700 rounded-lg dark:bg-gray-700/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold dark:text-white">{fine.borrowing?.book?.title || t('common.unknown_book')}</h4>
                                                <span className="text-red-600 dark:text-red-400 font-medium">
                                                    ${fine.amount}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                {t('borrowings.fine_date')}: {new Date(fine.fine_date || fine.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                {t('borrowings.fine_reason')}: {fine.reason || t('borrowings.no_reason_provided')}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {t('borrowings.status')}: <span className={`px-2 py-1 rounded-full ${
                                                    fine.status === 'paid' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                                        : fine.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                    {fine.status}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    {t('borrowings.no_fines')}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-300">
                            {t('borrowings.no_fines_data')}
                        </p>
                    )}
                </div>
            </Dialog>

            {/* Extend Confirmation Dialog */}
            <Dialog
                visible={showExtendDialog}
                onHide={() => setShowExtendDialog(false)}
                header={t('borrowings.extend_confirmation_title')}
                className="dark:bg-gray-800 border-none"
                headerClassName="dark:bg-gray-800 dark:text-white border-b dark:border-gray-700"
                contentClassName="dark:bg-gray-800"
                style={{ borderRadius: '8px' }}
                modal
                dismissableMask
            >
                <div className="p-4 bg-white dark:bg-gray-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{t('borrowings.extend_confirmation_message')}</p>
                    {selectedBorrowing && (
                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-white mb-2">{selectedBorrowing.book.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('borrowings.current_due_date')}: {new Date(selectedBorrowing.due_date).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                    <Button
                        label={t('common.cancel')}
                        icon="pi pi-times"
                        className="p-button-text dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => setShowExtendDialog(false)}
                    />
                    <Button
                        label={t('common.confirm')}
                        icon="pi pi-check"
                        className="p-button-primary dark:text-white"
                        onClick={handleExtend}
                        autoFocus
                    />
                </div>
            </Dialog>

            {/* Return Confirmation Dialog */}
            <Dialog
                visible={showReturnDialog}
                onHide={() => setShowReturnDialog(false)}
                header={t('borrowings.return_confirmation_title')}
                className="dark:bg-gray-800 border-none"
                headerClassName="dark:bg-gray-800 dark:text-white border-b dark:border-gray-700"
                contentClassName="dark:bg-gray-800"
                style={{ borderRadius: '8px' }}
                modal
                dismissableMask
            >
                <div className="p-4 bg-white dark:bg-gray-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{t('borrowings.return_confirmation_message')}</p>
                    {selectedBorrowing && (
                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-white mb-2">{selectedBorrowing.book.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('borrowings.borrow_date')}: {new Date(selectedBorrowing.borrow_date).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                    <Button
                        label={t('common.cancel')}
                        icon="pi pi-times"
                        className="p-button-text dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => setShowReturnDialog(false)}
                    />
                    <Button
                        label={t('common.confirm')}
                        icon="pi pi-check"
                        className="p-button-primary dark:text-white focus:outline-none focus:ring-0"
                        onClick={handleReturn}
                        autoFocus
                    />
                </div>
            </Dialog>

            {/* Reason Dialog */}
            <Dialog
                visible={showReasonDialogVisible}
                onHide={() => setShowReasonDialogVisible(false)}
                header={t('borrowings.reason_title')}
                className="dark:bg-gray-800 border-none"
                headerClassName="dark:bg-gray-800 dark:text-white border-b dark:border-gray-700"
                contentClassName="dark:bg-gray-800"
                style={{ borderRadius: '8px' }}
                modal
                dismissableMask
            >
                <div className="p-4 bg-white dark:bg-gray-800">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{t('borrowings.reason_message')}</p>
                    {rejectedBorrowing && (
                        <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-white mb-2">{rejectedBorrowing.book.title}</p>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">{t('borrowings.reason')}:</span>{' '}
                                <span className="italic">{rejectedBorrowing.reason ? rejectedBorrowing.reason : t('borrowings.no_reason_provided')}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                    <Button
                        label={t('common.close')}
                        icon="pi pi-times"
                        className="p-button-text dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600"
                        onClick={() => setShowReasonDialogVisible(false)}
                    />
                </div>
            </Dialog>

            {/* Borrowings List */}
            {borrowings.length > 0 ? (
                borrowings.map(borrowing => renderBorrowingCard(borrowing))
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t('borrowings.no_active_borrowings')}</p>
                </div>
            )}
        </div>
    );
};

export default CurrentBorrowings; 