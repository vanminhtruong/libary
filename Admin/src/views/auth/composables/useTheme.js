import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useLayout } from '@/layout/composables/layout'

export function useTheme() {
  const { t } = useI18n()
  const toast = useToast()
  const { toggleDarkMode, isDarkTheme } = useLayout()

  // Handler for toggling dark mode with toast notification
  const handleToggleDarkMode = () => {
    toggleDarkMode();
  };

  // Initialize dark mode
  const initDarkMode = () => {
    // Check if dark mode is enabled in localStorage
    const darkModeEnabled = localStorage.getItem('admin_darkTheme') === 'true';
    if (darkModeEnabled) {
      document.documentElement.classList.add('app-dark');
    } else {
      document.documentElement.classList.remove('app-dark');
    }
  };

  return {
    isDarkTheme,
    handleToggleDarkMode,
    initDarkMode
  }
} 