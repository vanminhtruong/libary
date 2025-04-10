import { useTranslation } from 'react-i18next'
import useRegister from './hooks/useRegister'
import AuthLayout from './components/AuthLayout'
import RegisterForm from './components/RegisterForm'

const Register = () => {
    const { t } = useTranslation()
    const { 
        formData, 
        loading, 
        touched, 
        toast, 
        updateFormData, 
        handleSubmit 
    } = useRegister()

    return (
        <AuthLayout 
            title={t('common.register')}
            subtitle={t('common.registerWelcome')}
            toastRef={toast}
        >
            <RegisterForm 
                formData={formData}
                loading={loading}
                touched={touched}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
            />
        </AuthLayout>
    )
}

export default Register 