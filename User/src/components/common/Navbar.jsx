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
    const menubarRef = useRef(null)
    const toast = useRef(null)
    const [darkMode, setDarkMode] = useState(false)
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const [activeSubMenu, setActiveSubMenu] = useState(null)
    const [desktopActiveSubmenu, setDesktopActiveSubmenu] = useState(null)

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

    // If the mobile menu is active, prevent scrolling
    useEffect(() => {
        if (mobileMenuActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to restore scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuActive]);

    const toggleMobileMenu = () => {
        setMobileMenuActive(prevState => !prevState);
    };

    const handleMenuItemClick = (command) => {
        // Execute the navigation command
        if (command) {
            command();
        }
        
        // Close the mobile menu after navigation
        setMobileMenuActive(false);
    };
    
    const start = (
        <div className="flex items-center">
            {/* Custom mobile menu button for screens < 1286px */}
            <button 
                onClick={toggleMobileMenu}
                className="mr-2 flex lg:hidden items-center justify-center p-2 rounded-md focus:outline-none dark:text-white dark:hover:bg-gray-700"
            >
                <i className="pi pi-bars text-xl"></i>
            </button>
            
            <div className="flex items-center gap-2 cursor-pointer navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
                <i className="pi pi-book text-2xl text-primary dark:text-blue-400"></i>
                <span className="text-xl font-bold dark:text-white truncate">{t('common.app_name')}</span>
            </div>
        </div>
    )

    const items = [
        {
            label: t('common.home'),
            icon: 'pi pi-home',
            className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
            command: () => {
                navigate(ROUTES.HOME);
                setMobileMenuActive(false);
            }
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
                    command: () => {
                        navigate(ROUTES.BOOKS);
                        setMobileMenuActive(false);
                    }
                },
            ]
        },
        {
            label: t('borrowings.current_borrowings'),
            icon: 'pi pi-bookmark',
            className: darkMode ? 'dark:text-white' : 'hover:bg-gray-100',
            command: () => {
                navigate(ROUTES.CURRENT_BORROWINGS);
                setMobileMenuActive(false);
            }
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
        <div className="flex gap-1 md:gap-2 items-center navbar-end">
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
                                className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200"
                                onClick={(e) => menuRef.current.toggle(e)}
                            >
                                {user?.image ? (
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden relative">
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
                                        className="bg-blue-600 dark:bg-blue-500 text-white shadow-sm w-7 h-7 md:w-8 md:h-8"
                                        pt={{ root: { className: 'w-7 h-7 md:w-8 md:h-8 text-sm md:text-base' } }}
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
                                className="login-btn !px-2 !py-1 md:!px-3 md:!py-2"
                            />
                            <Button
                                label={t('common.register')}
                                icon="pi pi-user-plus"
                                severity="primary"
                                outlined
                                onClick={() => navigate(ROUTES.REGISTER)}
                                className="register-btn !px-2 !py-1 md:!px-3 md:!py-2"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )

    // Toggle submenu visibility
    const toggleSubMenu = (itemIdx) => {
        setActiveSubMenu(activeSubMenu === itemIdx ? null : itemIdx)
    }

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
            <div className="container mx-auto px-2 md:px-4">
                <div ref={menubarRef} className={`relative ${mobileMenuActive ? 'mobile-menu-active' : ''}`}>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                            {/* Custom mobile menu button for screens < 1286px */}
                            <button 
                                onClick={toggleMobileMenu}
                                className="mr-2 flex items-center justify-center p-2 rounded-md focus:outline-none dark:text-white dark:hover:bg-gray-700 lg:hidden"
                            >
                                <i className="pi pi-bars text-xl"></i>
                            </button>
                            
                            <div className="flex items-center gap-2 cursor-pointer navbar-logo" onClick={() => navigate(ROUTES.HOME)}>
                                <i className="pi pi-book text-2xl text-primary dark:text-blue-400"></i>
                                <span className="text-xl font-bold dark:text-white truncate">{t('common.app_name')}</span>
                            </div>
                        </div>
                        
                        {/* Desktop navigation menu - only visible on large screens */}
                        <div className="hidden lg:flex items-center">
                            <ul className="flex">
                                {items.map((item, idx) => (
                                    <li key={idx} className="relative">
                                        <div 
                                            className="flex items-center gap-2 px-4 py-2 cursor-pointer text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mx-1"
                                            onClick={() => {
                                                if (item.items) {
                                                    setDesktopActiveSubmenu(desktopActiveSubmenu === idx ? null : idx);
                                                } else if (item.command) {
                                                    item.command();
                                                }
                                            }}
                                        >
                                            {item.icon && <i className={item.icon}></i>}
                                            <span>{item.label}</span>
                                            {item.items && <i className={`pi ${desktopActiveSubmenu === idx ? 'pi-angle-down' : 'pi-angle-right'} text-xs ml-1`}></i>}
                                        </div>
                                        
                                        {item.items && desktopActiveSubmenu === idx && (
                                            <div className="absolute left-0 mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md overflow-hidden min-w-[180px] z-10">
                                                {item.items.map((subItem, subIdx) => (
                                                    <div 
                                                        key={subIdx}
                                                        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white"
                                                        onClick={() => {
                                                            if (subItem.command) {
                                                                subItem.command();
                                                                setDesktopActiveSubmenu(null);
                                                            }
                                                        }}
                                                    >
                                                        {subItem.icon && <i className={subItem.icon}></i>}
                                                        <span>{subItem.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* End section with buttons/profile - only show on large screens */}
                        <div className="flex items-center">
                            {/* Language and theme switchers are always visible */}
                            <div className="hidden sm:block">
                                <LanguageSwitcher />
                            </div>
                            <ThemeSwitcher />
                            
                            {/* User profile/auth buttons - only visible on large screens */}
                            <div className="hidden lg:block">
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
                                                    className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:!bg-gray-700 transition-colors duration-200"
                                                    onClick={(e) => menuRef.current.toggle(e)}
                                                >
                                                    {user?.image ? (
                                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden relative">
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
                                                            className="bg-blue-600 dark:bg-blue-500 text-white shadow-sm w-7 h-7 md:w-8 md:h-8"
                                                            pt={{ root: { className: 'w-7 h-7 md:w-8 md:h-8 text-sm md:text-base' } }}
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
                                                    className="login-btn !px-2 !py-1 md:!px-3 md:!py-2"
                                                />
                                                <Button
                                                    label={t('common.register')}
                                                    icon="pi pi-user-plus"
                                                    severity="primary"
                                                    outlined
                                                    onClick={() => navigate(ROUTES.REGISTER)}
                                                    className="register-btn !px-2 !py-1 md:!px-3 md:!py-2"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Dropdown */}
                    {mobileMenuActive && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/60"></div>
                            <div className="absolute left-0 top-0 h-full w-72 bg-gray-900 text-white overflow-y-auto">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <i className="pi pi-book text-xl text-blue-400"></i>
                                        <span className="font-bold text-lg">BookLib</span>
                                    </div>
                                    <button 
                                        onClick={() => setMobileMenuActive(false)}
                                        className="p-2 rounded-full hover:bg-gray-800"
                                    >
                                        <i className="pi pi-times text-gray-400"></i>
                                    </button>
                                </div>
                                
                                {/* User profile section in mobile menu */}
                                {!isLoading && user && (
                                    <div className="px-4 py-3 border-b border-gray-800">
                                        <div className="flex items-center gap-3">
                                            {user?.image ? (
                                                <div className="w-12 h-12 rounded-full overflow-hidden relative">
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
                                                    className="bg-blue-600 text-white shadow-sm w-12 h-12"
                                                />
                                            )}
                                            <div>
                                                <div className="font-semibold text-white">
                                                    {user?.name || 'User'}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Navigation links */}
                                <nav className="py-4">
                                    {items.map((item, idx) => (
                                        <div key={idx}>
                                            <div 
                                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                onClick={() => {
                                                    if (item.items) {
                                                        toggleSubMenu(idx)
                                                    } else {
                                                        item.command && item.command()
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon && <i className={`${item.icon} text-gray-400`}></i>}
                                                    <span>{item.label}</span>
                                                </div>
                                                {item.items && (
                                                    <i className={`pi ${activeSubMenu === idx ? 'pi-angle-down' : 'pi-angle-right'} text-gray-400`}></i>
                                                )}
                                            </div>
                                            
                                            {item.items && activeSubMenu === idx && (
                                                <div className="bg-gray-800/50 pl-10">
                                                    {item.items.map((subItem, subIdx) => (
                                                        <div 
                                                            key={subIdx}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                            onClick={() => subItem.command && subItem.command()}
                                                        >
                                                            {subItem.icon && <i className={`${subItem.icon} text-gray-400`}></i>}
                                                            <span>{subItem.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {/* Add user profile options to mobile menu */}
                                    {!isLoading && (
                                        <>
                                            {user ? (
                                                <div className="border-t border-gray-800 mt-2 pt-2">
                                                    <div 
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => {
                                                            navigate(ROUTES.PROFILE);
                                                            setMobileMenuActive(false);
                                                        }}
                                                    >
                                                        <i className="pi pi-user text-gray-400"></i>
                                                        <span>{t('common.profile')}</span>
                                                    </div>
                                                    <div 
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => {
                                                            navigate(ROUTES.BORROWING_HISTORY);
                                                            setMobileMenuActive(false);
                                                        }}
                                                    >
                                                        <i className="pi pi-history text-gray-400"></i>
                                                        <span>{t('borrowings.borrowing_history')}</span>
                                                    </div>
                                                    <div 
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => {
                                                            handleLogout();
                                                            setMobileMenuActive(false);
                                                        }}
                                                    >
                                                        <i className="pi pi-power-off text-red-400"></i>
                                                        <span className="text-red-400">{t('common.logout')}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="border-t border-gray-800 mt-2 pt-2">
                                                    <div 
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => {
                                                            navigate(ROUTES.LOGIN);
                                                            setMobileMenuActive(false);
                                                        }}
                                                    >
                                                        <i className="pi pi-sign-in text-gray-400"></i>
                                                        <span>{t('common.login')}</span>
                                                    </div>
                                                    <div 
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => {
                                                            navigate(ROUTES.REGISTER);
                                                            setMobileMenuActive(false);
                                                        }}
                                                    >
                                                        <i className="pi pi-user-plus text-gray-400"></i>
                                                        <span>{t('common.register')}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar