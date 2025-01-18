import { useState } from 'react'
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

const Register = () => {
    const navigate = useNavigate()
    const toast = useRef(null)
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const validateForm = () => {
        if (formData.password !== formData.password_confirmation) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: t('validation.passwordsDoNotMatch'),
                life: 3000
            })
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched(true)

        if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
            return
        }

        if (!validateForm()) return

        setLoading(true)
        try {
            await authService.register(formData)
            
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: t('auth.registrationSuccessful'),
                life: 3000
            })

            setTimeout(() => {
                navigate(ROUTES.LOGIN)
            }, 2000)

        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || t('auth.registrationFailed'),
                life: 3000
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast ref={toast} />
            
            <div className="fixed top-4 right-4 flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>

            <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-800">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('common.register')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('common.registerWelcome')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <FormInput
                        type="text"
                        name="name"
                        label={t('auth.fullName')}
                        value={formData.name}
                        onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                        required
                        disabled={loading}
                        icon="pi pi-user"
                        placeholder={t('auth.fullNamePlaceholder')}
                        touched={touched}
                        className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
                    />

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

                    <FormInput
                        type="password"
                        name="password_confirmation"
                        label={t('auth.confirmPassword')}
                        value={formData.password_confirmation}
                        onChange={(value) => setFormData(prev => ({ ...prev, password_confirmation: value }))}
                        required
                        disabled={loading}
                        icon="pi pi-lock"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        touched={touched}
                        className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
                    />

                    <Button 
                        type="submit" 
                        label={t('common.register')}
                        icon="pi pi-user-plus"
                        loading={loading}
                        severity="primary"
                        className="mt-4 py-3 px-4 w-full dark:text-white"
                    />

                    <div className="text-center mt-6">
                        <span className="text-gray-600 dark:text-gray-400">
                            {t('auth.haveAccount')}{' '}
                        </span>
                        <Link 
                            to={ROUTES.LOGIN} 
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                        >
                            {t('auth.loginHere')}
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    )
}

export default Register 