import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { API_CONFIG } from '../../../config/api.config';

const ProfileCard = ({
    profile,
    isEditing,
    setIsEditing,
    loading,
    imagePreview,
    handleImageChange
}) => {
    const { t } = useTranslation();

    return (
        <Card className="shadow-lg border-0 dark:bg-gray-800 h-full">
            <div className="flex flex-col items-center text-center h-full">
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="relative mb-6">
                        {(imagePreview || profile.image) ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden relative">
                                <img
                                    src={imagePreview || (() => {
                                        const imageUrl = `${API_CONFIG.BASE_URL}/user/profile/image/${profile.image.split('/').pop()}`;
                                        return imageUrl;
                                    })()}
                                    alt="Profile"
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            </div>
                        ) : (
                            <Avatar
                                label={profile.name[0]?.toUpperCase()}
                                size="xlarge"
                                shape="circle"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white text-3xl w-32 h-32 shadow-lg"
                            />
                        )}
                        {isEditing && (
                            <label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                            >
                                <i className="pi pi-camera text-blue-500 dark:text-blue-400" />
                                <input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {profile.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {profile.email}
                    </p>
                </div>
                <div className="w-full p-6 border-t border-gray-200 dark:border-gray-700">
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
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                <i className="pi pi-info-circle mr-2" />
                                {t('profile.edit_mode_active')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ProfileCard;