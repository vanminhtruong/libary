import { ref, reactive } from 'vue'

export default function useCategoryForm() {
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const errors = ref({})
  const isEditing = ref(false)
  const currentCategoryId = ref(null)
  
  const categoryForm = reactive({
    name: '',
    description: ''
  })
  
  const resetForm = () => {
    isEditing.value = false
    currentCategoryId.value = null
    errors.value = {}
    
    // Reset all form fields
    Object.keys(categoryForm).forEach(key => {
      categoryForm[key] = ''
    })
  }
  
  const openDialog = (isEdit = false, category = null) => {
    resetForm()
    
    if (isEdit && category) {
      isEditing.value = true
      currentCategoryId.value = category.id
      
      // Populate form with category data
      Object.keys(categoryForm).forEach(key => {
        if (category[key] !== undefined) {
          categoryForm[key] = category[key]
        }
      })
    }
    
    dialogVisible.value = true
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    resetForm()
  }
  
  return {
    dialogVisible,
    submitting,
    errors,
    isEditing,
    currentCategoryId,
    categoryForm,
    resetForm,
    openDialog,
    closeDialog
  }
} 