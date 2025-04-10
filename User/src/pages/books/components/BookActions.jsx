import { useTranslation } from 'react-i18next'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'primereact/tooltip'

const BookActions = ({ book, onBorrowClick }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
                <Tooltip target=".borrow-button" />
                <Button
                    label={t('common.borrow')}
                    icon="pi pi-book"
                    data-pr-tooltip={book.available_copies === 0 ? t('books.no_copies_available') : ''}
                    data-pr-position="top"
                    className="borrow-button bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white py-2 px-3
                            shadow-sm rounded-md transition-colors duration-200 flex items-center gap-2
                            dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800 dark:hover:border-blue-800"
                    disabled={book.available_copies === 0}
                    onClick={onBorrowClick}
                />
            </div>

            <Button
                label={t('common.back')}
                icon="pi pi-arrow-left"
                outlined
                className="p-button-secondary transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                onClick={() => navigate('/books')}
            />

            <Button
                icon="pi pi-share-alt"
                rounded
                text
                severity="info"
                className="p-button-text-secondary p-2.5 hover:scale-110 transition-transform"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Hiển thị thông báo sao chép thành công nếu cần
                }}
                tooltip={t('common.share')}
                tooltipOptions={{ position: 'top' }}
            />

            <Button
                icon="pi pi-bookmark"
                rounded
                text
                severity="success" 
                className="p-button-text-secondary p-2.5 hover:scale-110 transition-transform"
                tooltip={t('books.add_to_wishlist')}
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    )
}

export default BookActions 