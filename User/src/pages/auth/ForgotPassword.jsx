import { useTranslation } from 'react-i18next'
import useForgotPassword from './hooks/useForgotPassword'
import AuthLayout from './components/AuthLayout'
import ForgotPasswordForm from './components/ForgotPasswordForm'

const ForgotPassword = () => {
    const { t } = useTranslation()
    const { 
        formData, 
        loading, 
        touched, 
        toast, 
        updateFormData, 
        handleSubmit 
    } = useForgotPassword()

    return (
        <AuthLayout 
            title={t('auth.forgotPasswordTitle')}
            subtitle={t('auth.forgotPasswordSubtitle')}
            toastRef={toast}
        >
            <ForgotPasswordForm 
                formData={formData}
                loading={loading}
                touched={touched}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
            />
        </AuthLayout>
    )
}

export default ForgotPassword
