<template>
  <div class="card">
    <div class="text-center uppercase">
      <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ $t('book.title') }}</h1>
    </div>

    <div class="flex justify-content-end mb-3">
      <Button :label="$t('book.addBook')" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <DataTable :value="books" :paginator="true" :rows="10" 
              :rowsPerPageOptions="[5,10,20]" responsiveLayout="scroll"
              :loading="loading">
      <Column :header="$t('book.table.stt')">
        <template #body="slotProps">
          {{ books.indexOf(slotProps.data) + 1 }}
        </template>
      </Column>
      <Column field="title" :header="$t('book.table.name')"></Column>
      <Column field="author" :header="$t('book.table.author')"></Column>
      <Column field="available_copies" :header="$t('book.table.status')">
        <template #body="slotProps">
          <Tag :severity="slotProps.data.available_copies > 0 ? 'success' : 'danger'">
            {{ slotProps.data.available_copies > 0 ? $t('book.table.available') : $t('book.table.outOfStock') }}
          </Tag>
        </template>
      </Column>
      <Column :header="$t('book.table.actions')">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" 
                  @click="editBook(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                  @click="confirmDelete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- eslint-disable-next-line vue/no-v-model-argument -->
    <Dialog v-model:visible="dialogVisible" 
            :header="isEditing ? $t('book.editBook') : $t('book.addBook')"
            :modal="true" 
            :style="{width: '600px'}" 
            class="p-fluid dark:bg-gray-800"
            headerClassName="dark:bg-gray-800 dark:text-white"
            contentClassName="dark:bg-gray-800">
      <div class="grid">
        <div class="col-12 mb-4">
          <div class="section-title dark:text-white">{{ $t('book.form.basicInfo') }}</div>
          <div class="section-content dark:bg-gray-700/50 dark:border-gray-700">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="title">{{ $t('book.form.name.label') }} <span class="text-red-500">*</span></label>
                  <InputText id="title" v-model="bookForm.title" 
                           :class="{'p-invalid': errors.title}"
                           :placeholder="$t('book.form.name.placeholder')"
                           required autofocus />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.title">{{ errors.title[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="author" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.author.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputText id="author" v-model="bookForm.author" 
                           :class="{'p-invalid': errors.author}"
                           :placeholder="$t('book.form.author.placeholder')"
                           class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                           required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.author">{{ errors.author[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="isbn" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.isbn.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputText id="isbn" v-model="bookForm.isbn" 
                           :class="{'p-invalid': errors.isbn}"
                           :placeholder="$t('book.form.isbn.placeholder')"
                           class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                           required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.isbn">{{ errors.isbn[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="publisher" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.publisher.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputText id="publisher" v-model="bookForm.publisher" 
                           :class="{'p-invalid': errors.publisher}"
                           :placeholder="$t('book.form.publisher.placeholder')"
                           class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                           required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.publisher">{{ errors.publisher[0] }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mb-4">
          <div class="section-title dark:text-white">{{ $t('book.form.detailInfo') }}</div>
          <div class="section-content dark:bg-gray-700/50 dark:border-gray-700">
            <div class="grid">
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="publication_year" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.publicationYear.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputNumber id="publication_year" v-model="bookForm.publication_year" 
                             :class="{'p-invalid': errors.publication_year}"
                             :placeholder="$t('book.form.publicationYear.placeholder')"
                             class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                             required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.publication_year">{{ errors.publication_year[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.category.label') }} <span class="text-red-500">*</span>
                  </label>
                  <Dropdown
                    id="category_id"
                    v-model="bookForm.category_id"
                    :options="categories"
                    optionLabel="name"
                    optionValue="id"
                    :placeholder="$t('book.form.category.placeholder')"
                    :class="{'p-invalid': errors.category_id}"
                    class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    required
                  />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.category_id">{{ errors.category_id[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.price.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputNumber id="price" v-model="bookForm.price" 
                             :class="{'p-invalid': errors.price}"
                             mode="currency" currency="VND" locale="vi-VN"
                             :placeholder="$t('book.form.price.placeholder')"
                             class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                             required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.price">{{ errors.price[0] }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mb-4">
          <div class="section-title dark:text-white">{{ $t('book.form.inventoryInfo') }}</div>
          <div class="section-content dark:bg-gray-700/50 dark:border-gray-700">
            <div class="grid">
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="total_copies" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.totalCopies.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputNumber id="total_copies" v-model="bookForm.total_copies" 
                             :class="{'p-invalid': errors.total_copies}"
                             :placeholder="$t('book.form.totalCopies.placeholder')"
                             class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                             required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.total_copies">{{ errors.total_copies[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="available_copies" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.availableCopies.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputNumber id="available_copies" v-model="bookForm.available_copies" 
                             :class="{'p-invalid': errors.available_copies}"
                             :placeholder="$t('book.form.availableCopies.placeholder')"
                             class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                             required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.available_copies">{{ errors.available_copies[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="location_shelf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.locationShelf.label') }} <span class="text-red-500">*</span>
                  </label>
                  <InputText id="location_shelf" v-model="bookForm.location_shelf" 
                           :class="{'p-invalid': errors.location_shelf}"
                           :placeholder="$t('book.form.locationShelf.placeholder')"
                           class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                           required />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.location_shelf">{{ errors.location_shelf[0] }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="section-title dark:text-white">{{ $t('book.form.additionalInfo') }}</div>
          <div class="section-content dark:bg-gray-700/50 dark:border-gray-700">
            <div class="grid">
              <div class="col-12 md:col-8">
                <div class="field">
                  <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.description.label') }}
                  </label>
                  <Textarea id="description" v-model="bookForm.description" 
                          :class="{'p-invalid': errors.description}"
                          :placeholder="$t('book.form.description.placeholder')"
                          class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          rows="5" />
                  <small class="p-error" style="color: #ff0000;" v-if="errors.description">{{ errors.description[0] }}</small>
                </div>
              </div>
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {{ $t('book.form.image.label') }}
                  </label>
                  <FileUpload
                    mode="basic"
                    name="image"
                    :auto="false"
                    accept="image/*"
                    :maxFileSize="1000000"
                    @select="onImageSelect"
                    @clear="onImageClear"
                    :chooseLabel="$t('book.form.image.chooseImage')"
                    class="p-button-outlined w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <small v-if="selectedImage" class="block mt-2 text-gray-600 dark:text-gray-300">
                    {{ $t('book.form.image.selected') }}: {{ bookForm.image }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button :label="$t('book.button.cancel')" icon="pi pi-times" @click="closeDialog" 
                 class="p-button-text" :disabled="submitting" />
          <Button :label="$t('book.button.save')" icon="pi pi-check" @click="handleSubmit" 
                 class="p-button-primary" :loading="submitting" />
        </div>
      </template>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { useI18n } from 'vue-i18n'
import BookService from '@/views/books/services/BookService'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import FileUpload from 'primevue/fileupload'
import Dropdown from 'primevue/dropdown'

const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const books = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const selectedImage = ref(null)
const errors = ref({})
const categories = ref([])
const loading = ref(false)

const bookForm = ref({
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
  image: '',
  created_at: '',
  updated_at: ''
})
const isEditing = ref(false)
const currentBookId = ref(null)

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

const openDialog = () => {
  isEditing.value = false
  currentBookId.value = null
  bookForm.value = {
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
    image: '',
    created_at: '',
    updated_at: ''
  }
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
  bookForm.value = {
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
    image: '',
    created_at: '',
    updated_at: ''
  }
}

const editBook = (book) => {
  isEditing.value = true
  currentBookId.value = book.id
  
  const bookData = { ...book }
  delete bookData.image
  delete bookData.created_at
  delete bookData.updated_at
  delete bookData.authors
  delete bookData.category
  delete bookData.category_name
  
  bookForm.value = bookData
  selectedImage.value = null
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    errors.value = {}
    
    const formData = new FormData()
    
    const skipFields = [
      'image', 
      'created_at', 
      'updated_at', 
      'authors',
      'category',
      'category_name'
    ]
    
    for (const key in bookForm.value) {
      if (!skipFields.includes(key) && bookForm.value[key] !== null && bookForm.value[key] !== '') {
        formData.append(key, bookForm.value[key])
      }
    }
    
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    let response
    if (isEditing.value) {
      response = await BookService.updateBook(currentBookId.value, formData)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: t('book.message.success.update'),
        life: 3000
      })
    } else {
      response = await BookService.createBook(formData)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: t('book.message.success.create'),
        life: 3000
      })
    }

    closeDialog()
    loadBooks()
  } catch (error) {
    console.log('Error saving book:', JSON.stringify(error.response, null, 2))
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (book) => {
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
      }
    }
  })
}

