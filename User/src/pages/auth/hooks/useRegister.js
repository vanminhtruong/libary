import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../../services/auth.service';
import { ROUTES } from '../../../constants/routes';

const useRegister = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
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
        
        if (!formData.name) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('validation.required'),
                life: 3000
            });
            hasError = true;
        }
        
        if (!formData.email) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.emailRequired'),
                life: 3000
            });
            hasError = true;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.emailInvalid'),
                life: 3000
            });
            hasError = true;
        }
        
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
            await authService.register(formData);
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: t('auth.registrationSuccessful'),
                life: 3000
            });
            
            // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
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
                errorMessage = t('auth.registrationFailed');
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

export default useRegister; 