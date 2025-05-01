<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Badge from 'primevue/badge';

const route = useRoute();

const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    },
    badge: {
        type: Number,
        default: 0
    },
    badgeClass: {
        type: Object,
        default: () => ({})
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? `${props.parentItemKey}-${props.index}` : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || (activeItem && activeItem.startsWith(`${itemKey.value}-`));
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(`${itemKey.value}-`);
    }
);

function itemClick(event, item) {
    // Prevent interaction with disabled items
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    // Close mobile/overlay menu after navigation
    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        onMenuToggle();
    }

    // Execute custom command if exists
    if (item.command) {
        item.command({
            originalEvent: event,
            item: item
        });
    }

    // Determine the key for setting active menu item
    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey.value) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

// Optimized active route checking
const isActiveRoute = computed(() => (item) => {
    return route.path === item.to || route.path.startsWith(item.to + '/');
});
</script>

<template>
    <li
        :class="{
            'layout-root-menuitem': root,
            'active-menuitem': isActiveMenu
        }"
    >
        <!-- Root level label -->
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">
            {{ item.label }}
        </div>

        <!-- Non-router link items (with or without submenu) -->
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i v-if="item.items" class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
        </a>

        <!-- Router link items without submenu -->
        <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item)" :class="[item.class, { 'active-route': isActiveRoute(item) }]" tabindex="0" :to="item.to">
            <template v-if="item.customIcon">
                <div class="menu-icon-container">
                    <i :class="[item.icon, {'shake-animation': item.showAnimation?.value}]" class="layout-menuitem-icon"></i>
                    <!-- Hiển thị badge cứng để test -->
                    <span v-if="item.pendingCount?.value > 0 && $route.path !== '/borrowings'" 
                        class="custom-badge">
                        {{ item.pendingCount?.value }}
                    </span>
                </div>
                <span class="layout-menuitem-text">{{ item.label }}</span>
            </template>
            <template v-else>
                <i :class="item.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text">{{ item.label }}</span>
            </template>
        </router-link>

        <!-- Submenu -->
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items" :key="i" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped>
.menu-icon-container {
    position: relative;
    display: inline-block;
}

.custom-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff0000 !important;
    color: white !important;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: bold;
    min-width: 16px;
    text-align: center;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    z-index: 100;
}

@keyframes shake {
    0% { transform: translateX(0); }
    10% { transform: translateX(-2px) rotate(-1deg); }
    20% { transform: translateX(2px) rotate(1deg); }
    30% { transform: translateX(-2px) rotate(-1deg); }
    40% { transform: translateX(2px) rotate(1deg); }
    50% { transform: translateX(-2px) rotate(-1deg); }
    60% { transform: translateX(2px) rotate(1deg); }
    70% { transform: translateX(-2px) rotate(-1deg); }
    80% { transform: translateX(2px) rotate(1deg); }
    90% { transform: translateX(-1px) rotate(0deg); }
    100% { transform: translateX(0); }
}

.shake-animation {
    animation: shake 1s ease-in-out infinite;
}
</style>
