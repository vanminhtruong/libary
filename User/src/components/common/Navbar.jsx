import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { ROUTES } from '../../constants/routes'
import authService from '../../services/auth.service'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Avatar } from 'primereact/avatar'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import { API_CONFIG } from '../../config/api.config'
import { Skeleton } from 'primereact/skeleton'
import { Toast } from 'primereact/toast'
import './DialogStyles.css'

const Navbar = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const menuRef = useRef(null)
    const toast = useRef(null)
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark')
        setDarkMode(isDarkMode)

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.documentElement.classList.contains('dark')
                    setDarkMode(isDarkMode)
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true)
            if (authService.isAuthenticated()) {
                try {
                    const userData = await authService.getCurrentUser()
                    setUser(userData)
                } catch (error) {
                    console.error('Error fetching user:', error)
                }
            }
            setIsLoading(false)
        }
        fetchUser()

        // Listen for auth changes to update user info
        const handleAuthChange = () => {
            if (!authService.isAuthenticated()) {
                setUser(null)
            } else {
                fetchUser()
            }
        }
        window.addEventListener('auth-change', handleAuthChange)
        return () => window.removeEventListener('auth-change', handleAuthChange)
    }, [])

    const start = (
        <div className="flex items-center gap-2 cursor-pointer navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
            <i className="pi pi-book text-2xl text-primary dark:text-blue-400"></i>
            <span className="text-xl font-bold dark:text-white truncate">{t('common.app_name')}</span>
        </div>
    )

    const items = [
        {
            label: t('common.home'),
            icon: 'pi pi-home',
            className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
            command: () => navigate(ROUTES.HOME)
        },
        {
            label: t('common.books'),
            icon: 'pi pi-book',
            className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
            items: [
                {
                    label: t('common.all_books'),
                    icon: 'pi pi-list',
                    className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
                    command: () => navigate(ROUTES.BOOKS)
                },
            ]
        },
        {
            label: t('borrowings.current_borrowings'),
            icon: 'pi pi-bookmark',
            className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
            command: () => navigate(ROUTES.CURRENT_BORROWINGS)
        }
    ]

    const handleLogout = () => {
        toast.current.show({
            severity: 'warn',
            sticky: true,
            className: 'logout-confirmation-toast',
            position: 'center',
            content: (
                <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg w-80">
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-amber-600/20 dark:bg-amber-600/20 p-2 rounded-full">
                                <i className="pi pi-exclamation-triangle text-amber-600 text-xl"></i>
                            </div>
                            <h3 className="font-bold text-gray-800 dark:text-white">{t('auth.logout_header')}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {t('auth.logout_confirm')}
                        </p>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-end gap-2">
                        <Button
                            label={t('common.cancel')}
                            size="small"
                            className="p-button-text text-gray-700 dark:text-gray-300 px-3 py-2"
                            onClick={() => toast.current.clear()}
                        />
                        <Button
                            label={t('common.confirm')}
                            size="small"
                            severity="primary"
                            className={darkMode ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white px-3 py-2' : 'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white px-3 py-2'}
                            onClick={async () => {
                                try {
                                    await authService.logout()
                                    toast.current.clear();
                                    toast.current.show({
                                        severity: 'success',
                                        summary: t('common.success'),
                                        detail: t('auth.logout_success'),
                                        life: 3000
                                    })
                                    setTimeout(() => {
                                        navigate(ROUTES.LOGIN)
                                    }, 1000)
                                } catch (error) {
                                    console.error('Logout error:', error)
                                    toast.current.show({
                                        severity: 'error',
                                        summary: t('common.error'),
                                        detail: t('auth.logout_error'),
                                        life: 3000
                                    })
                                }
                            }}
                        />
                    </div>
                </div>
            )
        });
    }

    const userMenuItems = [
        {
            template: () => (
                <div className="px-3 py-2">
                    <div className="flex items-center gap-3 mb-2">
                        {user?.image ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                <img
                                    src={`${API_CONFIG.BASE_URL}/user/profile/image/${user.image.split('/').pop()}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            </div>
                        ) : (
                            <Avatar
                                label={user?.email[0].toUpperCase()}
                                size="large"
                                shape="circle"
                                className="bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                            />
                        )}
                        <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">
                                {user?.name || 'User'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        { separator: true },
        {
            label: t('common.profile'),
            icon: 'pi pi-user',
            className: 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200',
            command: () => navigate(ROUTES.PROFILE)
        },
        {
            label: t('borrowings.borrowing_history'),
            icon: 'pi pi-history',
            className: 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200',
            command: () => navigate(ROUTES.BORROWING_HISTORY)
        },
        {
            label: t('common.logout'),
            icon: 'pi pi-power-off',
            className: 'text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200',
            command: handleLogout
        }
    ]

    const end = (
        <div className="flex gap-2 items-center navbar-end">
            {/* Hide language switcher on very small screens */}
            <div className="hidden sm:block">
                <LanguageSwitcher />
            </div>
            <ThemeSwitcher />
            {isLoading ? (
                <div className="relative">
                    <div className="flex items-center gap-2 px-2 py-1">
                        <Skeleton shape="circle" size="2rem" className="bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            ) : (
                <>
                    {user ? (
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200"
                                onClick={(e) => menuRef.current.toggle(e)}
                            >
                                {user?.image ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                        <img
                                            src={`${API_CONFIG.BASE_URL}/user/profile/image/${user.image.split('/').pop()}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover absolute inset-0"
                                        />
                                    </div>
                                ) : (
                                    <Avatar
                                        label={user.email[0].toUpperCase()}
                                        size="normal"
                                        shape="circle"
                                        className="bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                                    />
                                )}
                                <i className="pi pi-angle-down text-gray-600 dark:text-gray-200 hidden sm:block" />
                            </button>
                            <Menu
                                model={userMenuItems}
                                popup
                                ref={menuRef}
                                className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border border-gray-200 dark:border-gray-700"
                                pt={{
                                    root: { className: 'dark:bg-gray-800' },
                                    menu: { className: 'dark:bg-gray-800' },
                                    menuitem: { className: 'dark:bg-gray-800' },
                                    content: { className: 'dark:bg-gray-800' },
                                    submenu: { className: 'dark:bg-gray-800' },
                                    separator: { className: 'dark:border-gray-700' },
                                    label: { className: 'dark:text-white' },
                                    action: { className: 'dark:text-white hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200' },
                                    icon: { className: 'dark:text-white' }
                                }}
                                style={{ minWidth: '280px' }}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-1 sm:gap-2 dark:text-white auth-buttons">
                            <Button
                                label={t('common.login')}
                                icon="pi pi-sign-in"
                                severity="primary"
                                text
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="login-btn"
                            />
                            <Button
                                label={t('common.register')}
                                icon="pi pi-user-plus"
                                severity="primary"
                                outlined
                                onClick={() => navigate(ROUTES.REGISTER)}
                                className="register-btn"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )

    return (
        <header className="shadow-md bg-white dark:bg-gray-800 sticky top-0 z-50 transition-colors duration-200">
            <Toast ref={toast} pt={{
                root: { className: 'dark:bg-transparent' },
                message: { className: 'dark:bg-transparent' },
                container: { className: 'dark:bg-transparent dark:border-0' },
                content: { className: 'dark:bg-transparent p-0' },
                summary: { className: 'dark:text-white' },
                detail: { className: 'dark:text-gray-300' },
                icon: { className: 'dark:text-white' },
                buttonIcon: { className: 'dark:text-gray-400 dark:hover:text-white' },
                button: { className: 'dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700' }
            }} />
            <div className="container mx-auto px-4">
                <Menubar
                    model={items}
                    start={start}
                    end={end}
                    pt={{
                        root: { className: 'border-none p-0 dark:bg-gray-800 responsive-menubar' },
                        menuitem: { className: 'dark:bg-gray-800' },
                        menu: { className: 'dark:bg-gray-800' },
                        submenu: { className: 'dark:bg-gray-800 dark:border-gray-700' },
                        button: { className: 'dark:text-white mobile-menu-button dark:hover:!bg-gray-700' },
                        label: { className: 'dark:text-white' },
                        icon: { className: 'dark:text-white' },
                        action: { className: 'dark:text-white hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200' }
                    }}
                    className="border-none !p-0 dark:bg-gray-800 responsive-navbar
                        [&_.p-menuitem-link]:dark:bg-gray-800
                        [&_.p-menuitem-link:hover]:dark:!bg-gray-700
                        [&_.p-menuitem-link:focus]:dark:bg-gray-800
                        [&_.p-menuitem-link.p-menuitem-link-active]:dark:bg-gray-700

                        [&_.p-submenu-list]:dark:bg-gray-800
                        [&_.p-submenu-list]:dark:border-gray-700
                        [&_.p-submenu-list_.p-menuitem]:dark:bg-gray-800
                        [&_.p-submenu-list_.p-menuitem-link]:dark:bg-gray-800
                        [&_.p-submenu-list_.p-menuitem-link:hover]:dark:!bg-gray-700
                        [&_.p-submenu-list_.p-menuitem-link:focus]:dark:bg-gray-800

                        [&_.p-menuitem-text]:dark:text-white
                        [&_.p-menuitem-icon]:dark:text-white

                        [&_.p-menubar-root-list]:dark:bg-gray-800
                        [&_.p-menubar-button]:dark:text-white
                        [&_.p-menubar-button:hover]:dark:!bg-gray-700
                        [&_.p-menubar-root-list>.p-menuitem]:dark:bg-gray-800
                        [&_.p-menubar-root-list>.p-menuitem>.p-menuitem-link]:dark:bg-gray-800
                        [&_.p-menubar-root-list>.p-menuitem>.p-menuitem-link:not(.p-disabled)]:dark:bg-gray-800
                        [&_.p-menubar-root-list>.p-menuitem>.p-menuitem-link:not(.p-disabled):hover]:dark:!bg-gray-700
                        [&_.p-menubar-root-list>.p-menuitem.p-menuitem-active>.p-menuitem-link]:dark:bg-gray-700

                        [&_.p-menuitem.p-menuitem-active]:dark:bg-gray-700
                        [&_.p-menuitem.p-menuitem-active>.p-menuitem-link]:dark:bg-gray-700
                        [&_.p-menuitem.p-menuitem-active>.p-menuitem-link_.p-menuitem-text]:dark:text-white
                        [&_.p-menuitem.p-menuitem-active>.p-menuitem-link_.p-menuitem-icon]:dark:text-white"
                    style={{ background: 'transparent' }}
                />
            </div>
        </header>
    )
}

export default Navbar