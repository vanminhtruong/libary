import { API_CONFIG } from '../../../config/api.config';

export const useBookImage = () => {

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/default-book-cover.jpg'
        if (imagePath.startsWith('http')) return imagePath
        const cleanPath = imagePath.replace('profile_image/', '')
        return `${API_CONFIG.BASE_URL}/books/image/${cleanPath}`
    }

    return {
        getImageUrl
    };
}; 