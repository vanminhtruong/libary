import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';

const ProfileActions = ({ 
    isEditing,
    setIsEditing,
    loading,
    handleSubmit,
    handleChange
}) => {
    const { t } = useTranslation();

    const handleCancel = () => {
        setIsEditing(false);
        handleChange('password', '');
        handleChange('newPassword', '');
        handleChange('confirmPassword', '');
    };

    if (!isEditing) return null;

    return (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-4">
                <Button
                    label={t('common.cancel')}
                    icon="pi pi-times"
                    severity="secondary"
                    outlined
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2"
                />
                <Button
                    label={t('common.save')}
                    icon="pi pi-check"
                    onClick={handleSubmit}
                    loading={loading}
                    className="px-4 py-2"
                />
            </div>
        </div>
    );
};

export default ProfileActions; 