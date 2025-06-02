import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import { API_CONFIG } from '../config/api.config';

/**
 * Hook quản lý phần end (language switcher, theme switcher, user profile) của Navbar
 * @param {Object} user - Thông tin người dùng hiện tại
 * @param {boolean} isLoading - Trạng thái đang tải thông tin người dùng
 * @param {Object} menuRef - Tham chiếu đến menu người dùng
 * @param {boolean} userMenuVisible - Trạng thái hiển thị menu người dùng
 * @param {Function} navigate - Hàm điều hướng từ react-router
 * @param {Object} ROUTES - Các đường dẫn trong ứng dụng
 * @param {Array} userMenuItems - Các mục menu cho người dùng
 * @returns {JSX.Element} - Phần tử JSX cho phần end của Navbar
 */
const useNavbarEnd = (user, isLoading, menuRef, userMenuVisible, navigate, ROUTES, userMenuItems) => {
    const end = (
        <div className="flex items-center gap-3 md:gap-4">
            {/* Language and theme switchers are always visible */}
            <div className="hidden sm:block">
                <LanguageSwitcher />
            </div>
            <ThemeSwitcher />
            
            {/* User profile/auth buttons - only visible on large screens */}
            <div className="hidden lg:block ml-2 md:ml-3">
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
                                    <i className={`pi pi-angle-down text-gray-600 dark:text-gray-200 hidden sm:block transition-transform duration-300 ${userMenuVisible ? 'rotate-180' : ''}`} />
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
                                    onShow={() => setUserMenuVisible(true)}
                                    onHide={() => setUserMenuVisible(false)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    label="Đăng nhập"
                                    size="small"
                                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white"
                                    onClick={() => navigate(ROUTES.LOGIN)}
                                />
                                <Button
                                    label="Đăng ký"
                                    size="small"
                                    className="px-3 py-2 bg-transparent hover:bg-blue-50 border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                                    onClick={() => navigate(ROUTES.REGISTER)}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    return end;
};

export default useNavbarEnd;
