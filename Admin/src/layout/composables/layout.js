import { computed, reactive, readonly } from 'vue';

// Đọc trạng thái từ localStorage hoặc sử dụng giá trị mặc định
const darkThemeFromStorage = localStorage.getItem('admin_darkTheme') === 'true';
const primaryFromStorage = localStorage.getItem('admin_primary') || 'emerald';
const surfaceFromStorage = localStorage.getItem('admin_surface') || null;
const presetFromStorage = localStorage.getItem('admin_preset') || 'Aura';
const menuModeFromStorage = localStorage.getItem('admin_menuMode') || 'static';

const layoutConfig = reactive({
    preset: presetFromStorage,
    primary: primaryFromStorage,
    surface: surfaceFromStorage,
    darkTheme: darkThemeFromStorage,
    menuMode: menuModeFromStorage
});

// Áp dụng chế độ tối ngay lập tức nếu được lưu trong localStorage
if (darkThemeFromStorage) {
    document.documentElement.classList.add('app-dark');
} else {
    document.documentElement.classList.remove('app-dark');
}

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const setPrimary = (value) => {
        layoutConfig.primary = value;
        localStorage.setItem('admin_primary', value);
    };

    const setSurface = (value) => {
        layoutConfig.surface = value;
        localStorage.setItem('admin_surface', value);
    };

    const setPreset = (value) => {
        layoutConfig.preset = value;
        localStorage.setItem('admin_preset', value);
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const setMenuMode = (mode) => {
        layoutConfig.menuMode = mode;
        localStorage.setItem('admin_menuMode', mode);
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();
            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        // Lưu trạng thái vào localStorage
        localStorage.setItem('admin_darkTheme', layoutConfig.darkTheme);
        document.documentElement.classList.toggle('app-dark');
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return { layoutConfig: readonly(layoutConfig), layoutState: readonly(layoutState), onMenuToggle, isSidebarActive, isDarkTheme, getPrimary, getSurface, setActiveMenuItem, toggleDarkMode, setPrimary, setSurface, setPreset, resetMenu, setMenuMode };
}
