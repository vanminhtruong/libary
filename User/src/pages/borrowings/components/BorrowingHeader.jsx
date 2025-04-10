import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

const BorrowingHeader = ({ onViewFines, loadingFines }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {t('borrowings.my_borrowings')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                    {t('borrowings.manage_description')}
                </p>
            </div>
            <Button
                label={t('borrowings.check_fines')}
                icon="pi pi-dollar"
                className="p-button-outlined dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                onClick={onViewFines}
                loading={loadingFines}
            />
        </div>
    )
}

export default BorrowingHeader 