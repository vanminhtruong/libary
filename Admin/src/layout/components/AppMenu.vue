<!-- eslint-disable prettier/prettier -->
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppMenuItem from './AppMenuItem.vue';

const { t } = useI18n();

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
                icon: 'pi pi-fw pi-calendar',
                to: '/borrowings'
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
