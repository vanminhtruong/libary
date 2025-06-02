import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { ROUTES } from '../../constants/routes'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { API_CONFIG } from '../../config/api.config'
import { Toast } from 'primereact/toast'
import { Menu } from 'primereact/menu'
import { Avatar } from 'primereact/avatar'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeSwitcher from './ThemeSwitcher'

// Import các hooks đã tách
import useNavbarStart from '../../hooks/useNavbarStart.jsx'
import useNavbarEnd from '../../hooks/useNavbarEnd.jsx'
import useNavbarUser from '../../hooks/useNavbarUser.jsx'
import useNavbarMenu from '../../hooks/useNavbarMenu'
import useNavbarScroll from '../../hooks/useNavbarScroll'
import useNavbarTheme from '../../hooks/useNavbarTheme'
import useNavbarUserMenu from '../../hooks/useNavbarUserMenu.jsx'

const Navbar = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const menuRef = useRef(null)
    const menubarRef = useRef(null)
    const toast = useRef(null)
    
    // Sử dụng các hooks đã tách
    const scrolled = useNavbarScroll(30)
    const darkMode = useNavbarTheme()
    const { user, isLoading, handleLogout } = useNavbarUser()
    const {
        mobileMenuActive,
        activeSubMenu,
        desktopActiveSubmenu,
        userMenuVisible,
        items,
        toggleMobileMenu,
        handleMenuItemClick,
        toggleSubMenu,
        setDesktopActiveSubmenu,
        setUserMenuVisible
    } = useNavbarMenu(navigate, t, darkMode)

    
    // Sử dụng hook useNavbarStart để tạo phần start của Navbar
    const start = useNavbarStart(navigate, t, toggleMobileMenu, ROUTES)

    // Items đã được chuyển vào useNavbarMenu

    // Hàm handleLogout đã được chuyển vào useNavbarUser
    const handleLogoutWithDeps = () => handleLogout(toast, t, navigate, ROUTES);

    // Sử dụng hook useNavbarUserMenu để tạo các mục menu cho user dropdown
    const userMenuItems = useNavbarUserMenu(user, navigate, ROUTES, t, handleLogoutWithDeps);

    // Sử dụng hook useNavbarEnd để tạo phần end của Navbar
    const end = useNavbarEnd(user, isLoading, menuRef, userMenuVisible, navigate, ROUTES, userMenuItems)

    // toggleSubMenu đã được import từ useNavbarMenu

    return (
        <header className={`${scrolled ? 'shadow-lg' : 'shadow-md'} bg-white dark:bg-gray-800 sticky top-0 z-50 transition-all duration-300`}>
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
                    <div className={`flex items-center justify-between ${scrolled ? 'py-1' : 'py-3'} transition-all duration-300`}>
                        <div className="flex items-center">
                            {/* Custom mobile menu button for screens < 1286px */}
                            <button 
                                onClick={toggleMobileMenu}
                                className="mr-2 flex items-center justify-center p-2 rounded-md focus:outline-none dark:text-white dark:hover:bg-gray-700 lg:hidden"
                            >
                                <i className="pi pi-bars text-xl"></i>
                            </button>
                            
                            <div className="flex items-center gap-2 cursor-pointer navbar-logo transition-all duration-300" onClick={() => navigate(ROUTES.HOME)}>
                                <i className={`pi pi-book ${scrolled ? 'text-xl' : 'text-2xl'} text-primary dark:text-blue-400 transition-all duration-300`}></i>
                                <span className={`${scrolled ? 'text-lg' : 'text-xl'} font-bold dark:text-white truncate transition-all duration-300`}>{t('common.app_name')}</span>
                            </div>
                        </div>
                        
                        {/* Desktop navigation menu - only visible on large screens */}
                        <div className="hidden lg:flex items-center">
                            <ul className="flex">
                                {items.map((item, idx) => (
                                    <li key={idx} className="relative">
                                        <div 
                                            className={`flex items-center gap-2 px-4 ${scrolled ? 'py-1.5' : 'py-2'} cursor-pointer text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mx-1 transition-all duration-300`}
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
                                            {item.items && <i className={`pi pi-angle-down text-xs ml-1 transition-transform duration-300 ${desktopActiveSubmenu === idx ? 'rotate-180' : ''}`}></i>}
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
                        {end}
                    </div>
                    
                    {/* Mobile Menu Dropdown */}
                    <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${mobileMenuActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileMenuActive ? 'opacity-100' : 'opacity-0'}`} onClick={toggleMobileMenu}></div>
                        <div className={`absolute left-0 top-0 h-full w-72 bg-gray-900 text-white overflow-y-auto transition-all duration-300 ease-out shadow-xl ${mobileMenuActive ? 'translate-x-0' : '-translate-x-full'}`}>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-book text-xl text-blue-400 transition-all duration-300"></i>
                                    <span className="font-bold text-lg transition-all duration-300">BookLib</span>
                                </div>
                                <button 
                                    onClick={toggleMobileMenu}
                                    className="p-2 rounded-full hover:bg-gray-800 transition-all duration-200 hover:rotate-90"
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
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:pl-5"
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
                                                <i className={`pi pi-angle-down text-gray-400 transition-transform duration-300 ${activeSubMenu === idx ? 'rotate-180' : ''}`}></i>
                                            )}
                                        </div>
                                        {item.items && (
                                            <div className={`bg-gray-800/50 pl-10 overflow-hidden transition-all duration-300 ease-in-out ${activeSubMenu === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                {item.items.map((subItem, subIdx) => (
                                                    <div 
                                                        key={subIdx}
                                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer transition-all duration-200 hover:pl-2"
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
                                                        if (mobileMenuActive) toggleMobileMenu();
                                                    }}
                                                >
                                                    <i className="pi pi-user text-gray-400"></i>
                                                    <span>{t('common.profile')}</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                    onClick={() => {
                                                        navigate(ROUTES.BORROWING_HISTORY);
                                                        if (mobileMenuActive) toggleMobileMenu();
                                                    }}
                                                >
                                                    <i className="pi pi-history text-gray-400"></i>
                                                    <span>{t('borrowings.borrowing_history')}</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                    onClick={() => {
                                                        handleLogoutWithDeps();
                                                        if (mobileMenuActive) toggleMobileMenu();
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
                                                        if (mobileMenuActive) toggleMobileMenu();
                                                    }}
                                                >
                                                    <i className="pi pi-sign-in text-gray-400"></i>
                                                    <span>{t('common.login')}</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer"
                                                    onClick={() => {
                                                        navigate(ROUTES.REGISTER);
                                                        if (mobileMenuActive) toggleMobileMenu();
                                                    }}
                                                >
                                                    <i className="pi pi-user-plus text-gray-400"></i>
                                                    <span>{t('common.register')}</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Add language and theme switchers to mobile menu */}
                                        <div className="border-t border-gray-800 mt-2 pt-2">
                                            <div className="px-4 py-3">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <i className="pi pi-globe text-gray-400"></i>
                                                    <span>{t('common.language')}</span>
                                                </div>
                                                <div className="pl-8">
                                                    <LanguageSwitcher />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar