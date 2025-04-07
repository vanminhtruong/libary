import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import FormInput from '../../components/common/FormInput'
import { useTranslation } from 'react-i18next'
import ThemeSwitcher from '../../components/common/ThemeSwitcher'
import LanguageSwitcher from '../../components/common/LanguageSwitcher'
import useLogin from './hooks/useLogin'

const Login = () => {
    const { t } = useTranslation()
    const { 
        formData, 
        loading, 
        touched, 
        loginError, 
        toast, 
        updateFormData, 
        handleSubmit 
    } = useLogin()

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
                        onChange={(value) => updateFormData('email', value)}
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
                        onChange={(value) => updateFormData('password', value)}
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