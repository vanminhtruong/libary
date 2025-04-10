import { API_CONFIG } from '../../../config/api.config';

const useBookImages = () => {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace('profile_image/', '');
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`;
    };

    const handleImageError = (e) => {
        e.target.src = '/default-book-cover.jpg';
    };

    return {
        getImageUrl,
        handleImageError
    };
};

export default useBookImages; 