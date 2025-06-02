import React from 'react';
import { useTranslation } from 'react-i18next';

const BookInfo = ({ book, borrowDate, dueDate, visibleColumns, formatDate, getBookImageUrl }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-2">
            <div className="book-image-container">
                <img
                    src={getBookImageUrl(book?.image)}
                    alt={book?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/default-book-cover.jpg'}
                />
            </div>
            <div className="book-info-container">
                <div className="book-title">{book?.title || t('common.unknown')}</div>
                <div className="book-author">{book?.author || '-'}</div>
                
                {/* Show dates on mobile when columns are hidden */}
                <div className="mobile-date-info">
                    <div className="flex items-center gap-1">
                        <span className="date-label">{t('borrowings.borrow_date')}:</span> 
                        <span>{formatDate(borrowDate)}</span>
                    </div>
                    {!visibleColumns.due_date && (
                        <div className="due-date-info flex items-center gap-1">
                            <span className="date-label">{t('borrowings.due_date')}:</span> 
                            <span>{formatDate(dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookInfo;
