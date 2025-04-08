<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-gray-900 dark:bg-none p-8 relative">
        <!-- Toast -->
        <Toast />

        <!-- Language Selector and Dark Mode Toggle -->
        <div class="absolute top-4 right-4 flex items-center gap-2">
            <Button 
                type="button" 
                @click="handleToggleDarkMode" 
                icon="pi pi-moon" 
                v-if="isDarkTheme" 
                class="p-button-rounded p-button-text p-button-secondary"
                aria-label="Toggle light mode"
            />
            <Button 
                type="button" 
                @click="handleToggleDarkMode" 
                icon="pi pi-sun" 
                v-else 
                class="p-button-rounded p-button-text p-button-secondary"
                aria-label="Toggle dark mode"
            />
            <Dropdown
                v-model="selectedLanguage"
                :options="languages"
                optionLabel="name"
                @change="changeLanguage"
                class="w-40 rounded-lg dark:bg-surface-800 dark:border-surface-700"
            />
        </div>

        <div class="w-full max-w-md bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-10">
            <div class="text-center mb-10">
                <i class="pi pi-user text-5xl text-primary mb-4"></i>
                <h1 class="text-3xl font-semibold text-primary mb-2">{{ $t('auth.welcome') }}</h1>
                <p class="text-gray-600 dark:text-gray-300">{{ $t('auth.signInToContinue') }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        <i class="pi pi-envelope mr-2"></i>
                        {{ $t('auth.email') }}
                    </label>
                    <InputText 
                        id="email" 
                        v-model="email" 
                        type="email"
                        :class="{'p-invalid': errors.email}"
                        :placeholder="$t('auth.emailPlaceholder')"
                        class="w-full !p-3 !rounded-lg !border !border-gray-300 dark:!bg-surface-800 dark:!border-surface-700 dark:!text-white focus:!border-primary focus:!ring-2 focus:!ring-primary-200 !transition-colors"
                    />
                    <small class="text-red-500 text-xs" v-if="errors.email">{{ errors.email[0] }}</small>
                </div>

                <div class="space-y-2">
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        <i class="pi pi-lock mr-2"></i>
                        {{ $t('auth.password') }}
                    </label>
                    <Password
                        id="password"
                        v-model="password"
                        :feedback="false"
                        :toggleMask="true"
                        :class="{'p-invalid': errors.password}"
                        :placeholder="$t('auth.passwordPlaceholder')"
                        style="width: 100%; display: block;"
                        class="dark:bg-surface-800"
                        :inputClass="isDarkTheme ? 'dark:bg-surface-800 dark:text-white dark:border-surface-700' : ''"
                        :inputStyle="{ 
                            width: '100%', 
                            padding: '0.75rem', 
                            borderRadius: '0.5rem',
                            backgroundColor: isDarkTheme ? 'var(--surface-800)' : 'white',
                            color: isDarkTheme ? 'var(--surface-50)' : 'inherit',
                            borderColor: isDarkTheme ? 'var(--surface-700)' : 'var(--gray-300)'
                        }"
                        :panelStyle="{ display: 'none' }"
                    />
                    <small class="text-red-500 text-xs" v-if="errors.password">{{ errors.password[0] }}</small>
                </div>

                <div class="flex items-center">
                    <Checkbox 
                        v-model="rememberMe" 
                        :binary="true" 
                        inputId="remember"
                        class="mr-2"
                    />
                    <label for="remember" class="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                        {{ $t('auth.rememberMe') }}
                    </label>
                </div>

                <Button 
                    type="submit" 
                    :label="$t('auth.signIn')"
                    :loading="loading"
                    class="w-full p-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
                />
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { useLayout } from '@/layout/composables/layout'
import AuthService from './services/auth'
import Toast from 'primevue/toast'

const { t, locale } = useI18n()
const toast = useToast()
const router = useRouter()
const { toggleDarkMode, isDarkTheme } = useLayout()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errors = ref({})

// Ensure dark mode is properly initialized on component mount
onMounted(() => {
    // Check if dark mode is enabled in localStorage
    const darkModeEnabled = localStorage.getItem('admin_darkTheme') === 'true';
    if (darkModeEnabled) {
        document.documentElement.classList.add('app-dark');
    } else {
        document.documentElement.classList.remove('app-dark');
    }
});

// Handler for toggling dark mode with toast notification
const handleToggleDarkMode = () => {
    toggleDarkMode();
    toast.add({
        severity: 'info',
        summary: isDarkTheme.value ? t('auth.theme.darkModeEnabled') : t('auth.theme.lightModeEnabled'),
        detail: isDarkTheme.value ? t('auth.theme.darkModeEnabledDetail') : t('auth.theme.lightModeEnabledDetail'),
        life: 3000
    });
};

const languages = [
    { name: 'English', code: 'en' },
    { name: 'Tiếng Việt', code: 'vi' },
    { name: '한국어', code: 'ko' }
]

// Khởi tạo ngôn ngữ từ localStorage hoặc mặc định
const savedLanguage = localStorage.getItem('language')
const defaultLanguage = languages.find(lang => lang.code === savedLanguage) || languages[0]
const selectedLanguage = ref(defaultLanguage)

// Cập nhật locale khi component được tạo
locale.value = selectedLanguage.value.code

const changeLanguage = (event) => {
    const newLang = event.value.code
    localStorage.setItem('language', newLang)
    locale.value = newLang // Cập nhật locale ngay lập tức
}

// Watch để theo dõi thay đổi của locale
watch(locale, (newLocale) => {
    console.log('Language changed to:', newLocale)
})

const handleSubmit = async () => {
    try {
        loading.value = true
        errors.value = {}
        
        const response = await AuthService.login({
            email: email.value,
            password: password.value,
            remember_me: rememberMe.value
        })

        localStorage.setItem('admin_token', response.token)
        localStorage.setItem('admin_user', response.user)

        toast.add({
            severity: 'success',
            summary: t('auth.success'),
            detail: t('auth.loginSuccess'),
            life: 3000,
            sticky: true
        })
        
        // Tăng thời gian delay lên 2 giây để đảm bảo toast hiển thị
        setTimeout(() => {
            router.push('/')
        }, 2000)
    } catch (error) {
        console.log('Login error:', JSON.stringify(error.status, null, 2))
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors
        } 
        else if(error.status === 401) {
            toast.add({
                severity: 'error',
                summary: t('auth.error'),
                detail: t('auth.loginError'),
                life: 3000
            })
        }
    } finally {
        loading.value = false
    }
}
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