import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../constants/routes';

const ActionButtons = ({ bookId }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="flex gap-2 justify-center">
            <Button
                icon="pi pi-eye"
                rounded
                text
                severity="info"
                onClick={() => navigate(`${ROUTES.BOOKS}/${bookId}`)}
                tooltip={t('common.view_details')}
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );
};

export default ActionButtons;
