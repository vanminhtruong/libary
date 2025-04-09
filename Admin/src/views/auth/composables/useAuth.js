import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import AuthService from '../services/auth'

export function useAuth() {
  const { t } = useI18n()
  const toast = useToast()
  const router = useRouter()

  const email = ref('')
  const password = ref('')
  const rememberMe = ref(false)
  const loading = ref(false)
  const errors = ref({})

  const login = async () => {
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
      
      // Increase delay to 2 seconds to ensure toast is displayed
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

  return {
    email,
    password,
    rememberMe,
    loading,
    errors,
    login
  }
} 