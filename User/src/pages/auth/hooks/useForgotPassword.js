import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../../services/auth.service';
import { ROUTES } from '../../../constants/routes';

const useForgotPassword = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirmation: ''
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        setTouched(true);
        let hasError = false;

        // Email validation
        if (!formData.email) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.emailRequired'),
                life: 3000
            });
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('validation.email_invalid'),
                life: 3000
            });
            hasError = true;
        }

        // Password validation
        if (!formData.password) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.passwordRequired'),
                life: 3000
            });
            hasError = true;
        } else if (formData.password.length < 6) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.passwordMinLength'),
                life: 3000
            });
            hasError = true;
        }

        // Password confirmation validation
        if (formData.password !== formData.password_confirmation) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('validation.passwordsDoNotMatch'),
                life: 3000
            });
            hasError = true;
        }

        return !hasError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword(formData);

            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('auth.resetPasswordSuccess'),
                life: 3000
            });

            // Redirect to login page after successful password reset
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (error) {
            let errorMessage = '';
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else {
                errorMessage = t('auth.resetPasswordError');
            }

            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: errorMessage,
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        touched,
        toast,
        updateFormData,
        handleSubmit
    };
};

export default useForgotPassword;
