import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import authService from '../../services/auth.service'
import { ROUTES } from '../../constants/routes'
import FormInput from '../../components/common/FormInput'
import { useTranslation } from 'react-i18next'
import ThemeSwitcher from '../../components/common/ThemeSwitcher'
import LanguageSwitcher from '../../components/common/LanguageSwitcher'

const Login = () => {
    const navigate = useNavigate()
    const toast = useRef(null)
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [isSubmit, setIsSubmit] = useState(false);

    console.log("loginError: ", loginError)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched(true)
        // setLoginError(null)
        
        // Validate form
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

        if (hasError) {
            return;
        }
        
        setLoading(true)
        try {
            const response = await authService.login(formData)
            window.dispatchEvent(new Event('auth-change'))
            
            toast.current.show({
                severity: 'success',
                summary: t('common.success'),
                detail: response?.message || t('auth.loginSuccess'),
                life: 6000,
            })

            setTimeout(() => {
                navigate(ROUTES.HOME)
            }, 2000)

        } catch (error) {
            console.error("Login error:", error)
            
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
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast ref={toast} baseZIndex={1000} position="top-right" />
            
            <div className="fixed top-4 right-4 flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>

            <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-800 dark:text-white">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('common.login')}
                    </h1>
                    <p className="text-gray-600 dark:text-white">
                        {t('common.loginWelcome')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <FormInput
                        type="text"
                        name="email"
                        label={t('auth.email')}
                        value={formData.email}
                        onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                        required
                        disabled={loading}
                        icon="pi pi-envelope"
                        placeholder={t('auth.emailPlaceholder')}
                        touched={touched}
                        className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
                    />

                    <FormInput
                        type="password"
                        name="password"
                        label={t('auth.password')}
                        value={formData.password}
                        onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                        required
                        disabled={loading}
                        icon="pi pi-lock"
                        placeholder={t('auth.passwordPlaceholder')}
                        touched={touched}
                        className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
                    />

                    <Button 
                        type="submit" 
                        label={t('common.login')}
                        icon="pi pi-sign-in"
                        loading={loading}
                        severity="primary"
                        className="mt-4 py-3 px-4 w-full dark:text-white"
                    />

                    <div className="text-center mt-6">
                        <span className="text-gray-600 dark:text-white">
                            {t('auth.noAccount')}{' '}
                        </span>
                        <Link 
                            to={ROUTES.REGISTER} 
                            className="text-blue-600 hover:text-blue-700 dark:text-white hover:underline"
                        >
                            {t('auth.registerHere')}
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default Login