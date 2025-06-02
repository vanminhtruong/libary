import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import FormInput from '../../../components/common/FormInput';

const ProfileInfo = ({ 
    profile, 
    isEditing, 
    handleChange,
    setIsEditing,
    loading,
    handleSubmit
}) => {
    const { t } = useTranslation();

    const handleCancel = () => {
        setIsEditing(false);
        handleChange('password', '');
        handleChange('newPassword', '');
        handleChange('confirmPassword', '');
    };

    return (
        <Card className="shadow-lg border-0 dark:bg-gray-800 backdrop-blur-sm h-full">
            <div className="flex flex-col h-full">
                <div className="p-6 flex-1">
                    {isEditing ? (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t('profile.edit_info')}
                            </h3>
                        </div>
                    ) : (
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('profile.personal_info')}
                        </h3>
                    )}
                    
                    <div className="space-y-6">
                        {isEditing && (
                            <Card className="shadow-lg border-0 overflow-hidden dark:bg-gray-700/90 rounded-xl mb-8">
                                <div className="p-6 relative">
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-800 to-black"></div>
                                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                        {t('profile.personal_info')}
                                    </h4>
                                    
                                    <div className="space-y-5">
                                        <FormInput
                                            label={t('auth.fullName')}
                                            value={profile.name}
                                            onChange={(value) => handleChange('name', value)}
                                            required
                                            className="dark:bg-gray-600/60 dark:border-gray-500/50 focus:dark:border-gray-900"
                                        />
                                        
                                        <FormInput
                                            label={t('auth.email')}
                                            value={profile.email}
                                            disabled={true}
                                            type="email"
                                            className="dark:bg-gray-600/60 dark:border-gray-500/50"
                                        />

                                        <FormInput
                                            label={t('auth.phone')}
                                            value={profile.phone}
                                            onChange={(value) => handleChange('phone', value)}
                                            placeholder={t('auth.phonePlaceholder')}
                                            className="dark:bg-gray-600/60 dark:border-gray-500/50 focus:dark:border-gray-900"
                                        />
                                    </div>
                                </div>
                            </Card>
                        )}

                        {!isEditing && (
                            <>
                                <FormInput
                                    label={t('auth.fullName')}
                                    value={profile.name}
                                    onChange={(value) => handleChange('name', value)}
                                    disabled={true}
                                    required
                                />
                                
                                <FormInput
                                    label={t('auth.email')}
                                    value={profile.email}
                                    disabled={true}
                                    type="email"
                                />

                                <FormInput
                                    label={t('auth.phone')}
                                    value={profile.phone}
                                    onChange={(value) => handleChange('phone', value)}
                                    disabled={true}
                                    placeholder={t('auth.phonePlaceholder')}
                                />
                            </>
                        )}

                        {isEditing && (
                            <div className="mt-6">
                                <Card className="shadow-xl border-0 overflow-hidden dark:bg-gray-700/90 rounded-xl p-0">
                                    <div className="p-6 relative">
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-800 to-black"></div>
                                        <div className="flex flex-col items-center justify-center mb-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg mb-4">
                                                <i className="pi pi-lock text-white text-2xl" />
                                            </div>
                                            <h4 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                                                {t('profile.change_password')}
                                            </h4>
                                        </div>
                                        
                                        <div className="space-y-5">
                                            <FormInput
                                                label={t('profile.current_password')}
                                                value={profile.password}
                                                onChange={(value) => handleChange('password', value)}
                                                type="password"
                                                placeholder={t('profile.current_password_placeholder')}
                                                className="dark:bg-gray-600/60 dark:border-gray-500/50 focus:dark:border-gray-900"
                                            />

                                            <FormInput
                                                label={t('profile.new_password')}
                                                value={profile.newPassword}
                                                onChange={(value) => handleChange('newPassword', value)}
                                                type="password"
                                                placeholder={t('profile.new_password_placeholder')}
                                                className="dark:bg-gray-600/60 dark:border-gray-500/50 focus:dark:border-gray-900"
                                            />

                                            <FormInput
                                                label={t('profile.confirm_password')}
                                                value={profile.confirmPassword}
                                                onChange={(value) => handleChange('confirmPassword', value)}
                                                type="password"
                                                placeholder={t('profile.confirm_password_placeholder')}
                                                className="dark:bg-gray-600/60 dark:border-gray-500/50 focus:dark:border-gray-900"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end gap-4 p-5 dark:bg-gray-700/90 border-t border-gray-600/20">
                                        <Button
                                            label={t('common.cancel')}
                                            icon="pi pi-times"
                                            severity="secondary"
                                            outlined
                                            onClick={handleCancel}
                                            disabled={loading}
                                            className="px-4 py-2 dark:bg-transparent dark:text-gray-300 dark:border-gray-500/50 dark:hover:bg-gray-600/50"
                                        />
                                        <Button
                                            label={t('common.save')}
                                            icon="pi pi-check"
                                            onClick={handleSubmit}
                                            loading={loading}
                                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white py-2 px-4
                                                      shadow-md rounded-md transition-colors duration-200 flex items-center gap-2
                                                      dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-800 dark:hover:border-blue-800"
                                        />
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileInfo; 