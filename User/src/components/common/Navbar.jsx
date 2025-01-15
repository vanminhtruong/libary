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

const Navbar = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [user, setUser] = useState(null)
    const menuRef = useRef(null)

    useEffect(() => {
        const fetchUser = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const userData = await authService.getCurrentUser()
                    setUser(userData)
                } catch (error) {
                    console.error('Error fetching user:', error)
                }
            }
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
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <i className="pi pi-book text-2xl text-primary dark:text-blue-400"></i>
            <span className="text-xl font-bold dark:text-white">BookLib</span>
        </div>
    )

    const items = [
        {
            label: t('common.home'),
            icon: 'pi pi-home',
            className: 'dark:text-white dark:hover:bg-gray-700',
            command: () => navigate(ROUTES.HOME)
        },
        {
            label: t('common.books'),
            icon: 'pi pi-book',
            className: 'dark:text-white dark:hover:bg-gray-700',
            items: [
                {
                    label: t('common.all_books'),
                    icon: 'pi pi-list',
                    className: 'dark:text-white dark:hover:bg-gray-700',
                    command: () => navigate(ROUTES.BOOKS)
                },
                {
                    label: t('common.categories'),
                    icon: 'pi pi-tags',
                    className: 'dark:text-white dark:hover:bg-gray-700',
                    command: () => navigate(ROUTES.CATEGORIES)
                },
                {
                    label: t('common.new_releases'),
                    icon: 'pi pi-star',
                    className: 'dark:text-white dark:hover:bg-gray-700',
                    command: () => navigate(ROUTES.NEW_RELEASES)
                }
            ]
        },
        {
            label: t('borrowings.current_borrowings'),
            icon: 'pi pi-bookmark',
            className: 'dark:text-white dark:hover:bg-gray-700',
            command: () => navigate(ROUTES.CURRENT_BORROWINGS)
        }
    ]

    const handleLogout = async () => {
        await authService.logout()
        navigate(ROUTES.LOGIN)
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
            className: 'dark:text-gray-200',
            command: () => navigate(ROUTES.PROFILE)
        },
        {
            label: t('common.logout'),
            icon: 'pi pi-power-off',
            className: 'text-red-600 dark:text-red-400',
            command: handleLogout
        }
    ]

    const end = (
        <div className="flex gap-2 items-center">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {user ? (
                <div className="relative">
                    <button 
                        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
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
                        <i className="pi pi-angle-down text-gray-600 dark:text-gray-200" />
                    </button>
                    <Menu 
                        model={userMenuItems} 
                        popup 
                        ref={menuRef} 
                        className="dark:bg-gray-800 dark:border-gray-700 shadow-lg border border-gray-200 dark:border-gray-700"
                        style={{ minWidth: '280px' }}
                    />
                </div>
            ) : (
                <div className="flex gap-2">
                    <Button
                        label={t('common.login')}
                        icon="pi pi-sign-in"
                        severity="primary"
                        text
                        onClick={() => navigate(ROUTES.LOGIN)}
                    />
                    <Button
                        label={t('common.register')}
                        icon="pi pi-user-plus"
                        severity="primary"
                        outlined
                        onClick={() => navigate(ROUTES.REGISTER)}
                    />
                </div>
            )}
        </div>
    )

    return (
        <header className="shadow-md bg-white dark:bg-gray-800 sticky top-0 z-50 transition-colors duration-200">
            <div className="container mx-auto px-4">
                <Menubar
                    model={items}
                    start={start}
                    end={end}
                    className="border-none !p-0 dark:bg-gray-800 [&_.p-menuitem-link:hover]:dark:bg-gray-700 [&_.p-submenu-list]:dark:bg-gray-800 [&_.p-submenu-list]:dark:border-gray-700 [&_.p-menuitem-text]:dark:text-white [&_.p-menuitem-icon]:dark:text-white [&_.p-menuitem-link.p-menuitem-link-active]:dark:bg-gray-700 [&_.p-menuitem-link.p-menuitem-link-active]:dark:text-white [&_.p-overlay]:dark:bg-gray-800 [&_.p-dropdown-panel]:dark:bg-gray-800 [&_.p-dropdown-item]:dark:text-white [&_.p-dropdown-item:hover]:dark:bg-gray-700 [&_.p-dropdown-item.p-highlight]:dark:bg-gray-700"
                    style={{ background: 'transparent' }}
                />
            </div>
        </header>
    )
}

export default Navbar