import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from '../../../utils/currencyUtils'
import '../styles/DialogStyles.css'

const FinesDialog = ({ visible, onHide, finesData }) => {
    const { t } = useTranslation()
    
    // Display data structure for debugging
    const debugDataStructure = () => {
        if (!finesData) return 'finesData is null';
        
        return Object.keys(finesData).map(key => {
            const value = finesData[key];
            if (Array.isArray(value)) {
                return `${key}: Array with ${value.length} items`;
            } else {
                return `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`;
            }
        }).join(', ');
    };
    
    console.log('Data structure debug:', debugDataStructure());
    
    // Function to safely format date
    const formatDate = (dateString) => {
        if (!dateString) return '-'
        try {
            return new Date(dateString).toLocaleDateString()
        } catch (error) {
            console.error('Date formatting error:', error)
            return dateString || '-'
        }
    }
    
    // Check if we have valid fine data
    const hasFines = finesData && 
                   finesData.total_fine !== undefined && 
                   finesData.total_fine > 0 &&
                   finesData.fine_details && 
                   Array.isArray(finesData.fine_details) && 
                   finesData.fine_details.length > 0;

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={t('borrowings.fines_details')}
            style={{ width: '600px' }}
            className="dark:bg-gray-800 custom-dialog"
            contentClassName="dark:bg-gray-800 p-0"
            headerClassName="dark:bg-gray-800 dark:text-white pb-2 border-b dark:border-gray-700"
            maskClassName="dark:mask-dark"
            footer={
                <div className="flex justify-end dark:bg-gray-800 pt-3 border-t dark:border-gray-700">
                    <Button
                        label={t('common.close')}
                        icon="pi pi-times"
                        onClick={onHide}
                        className="p-button-text dark:text-gray-300 dark:hover:text-white"
                    />
                </div>
            }
        >
            <div className="p-4 dark:bg-gray-800">
                {!finesData ? (
                    <div className="text-center py-8">
                        <i className="pi pi-spin pi-spinner text-5xl text-blue-500 dark:text-blue-400 mb-4"></i>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {t('common.loading')}
                        </h3>
                    </div>
                ) : hasFines ? (
                    <>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-lg mb-6">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-2">
                                <i className="pi pi-exclamation-circle"></i>
                                <span>{t('borrowings.you_have_fines')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">{t('borrowings.total_fine')}:</span>
                                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(finesData.total_fine)}
                                </span>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            {t('borrowings.overdue_books')}
                        </h3>

                        <div className="space-y-4">
                            {finesData.fine_details.map((fine, idx) => (
                                <div key={idx} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700">
                                        <h4 className="font-medium text-gray-800 dark:text-white">{fine.book_title || t('books.unknown')}</h4>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-gray-700/60">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {t('borrowings.due_date')}
                                                </p>
                                                <p className="font-medium dark:text-white">
                                                    {formatDate(fine.due_date)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {t('borrowings.days_overdue')}
                                                </p>
                                                <p className="font-medium dark:text-white">{fine.days_overdue || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {t('borrowings.fine_per_day')}
                                                </p>
                                                <p className="font-medium dark:text-white">{formatCurrency(fine.fine_per_day || 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    {t('borrowings.fine_amount')}
                                                </p>
                                                <p className="font-medium text-red-600 dark:text-red-400">
                                                    {formatCurrency(fine.fine_amount || 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-gray-50 dark:bg-gray-800/80 border dark:border-gray-700 p-4 rounded-lg">
                            <p className="text-gray-600 dark:text-gray-400">
                                <i className="pi pi-info-circle mr-2"></i>
                                {t('borrowings.fine_payment_info')}
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <i className="pi pi-check-circle text-5xl text-green-500 dark:text-green-400 mb-4"></i>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {t('borrowings.no_fines')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('borrowings.no_fines_message')}
                        </p>
                    </div>
                )}
                
            </div>
        </Dialog>
    )
}

export default FinesDialog 