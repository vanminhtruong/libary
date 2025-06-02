import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/routes';

const TableHeader = ({ onRefresh }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="borrowing-history-header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <h2 className="text-xl font-bold m-0">{t('borrowings.borrowing_history')}</h2>
            <div className="header-actions flex gap-2 self-start sm:self-auto">
                <Button
                    icon="pi pi-refresh"
                    rounded
                    outlined
                    onClick={onRefresh}
                    tooltip={t('common.refresh')}
                    tooltipOptions={{ position: 'top' }}
                    className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                />
                <Button
                    icon="pi pi-book"
                    rounded
                    outlined
                    onClick={() => navigate(ROUTES.BOOKS)}
                    tooltip={t('borrowings.browse_books')}
                    tooltipOptions={{ position: 'top' }}
                    className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                />
            </div>
        </div>
    );
};

export default TableHeader;
