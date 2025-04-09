import { ref, reactive } from 'vue'

export default function useBookForm() {
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const selectedImage = ref(null)
  const errors = ref({})
  const isEditing = ref(false)
  const currentBookId = ref(null)
  
  const bookForm = reactive({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: '',
    category_id: '',
    price: '',
    total_copies: '',
    available_copies: '',
    location_shelf: '',
    description: '',
    image: ''
  })
  
  const resetForm = () => {
    isEditing.value = false
    currentBookId.value = null
    errors.value = {}
    selectedImage.value = null
    
    // Reset all form fields
    Object.keys(bookForm).forEach(key => {
      bookForm[key] = ''
    })
  }
  
  const openDialog = (isEdit = false, book = null) => {
    resetForm()
    
    if (isEdit && book) {
      isEditing.value = true
      currentBookId.value = book.id
      
      // Copy book data to form, excluding certain fields
      const bookData = { ...book }
      delete bookData.image
      delete bookData.created_at
      delete bookData.updated_at
      delete bookData.authors
      delete bookData.category
      delete bookData.category_name
      
      // Populate form with book data
      Object.keys(bookForm).forEach(key => {
        if (bookData[key] !== undefined) {
          bookForm[key] = bookData[key]
        }
      })
    }
    
    dialogVisible.value = true
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    resetForm()
  }
  
  const onImageSelect = (event) => {
    try {
      // Add null checking to prevent "Cannot read properties of undefined"
      if (!event || !event.files) {
        console.error('Invalid event or missing files property')
        return
      }
      
      // Check if files array exists and has content
      if (!event.files.length) {
        console.error('No files selected')
        return
      }
      
      const file = event.files[0]
      if (file) {
        selectedImage.value = file
        bookForm.image = file.name
      }
    } catch (error) {
      console.error('Error in image selection:', error)
    }
  }
  
  const onImageClear = () => {
    try {
      selectedImage.value = null
      bookForm.image = ''
    } catch (error) {
      console.error('Error clearing image:', error)
    }
  }
  
  return {
    dialogVisible,
    submitting,
    selectedImage,
    errors,
    isEditing,
    currentBookId,
    bookForm,
    resetForm,
    openDialog,
    closeDialog,
    onImageSelect,
    onImageClear
  }
} 