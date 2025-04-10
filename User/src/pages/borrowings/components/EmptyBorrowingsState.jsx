import { useTranslation } from 'react-i18next'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'

const EmptyBorrowingsState = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-10 text-center mt-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="pi pi-book text-blue-500 dark:text-blue-400 text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {t('borrowings.no_borrowings')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                {t('borrowings.no_borrowings_description')}
            </p>
            <Button
                label={t('borrowings.browse_books')}
                icon="pi pi-search"
                onClick={() => navigate('/books')}
                className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            />
        </div>
    )
}

export default EmptyBorrowingsState 