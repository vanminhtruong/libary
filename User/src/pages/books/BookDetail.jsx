import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Divider } from 'primereact/divider'
import { useTranslation } from 'react-i18next'
import bookService from '../../services/book.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { API_CONFIG } from '../../config/api.config'
import BookInfo from './components/BookInfo'
import BookActions from './components/BookActions'
import BorrowDialog from './components/BorrowDialog'

const BookDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useRef(null)
    const { t } = useTranslation()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showBorrowDialog, setShowBorrowDialog] = useState(false)
    const [borrowForm, setBorrowForm] = useState({
        book_id: null,
        due_date: null
    })
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        if (id) {
            loadBook()
        } else {
            setLoading(false)
            if (toast?.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('books.id_required'),
                    life: 3000
                })
            }
            setTimeout(() => navigate('/books'), 2000)
        }
    }, [id, navigate, t])

    const loadBook = async () => {
        try {
            setLoading(true)
            const response = await bookService.getBookById(id)
            
            if (response && response.book) {
                const bookData = {
                    ...response.book,
                    available_copies: response.available_copies || 0
                }
                setBook(bookData)
            } else {
                throw new Error(t('books.not_found'))
            }
        } catch (error) {
            console.error("Book loading error:", error)
            if (toast?.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: error.message || t('books.load_error'),
                    life: 3000
                })
            }
            
            // Chuyển hướng về trang sách nếu không tìm thấy
            setTimeout(() => navigate('/books'), 2000)
        } finally {
            setLoading(false)
        }
    }

    const handleBorrow = async () => {
        if (!validateForm()) return

        try {
            await bookService.borrowBook({
                book_id: id,
                due_date: borrowForm.due_date
            })

            if (toast?.current) {
                toast.current.show({
                    severity: 'success',
                    summary: t('common.success'),
                    detail: t('books.borrow_success'),
                    life: 3000
                })
            }

            setShowBorrowDialog(false)
            loadBook()
        } catch (error) {
            console.error("Borrow error:", error)
            if (toast?.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: error.message || t('books.borrow_failed'),
                    life: 3000
                })
            }
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!borrowForm.due_date) {
            errors.due_date = t('validation.required')
        }
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.png'
        if (imagePath.startsWith('http')) return imagePath
        // Lấy tên file từ đường dẫn (loại bỏ các thư mục nếu có)
        const filename = imagePath.split('/').pop()
        return `${API_CONFIG.BASE_URL}/books/image/${filename}`
    }

    // Breadcrumb items
    const items = [
        { label: t('common.home'), command: () => navigate('/') },
        { label: t('common.books'), command: () => navigate('/books') },
        { label: book?.title || t('books.details'), disabled: true }
    ];
    
    const home = { icon: 'pi pi-home', command: () => navigate('/') };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!book) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
                    <i className="pi pi-exclamation-circle text-5xl text-yellow-500 mb-4"></i>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('books.not_found')}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{t('books.not_found_message')}</p>
                    <Button
                        label={t('common.back_to_books')}
                        icon="pi pi-arrow-left"
                        onClick={() => navigate('/books')}
                        className="mt-2"
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {toast && <Toast ref={toast} />}

            <div className="container mx-auto px-4 py-6">
                <div className="mb-6">
                    <BreadCrumb model={items} home={home} className="p-0 pb-2 border-0 bg-transparent text-sm" />
                </div>
                
                <div className="flex justify-between items-center flex-wrap mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-0 line-clamp-1 mr-4">
                        {book.title}
                    </h1>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            label={t('common.borrow')}
                            icon="pi pi-book"
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white py-2 px-4
                                      shadow-md rounded-md transition-colors duration-200 flex items-center gap-2
                                      dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800 dark:hover:border-blue-800"
                            disabled={book.available_copies === 0}
                            onClick={() => setShowBorrowDialog(true)}
                        />
                        
                        <Button
                            label={t('common.back')}
                            icon="pi pi-arrow-left"
                            className="bg-gray-200 hover:bg-gray-300 border-gray-200 hover:border-gray-300 text-gray-700 py-2 px-4
                                      shadow-md rounded-md transition-colors duration-200 flex items-center gap-2
                                      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-700 dark:hover:border-gray-600"
                            onClick={() => navigate('/books')}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <BookInfo book={book} getImageUrl={getImageUrl} />
                </div>
                
                <div className="mt-8">
                    <div className="bg-gray-800 text-white flex items-center rounded-lg p-3 mb-4 w-max">
                        <i className="pi pi-info-circle text-lg mr-2"></i>
                        <span>{t('books.additional_information')}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('books.created_at')}</div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                {book.created_at ? new Date(book.created_at).toLocaleDateString() : '-'}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('books.publisher')}</div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                                {book.publisher || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BorrowDialog
                visible={showBorrowDialog}
                onHide={() => setShowBorrowDialog(false)}
                book={book}
                borrowForm={borrowForm}
                setBorrowForm={setBorrowForm}
                formErrors={formErrors}
                handleBorrow={handleBorrow}
                getImageUrl={getImageUrl}
            />
        </div>
    )
}

export default BookDetail 