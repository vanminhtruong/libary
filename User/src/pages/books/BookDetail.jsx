import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { useTranslation } from 'react-i18next'
import bookService from '../../services/book.service'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import FormInput from '../../components/common/FormInput'
import { API_CONFIG } from '../../config/api.config'

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
        loadBook()
    }, [id])

    const loadBook = async () => {
        try {
            setLoading(true)
            if (!id) {
                throw new Error(t('books.id_required'))
            }
            const response = await bookService.getBookById(id)
            
            if (!response || !response.book) {
                throw new Error(t('books.not_found'))
            }

            const bookData = {
                ...response.book,
                available_copies: response.available_copies
            }

            setBook(bookData)
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('books.load_error'),
                life: 3000
            })
        } finally {
            setLoading(false)
        }
    }

    const handleBorrow = async () => {
        try {
            if (!validateForm()) return;

            const response = await bookService.borrowBook({
                book_id: id,
                due_date: borrowForm.due_date
            });

            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('books.borrow_success'),
                life: 3000
            });

            setShowBorrowDialog(false);
            loadBook();
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('books.borrow_failed'),
                life: 3000
            });
        }
    }

    const validateForm = () => {
        const errors = {};
        if (!borrowForm.due_date) {
            errors.due_date = t('validation.required');
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg'
        if (imagePath.startsWith('http')) return imagePath
        const cleanPath = imagePath.replace('profile_image/', '')
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`
    }

    const renderBorrowDialog = () => (
        <Dialog
            visible={showBorrowDialog}
            onHide={() => setShowBorrowDialog(false)}
            header={t('common.borrow')}
            modal
            className="!p-0 dark:bg-gray-800/95"
            style={{ width: '450px', height: 'auto', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            blockScroll={true}
            headerClassName="dark:bg-gray-800/95 dark:text-gray-100 !p-4"
            contentClassName="dark:bg-gray-800/95 !p-0"
            footerClassName="dark:bg-gray-800/95 !p-0"
            footer={
                <div className="flex justify-end items-center gap-6 p-4 dark:bg-gray-800/95 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        onClick={() => setShowBorrowDialog(false)}
                        className="flex items-center gap-2 text-black-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                        <i className="pi pi-times text-lg"></i>
                        <span>{t('common.cancel')}</span>
                    </Button>
                    <Button
                        onClick={handleBorrow}
                        className="flex items-center gap-2 text-black-400 px-6 py-2 rounded-lg transition-colors"
                    >
                        <i className="pi pi-check text-lg"></i>
                        <span>{t('common.submit')}</span>
                    </Button>
                </div>
            }
        >
            <div className="p-4 pb-[400px]">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{book.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-1">
                            <i className="pi pi-user text-sm"></i>
                            <span>{book.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                            <i className="pi pi-bookmark text-sm"></i>
                            <span>{book.category_name || t('common.unknown_category')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-[#23C552] mb-2">
                            <i className="pi pi-info-circle"></i>
                            <span className="font-medium">{t('books.borrowing_details')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('books.form.borrow_date')}</p>
                                <p className="font-medium dark:text-[#23C552]">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('books.available_copies')}</p>
                                <p className="font-medium dark:text-[#23C552]">{book.available_copies}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <FormInput
                            type="date"
                            label={`${t('books.form.due_date')} *`}
                            value={borrowForm.due_date}
                            onChange={(value) => setBorrowForm(prev => ({ ...prev, due_date: value }))}
                            error={formErrors.due_date}
                            required
                            minDate={new Date()}
                            icon="pi pi-calendar"
                            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white relative z-50"
                        />
                        <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                            <i className="pi pi-info-circle mr-1"></i>
                            {t('books.due_date_info')}
                        </small>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-exclamation-circle text-yellow-600 dark:text-yellow-400"></i>
                            <span className="font-medium text-gray-700 dark:text-[#23C552]">{t('books.borrowing_terms')}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            <li>{t('books.terms.return_on_time')}</li>
                            <li>{t('books.terms.take_care')}</li>
                            <li>{t('books.terms.fees_apply')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Dialog>
    )

    if (loading) {
        return <LoadingSpinner />
    }

    if (!book) {
        return (
            <div className="p-4">
                <div className="text-center text-gray-500">
                    {t('books.not_found')}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Toast ref={toast} />
            <Card className="shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 md:pr-6">
                        <div className="sticky top-4">
                            <img
                                src={getImageUrl(book.image)}
                                alt={book.title}
                                className="w-full h-auto rounded-lg shadow-md object-cover dark:border-gray-700"
                                style={{ maxHeight: '400px' }}
                            />
                            <div className="mt-4 bg-gray-50 dark:bg-gray-800/80 p-4 rounded-lg border dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-semibold text-green-500 dark:text-white">${book.price}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        book.available_copies > 0 
                                        ? 'bg-green-500/10 text-green-500 dark:bg-[#23C552]/20 dark:text-white' 
                                        : 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400'
                                    }`}>
                                        {book.available_copies > 0 ? t('status.available') : t('status.borrowed')}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p className="flex items-center gap-2 mb-1">
                                        <span>{t('books.total_copies')}:</span>
                                        <span className="font-medium text-green-500 dark:text-white">{book.total_copies}</span>
                                    </p>
                                    <p className="flex items-center gap-2 mb-1">
                                        <span>{t('books.available_copies')}:</span>
                                        <span className="font-medium text-green-500 dark:text-white">{book.available_copies}</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span>{t('books.location')}:</span>
                                        <span className="font-medium text-green-500 dark:text-white">{book.location_shelf}</span>
                                    </p>
                                </div>
                                {book.available_copies > 0 && (
                                    <Button
                                        icon="pi pi-book"
                                        label={t('common.borrow')}
                                        onClick={() => setShowBorrowDialog(true)}
                                        severity="success"
                                        className="w-full mt-4 dark:text-white hover:brightness-90 dark:hover:brightness-75 transition-colors duration-200"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3 md:border-l border-gray-200 dark:border-gray-700 md:pl-6 mt-6 md:mt-0">
                        <div className="h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                            <div className="space-y-6 pr-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{book.title}</h3>
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <i className="pi pi-user"></i>
                                        <span className="font-medium">{book.author}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('books.publisher')}</p>
                                        <p className="font-medium dark:text-gray-200">{book.publisher}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('books.publication_year')}</p>
                                        <p className="font-medium dark:text-gray-200">{book.publication_year}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('books.category')}</p>
                                        <p className="font-medium dark:text-gray-200">{book.category_name || book.category?.name || t('common.unknown_category')}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('books.isbn')}</p>
                                        <p className="font-medium dark:text-gray-200">{book.isbn}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-2 dark:text-gray-100">{t('books.description')}</h4>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{book.description}</p>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                                    <h4 className="text-lg font-semibold mb-3 dark:text-gray-100">{t('books.additional_info')}</h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        <p className="mb-1">
                                            <span className="font-medium dark:text-gray-200">{t('books.created_at')}:</span>{' '}
                                            {new Date(book.created_at).toLocaleDateString()}
                                        </p>
                                        {book.updated_at && (
                                            <p>
                                                <span className="font-medium dark:text-gray-200">{t('books.updated_at')}:</span>{' '}
                                                {new Date(book.updated_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            {renderBorrowDialog()}
        </div>
    )
}

export default BookDetail 