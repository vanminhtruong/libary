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

    useEffect(() => {
        loadBorrowings();
    }, []);

    const loadBorrowings = async () => {
        try {
            setLoading(true);
            const response = await bookService.getCurrentBorrowings();
            console.log('Borrowings response:', response);
            if (response && Array.isArray(response)) {
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

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg'
        if (imagePath.startsWith('http')) return imagePath
        const cleanPath = imagePath.replace('profile_image/', '')
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`
    }

    const renderBorrowingCard = (borrowing) => (
        <Card key={borrowing.id} className="mb-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Book Image */}
                <div className="w-full md:w-48">
                    <img
                        src={getImageUrl(borrowing.book.image)}
                        alt={borrowing.book.title}
                        className="w-full h-64 md:h-48 object-cover rounded-lg shadow-sm"
                        onError={(e) => e.target.src = '/images/book-placeholder.png'}
                    />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {borrowing.book.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <i className="pi pi-user"></i>
                                <span>{borrowing.book.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <i className="pi pi-bookmark"></i>
                                <span>{borrowing.book.category}</span>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-external-link"
                            onClick={() => navigate(`/books/${borrowing.book_id}`)}
                            className="p-button-rounded p-button-text"
                            tooltip={t('common.view_details')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('borrowings.borrow_date')}</p>
                            <p className="font-medium">
                                {new Date(borrowing.borrow_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('borrowings.due_date')}</p>
                            <p className="font-medium">
                                {new Date(borrowing.due_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('borrowings.status')}</p>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                borrowing.status === 'borrowed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {borrowing.status === 'borrowed'
                                    ? t('borrowings.status_active')
                                    : t('borrowings.status_overdue')
                                }
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button
                            label={t('borrowings.extend')}
                            icon="pi pi-calendar-plus"
                            className="p-button-secondary"
                            onClick={() => confirmExtend(borrowing)}
                            disabled={borrowing.status !== 'borrowed'}
                        />
                    </div>

                    {borrowing.fine_amount > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
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
        <div className="p-6">
            <Toast ref={toast} />
            
            {/* Header with Fines Button */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {t('borrowings.current_borrowings')}
                    </h1>
                    <p className="text-gray-600">
                        {t('borrowings.current_borrowings_description')}
                    </p>
                </div>
                <Button
                    label={t('borrowings.view_fines')}
                    icon="pi pi-money-bill"
                    className="p-button-secondary"
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
            >
                <div className="p-4">
                    {loadingFines ? (
                        <LoadingSpinner />
                    ) : finesData?.data ? (
                        <>
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">
                                    {t('borrowings.total_fines')}: ${finesData.data.reduce((total, fine) => total + fine.amount, 0)}
                                </h3>
                            </div>
                            {finesData.data.length > 0 ? (
                                <div className="space-y-4">
                                    {finesData.data.map((fine) => (
                                        <div key={fine.id} className="p-4 border rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold">{fine.borrowing?.book?.title || t('common.unknown_book')}</h4>
                                                <span className="text-red-600 font-medium">
                                                    ${fine.amount}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {t('borrowings.fine_reason')}: {fine.reason || t('common.no_reason')}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {t('borrowings.fine_date')}: {new Date(fine.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {t('borrowings.status')}: <span className={`px-2 py-1 rounded-full ${
                                                    fine.status === 'paid' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : fine.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {fine.status}
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    {t('borrowings.no_fines')}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-center text-gray-600">
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
                footer={(
                    <div className="flex justify-end gap-2">
                        <Button
                            label={t('common.cancel')}
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowExtendDialog(false)}
                        />
                        <Button
                            label={t('common.confirm')}
                            icon="pi pi-check"
                            className="p-button-primary"
                            onClick={handleExtend}
                            autoFocus
                        />
                    </div>
                )}
            >
                <div className="p-4">
                    <p>{t('borrowings.extend_confirmation_message')}</p>
                    {selectedBorrowing && (
                        <div className="mt-3">
                            <p className="font-semibold">{selectedBorrowing.book.title}</p>
                            <p className="text-sm text-gray-600">
                                {t('borrowings.current_due_date')}: {new Date(selectedBorrowing.due_date).toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </div>
            </Dialog>

            {/* Borrowings List */}
            {borrowings.length > 0 ? (
                borrowings.map(borrowing => renderBorrowingCard(borrowing))
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">{t('borrowings.no_active_borrowings')}</p>
                </div>
            )}
        </div>
    );
};

export default CurrentBorrowings; 