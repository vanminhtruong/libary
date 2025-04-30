import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import ProfileCard from './components/ProfileCard';
import ProfileInfo from './components/ProfileInfo';
import useProfile from './hooks/useProfile';

const Profile = () => {
    const { t } = useTranslation();
    const {
        toast,
        loading,
        isEditing,
        setIsEditing,
        profile,
        imagePreview,
        handleImageChange,
        handleChange,
        handleSubmit,
        showDeleteDialog,
        setShowDeleteDialog,
        deletePassword,
        setDeletePassword,
        deleteLoading,
        handleDeleteAccount
    } = useProfile();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <Toast ref={toast} />
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('common.profile')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('profile.manage_info')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <ProfileCard 
                            profile={profile}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            loading={loading}
                            imagePreview={imagePreview}
                            handleImageChange={handleImageChange}
                            showDeleteDialog={showDeleteDialog}
                            setShowDeleteDialog={setShowDeleteDialog}
                            deletePassword={deletePassword}
                            setDeletePassword={setDeletePassword}
                            deleteLoading={deleteLoading}
                            handleDeleteAccount={handleDeleteAccount}
                        />
                    </div>

                    <div className="lg:col-span-8">
                        <ProfileInfo 
                            profile={profile}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                                                loading={loading}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                                            />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 