import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Tooltip } from 'primereact/tooltip'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format as dateFormat, isAfter } from 'date-fns'
import { Badge } from 'primereact/badge'
import { Tag } from 'primereact/tag'
import { Menu } from 'primereact/menu'
import { useRef, useEffect, useState } from 'react'
import { API_CONFIG } from '../../../config/api.config'

const BorrowingCard = ({ borrowing, onExtend, onReturn, onViewFines, onDelete, getImageUrl, onViewRejectionReason }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const menuRef = useRef(null)
    const menuButtonRef = useRef(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const getStatusInfo = (borrowing) => {
        if (borrowing.status === 'rejected') {
            return {
                label: t('borrowings.rejected'),
                className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
                icon: 'pi-times-circle'
            }
        }

        if (borrowing.status === 'returned') {
            return {
                label: t('borrowings.returned'),
                className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                icon: 'pi-check-circle'
            }
        }

        if (borrowing.status === 'active' && borrowing.due_date) {
            const dueDate = new Date(borrowing.due_date)
            const now = new Date()

            if (isAfter(now, dueDate)) {
                return {
                    label: t('borrowings.overdue'),
                    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
                    icon: 'pi-exclamation-circle'
                }
            }
        }

        return {
            label: t('borrowings.active'),
            className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            icon: 'pi-check'
        }
    }
    
    const getBookImageUrl = (imagePath) => {
        if (getImageUrl) return getImageUrl(imagePath)
        
        if (!imagePath) return '/book-placeholder.png'
        if (imagePath.startsWith('http')) return imagePath
        const filename = imagePath.split('/').pop()
        return `${API_CONFIG.BASE_URL}/books/image/${filename}`
    }

    const statusInfo = getStatusInfo(borrowing)
    const formattedBorrowDate = dateFormat(new Date(borrowing.borrow_date), 'dd/MM/yyyy')
    const formattedDueDate = borrowing.due_date ? dateFormat(new Date(borrowing.due_date), 'dd/MM/yyyy') : '-'
    const isOverdue = statusInfo.label === t('borrowings.overdue')
    const isActive = borrowing.status === 'active'

    const menuItems = [
        {
            label: t('borrowings.return'),
            icon: 'pi pi-check-square',
            command: () => onReturn && onReturn(borrowing),
            disabled: borrowing.status === 'rejected',
            className: 'return-option'
        },
        {
            label: t('borrowings.extend'),
            icon: 'pi pi-calendar-plus',
            command: () => onExtend && onExtend(borrowing),
            disabled: isActive || borrowing.extend_count >= 2 || borrowing.status === 'rejected',
            className: 'extend-option'
        },
        {
            label: t('borrowings.view_reason'),
            icon: 'pi pi-info-circle',
            command: () => onViewRejectionReason && onViewRejectionReason(borrowing),
            visible: borrowing.status === 'rejected' && borrowing.rejection_reason
        },
        {
            label: t('borrowings.delete'),
            icon: 'pi pi-trash',
            command: () => onDelete && onDelete(borrowing),
            disabled: !['returned', 'rejected'].includes(borrowing.status)
        }
    ]

    const toggleMenu = (event) => {
        if (menuRef.current) {
            menuRef.current.toggle(event)
        }
    }

    return (
        <div className="mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative">
            <Tooltip target=".extend-option" content={borrowing.extend_count >= 2 ? t('borrowings.max_extensions_reached') : ''} position="left" />
            <div className={`${isMobile ? 'absolute top-2 right-2 z-20' : 'absolute top-2 right-2 z-10'}`}>
                <Button
                    ref={menuButtonRef}
                    icon="pi pi-ellipsis-v"
                    className="p-button-sm p-button-text p-button-rounded hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors duration-200 dark:text-white"
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                    }}
                    onClick={toggleMenu}
                    aria-label="Options"
                />
                <Menu 
                    model={menuItems} 
                    popup 
                    ref={menuRef} 
                    className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border border-gray-200 dark:border-gray-700"
                    appendTo={document.body}
                    autoZIndex
                    baseZIndex={2000}
                    scrollHeight={250}
                    breakpoint="767px"
                    pt={{
                        root: { className: 'dark:bg-gray-800 mobile-menu-dropdown' },
                        menu: { className: 'dark:bg-gray-800' },
                        menuitem: { className: 'dark:bg-gray-800' },
                        content: { className: 'dark:bg-gray-800' },
                        submenu: { className: 'dark:bg-gray-800' },
                        separator: { className: 'dark:border-gray-700' },
                        label: { className: 'dark:text-white' },
                        action: { className: 'dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200' },
                        icon: { className: 'dark:text-white' }
                    }}
                    style={{ 
                        maxWidth: isMobile ? 'calc(100vw - 30px)' : 'auto',
                        width: isMobile ? 'auto' : 'auto',
                        right: isMobile ? '0' : 'auto',
                        position: isMobile ? 'fixed' : 'absolute',
                        top: isMobile ? 'auto' : 'auto'
                    }}
                    popupAlignment="right"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-4 p-4">
                <div className="relative flex-shrink-0 w-full md:w-32 h-40 md:h-auto cursor-pointer" onClick={() => navigate(`/books/${borrowing.book.id}`)}>
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                        <img 
                            src={getBookImageUrl(borrowing.book.image)} 
                            alt={borrowing.book.title} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(e) => e.target.src = '/book-placeholder.png'}
                        />
                    </div>
                    <div className="absolute top-2 right-2">
                        <Tag 
                            value={statusInfo.label} 
                            severity={borrowing.status === 'active' ? (isOverdue ? 'warning' : 'success') : 
                                    borrowing.status === 'rejected' ? 'danger' : 'info'} 
                            icon={`pi ${statusInfo.icon}`} 
                            className="font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="cursor-pointer" onClick={() => navigate(`/books/${borrowing.book.id}`)}>
                        <h3 className="text-xl font-bold mb-1 text-gray-800 dark:text-gray-100 line-clamp-1">{borrowing.book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{borrowing.book.author}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 text-sm">
                        <div>
                            <div className="font-medium text-gray-500 dark:text-gray-400">{t('borrowings.borrow_date')}</div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">{formattedBorrowDate}</div>
                        </div>
                        <div>
                            <div className="font-medium text-gray-500 dark:text-gray-400">{t('borrowings.due_date')}</div>
                            <div className={`font-semibold ${isOverdue ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {formattedDueDate}
                            </div>
                        </div>
                        {borrowing.extend_count !== undefined && (
                            <div>
                                <div className="font-medium text-gray-500 dark:text-gray-400">{t('borrowings.extensions')}</div>
                                <div className="font-semibold text-gray-800 dark:text-gray-200">{borrowing.extend_count || 0}</div>
                            </div>
                        )}
                    </div>
                    
                    {borrowing.status === 'rejected' && borrowing.rejection_reason && (
                        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/10 rounded border-l-4 border-red-500 dark:border-red-700">
                            <div className="font-medium text-red-700 dark:text-red-400">{t('borrowings.rejection_reason')}:</div>
                            <div className="text-gray-700 dark:text-gray-300">{borrowing.rejection_reason}</div>
                        </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2">
                        {isActive && (
                            <>
                                <Button 
                                    icon="pi pi-calendar-plus" 
                                    label={t('borrowings.extend')}
                                    className="p-button-sm p-button-primary p-button-outlined transition-colors duration-200" 
                                    onClick={() => onExtend && onExtend(borrowing)}
                                    disabled={borrowing.extend_count >= 2}
                                    tooltip={borrowing.extend_count >= 2 ? t('borrowings.max_extensions_reached') : ''}
                                    tooltipOptions={{ position: 'top' }}
                                />
                                <Button 
                                    icon="pi pi-check-square" 
                                    label={t('borrowings.return')}
                                    className="p-button-sm p-button-success p-button-outlined transition-colors duration-200" 
                                    onClick={() => onReturn && onReturn(borrowing)}
                                />
                            </>
                        )}
                        
                        {isOverdue && (
                            <Button 
                                icon="pi pi-dollar" 
                                label={t('borrowings.view_fines')}
                                className="p-button-sm p-button-warning p-button-outlined transition-colors duration-200" 
                                onClick={() => onViewFines && onViewFines(borrowing)}
                            />
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default BorrowingCard