import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import BookService from '../services/BookService'

export default function useBooks() {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()
  
  const books = ref([])
  const selectedBook = ref(null)
  const loading = ref(false)
  const detailsDialogVisible = ref(false)
  
  const loadBooks = async () => {
    try {
      loading.value = true
      const response = await BookService.getBooks()
      books.value = response.data
    } catch (error) {
      console.error('Error loading books:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: t('book.message.error.load'),
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  const viewBookDetails = async (book) => {
    try {
      loading.value = true
      const response = await BookService.getBook(book.id)
      selectedBook.value = response.book
      detailsDialogVisible.value = true
    } catch (error) {
      console.error('Error fetching book details:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: t('book.message.error.fetch'),
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  const deleteBook = (book) => {
    confirm.require({
      message: t('book.message.confirmDelete'),
      header: t('book.message.confirmTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('book.button.delete'),
      rejectLabel: t('book.button.cancel'),
      accept: async () => {
        try {
          await BookService.deleteBook(book.id)
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: t('book.message.success.delete'),
            life: 3000
          })
          loadBooks()
        } catch (error) {
          console.error('Error deleting book:', error)
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: t('book.message.error.delete'),
            life: 3000
          })
        }
      }
    })
  }
  
  const saveBook = async (formData, isEditing, bookId) => {
    try {
      loading.value = true
      
      const submitData = new FormData()
      
      const skipFields = [
        'image', 
        'created_at', 
        'updated_at', 
        'authors',
        'category',
        'category_name',
        'selectedImage'
      ]
      
      for (const key in formData) {
        if (!skipFields.includes(key) && formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      }
      
      if (formData.selectedImage && typeof formData.selectedImage === 'object') {
        submitData.append('image', formData.selectedImage)
      }

      let response
      if (isEditing) {
        response = await BookService.updateBook(bookId, submitData)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: t('book.message.success.update'),
          life: 3000
        })
      } else {
        response = await BookService.createBook(submitData)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: t('book.message.success.create'),
          life: 3000
        })
      }
      
      loadBooks()
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error saving book:', error)
      
      let errorDetail = isEditing 
        ? t('book.message.error.update') 
        : t('book.message.error.create')
      
      if (error.response?.status === 422) {
        toast.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: errorDetail,
          life: 3000
        })
        return { 
          success: false, 
          errors: error.response.data.errors || {} 
        }
      } else if (error.response?.status === 500) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: errorDetail,
          life: 3000
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail,
          life: 3000
        })
      }
      
      return { 
        success: false, 
        errors: {} 
      }
    } finally {
      loading.value = false
    }
  }
  
  return {
    books,
    selectedBook,
    loading,
    detailsDialogVisible,
    loadBooks,
    viewBookDetails,
    deleteBook,
    saveBook
  }
} 