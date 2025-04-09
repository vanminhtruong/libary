<template>
  <div class="card">
    <div class="text-center uppercase">
      <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ $t('book.title') }}</h1>
    </div>

    <div class="flex justify-content-end mb-3">
      <Button :label="$t('book.addBook')" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <BookTable 
      :books="books" 
      :loading="loading" 
      @view="viewBookDetails"
      @edit="editBook"
      @delete="confirmDelete" 
    />

    <BookDetailsDialog 
      :visible="detailsDialogVisible" 
      @update:visible="detailsDialogVisible = $event" 
      :selectedBook="selectedBook"
      @edit="editSelectedBook"
    />

    <BookFormDialog 
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
      :bookData="bookForm"
      :categories="categories"
      :isEditing="isEditing"
      :submitting="submitting"
      :errors="errors"
      @save="handleSubmit"
      @image-select="onImageSelect"
      @image-clear="onImageClear"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { useBooks, useCategories, useBookForm } from './composables'
import BookTable from './components/BookTable.vue'
import BookDetailsDialog from './components/BookDetailsDialog.vue'
import BookFormDialog from './components/BookFormDialog.vue'

// Use the composables
const { 
  books, 
  selectedBook, 
  loading, 
  detailsDialogVisible,
  loadBooks, 
  viewBookDetails, 
  deleteBook,
  saveBook 
} = useBooks()

const { categories, loadCategories } = useCategories()

const {
  dialogVisible,
  submitting,
  selectedImage,
  errors,
  isEditing,
  currentBookId,
  bookForm,
  openDialog,
  closeDialog,
  onImageSelect,
  onImageClear
} = useBookForm()

// Methods
const editBook = (book) => {
  openDialog(true, book)
}

const confirmDelete = (book) => {
  deleteBook(book)
}

const editSelectedBook = (book) => {
  if (book) {
    editBook(book)
    detailsDialogVisible.value = false
  }
}

const handleSubmit = async (formData) => {
    submitting.value = true
    errors.value = {}
    
  try {
    const result = await saveBook(formData, isEditing.value, currentBookId.value)
    
    if (result.success) {
      closeDialog()
    } else {
      errors.value = result.errors
    }
  } finally {
    submitting.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  loadBooks()
  loadCategories()
})
</script>

<style scoped>
/* No styles needed here as they are now in the component files */
</style>