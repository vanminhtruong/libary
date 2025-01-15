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
            console.log('Fetching book with ID:', id)
            const response = await bookService.getBookById(id)
            console.log('Raw API Response:', response)
            
            // Kiểm tra response
            if (!response || !response.book) {
                console.error('No book data received from API')
                throw new Error(t('books.not_found'))
            }

            // Kết hợp dữ liệu book và available_copies
            const bookData = {
                ...response.book,
                available_copies: response.available_copies
            }

            console.log('Processed book data:', JSON.stringify(bookData.image, null, 2))
            setBook(bookData)
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                stack: error.stack
            })
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

    useEffect(() => {
        console.log('Current book state:', book)
    }, [book])

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
            className="p-fluid"
            style={{ width: '450px' }}
            footer={
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        label={t('common.cancel')}
                        icon="pi pi-times"
                        onClick={() => setShowBorrowDialog(false)}
                        className="p-button-outlined p-button-secondary hover:bg-gray-100 transition-colors duration-200"
                        style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: '8px'
                        }}
                    />
                    <Button
                        label={t('common.submit')}
                        icon="pi pi-check"
                        onClick={handleBorrow}
                        severity="success"
                        className="hover:bg-green-600 transition-colors duration-200"
                        style={{
                            padding: '0.75rem 1.25rem',
                            borderRadius: '8px'
                        }}
                        autoFocus
                    />
                </div>
            }
        >
            <div className="p-4">
                {/* Book Info Section */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <img
                        src={getImageUrl(book.image)}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{book.title}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <i className="pi pi-user text-sm"></i>
                            <span>{book.author}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <i className="pi pi-bookmark text-sm"></i>
                            <span>{book.category}</span>
                        </div>
                    </div>
                </div>

                {/* Borrowing Details Section */}
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-800 mb-2">
                            <i className="pi pi-info-circle"></i>
                            <span className="font-medium">{t('books.borrowing_details')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{t('books.form.borrow_date')}</p>
                                <p className="font-medium">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{t('books.available_copies')}</p>
                                <p className="font-medium">{book.available_copies}</p>
                            </div>
                        </div>
                    </div>

                    {/* Due Date Input */}
                    <div>
                        <FormInput
                            type="date"
                            label="books.form.due_date"
                            value={borrowForm.due_date}
                            onChange={(value) => setBorrowForm(prev => ({ ...prev, due_date: value }))}
                            error={formErrors.due_date}
                            required
                            minDate={new Date()}
                            icon="pi pi-calendar"
                            className="w-full"
                        />
                        <small className="text-gray-500 mt-1 block">
                            <i className="pi pi-info-circle mr-1"></i>
                            {t('books.due_date_info')}
                        </small>
                    </div>

                    {/* Terms Section */}
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <i className="pi pi-exclamation-circle text-yellow-600"></i>
                            <span className="font-medium text-gray-700">{t('books.borrowing_terms')}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
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

    const header = (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{book.title}</h2>
        </div>
    )

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <Card header={header} className="shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <img
                            src={getImageUrl(book.image)}
                            alt={book.title}
                            className="w-full h-auto rounded-lg shadow-md object-cover"
                            style={{ maxHeight: '400px' }}
                        />
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold text-green-600">${book.price}</span>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    book.available_copies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {book.available_copies > 0 ? t('status.available') : t('status.borrowed')}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Total Copies: {book.total_copies}</p>
                                <p>Available Copies: {book.available_copies}</p>
                                <p>Location: {book.location_shelf}</p>
                            </div>
                            {book.available_copies > 0 && (
                                <Button
                                    icon="pi pi-book"
                                    label={t('common.borrow')}
                                    onClick={() => setShowBorrowDialog(true)}
                                    severity="success"
                                    className="w-full mt-4"
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h3>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <i className="pi pi-user"></i>
                                    <span className="font-medium">{book.author}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Publisher</p>
                                    <p className="font-medium">{book.publisher}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Publication Year</p>
                                    <p className="font-medium">{book.publication_year}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{book.category}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-500">ISBN</p>
                                    <p className="font-medium">{book.isbn}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-2">Description</h4>
                                <p className="text-gray-600 leading-relaxed">{book.description}</p>
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <h4 className="text-lg font-semibold mb-3">Additional Information</h4>
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1">
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(book.created_at).toLocaleDateString()}
                                    </p>
                                    {book.updated_at && (
                                        <p>
                                            <span className="font-medium">Last Updated:</span>{' '}
                                            {new Date(book.updated_at).toLocaleDateString()}
                                        </p>
                                    )}
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