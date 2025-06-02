import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { format as dateFormat } from 'date-fns'
import '../styles/DialogStyles.css'

const BorrowingDialogs = ({
    showExtendDialog,
    setShowExtendDialog,
    showReturnDialog,
    setShowReturnDialog,
    showReasonDialogVisible,
    setShowReasonDialogVisible,
    selectedBorrowing,
    rejectedBorrowing,
    handleExtend,
    handleReturn,
    getImageUrl
}) => {
    const { t } = useTranslation()

    // Format the dates
    const formatDate = (dateString) => {
        if (!dateString) return "-"
        return dateFormat(new Date(dateString), 'dd/MM/yyyy')
    }

    // Calculate new due date (14 days from current due date)
    const calculateNewDueDate = (currentDueDate) => {
        if (!currentDueDate) return "-"
        const dueDate = new Date(currentDueDate)
        dueDate.setDate(dueDate.getDate() + 14)
        return formatDate(dueDate)
    }

    // Hiển thị ảnh sách với fallback
    const getBookImageUrl = (imagePath) => {
        if (getImageUrl) return getImageUrl(imagePath)
        return '/book-placeholder.png'
    }

    const renderExtendDialog = () => (
        <Dialog
            visible={showExtendDialog}
            onHide={() => setShowExtendDialog(false)}
            header={t('borrowings.extend_borrowing')}
            className="dark:bg-gray-900 custom-dialog"
            contentClassName="dark:bg-gray-900 p-0"
            headerClassName="dark:bg-gray-900 dark:text-white pb-2 border-b dark:border-gray-700"
            maskClassName="dark:mask-dark"
            footer={
                <div className="flex justify-end gap-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-b-lg border-t dark:border-gray-700">
                    <Button
                        label={t('common.cancel')}
                        icon="pi pi-times"
                        onClick={() => setShowExtendDialog(false)}
                        className="p-button-text text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
                    />
                    <Button
                        label={t('borrowings.extend')}
                        icon="pi pi-check"
                        onClick={handleExtend}
                        severity="primary"
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white transition-colors duration-200 px-4 py-2"
                    />
                </div>
            }
            breakpoints={{'960px': '80vw', '640px': '90vw'}}
            style={{width: '50vw'}}
            dismissableMask
        >
            <div className="p-4 dark:bg-gray-900">
                {selectedBorrowing && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedBorrowing.book.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.current_due_date')}</p>
                                <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedBorrowing.due_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.new_due_date')}</p>
                                <p className="font-medium text-green-600 dark:text-green-400">{calculateNewDueDate(selectedBorrowing.due_date)}</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{t('borrowings.extend_confirmation')}</p>
                    </div>
                )}
            </div>
        </Dialog>
    )

    const renderReturnDialog = () => (
        <Dialog
            visible={showReturnDialog}
            onHide={() => setShowReturnDialog(false)}
            header={t('borrowings.return_book')}
            className="dark:bg-gray-900 custom-dialog"
            contentClassName="dark:bg-gray-900 p-0"
            headerClassName="dark:bg-gray-900 dark:text-white pb-2 border-b dark:border-gray-700"
            maskClassName="dark:mask-dark"
            footer={
                <div className="flex justify-end gap-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-b-lg border-t dark:border-gray-700">
                    <Button
                        label={t('common.cancel')}
                        icon="pi pi-times"
                        onClick={() => setShowReturnDialog(false)}
                        className="p-button-text text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
                    />
                    <Button
                        label={t('borrowings.return')}
                        icon="pi pi-check"
                        onClick={handleReturn}
                        severity="primary"
                        className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white transition-colors duration-200 px-4 py-2"
                    />
                </div>
            }
            breakpoints={{'960px': '80vw', '640px': '90vw'}}
            style={{width: '50vw'}}
            dismissableMask
        >
            <div className="p-4 dark:bg-gray-900">
                {selectedBorrowing && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedBorrowing.book.title}</h3>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('borrowings.due_date')}</p>
                            <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedBorrowing.due_date)}</p>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{t('borrowings.return_confirmation')}</p>
                    </div>
                )}
            </div>
        </Dialog>
    )

    const renderReasonDialog = () => (
        <Dialog
            visible={showReasonDialogVisible}
            onHide={() => setShowReasonDialogVisible(false)}
            header={t('borrowings.rejection_details')}
            style={{ width: '50vw' }}
            className="dark:bg-gray-900 custom-dialog"
            contentClassName="dark:bg-gray-900 p-0"
            headerClassName="dark:bg-gray-900 dark:text-white pb-2 border-b dark:border-gray-700"
            maskClassName="dark:mask-dark"
            footer={
                <div className="flex justify-end dark:bg-gray-900 pt-3 border-t dark:border-gray-700">
                    <Button
                        label={t('common.close')}
                        icon="pi pi-times"
                        onClick={() => setShowReasonDialogVisible(false)}
                        className="p-button-text dark:text-gray-300 dark:hover:text-white px-4 py-2"
                    />
                </div>
            }
            breakpoints={{'960px': '80vw', '640px': '90vw'}}
        >
            <div className="p-4 dark:bg-gray-900">
                {rejectedBorrowing && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                                <img 
                                    src={getBookImageUrl(rejectedBorrowing.book?.image)}
                                    alt={rejectedBorrowing.book?.title || ''}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = '/book-placeholder.png'}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{rejectedBorrowing.book?.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{rejectedBorrowing.book?.author}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border-l-4 border-red-500">
                            <i className="pi pi-times-circle text-red-500 text-2xl mr-3"></i>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white">{t('borrowings.rejected')}</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {t('borrowings.borrow_date')}: {formatDate(rejectedBorrowing.borrow_date)}
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 dark:text-white mb-2">{t('borrowings.rejection_reason')}:</h4>
                            <p className="text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                {rejectedBorrowing.rejection_reason || rejectedBorrowing.reason || t('borrowings.no_reason_provided')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    )

    return (
        <>
            {renderExtendDialog()}
            {renderReturnDialog()}
            {renderReasonDialog()}
        </>
    )
}

export default BorrowingDialogs 