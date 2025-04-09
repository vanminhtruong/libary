import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import BookService from '../services/BookService'

export default function useCategories() {
  const { t } = useI18n()
  const toast = useToast()
  
  const categories = ref([])
  const loading = ref(false)
  
  const loadCategories = async () => {
    try {
      loading.value = true
      const response = await BookService.getCategories()
      categories.value = response || []
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.add({
        severity: 'error',
        summary: t('common.error'),
        detail: t('book.message.error.loadCategories'),
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  return {
    categories,
    loading,
    loadCategories
  }
} 