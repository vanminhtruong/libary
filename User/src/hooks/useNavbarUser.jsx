import { useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { Button } from 'primereact/button';

/**
 * Hook quản lý thông tin người dùng và xác thực cho Navbar
 * @returns {Object} - Các state và hàm xử lý liên quan đến người dùng
 */
const useNavbarUser = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hàm lấy thông tin người dùng hiện tại
    const fetchUser = async () => {
        setIsLoading(true);
        if (authService.isAuthenticated()) {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        setIsLoading(false);
    };

    // Xử lý đăng xuất
    const handleLogout = async (toast, t, navigate, ROUTES) => {
        toast.current.show({
            severity: 'warn',
            sticky: true,
            className: 'logout-confirmation-toast',
            position: 'center',
            content: () => (
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
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white px-3 py-2"
                            onClick={async () => {
                                try {
                                    await authService.logout();
                                    toast.current.clear();
                                    toast.current.show({
                                        severity: 'success',
                                        summary: t('common.success'),
                                        detail: t('auth.logout_success'),
                                        life: 3000
                                    });
                                    setTimeout(() => {
                                        navigate(ROUTES.LOGIN);
                                    }, 1000);
                                } catch (error) {
                                    console.error('Logout error:', error);
                                    toast.current.show({
                                        severity: 'error',
                                        summary: t('common.error'),
                                        detail: t('auth.logout_error'),
                                        life: 3000
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            )
        });
    };

    useEffect(() => {
        fetchUser();

        // Lắng nghe sự kiện thay đổi xác thực để cập nhật thông tin người dùng
        const handleAuthChange = () => {
            if (!authService.isAuthenticated()) {
                setUser(null);
            } else {
                fetchUser();
            }
        };
        
        window.addEventListener('auth-change', handleAuthChange);
        
        // Cleanup event listener khi component unmount
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    return {
        user,
        isLoading,
        handleLogout
    };
};

export default useNavbarUser;
