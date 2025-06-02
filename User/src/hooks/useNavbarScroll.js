import { useState, useEffect } from 'react';

/**
 * Hook quản lý hiệu ứng cuộn cho Navbar
 * @param {number} threshold - Ngưỡng cuộn để kích hoạt hiệu ứng (mặc định: 30px)
 * @returns {boolean} scrolled - Trạng thái đã cuộn vượt ngưỡng
 */
const useNavbarScroll = (threshold = 30) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > threshold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup listener khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return scrolled;
};

export default useNavbarScroll;
