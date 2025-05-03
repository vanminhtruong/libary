<template>
    <div class="welcome-container flex flex-column align-items-center justify-content-center h-screen">
        <div class="welcome-card p-5 border-round-xl shadow-8 animation-duration-1000 animation-ease-in-out fadeInDown">
            <div class="logo-container mb-5 flex justify-content-center">
                <i class="pi pi-book text-6xl text-primary"></i>
            </div>
            <h1 class="text-5xl font-bold mb-4 text-center text-primary animation-duration-1000 animation-ease-in-out fadeIn">{{ $t('common.welcome') }}</h1>
            <p class="text-xl text-center mb-5 animation-duration-1500 animation-ease-in-out fadeIn">{{ $t('common.welcomeMessage') }}</p>
            
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-content-center my-5">
                <i class="pi pi-spin pi-spinner text-5xl text-primary"></i>
            </div>
            
            <!-- Error state -->
            <div v-else-if="error" class="flex flex-column align-items-center my-5">
                <i class="pi pi-exclamation-triangle text-4xl text-yellow-500 mb-3"></i>
                <p>{{ error }}</p>
                <Button @click="fetchStats" label="Retry" class="p-button-outlined mt-3" />
            </div>
            
            <!-- Stats display -->
            <div v-else class="stats-container grid mt-5">
                <div v-for="(stat, index) in statsArray" :key="index" class="col-12 md:col-6 lg:col-3 p-3">
                    <div class="p-4 border-round-xl flex flex-column align-items-center animation-duration-2000 animation-ease-in-out fadeInUp" :style="{ animationDelay: index * 0.1 + 's' }">
                        <i :class="stat.icon + ' text-4xl text-primary mb-3'"></i>
                        <span class="text-xl font-bold text-primary">{{ stat.value }}</span>
                        <span class="text-sm">{{ stat.label }}</span>
                    </div>
                </div>
            </div>
            
            <div class="quick-links flex justify-content-center flex-wrap gap-3 mt-5 animation-duration-2000 animation-ease-in-out fadeIn">
                <router-link v-for="(link, index) in quickLinks" :key="index" :to="link.path" 
                    class="p-button p-button-outlined p-button-rounded animation-duration-2000 animation-ease-in-out fadeInUp"
                    :style="{ animationDelay: (index * 0.1 + 0.5) + 's' }">
                    <i :class="link.icon + ' mr-2'"></i>
                    <span>{{ link.label }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import useDashboardStats from '@/composables/useDashboardStats';
import Button from 'primevue/button';

const { t } = useI18n();
const { fetchStats } = useDashboardStats();

// Sử dụng local state để tránh lỗi reactive
const loading = ref(true);
const error = ref(null);
const books = ref(0);
const users = ref(0);
const categories = ref(0);
const borrowings = ref(0);

// Dữ liệu mẫu khi API không hoạt động
const SAMPLE_DATA = {
    books: 1234,
    users: 567,
    categories: 89,
    borrowings: 42
};

// Hàm để lấy dữ liệu thống kê
const loadStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        // Gọi API và cập nhật dữ liệu
        const result = await fetchStats();
        
        // Nếu có dữ liệu từ API, cập nhật state
        if (result && result.books !== undefined) {
            books.value = result.books;
            users.value = result.users;
            categories.value = result.categories;
            borrowings.value = result.borrowings;
        } else {
            // Sử dụng dữ liệu mẫu nếu không có dữ liệu từ API
            books.value = SAMPLE_DATA.books;
            users.value = SAMPLE_DATA.users;
            categories.value = SAMPLE_DATA.categories;
            borrowings.value = SAMPLE_DATA.borrowings;
        }
    } catch (err) {
        console.error('Error loading stats:', err);
        error.value = 'Failed to load statistics';
        
        // Sử dụng dữ liệu mẫu khi có lỗi
        books.value = SAMPLE_DATA.books;
        users.value = SAMPLE_DATA.users;
        categories.value = SAMPLE_DATA.categories;
        borrowings.value = SAMPLE_DATA.borrowings;
    } finally {
        loading.value = false;
    }
};

// Computed property để hiển thị dữ liệu thống kê
const statsArray = computed(() => [
    { 
        icon: 'pi pi-book', 
        value: loading.value ? '...' : books.value.toString(), 
        label: t('menu.books') 
    },
    { 
        icon: 'pi pi-users', 
        value: loading.value ? '...' : users.value.toString(), 
        label: t('menu.users') 
    },
    { 
        icon: 'pi pi-bookmark', 
        value: loading.value ? '...' : categories.value.toString(), 
        label: t('menu.categories') 
    },
    { 
        icon: 'pi pi-calendar', 
        value: loading.value ? '...' : borrowings.value.toString(), 
        label: t('menu.borrowings') 
    }
]);

const quickLinks = ref([
    { path: '/books', icon: 'pi pi-book', label: t('menu.books') },
    { path: '/users', icon: 'pi pi-users', label: t('menu.users') },
    { path: '/categories', icon: 'pi pi-bookmark', label: t('menu.categories') },
    { path: '/borrowings', icon: 'pi pi-calendar', label: t('menu.borrowings') }
]);

// Tải dữ liệu khi component được mount
onMounted(loadStats);
</script>

<style scoped>
.welcome-container {
    min-height: calc(100vh - 9rem);
    padding: 2rem;
    background: transparent;
}

.welcome-card {
    max-width: 1200px;
    width: 100%;
    background-color: transparent;
    transition: all 0.3s ease;
}

.welcome-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.3) !important;
}

.stats-container .col-12 > div {
    background-color: var(--surface-card);
    border: 1px solid var(--surface-border);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fadeIn {
    animation-name: fadeIn;
}

.fadeInDown {
    animation-name: fadeInDown;
}

.fadeInUp {
    animation-name: fadeInUp;
}
</style>
