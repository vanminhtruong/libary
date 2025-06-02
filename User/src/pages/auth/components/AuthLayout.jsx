import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import ThemeSwitcher from '../../../components/common/ThemeSwitcher'
import LanguageSwitcher from '../../../components/common/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../../../constants/routes'

const AuthLayout = ({ children, title, subtitle, toastRef }) => {
    const { t } = useTranslation()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-black">
            <Toast ref={toastRef} baseZIndex={1000} position="top-right" />

            <div className="fixed top-4 right-4 flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>

            <div className="fixed top-4 left-4">
                <Button
                    label={t('common.home')}
                    icon="pi pi-home"
                    severity="secondary"
                    outlined
                    className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                    onClick={() => window.location.href = ROUTES.HOME}
                />
            </div>

            <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-800 dark:text-white">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-600 dark:text-white">
                        {subtitle}
                    </p>
                </div>

                {children}
            </Card>
        </div>
    )
}

export default AuthLayout