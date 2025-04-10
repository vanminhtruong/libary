import { useTranslation } from 'react-i18next'

const EmptyBookState = () => {
    const { t } = useTranslation()

    return (
        <div className="text-center py-10">
            <i className="pi pi-book text-4xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t('common.no_books_found')}</p>
        </div>
    )
}

export default EmptyBookState 