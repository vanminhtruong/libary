import { Button } from 'primereact/button'
import FormInput from '../../../components/common/FormInput'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const LoginForm = ({ formData, loading, touched, updateFormData, handleSubmit }) => {
    const { t } = useTranslation()

    return (
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
    )
}

export default LoginForm 