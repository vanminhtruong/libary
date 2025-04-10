import { Button } from 'primereact/button'
import { useTranslation } from 'react-i18next'

const BookList = ({ books, getImageUrl, handleImageError, navigateToBookDetail }) => {
    const { t } = useTranslation()

    return (
        <div>
            {books.map(book => (
                <div key={book.id} className="mb-4 rounded-lg bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col md:flex-row">
                    <div className="md:w-1/6 h-40 md:h-auto min-w-[100px] overflow-hidden mb-4 md:mb-0 flex-shrink-0">
                        <img 
                            src={getImageUrl(book.image)} 
                            alt={book.title} 
                            className="w-full h-full object-cover rounded-md"
                            onError={handleImageError}
                        />
                    </div>
                    <div className="md:ml-4 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2 dark:text-white">{book.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                            <div className="flex items-center mb-2">
                                <i className="pi pi-tag mr-2 text-gray-500 dark:text-gray-400"></i>
                                <span className="text-gray-500 dark:text-gray-400">{book.category?.name || t('common.unknown_category')}</span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                icon="pi pi-eye"
                                outlined
                                severity="info"
                                onClick={() => navigateToBookDetail(book.id)}
                                className="dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-400/20"
                            >
                                <span className="ml-2">{t('common.view_details')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookList 