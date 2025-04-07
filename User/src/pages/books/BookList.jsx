import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { useTranslation } from 'react-i18next'
import { Paginator } from 'primereact/paginator'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import FormInput from '../../components/common/FormInput'
import useBookList from './hooks/useBookList'

const BookList = () => {
    const { t } = useTranslation()
    const {
        books,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        viewMode,
        setViewMode,
        categories,
        setCategorySearchQuery,
        pagination,
        statuses,
        toast,
        onPageChange,
        getImageUrl,
        handleImageError,
        navigateToBookDetail
    } = useBookList();

    const renderBookCard = (book) => (
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
    );

    const renderBookRow = (book) => (
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
    );

    return (
        <div className="p-0 bg-white dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />
            
            <div className="p-4 md:p-6 relative">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{t('common.library_collection')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('common.discover_books')}</p>
                
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    <div className="flex-1 relative">
                        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('common.search')}
                            className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md pl-10 p-3 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    
                    <Dropdown
                        value={selectedCategory}
                        options={categories}
                        onChange={(e) => setSelectedCategory(e.value)}
                        placeholder={t('common.select_category')}
                        className="md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
                        filter
                        onFilter={(e) => setCategorySearchQuery(e.filter)}
                    />
                    
                    <Dropdown
                        value={selectedStatus}
                        options={statuses}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder={t('common.select_status')}
                        className="md:w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
                    />
                </div>
                
                <div className="flex justify-end mt-4 md:mt-0 md:absolute md:right-6 md:top-6">
                    <div className="p-buttonset">
                        <Button 
                            icon="pi pi-th-large" 
                            outlined={viewMode !== 'grid'}
                            onClick={() => setViewMode('grid')}
                            className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                        <Button 
                            icon="pi pi-list" 
                            outlined={viewMode !== 'list'}
                            onClick={() => setViewMode('list')}
                            className="text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                    </div>
                </div>
            </div>
            
            {loading ? (
                <LoadingSpinner />
            ) : books.length === 0 ? (
                <div className="text-center py-10">
                    <i className="pi pi-book text-4xl text-gray-400 mb-4"></i>
                    <p className="text-xl text-gray-600 dark:text-gray-400">{t('common.no_books_found')}</p>
                </div>
            ) : (
                <>
                    <div className="p-4 md:p-6">
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {books.map(book => renderBookCard(book))}
                            </div>
                        ) : (
                            <div>
                                {books.map(book => renderBookRow(book))}
                            </div>
                        )}
                    </div>
                    
                    <div className="my-8 flex justify-center">
                        <Paginator 
                            first={pagination.first} 
                            rows={pagination.rows} 
                            totalRecords={pagination.totalRecords} 
                            onPageChange={onPageChange}
                            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default BookList 