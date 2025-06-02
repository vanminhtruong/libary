import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import { API_CONFIG } from '../../../config/api.config';

const ProfileCard = ({
    profile,
    isEditing,
    setIsEditing,
    loading,
    imagePreview,
    handleImageChange,
    showDeleteDialog,
    setShowDeleteDialog,
    deletePassword,
    setDeletePassword,
    deleteLoading,
    handleDeleteAccount
}) => {
    const { t } = useTranslation();

    // Prevent scrolling when dialog is open
    useEffect(() => {
        if (showDeleteDialog) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        // Cleanup function
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showDeleteDialog]);

    const renderProfileImage = () => {
        if (imagePreview || profile.image) {
            return (
                <div className="w-32 h-32 rounded-full overflow-hidden relative">
                    <img
                        src={imagePreview || `${API_CONFIG.BASE_URL}/user/profile/image/${profile.image.split('/').pop()}`}
                        alt="Profile"
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </div>
            );
        } else {
            return (
                <Avatar
                    label={profile.name[0]?.toUpperCase()}
                    size="xlarge"
                    shape="circle"
                    className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white text-3xl w-32 h-32 shadow-lg"
                />
            );
        }
    };

    const renderImageUploadButton = () => {
        if (!isEditing) return null;
        
        return (
            <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            >
                <i className="pi pi-camera text-gray-900 dark:text-gray-300" />
                <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </label>
        );
    };

    const renderDialogFooter = () => {
        return (
            <div className="flex items-center justify-between gap-4 bg-gray-100 dark:bg-gray-800  border-t border-gray-200 dark:border-gray-700 w-full">
                <div className="w-1/4"></div> {/* Spacer for balance */}
                <div className="flex items-center justify-end gap-4 w-3/4">
                    <Button 
                        label={t('common.cancel')} 
                        icon="pi pi-times" 
                        onClick={() => {
                            setShowDeleteDialog(false);
                            setDeletePassword('');
                        }} 
                        className="p-button-text dark:text-gray-300 dark:hover:bg-gray-700 px-6 py-3 text-base" 
                        disabled={deleteLoading}
                    />
                    <Button 
                        label={t('profile.confirm_delete')} 
                        icon="pi pi-trash" 
                        onClick={handleDeleteAccount} 
                        severity="danger" 
                        className="font-bold bg-red-600 hover:bg-red-700 border-red-600 px-6 py-3 text-base mt-3 mb-3 mr-3 text-white"
                        loading={deleteLoading}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <Card className="shadow-lg border-0 dark:bg-gray-800 h-full">
                <div className="flex flex-col items-center text-center h-full">
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                        <div className="relative mb-6">
                            {renderProfileImage()}
                            {renderImageUploadButton()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {profile.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {profile.email}
                        </p>
                    </div>
                    <div className="w-full p-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-3">
                            {!isEditing ? (
                                <Button
                                    label={t('common.edit')}
                                    icon="pi pi-user-edit"
                                    severity="primary"
                                    outlined
                                    className="w-full py-2 px-4 font-medium dark:text-white dark:border-white dark:hover:bg-gray-800"
                                    onClick={() => setIsEditing(true)}
                                    disabled={loading}
                                />
                            ) : (
                                <div className="bg-gray-100 dark:bg-gray-900/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-900 dark:text-gray-300">
                                        <i className="pi pi-info-circle mr-2" />
                                        {t('profile.edit_mode_active')}
                                    </p>
                                </div>
                            )}
                            
                            {!isEditing && (
                                <Button
                                    label={t('profile.delete_account')}
                                    icon="pi pi-trash"
                                    severity="danger"
                                    className="w-full py-2 px-4 font-bold mt-3 text-white bg-red-600 hover:bg-red-700 border-red-600"
                                    onClick={() => setShowDeleteDialog(true)}
                                    disabled={loading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>
            
            <Dialog 
                header={t('profile.delete_account')} 
                visible={showDeleteDialog} 
                style={{ width: '90%', maxWidth: '550px', borderRadius: '12px', overflow: 'hidden' }} 
                className="delete-account-dialog shadow-lg"
                contentClassName="dark:bg-gray-800"
                headerClassName="dark:bg-gray-800 dark:text-white text-xl font-bold py-5 px-8 border-b border-gray-200 dark:border-gray-700"
                showHeader={true}
                dismissableMask={false}
                draggable={false}
                resizable={false}
                closeOnEscape={true}
                onHide={() => {
                    setShowDeleteDialog(false);
                    setDeletePassword('');
                }}
                footer={renderDialogFooter()}
                pt={{
                    root: { className: 'dark:bg-gray-800 rounded-lg' },
                    content: { className: 'dark:bg-gray-800 p-0' },
                    footer: { className: 'dark:bg-gray-800 p-0' }
                }}
            >
                <div className="p-8 dark:bg-gray-800 dark:text-white">
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-5 mb-8 border border-red-200 dark:border-red-800 flex items-start">
                        <i className="pi pi-exclamation-triangle text-red-600 dark:text-red-400 mr-3 text-xl mt-0.5" />
                        <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">
                            {t('profile.delete_warning')}
                        </p>
                    </div>
                    
                    <label className="block text-gray-700 dark:text-gray-300 mb-4 font-medium text-base">
                        {t('profile.enter_password_to_confirm')}
                    </label>
                    
                    <Password 
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        toggleMask
                        feedback={false}
                        placeholder={t('common.password')}
                        className="w-full dark-password-input"
                        inputClassName="dark:bg-gray-700 dark:text-white dark:border-gray-600 p-3 text-base rounded-md"
                        disabled={deleteLoading}
                    />
                </div>
            </Dialog>
        </>
    );
};

export default ProfileCard;