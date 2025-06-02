import React from 'react';
import { Avatar } from 'primereact/avatar';
import { API_CONFIG } from '../config/api.config';

/**
 * Hook tạo các mục menu cho user dropdown trong Navbar
 * @param {Object} user - Thông tin người dùng hiện tại
 * @param {Function} navigate - Hàm điều hướng từ react-router
 * @param {Object} ROUTES - Các đường dẫn trong ứng dụng
 * @param {Function} t - Hàm dịch từ i18next
 * @param {Function} handleLogoutWithDeps - Hàm xử lý logout với các dependencies
 * @returns {Array} - Mảng các mục menu cho user dropdown
 */
const useNavbarUserMenu = (user, navigate, ROUTES, t, handleLogoutWithDeps) => {
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
            command: handleLogoutWithDeps
        }
    ];

    return userMenuItems;
};

export default useNavbarUserMenu;
