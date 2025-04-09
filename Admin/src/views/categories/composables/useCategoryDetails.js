import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import CategoriesService from '../services/Categories'

export default function useCategoryDetails() {
  const { t } = useI18n()
  const toast = useToast()
  
  const detailsDialogVisible = ref(false)
  const selectedCategory = ref(null)
  const categoryBooks = ref([])
  const loadingBooks = ref(false)
  
  const viewCategoryDetails = async (category) => {
    selectedCategory.value = category
    detailsDialogVisible.value = true
    
    await loadCategoryBooks(category.id)
  }
  
  const loadCategoryBooks = async (categoryId) => {
    try {
      loadingBooks.value = true
      const response = await CategoriesService.getCategoryBooks(categoryId)
      categoryBooks.value = response.data || []
    } catch (error) {
      console.error('Error loading category books:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: t('category.message.error.loadBooks'),
        life: 3000
      })
      categoryBooks.value = []
    } finally {
      loadingBooks.value = false
    }
  }
  
  const closeDetailsDialog = () => {
    detailsDialogVisible.value = false
    selectedCategory.value = null
    categoryBooks.value = []
  }
  
  return {
    detailsDialogVisible,
    selectedCategory,
    categoryBooks,
    loadingBooks,
    viewCategoryDetails,
    loadCategoryBooks,
    closeDetailsDialog
  }
} 