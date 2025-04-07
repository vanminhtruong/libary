import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../../services/auth.service';
import { ROUTES } from '../../../constants/routes';

const useLogin = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        setTouched(true);
        let hasError = false;
        
        if (!formData.email) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.emailRequired'),
                life: 6000,
            });
            hasError = true;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.emailInvalid'),
                life: 6000,
            });
            hasError = true;
        }

        if (!formData.password) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.passwordRequired'),
                life: 6000,
            });
            hasError = true;
        } else if (formData.password.length < 6) {
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: t('auth.passwordMinLength'),
                life: 6000,
            });
            hasError = true;
        }

        return !hasError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError(null);
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            const response = await authService.login(formData);
            window.dispatchEvent(new Event('auth-change'));
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response?.message || t('auth.loginSuccess'),
                life: 6000,
            });

            setTimeout(() => {
                navigate(ROUTES.HOME);
            }, 2000);

        } catch (error) {
            console.error("Login error:", error);
            
            // Đảm bảo luôn có message để hiển thị
            let errorMessage;
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else {
                errorMessage = t('auth.invalidCredentials');
            }
            
            setLoginError(errorMessage);
            
            // Hiển thị toast lỗi
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: errorMessage,
                    life: 6000,
                    sticky: true
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        touched,
        loginError,
        toast,
        updateFormData,
        handleSubmit
    };
};

export default useLogin; 