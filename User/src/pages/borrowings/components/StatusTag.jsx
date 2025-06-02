import React from 'react';
import { Tag } from 'primereact/tag';
import { useTranslation } from 'react-i18next';

const StatusTag = ({ status, returnDate, visibleColumns, formatDate, getStatusSeverity }) => {
    const { t } = useTranslation();

    return (
        <div className="status-tag-container">
            <Tag
                value={t(`borrowings.status.${status}`)}
                severity={getStatusSeverity(status)}
                className="status-tag"
            />
            {!visibleColumns.return_date && returnDate && (
                <div className="mobile-return-date hidden sm:flex md:hidden">
                    <span className="date-label mr-1">{t('borrowings.return_date')}:</span>
                    {formatDate(returnDate)}
                </div>
            )}
        </div>
    );
};

export default StatusTag;