const onImageSelect = (event) => {
  const file = event.files[0]
  if (file) {
    selectedImage.value = file
    bookForm.value.image = file.name
  }
}

const onImageClear = () => {
  selectedImage.value = null
  bookForm.value.image = ''
}

const loadCategories = async () => {
  try {
    const response = await BookService.getCategories()
    console.log('Categories response:', response)
    categories.value = response || []
  } catch (error) {
    console.error('Error loading categories:', error)
    toast.add({
      severity: 'error',
      summary: t('common.error'),
      detail: t('book.message.error.loadCategories'),
      life: 3000
    })
  }
}

onMounted(() => {
  loadBooks()
  loadCategories()
})

</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-textarea),
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-inputtext.p-invalid),
:deep(.p-inputnumber.p-invalid),
:deep(.p-dropdown.p-invalid),
:deep(.p-inputnumber.p-invalid .p-inputnumber-input),
:deep(.p-invalid > .p-inputtext) {
  border: 1px solid #ff0000;
  border-radius: 6px;
}

:deep(.p-inputtext.p-invalid:enabled:hover),
:deep(.p-inputnumber.p-invalid:enabled:hover .p-inputnumber-input),
:deep(.p-dropdown.p-invalid:enabled:hover) {
  border: 1px solid #ff0000;
  border-radius: 6px;
}

