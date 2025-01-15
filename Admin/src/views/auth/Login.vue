<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-8 relative">
        <!-- Language Selector -->
        <div class="absolute top-4 right-4">
            <Dropdown
                v-model="selectedLanguage"
                :options="languages"
                optionLabel="name"
                @change="changeLanguage"
                class="w-40 rounded-lg"
            />
        </div>

        <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
            <div class="text-center mb-10">
                <i class="pi pi-user text-5xl text-primary mb-4"></i>
                <h1 class="text-3xl font-semibold text-primary mb-2">{{ $t('auth.welcome') }}</h1>
                <p class="text-gray-600">{{ $t('auth.signInToContinue') }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        <i class="pi pi-envelope mr-2"></i>
                        {{ $t('auth.email') }}
                    </label>
                    <InputText 
                        id="email" 
                        v-model="email" 
                        type="email"
                        :class="{'p-invalid': errors.email}"
                        :placeholder="$t('auth.emailPlaceholder')"
                        class="w-full !p-3 !rounded-lg !border !border-gray-300 focus:!border-primary focus:!ring-2 focus:!ring-primary-200 !transition-colors"
                    />
                    <small class="text-red-500 text-xs" v-if="errors.email">{{ errors.email[0] }}</small>
                </div>

                <div class="space-y-2">
                    <label for="password" class="block text-sm font-medium text-gray-700">
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
                        :inputStyle="{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }"
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
                    <label for="remember" class="text-sm text-gray-600 cursor-pointer">
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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import AuthService from './services/auth'

const { t, locale } = useI18n()
const toast = useToast()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errors = ref({})

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

        if (response.status === 200) {
            toast.add({
                severity: 'success',
                summary: t('auth.success'),
                detail: t('auth.loginSuccess'),
                life: 3000
            })
            router.push('/')
        }
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