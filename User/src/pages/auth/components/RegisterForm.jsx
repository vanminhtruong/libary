import { Button } from 'primereact/button'
import FormInput from '../../../components/common/FormInput'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'

const RegisterForm = ({ formData, loading, touched, updateFormData, handleSubmit }) => {
    const { t } = useTranslation()

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <FormInput
                type="text"
                name="name"
                label={t('auth.fullName')}
                value={formData.name}
                onChange={(value) => updateFormData('name', value)}
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
                onChange={(value) => updateFormData('email', value)}
                required
                disabled={loading}
                icon="pi pi-envelope"
                placeholder={t('auth.emailPlaceholder')}
                touched={touched}
                className="dark:text-white [&_.p-inputtext]:dark:text-white [&_label]:dark:text-white [&_i]:dark:text-white"
            />

            <FormInput
                type="text"
                name="phone"
                label={t('auth.phone')}
                value={formData.phone}
                onChange={(value) => updateFormData('phone', value)}
                disabled={loading}
                icon="pi pi-phone"
                placeholder={t('auth.phonePlaceholder')}
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
    )
}

export default RegisterForm