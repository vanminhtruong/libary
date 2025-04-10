import { Toast } from 'primereact/toast'
import { Paginator } from 'primereact/paginator'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import useBookList from './hooks/useBookList'
import BookFilters from './components/BookFilters'
import ViewToggle from './components/ViewToggle'
import BookGrid from './components/BookGrid'
import BookListView from './components/BookList'
import EmptyBookState from './components/EmptyBookState'

const BookListPage = () => {
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

    return (
        <div className="p-0 bg-white dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />
            
            <div className="p-4 md:p-6 relative">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{t('common.library_collection')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('common.discover_books')}</p>
                
                <BookFilters 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    categories={categories}
                    statuses={statuses}
                    setCategorySearchQuery={setCategorySearchQuery}
                />
                
                <div className="flex justify-end mt-4 md:mt-0 md:absolute md:right-6 md:top-6">
                    <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
            </div>
            
            {loading ? (
                <LoadingSpinner />
            ) : books.length === 0 ? (
                <EmptyBookState />
            ) : (
                <>
                    <div className="p-4 md:p-6">
                        {viewMode === 'grid' ? (
                            <BookGrid 
                                books={books} 
                                getImageUrl={getImageUrl} 
                                handleImageError={handleImageError} 
                                navigateToBookDetail={navigateToBookDetail} 
                            />
                        ) : (
                            <BookListView 
                                books={books} 
                                getImageUrl={getImageUrl} 
                                handleImageError={handleImageError} 
                                navigateToBookDetail={navigateToBookDetail} 
                            />
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

export default BookListPage 