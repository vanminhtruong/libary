<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    // Áp dụng chế độ tối từ localStorage khi trang được tải
    const darkModeEnabled = localStorage.getItem('admin_darkTheme') === 'true';
    if (darkModeEnabled) {
        document.documentElement.classList.add('app-dark');
    } else {
        document.documentElement.classList.remove('app-dark');
    }
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
