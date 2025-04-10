import { Card } from 'primereact/card'
import { useTranslation } from 'react-i18next'
import { Tag } from 'primereact/tag'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'
import { ProgressBar } from 'primereact/progressbar'
import { API_CONFIG } from '../../../config/api.config'

const BookInfo = ({ book, getImageUrl }) => {
    const { t } = useTranslation()

    const getStatusSeverity = (status) => {
        return status === 'available' ? 'success' : 'danger'
    }

    const getCopiesPercentage = () => {
        if (!book?.total_copies) return 0
        return Math.round((book.available_copies / book.total_copies) * 100)
    }

    // Kiểm tra và xử lý dữ liệu trước khi render
    const getCategoryName = () => {
        if (!book?.category) return t('common.unknown_category')
        if (typeof book.category === 'string') return book.category
        if (typeof book.category === 'object' && book.category?.name) return book.category.name
        return t('common.unknown_category')
    }

    // Hàm bảo vệ để lấy giá trị an toàn
    const safeValue = (value, defaultValue = 'N/A') => {
        if (value === null || value === undefined) return defaultValue
        if (typeof value === 'object') return JSON.stringify(value)
        return value
    }

    // Hiển thị ảnh sách từ API nếu không có getImageUrl được truyền vào
    const getBookImageUrl = (imagePath) => {
        if (getImageUrl) return getImageUrl(imagePath)
        
        if (!imagePath) return '/book-placeholder.png'
        if (imagePath.startsWith('http')) return imagePath
        // Lấy tên file từ đường dẫn (loại bỏ các thư mục nếu có)
        const filename = imagePath.split('/').pop()
        return `${API_CONFIG.BASE_URL}/books/image/${filename}`
    }

    // Đảm bảo có dữ liệu sách hợp lệ
    if (!book) {
        return (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <div className="text-center py-8">
                    <i className="pi pi-exclamation-circle text-yellow-500 text-4xl mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {t('books.not_found')}
                    </h3>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Ảnh sách */}
            <div className="md:col-span-1 flex justify-center">
                <div className="relative group w-full max-w-xs">
                    <div className="overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src={getBookImageUrl(book.image)} 
                            alt={safeValue(book.title)} 
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => e.target.src = '/book-placeholder.png'}
                        />
                    </div>
                    <div className="absolute top-3 right-3">
                        <Tag 
                            value={t(`books.${book.available_copies > 0 ? 'available' : 'unavailable'}`)} 
                            severity={getStatusSeverity(book.available_copies > 0 ? 'available' : 'unavailable')} 
                            className="font-semibold"
                        />
                    </div>
                </div>
            </div>

            {/* Thông tin sách */}
            <div className="md:col-span-2 flex flex-col">
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{safeValue(book.title)}</h2>
                
                <div className="text-lg font-semibold mb-1 text-gray-700 dark:text-gray-300">{safeValue(book.author)}</div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                    <Chip 
                        label={getCategoryName()} 
                        icon="pi pi-tag" 
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200" 
                    />
                    {book.publication_year && (
                        <Chip 
                            label={safeValue(book.publication_year)} 
                            icon="pi pi-calendar" 
                            className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200" 
                        />
                    )}
                    {book.language && (
                        <Chip 
                            label={safeValue(book.language)} 
                            icon="pi pi-globe" 
                            className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200" 
                        />
                    )}
                </div>
                
                <Divider />
                
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('books.availability')}</h3>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 dark:text-gray-300">
                            {safeValue(book.available_copies, 0)} / {safeValue(book.total_copies, 0)} {t('books.copies')}
                        </span>
                        <span className="text-sm font-medium" style={{ color: getCopiesPercentage() > 30 ? 'var(--green-500)' : 'var(--red-500)' }}>
                            {getCopiesPercentage()}%
                        </span>
                    </div>
                    <ProgressBar 
                        value={getCopiesPercentage()} 
                        showValue={false} 
                        color={getCopiesPercentage() > 30 ? 'var(--green-500)' : 'var(--red-500)'} 
                        className="h-2"
                    />
                </div>

                <Divider />
                
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{t('books.description')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-4 lg:line-clamp-none">
                        {safeValue(book.description, t('books.no_description'))}
                    </p>
                </div>

                <div className="mt-auto">
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>ISBN: {safeValue(book.isbn)}</div>
                        <div>{t('books.publisher')}: {safeValue(book.publisher)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookInfo 