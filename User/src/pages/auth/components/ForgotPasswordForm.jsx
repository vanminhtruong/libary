import { Button } from 'primereact/button'
import FormInput from '../../../components/common/FormInput'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const ForgotPasswordForm = ({ formData, loading, touched, updateFormData, handleSubmit }) => {
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

            <FormInput
                type="password"
                name="password_confirmation"
                label={t('auth.confirmPassword')}
                value={formData.password_confirmation}
                onChange={(value) => updateFormData('password_confirmation', value)}
                required
                disabled={loading}
                icon="pi pi-lock"
                placeholder={t('auth.confirmPasswordPlaceholder')}
                touched={touched}
                className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
            />

            <Button
                type="submit"
                label={t('auth.resetPassword')}
                icon="pi pi-key"
                loading={loading}
                severity="primary"
                className="mt-4 py-3 px-4 w-full dark:text-white"
            />

            <div className="text-center mt-4">
                <Link to={ROUTES.LOGIN} className="text-blue-500 hover:underline dark:text-blue-400">
                    {t('auth.backToLogin')}
                </Link>
            </div>
        </form>
    )
}

export default ForgotPasswordForm
