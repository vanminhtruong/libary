import { Toast } from 'primereact/toast'
import { Paginator } from 'primereact/paginator'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import useBookList from './hooks/useBookList'
import BookFilters from './components/BookFilters'
import ViewToggle from './components/ViewToggle'
import BookGrid from './components/BookGrid'
import LazyBookGrid from './components/LazyBookGrid'
import BookListView from './components/BookList'
import EmptyBookState from './components/EmptyBookState'

const BookListPage = () => {
    const { t } = useTranslation()
    const {
        ui,
        books,
        filter,
        pagination,
        images,
        actions,
        toast
    } = useBookList();

    return (
        <div className="p-0 bg-white dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />

            <div className="p-4 md:p-6 relative">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{t('common.library_collection')}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t('common.discover_books')}</p>

                <BookFilters
                    searchQuery={filter.searchQuery}
                    setSearchQuery={filter.setSearchQuery}
                    selectedCategory={filter.selectedCategory}
                    setSelectedCategory={filter.setSelectedCategory}
                    categories={filter.categories}
                    setCategorySearchQuery={filter.setCategorySearchQuery}
                    darkMode={ui.darkMode}
                />

                <div className="flex justify-end mt-4 md:mt-0 md:absolute md:right-6 md:top-6">
                    <ViewToggle viewMode={ui.viewMode} setViewMode={ui.setViewMode} />
                </div>
            </div>

            {ui.loading ? (
                <LoadingSpinner />
            ) : books.length === 0 ? (
                <EmptyBookState />
            ) : (
                <>
                    <div className="p-4 md:p-6">
                        {ui.viewMode === 'grid' ? (
                            <LazyBookGrid
                                books={books}
                                getImageUrl={images.getImageUrl}
                                handleImageError={images.handleImageError}
                                navigateToBookDetail={actions.navigateToDetail}
                            />
                        ) : (
                            <BookListView
                                books={books}
                                getImageUrl={images.getImageUrl}
                                handleImageError={images.handleImageError}
                                navigateToBookDetail={actions.navigateToDetail}
                            />
                        )}
                    </div>

                    <div className="my-8 flex justify-center">
                        <Paginator
                            first={pagination.pagination.first}
                            rows={pagination.pagination.rows}
                            totalRecords={pagination.pagination.totalRecords}
                            onPageChange={pagination.onPageChange}
                            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default BookListPage