import React from 'react';

/**
 * Hook quản lý phần start (logo và nút menu) của Navbar
 * @param {Function} navigate - Hàm điều hướng từ react-router
 * @param {Function} t - Hàm dịch từ i18next
 * @param {Function} toggleMobileMenu - Hàm bật/tắt menu mobile
 * @param {Object} ROUTES - Các đường dẫn trong ứng dụng
 * @returns {JSX.Element} - Phần tử JSX cho phần start của Navbar
 */
const useNavbarStart = (navigate, t, toggleMobileMenu, ROUTES) => {
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
    );

    return start;
};

export default useNavbarStart;
