import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import auth from '@/middleware/auth';
import User from '../views/user/User.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            component: AppLayout,
            beforeEnter: auth,
            children: [
                {
                    path: '/books',
                    name: 'books',
                    component: () => import('@/views/books/BookList.vue')
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: () => import('@/views/categories/Categories.vue')
                },
                {
                    path: '/fines',
                    name: 'fines',
                    component: () => import('@/views/fines/Fine.vue')
                },
                {
                    path: '/users',
                    name: 'Users',
                    component: User
                },
                {
                    path: '/borrowings',
                    name: 'borrowings',
                    component: () => import('@/views/borrowings/Borrowings.vue')
                }
            ]
        }
    ]
});

// Global navigation guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('admin_token');
    
    if (to.path === '/login' && token) {
        // Nếu đã đăng nhập và cố truy cập trang login, chuyển về trang chủ
        next('/');
        return;
    }
    
    if (to.matched.some(record => record.meta.requiresAuth !== false) && !token) {
        // Nếu route yêu cầu xác thực và chưa đăng nhập, chuyển đến trang login
        next('/login');
        return;
    }
    
    next();
});

export default router;
