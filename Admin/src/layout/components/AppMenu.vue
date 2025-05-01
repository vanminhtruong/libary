<!-- eslint-disable prettier/prettier -->
<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppMenuItem from './AppMenuItem.vue';
import { usePendingBorrowings } from '@/composables/usePendingBorrowings';

const { t } = useI18n();
const { pendingCount, fetchPendingCount } = usePendingBorrowings();
const showAnimation = ref(false);
const previousCount = ref(0);

// Lấy số lượng ban đầu
onMounted(() => {
    fetchPendingCount();
});

// Theo dõi sự thay đổi của pendingCount
watch(pendingCount, (newCount, oldCount) => {
    // Chỉ kích hoạt hiệu ứng rung khi số lượng tăng lên (có yêu cầu mới)
    if (newCount > oldCount && oldCount !== 0) {
        showAnimation.value = true;
        setTimeout(() => {
            showAnimation.value = false;
        }, 3000); // Hiệu ứng rung kéo dài 3 giây
    }
    previousCount.value = newCount;
});

const model = computed(() => [
    {
        label: t('menu.menu'),
        items: [
            {
                label: t('menu.bookManagement'),
                icon: 'pi pi-fw pi-book',
                to: '/books'
            },
            {
                label: t('menu.categoryManagement'),
                icon: 'pi pi-fw pi-list',
                to: '/categories'
            },
            {
                label: t('menu.userManagement'),
                icon: 'pi pi-fw pi-users',
                to: '/users'
            },
            {
                label: t('menu.borrowingManagement'),
                icon: 'pi pi-fw pi-bell',
                to: '/borrowings',
                customIcon: true,
                pendingCount: pendingCount,
                showAnimation: showAnimation
            },
            {
                label: t('menu.fineManagement'),
                icon: 'pi pi-money-bill',
                to: '/fines'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" :key="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator" :key="'sep-' + i"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
