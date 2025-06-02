import { useState, useEffect } from 'react';

/**
 * Hook quản lý chế độ tối/sáng cho Navbar
 * @returns {boolean} darkMode - Trạng thái chế độ tối
 */
const useNavbarTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Kiểm tra chế độ tối ban đầu
        const isDarkMode = document.documentElement.classList.contains('dark');
        setDarkMode(isDarkMode);

        // Theo dõi thay đổi class của document để cập nhật state khi chế độ tối/sáng thay đổi
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    setDarkMode(isDarkMode);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        
        // Cleanup observer khi component unmount
        return () => observer.disconnect();
    }, []);

    return darkMode;
};

export default useNavbarTheme;
