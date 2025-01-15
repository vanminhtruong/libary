import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import authService from '../services/auth.service'
import { ROUTES } from '../constants/routes'
import FormInput from '../components/common/FormInput'
import { useTranslation } from 'react-i18next'

const Login = () => {
    const navigate = useNavigate()
    const toast = useRef(null)
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setTouched(true)
        
        if (!formData.email || !formData.password) {
            return
        }
        
        setLoading(true)
        try {
            const response = await authService.login(formData)
            
            toast.current.show({
                severity: 'success',
                summary: 'Thông báo',
                detail: response.message || 'Đăng nhập thành công',
                life: 3000
            })

            navigate(ROUTES.HOME)
        } catch (error) {
            let errorMessage = 'Đăng nhập thất bại'
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message === 'Invalid response format') {
                errorMessage = 'Lỗi kết nối với máy chủ'
            }
            
            toast.current.show({
                severity: 'error',
                summary: 'Thông báo',
                detail: errorMessage,
                life: 3000
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast ref={toast} />
            <Card className="w-full max-w-md shadow-lg border-0">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('common.login')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
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
                    />

                    <Button 
                        type="submit" 
                        label={t('common.login')}
                        icon="pi pi-sign-in"
                        loading={loading}
                        severity="primary"
                        className="mt-4 py-3 px-4 w-full"
                    />

                    <div className="text-center mt-6">
                        <span className="text-gray-600 dark:text-gray-400">
                            {t('auth.noAccount')}{' '}
                        </span>
                        <Link 
                            to={ROUTES.REGISTER} 
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
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