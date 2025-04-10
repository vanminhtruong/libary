import { useTranslation } from 'react-i18next'
import useLogin from './hooks/useLogin'
import AuthLayout from './components/AuthLayout'
import LoginForm from './components/LoginForm'

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
        <AuthLayout 
            title={t('common.login')}
            subtitle={t('common.loginWelcome')}
            toastRef={toast}
        >
            <LoginForm 
                formData={formData}
                loading={loading}
                touched={touched}
                updateFormData={updateFormData}
                handleSubmit={handleSubmit}
            />
        </AuthLayout>
    )
}

export default Login