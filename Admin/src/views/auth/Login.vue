<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-gray-900 dark:bg-none p-8 relative">
        <!-- Toast -->
        <Toast />

        <!-- Language Selector and Dark Mode Toggle -->
        <div class="absolute top-4 right-4 flex items-center gap-2">
            <ThemeToggler />
            <LanguageSelector />
        </div>

        <div class="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-10">
            <LoginHeader />
            <LoginForm />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import ThemeToggler from './components/ThemeToggler.vue'
import LanguageSelector from './components/LanguageSelector.vue'
import LoginHeader from './components/LoginHeader.vue'
import LoginForm from './components/LoginForm.vue'
import { useTheme } from './composables'

const { initDarkMode } = useTheme()

// Ensure dark mode is properly initialized on component mount
onMounted(() => {
    initDarkMode()
});
</script>

<style scoped>
:deep(.p-dropdown-panel) {
  background: var(--surface-0);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

:deep(.app-dark) :deep(.p-dropdown) {
  background: var(--surface-800);
  border-color: var(--surface-700);
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown .p-dropdown-label),
:deep(.app-dark) :deep(.p-dropdown .p-dropdown-trigger) {
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown-panel) {
  background: var(--surface-800);
  border-color: var(--surface-700);
}

:deep(.app-dark) :deep(.p-dropdown-item) {
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-dropdown-item:hover) {
  background: var(--surface-700);
}

:deep(.app-dark) :deep(.p-password-panel) {
  background: var(--surface-800);
  border-color: var(--surface-700);
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-checkbox .p-checkbox-box) {
  background-color: var(--surface-800);
  border-color: var(--surface-600);
}

:deep(.app-dark) :deep(.p-checkbox.p-checkbox-checked .p-checkbox-box) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.app-dark) :deep(.p-inputtext) {
  background-color: var(--surface-800);
  color: var(--surface-50);
  border-color: var(--surface-700);
}

:deep(.app-dark) :deep(.p-password input) {
  background-color: var(--surface-800) !important;
  color: var(--surface-50) !important;
  border-color: var(--surface-700) !important;
}

:deep(.app-dark) :deep(.p-password .p-password-toggle) {
  color: var(--surface-400);
}

:deep(.app-dark) :deep(.p-toast) {
  background: var(--surface-800);
  border: 1px solid var(--surface-700);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.2);
}

:deep(.app-dark) :deep(.p-toast .p-toast-message) {
  background: var(--surface-700);
  border-color: var(--surface-600);
}

:deep(.app-dark) :deep(.p-toast .p-toast-message .p-toast-message-content) {
  color: var(--surface-50);
}

:deep(.app-dark) :deep(.p-button.p-button-text) {
  color: var(--surface-200);
}

:deep(.app-dark) :deep(.p-button.p-button-text:hover) {
  background: var(--surface-700);
}
</style> 