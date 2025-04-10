import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

const BookGrid = ({ books, getImageUrl, handleImageError, navigateToBookDetail }) => {
    const { t } = useTranslation()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
                <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-102">
                    <div className="relative pb-[110%] overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img 
                            src={getImageUrl(book.image)} 
                            alt={book.title}
                            className="absolute top-0 left-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 dark:text-gray-100 hover:text-primary transition-colors">{book.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">{book.author}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <i className="pi pi-tag mr-2"></i>
                            <span className="line-clamp-1">{book.category?.name || t('common.unknown_category')}</span>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <Button
                                icon="pi pi-eye"
                                rounded
                                outlined
                                severity="info"
                                onClick={() => navigateToBookDetail(book.id)}
                                className="dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400/20"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookGrid 