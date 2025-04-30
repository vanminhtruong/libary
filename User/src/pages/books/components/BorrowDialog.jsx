import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'
import FormInput from '../../../components/common/FormInput'
import '../../borrowings/styles/DialogStyles.css'

const BorrowDialog = ({ 
    visible, 
    onHide, 
    book, 
    borrowForm, 
    setBorrowForm, 
    formErrors, 
    handleBorrow,
    getImageUrl 
}) => {
    const { t } = useTranslation()

    const footer = (
        <div className="flex justify-end gap-2 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
            <Button
                label={t('common.cancel')}
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
            />
            <Button
                label={t('common.submit')}
                icon="pi pi-check"
                onClick={handleBorrow}
                severity="primary"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white transition-colors duration-200 px-4 py-2"
            />
        </div>
    )

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={t('common.borrow')}
            modal
            className="!p-0 dark:bg-gray-800/95 custom-dialog"
            style={{ width: '450px', height: 'auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            blockScroll={true}
            headerClassName="dark:bg-gray-800/95 dark:text-gray-100 !p-4"
            contentClassName="dark:bg-gray-800/95 !p-0"
            footerClassName="dark:bg-gray-800/95 !p-0"
            footer={footer}
        >
            <div className="p-4 pb-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <img
                        src={getImageUrl(book?.image)}
                        alt={book?.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{book?.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-1">
                            <i className="pi pi-user text-sm"></i>
                            <span>{book?.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                            <i className="pi pi-bookmark text-sm"></i>
                            <span>{book?.category_name || t('common.unknown_category')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-[#23C552] mb-2">
                            <i className="pi pi-info-circle"></i>
                            <span className="font-medium">{t('books.borrowing_details')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('books.form.borrow_date')}</p>
                                <p className="font-medium dark:text-[#23C552]">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('books.available_copies')}</p>
                                <p className="font-medium dark:text-[#23C552]">{book?.available_copies}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <FormInput
                            type="date"
                            label={`${t('books.form.due_date')} *`}
                            value={borrowForm.due_date}
                            onChange={(value) => setBorrowForm(prev => ({ ...prev, due_date: value }))}
                            error={formErrors.due_date}
                            required
                            minDate={new Date()}
                            icon="pi pi-calendar"
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white relative z-50 date-input-compact"
                        />
                        <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                            <i className="pi pi-info-circle mr-1"></i>
                            {t('books.due_date_info')}
                        </small>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-exclamation-circle text-yellow-600 dark:text-yellow-400"></i>
                            <span className="font-medium text-gray-700 dark:text-[#23C552]">{t('books.borrowing_terms')}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            <li>{t('books.terms.return_on_time')}</li>
                            <li>{t('books.terms.take_care')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default BorrowDialog 