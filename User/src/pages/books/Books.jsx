import { API_CONFIG } from '../../config/api.config';

// Hàm lấy URL ảnh từ API
const getImageUrl = (imagePath) => {
    if (!imagePath) return '/book-placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    // Lấy tên file từ đường dẫn (loại bỏ các thư mục nếu có)
    const filename = imagePath.split('/').pop();
    return `${API_CONFIG.BASE_URL}/books/image/${filename}`;
} 