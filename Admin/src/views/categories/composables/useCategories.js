import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import CategoriesService from '../services/Categories'

export default function useCategories() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()
  
  const categories = ref([])
  const loading = ref(false)
  const isDeleting = ref(false)
  
  const loadCategories = async () => {
    try {
      loading.value = true
      const response = await CategoriesService.getCategories()
      categories.value = response.data
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: t('category.message.error.load'),
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  const deleteCategory = (category) => {
    confirm.require({
      message: t('category.message.confirmDelete'),
      header: t('category.message.confirmTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('category.button.delete'),
      rejectLabel: t('category.button.cancel'),
      accept: async () => {
        if (isDeleting.value) return
        isDeleting.value = true
        try {
          const response = await CategoriesService.deleteCategory(category.id)
          if (response.status) {
            toast.add({
              severity: 'success',
              summary: 'Success',
              detail: t('category.message.success.delete'),
              life: 3000
            })
            await loadCategories()
          } 
        } catch (error) {
          console.error('Error deleting category:', error)
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: t('category.message.error.delete'),
            life: 3000
          })
        } finally {
          isDeleting.value = false
        }
      }
    })
  }
  
  const saveCategory = async (formData, isEditing, categoryId) => {
    try {
      loading.value = true
      
      let response
      if (isEditing) {
        response = await CategoriesService.updateCategory(categoryId, formData)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: t('category.message.success.update'),
          life: 3000
        })
      } else {
        response = await CategoriesService.createCategory(formData)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: t('category.message.success.create'),
          life: 3000
        })
      }
      
      loadCategories()
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error saving category:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: isEditing 
          ? t('category.message.error.update') 
          : t('category.message.error.create'),
        life: 3000
      })
      return { 
        success: false, 
        errors: error.response?.status === 422 ? error.response.data.errors : {} 
      }
    } finally {
      loading.value = false
    }
  }
  
  return {
    categories,
    loading,
    isDeleting,
    loadCategories,
    deleteCategory,
    saveCategory
  }
} 