import { useState, useEffect } from 'react';
import { ROUTES } from '../constants/routes';

/**
 * Hook quản lý menu và submenu cho Navbar
 * @param {Function} navigate - Hàm điều hướng từ react-router
 * @param {Function} t - Hàm dịch từ i18next
 * @param {boolean} darkMode - Trạng thái chế độ tối
 * @returns {Object} - Các state và hàm xử lý liên quan đến menu
 */
const useNavbarMenu = (navigate, t, darkMode) => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [desktopActiveSubmenu, setDesktopActiveSubmenu] = useState(null);
    const [userMenuVisible, setUserMenuVisible] = useState(false);

    // Xử lý khi menu mobile được mở/đóng
    useEffect(() => {
        if (mobileMenuActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup function để khôi phục cuộn khi component unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [mobileMenuActive]);

    // Bật/tắt menu mobile
    const toggleMobileMenu = () => {
        setMobileMenuActive(prevState => !prevState);
    };

    // Xử lý khi click vào item menu
    const handleMenuItemClick = (command) => {
        // Thực thi lệnh điều hướng
        if (command) {
            command();
        }
        
        // Đóng menu mobile sau khi điều hướng
        setMobileMenuActive(false);
    };

    // Bật/tắt submenu
    const toggleSubMenu = (itemIdx) => {
        setActiveSubMenu(activeSubMenu === itemIdx ? null : itemIdx);
    };

    // Danh sách menu items
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
    ];

    return {
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
    };
};

export default useNavbarMenu;
