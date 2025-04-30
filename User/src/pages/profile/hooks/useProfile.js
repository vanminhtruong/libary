import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/auth.service';
import { API_CONFIG } from '../../../config/api.config';

const useProfile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        image: null,
        password: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadProfile();
        // Cleanup function to revoke object URL when component unmounts
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await authService.getProfile();
            // Reset image preview
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
            }
            setProfile(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                image: data.image || null
            }));
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('profile.load_error')
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size
            if (file.size > 2 * 1024 * 1024) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('validation.image_size')
                });
                event.target.value = '';
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp'];
            if (!allowedTypes.includes(file.type)) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('validation.image_format')
                });
                event.target.value = '';
                return;
            }

            // Revoke old preview URL if exists
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }

            // Create new preview URL
            const newPreviewUrl = URL.createObjectURL(file);
            setImagePreview(newPreviewUrl);
            setProfile(prev => ({
                ...prev,
                image: file
            }));
        }
    };

    const handleChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            
            if (profile.newPassword) {
                if (profile.newPassword !== profile.confirmPassword) {
                    toast.current.show({
                        severity: 'error',
                        summary: t('common.error'),
                        detail: t('validation.passwordsDoNotMatch')
                    });
                    return;
                }
                if (profile.newPassword.length < 6) {
                    toast.current.show({
                        severity: 'error',
                        summary: t('common.error'),
                        detail: t('validation.password_min')
                    });
                    return;
                }
            }

            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('phone', profile.phone);
            if (profile.image instanceof File) {
                formData.append('image', profile.image);
            }
            if (profile.password) {
                formData.append('current_password', profile.password);
            }
            if (profile.newPassword) {
                formData.append('new_password', profile.newPassword);
            }

            await authService.updateProfile(formData);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('profile.update_success')
            });
            
            setIsEditing(false);
            // Reset password fields and image preview
            setProfile(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmPassword: '',
                image: null // Reset image in profile state
            }));
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
            }
            
            // Reload profile to get updated data from server
            await loadProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('profile.update_error')
            });
        } finally {
            setLoading(false);
        }
    };

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('validation.password_required')
            });
            return;
        }

        try {
            setDeleteLoading(true);
            await authService.deleteAccount(deletePassword);
            
            // Clear form and close dialog
            setDeletePassword('');
            setShowDeleteDialog(false);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('profile.account_deleted')
            });
            
            // After a brief delay, redirect to login page
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error('Error deleting account:', error);
            let errorMessage = t('profile.delete_error');
            
            // Check for specific error message from the server
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMessage
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    return {
        toast,
        loading,
        isEditing,
        setIsEditing,
        profile,
        imagePreview,
        loadProfile,
        handleImageChange,
        handleChange,
        handleSubmit,
        showDeleteDialog,
        setShowDeleteDialog,
        deletePassword,
        setDeletePassword,
        deleteLoading,
        handleDeleteAccount
    };
};

export default useProfile;