:deep(.p-inputtext.p-invalid:enabled:focus),
:deep(.p-inputnumber.p-invalid .p-inputnumber-input:enabled:focus),
:deep(.p-dropdown.p-invalid.p-focus) {
  border: 1px solid #ff0000;
  border-radius: 6px;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
}

:deep(.p-inputnumber.p-invalid .p-inputnumber-input),
:deep(.p-dropdown.p-invalid .p-dropdown-label),
:deep(.p-dropdown.p-invalid .p-dropdown-trigger) {
  border: none;
  background: transparent;
}

:deep(.p-dropdown-panel) {
  background: var(--surface-0);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.1);
}

.section-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--surface-200);
}

.section-content {
  background: var(--surface-0);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--surface-200);
}

.p-error {
  display: block;
  margin-top: 0.5rem;
  color: var(--red-500);
  font-size: 0.875rem;
}

:deep(.dark) :deep(.p-inputtext),
:deep(.dark) :deep(.p-inputnumber-input),
:deep(.dark) :deep(.p-textarea),
:deep(.dark) :deep(.p-dropdown) {
  background: var(--surface-800);
  border-color: var(--surface-700);
  color: var(--surface-0);
}

:deep(.dark) :deep(.p-dropdown-panel) {
  background: var(--surface-800);
  border-color: var(--surface-700);
}

:deep(.dark) .section-title {
  color: var(--surface-0);
  border-bottom-color: var(--surface-700);
}

:deep(.dark) .section-content {
  background: var(--surface-800);
  border-color: var(--surface-700);
}
</style>