import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { useTranslation } from 'react-i18next'
import { Paginator } from 'primereact/paginator'
import { API_CONFIG } from '../../config/api.config'
import bookService from '../../services/book.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import FormInput from '../../components/common/FormInput'

const BookList = () => {
    const navigate = useNavigate()
    const toast = useRef(null)
    const { t } = useTranslation()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [categories, setCategories] = useState([])
    const [categorySearchQuery, setCategorySearchQuery] = useState('')
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 12,
        page: 0,
        totalRecords: 0
    })
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const statuses = [
        { label: t('common.all_statuses'), value: null },
        { label: t('status.available'), value: 'available' },
        { label: t('status.borrowed'), value: 'borrowed' }
    ]

    const loadCategories = async () => {
        try {
            let response;
            if (categorySearchQuery) {
                response = await bookService.searchCategories(categorySearchQuery);
            } else {
                response = await bookService.getCategories();
            }
            const categoriesList = response || [];
            setCategories([
                { label: t('common.all_categories'), value: 'all' },
                ...categoriesList.map(cat => ({
                    label: cat.name,
                    value: cat.id
                }))
            ]);
        } catch (error) {
            console.error('Load categories error:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('book.message.error.loadCategories'),
                life: 3000
            });
        }
    };

    const loadBooks = async () => {
        try {
            if (isInitialLoad) {
                setLoading(true)
            }
            let data;
            if (searchQuery && searchQuery.length >= 2) {
                console.log('Calling search with query:', searchQuery);
                data = await bookService.searchBooks(searchQuery.trim());
                console.log('Search API response:', data);
                if (data && data.original && data.original.data) {
                    setBooks(data.original.data);
                    setPagination(prev => ({ 
                        ...prev, 
                        totalRecords: data.original.total || 0
                    }));
                } else {
                    setBooks([]);
                    setPagination(prev => ({ ...prev, totalRecords: 0 }));
                }
            } else if (selectedCategory && selectedCategory !== 'all') {
                // Use getBooksByCategory when a specific category is selected
                data = await bookService.getBooksByCategory(selectedCategory);
                console.log('GetBooksByCategory API response:', data);
                
                // Kiểm tra data.data là array và có phần tử
                const booksList = data?.data || [];
                setBooks(booksList);
                setPagination(prev => ({ 
                    ...prev, 
                    totalRecords: booksList.length
                }));
                
                if (booksList.length === 0) {
                    toast.current.show({
                        severity: 'info',
                        summary: t('common.info'),
                        detail: t('common.no_results'),
                        life: 3000
                    });
                }
            } else {
                // Khi chọn "All Categories" hoặc chưa chọn category
                data = await bookService.getAllBooks({
                    page: pagination.page + 1,
                    limit: pagination.rows,
                    status: selectedStatus
                });
                console.log('GetAllBooks API response:', data);
                
                if (data && data.data) {
                    setBooks(data.data);
                    setPagination(prev => ({ 
                        ...prev, 
                        totalRecords: data.total || 0
                    }));
                } else {
                    setBooks([]);
                    setPagination(prev => ({ ...prev, totalRecords: 0 }));
                }
            }
        } catch (error) {
            console.error('Load books error:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message,
                life: 3000
            })
        } finally {
            if (isInitialLoad) {
                setLoading(false)
                setIsInitialLoad(false)
            }
        }
    }

    useEffect(() => {
        loadBooks()
    }, [pagination.page, pagination.rows, searchQuery, selectedCategory, selectedStatus])

    useEffect(() => {
        loadCategories()
    }, [categorySearchQuery]);

    const onPageChange = (event) => {
        setPagination(prev => ({ ...prev, ...event }))
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg'
        if (imagePath.startsWith('http')) return imagePath
        return `${API_CONFIG.BASE_URL.replace('/api', '')}/storage/${imagePath}`
    }

    const handleImageError = (e) => {
        e.target.src = '/default-book-cover.jpg'
    }

    const renderBookCard = (book) => (
        <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:scale-102">
            <div className="relative pb-[60%] overflow-hidden bg-gray-100">
                <img 
                    src={getImageUrl(book.image)} 
                    alt={book.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={handleImageError}
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-sm ${
                    book.status?.toLowerCase() === 'available' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                    {book.status ? t(`status.${book.status.toLowerCase()}`) : t('status.unknown')}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <i className="pi pi-tag mr-2"></i>
                    <span>{book.category?.name || t('common.unknown_category')}</span>
                </div>
                <div className="flex gap-2 mt-auto">
                    <Button
                        icon="pi pi-eye"
                        rounded
                        outlined
                        severity="info"
                        onClick={() => navigate(`/books/${book.id}`)}
                    />
                    <Button
                        icon="pi pi-pencil"
                        rounded
                        outlined
                        severity="success"
                        onClick={() => navigate(`/books/${book.id}`)}
                    />
                </div>
            </div>
        </div>
    )

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toast ref={toast} />
            
            {/* Header Section */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">{t('common.library_collection')}</h1>
                        <p className="text-sm text-gray-500 mt-1">{t('common.discover_books')}</p>
                    </div>
                    <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200">
                        <Button
                            icon="pi pi-th-large"
                            text
                            severity={viewMode === 'grid' ? 'primary' : 'secondary'}
                            onClick={() => setViewMode('grid')}
                            className={`!px-3 !py-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-primary/10' : ''}`}
                            tooltip={t('common.grid_view')}
                        />
                        <Button
                            icon="pi pi-list"
                            text
                            severity={viewMode === 'list' ? 'primary' : 'secondary'}
                            onClick={() => setViewMode('list')}
                            className={`!px-3 !py-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-primary/10' : ''}`}
                            tooltip={t('common.list_view')}
                        />
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="relative mb-6">
                    <FormInput
                        type="text"
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        placeholder={t('common.search')}
                        icon="pi pi-search"
                        className="w-full !py-3 !pl-12 !pr-4 !bg-white border border-gray-200 rounded-full shadow-sm hover:border-gray-300 focus:!border-primary transition-colors"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <Dropdown
                        value={selectedCategory}
                        options={categories}
                        onChange={(e) => setSelectedCategory(e.value)}
                        placeholder={t('common.select_category')}
                        className="w-full md:w-48 !bg-white border border-gray-200 rounded-full hover:border-gray-300 focus:!border-primary transition-colors"
                        panelClassName="rounded-lg shadow-lg"
                        filter
                        filterBy="label"
                        onFilter={(e) => setCategorySearchQuery(e.filter)}
                        emptyFilterMessage={t('common.no_results')}
                    />
                    <Dropdown
                        value={selectedStatus}
                        options={statuses}
                        onChange={(e) => setSelectedStatus(e.value)}
                        placeholder={t('common.select_status')}
                        className="w-full md:w-48 !bg-white border border-gray-200 rounded-full hover:border-gray-300 focus:!border-primary transition-colors"
                        panelClassName="rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Books Grid */}
            <div className={`
                ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
                    : 'flex flex-col gap-4'
                }
            `}>
                {books.length > 0 ? (
                    books.map(book => renderBookCard(book))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <i className="pi pi-book text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-500">{t('books.no_books_found')}</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Paginator
                    first={pagination.first}
                    rows={pagination.rows}
                    totalRecords={pagination.totalRecords}
                    onPageChange={onPageChange}
                    className="bg-white rounded-lg shadow-sm"
                />
            </div>
        </div>
    )
}

export default BookList 