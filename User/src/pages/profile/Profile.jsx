import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import FormInput from '../../components/common/FormInput'
import authService from '../../services/auth.service'
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'
import { API_CONFIG } from '../../config/api.config'

const Profile = () => {
    const { t } = useTranslation()
    const toast = useRef(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        image: null,
        password: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        loadProfile()
        // Cleanup function to revoke object URL when component unmounts
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const data = await authService.getProfile()
            console.log('Profile data:', data);
            console.log('Image path from backend:', data.image);
            // Reset image preview
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
                setImagePreview(null)
            }
            setProfile(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                image: data.image || null
            }))
        } catch (error) {
            console.error('Error loading profile:', error)
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('profile.load_error')
            })
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Check file size
            if (file.size > 2 * 1024 * 1024) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('validation.image_size')
                })
                event.target.value = ''
                return
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp']
            if (!allowedTypes.includes(file.type)) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('validation.image_format')
                })
                event.target.value = ''
                return
            }

            // Revoke old preview URL if exists
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }

            // Create new preview URL
            const newPreviewUrl = URL.createObjectURL(file)
            setImagePreview(newPreviewUrl)
            setProfile(prev => ({
                ...prev,
                image: file
            }))
        }
    }

    const handleChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            
            if (profile.newPassword) {
                if (profile.newPassword !== profile.confirmPassword) {
                    toast.current.show({
                        severity: 'error',
                        summary: t('common.error'),
                        detail: t('validation.passwordsDoNotMatch')
                    })
                    return
                }
                if (profile.newPassword.length < 6) {
                    toast.current.show({
                        severity: 'error',
                        summary: t('common.error'),
                        detail: t('validation.password_min')
                    })
                    return
                }
            }

            const formData = new FormData()
            formData.append('name', profile.name)
            formData.append('phone', profile.phone)
            if (profile.image instanceof File) {
                formData.append('image', profile.image)
            }
            if (profile.password) {
                formData.append('current_password', profile.password)
            }
            if (profile.newPassword) {
                formData.append('new_password', profile.newPassword)
            }

            await authService.updateProfile(formData)
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('profile.update_success')
            })
            
            setIsEditing(false)
            // Reset password fields and image preview
            setProfile(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmPassword: '',
                image: null // Reset image in profile state
            }))
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
                setImagePreview(null)
            }
            
            // Reload profile to get updated data from server
            await loadProfile()
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('profile.update_error')
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <Toast ref={toast} />
            <div className="max-w-5xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('common.profile')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('profile.manage_info')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Profile Overview Card */}
                    <div className="lg:col-span-4">
                        <Card className="shadow-lg border-0 dark:bg-gray-800 h-full">
                            <div className="flex flex-col items-center text-center h-full">
                                <div className="flex-1 flex flex-col items-center justify-center p-6">
                                    <div className="relative mb-6">
                                        {(imagePreview || profile.image) ? (
                                            <div className="w-32 h-32 rounded-full overflow-hidden relative">
                                                <img
                                                    src={imagePreview || (() => {
                                                        const imageUrl = `${API_CONFIG.BASE_URL}/user/profile/image/${profile.image.split('/').pop()}`;
                                                        console.log('Constructed image URL:', imageUrl);
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
                                            className="w-full p-button-outlined"
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
                    </div>

                    {/* Profile Details Card */}
                    <div className="lg:col-span-8">
                        <Card className="shadow-lg border-0 dark:bg-gray-800 h-full">
                            <div className="flex flex-col h-full">
                                <div className="p-6 flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                        {isEditing ? t('profile.edit_info') : t('profile.personal_info')}
                                    </h3>
                                    
                                    <div className="space-y-6">
                                        <FormInput
                                            label={t('auth.fullName')}
                                            value={profile.name}
                                            onChange={(value) => handleChange('name', value)}
                                            disabled={!isEditing}
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
                                            disabled={!isEditing}
                                            placeholder={t('auth.phonePlaceholder')}
                                        />

                                        {isEditing && (
                                            <>
                                                <Divider className="my-6" align="center">
                                                    <span className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                        <i className="pi pi-lock text-blue-500 dark:text-blue-400" />
                                                    </span>
                                                </Divider>
                                                
                                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                                                    <i className="pi pi-shield mr-2 text-blue-500 dark:text-blue-400" />
                                                    {t('profile.change_password')}
                                                </h4>
                                                
                                                <FormInput
                                                    label={t('profile.current_password')}
                                                    value={profile.password}
                                                    onChange={(value) => handleChange('password', value)}
                                                    type="password"
                                                    placeholder={t('profile.current_password_placeholder')}
                                                />

                                                <FormInput
                                                    label={t('profile.new_password')}
                                                    value={profile.newPassword}
                                                    onChange={(value) => handleChange('newPassword', value)}
                                                    type="password"
                                                    placeholder={t('profile.new_password_placeholder')}
                                                />

                                                <FormInput
                                                    label={t('profile.confirm_password')}
                                                    value={profile.confirmPassword}
                                                    onChange={(value) => handleChange('confirmPassword', value)}
                                                    type="password"
                                                    placeholder={t('profile.confirm_password_placeholder')}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-end gap-4">
                                            <Button
                                                label={t('common.cancel')}
                                                icon="pi pi-times"
                                                severity="secondary"
                                                outlined
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    setProfile(prev => ({
                                                        ...prev,
                                                        password: '',
                                                        newPassword: '',
                                                        confirmPassword: ''
                                                    }))
                                                }}
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
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile 