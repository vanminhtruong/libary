import { decodeToken, isTokenExpired } from '../utils/jwtUtils';

export default function auth(to, from, next) {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
        next('/login');
        return;
    }

    try {
        if (isTokenExpired(token)) {
            throw new Error('Token expired');
        }
        
        const decoded = decodeToken(token);
        if (!decoded || !decoded.role || decoded.role !== 3) {
            throw new Error('Unauthorized. Admin access required.');
        }

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        next('/login');
    }
}
