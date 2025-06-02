import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/routes';

const EmptyState = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="text-center py-6 bg-white dark:bg-gray-800 w-full dark:text-white">
            <i className="pi pi-history text-5xl text-gray-300 dark:text-gray-500 mb-4"></i>
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">{t('borrowings.no_history')}</p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('borrowings.no_history_description')}</p>
            <Button
                label={t('borrowings.browse_books')}
                icon="pi pi-book"
                onClick={() => navigate(ROUTES.BOOKS)}
                className="p-button-outlined dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            />
        </div>
    );
};

export default EmptyState;
