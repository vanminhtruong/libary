<template>
    <div class="card">
        <div class="text-center uppercase">
            <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ $t('category.title') }}</h1>
        </div>

        <div class="flex justify-content-end mb-3">
            <Button :label="$t('category.addCategory')" icon="pi pi-plus" @click="openDialog()" />
        </div>

        <DataTable :value="categories" :paginator="true" :rows="10" 
                  :rowsPerPageOptions="[5,10,20]" responsiveLayout="scroll"
                  :loading="loading">
            <Column :header="$t('category.table.stt')">
                <template #body="slotProps">
                    {{ categories.indexOf(slotProps.data) + 1 }}
                </template>
            </Column>
            <Column field="name" :header="$t('category.table.name')"></Column>
            <Column field="description" :header="$t('category.table.description')"></Column>
            <Column :header="$t('category.table.actions')">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" 
                            @click="viewCategoryDetails(slotProps.data)" />
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" 
                            @click="editCategory(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                            @click="confirmDelete(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Dialog Chi Tiết Danh Mục -->
        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <Dialog v-model:visible="detailsDialogVisible"
                :header="selectedCategory?.name"
                :modal="true"
                :style="{width: '850px'}"
                class="p-fluid">
            <div v-if="selectedCategory" class="grid">
                <div class="col-12 mb-4">
                    <h3 class="mt-0 mb-2 text-lg font-semibold">{{ $t('category.details.description') }}</h3>
                    <p class="m-0">{{ selectedCategory.description || $t('category.details.noDescription') }}</p>
                </div>
                <div class="col-12">
                    <h3 class="mt-0 mb-3 text-lg font-semibold">{{ $t('category.details.books') }}</h3>
                    <ProgressSpinner v-if="loadingBooks" style="width: 50px; height: 50px; margin: 1rem auto;" />
                    <div v-else>
                        <div v-if="categoryBooks.length === 0" class="text-center p-3">
                            {{ $t('category.details.noBooks') }}
                        </div>
                        <DataTable v-else :value="categoryBooks" 
                                  :paginator="true" 
                                  :rows="5" 
                                  :rowsPerPageOptions="[5, 10, 20]"
                                  responsiveLayout="scroll"
                                  class="p-datatable-sm">
                            <Column field="title" :header="$t('book.table.name')"></Column>
                            <Column field="author" :header="$t('book.table.author')"></Column>
                            <Column field="available_copies" :header="$t('book.table.status')">
                                <template #body="slotProps">
                                    <Tag :severity="slotProps.data.available_copies > 0 ? 'success' : 'danger'">
                                        {{ slotProps.data.available_copies > 0 ? $t('book.table.available') : $t('book.table.outOfStock') }}
                                    </Tag>
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </Dialog>

        <!-- eslint-disable-next-line vue/no-v-model-argument -->
        <Dialog v-model:visible="dialogVisible" 
                :header="isEditing ? $t('category.editCategory') : $t('category.addCategory')"
                modal 
                :style="{width: '450px'}" 
                class="p-fluid">
            <div class="field">
                <label for="name">{{ $t('category.form.name.label') }}</label>
                <InputText id="name" v-model="categoryForm.name" 
                          :class="{'p-invalid': errors.name}"
                          :placeholder="$t('category.form.name.placeholder')"
                          required autofocus />
                <small class="p-error" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
            <div class="field">
                <label for="description">{{ $t('category.form.description.label') }}</label>
                <Textarea id="description" v-model="categoryForm.description" 
                         :class="{'p-invalid': errors.description}"
                         :placeholder="$t('category.form.description.placeholder')"
                         rows="3" />
                <small class="p-error" v-if="errors.description">{{ errors.description[0] }}</small>
            </div>
            <template #footer>
                <div class="flex justify-content-end gap-2">
                    <Button :label="$t('category.button.cancel')" icon="pi pi-times" @click="closeDialog" 
                           class="p-button-text" :disabled="submitting" />
                    <Button :label="$t('category.button.save')" icon="pi pi-check" @click="handleSubmit" 
                           class="p-button-primary" :loading="submitting" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { useI18n } from 'vue-i18n'
import CategoriesService from './services/Categories'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const categories = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const errors = ref({})
const isEditing = ref(false)
const currentCategoryId = ref(null)
const isHandlingError = ref(false)
const loading = ref(false)
const detailsDialogVisible = ref(false)
const selectedCategory = ref(null)
const categoryBooks = ref([])
const loadingBooks = ref(false)

const categoryForm = ref({
    name: '',
    description: ''
})

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

const openDialog = () => {
    isEditing.value = false
    currentCategoryId.value = null
    categoryForm.value = {
        name: '',
        description: ''
    }
    dialogVisible.value = true
}

const closeDialog = () => {
    dialogVisible.value = false
    errors.value = {}
    categoryForm.value = {
        name: '',
        description: ''
    }
}

const editCategory = (category) => {
    isEditing.value = true
    currentCategoryId.value = category.id
    categoryForm.value = {
        name: category.name,
        description: category.description
    }
    dialogVisible.value = true
}

const handleSubmit = async () => {
    try {
        submitting.value = true
        errors.value = {}

        let response
        if (isEditing.value) {
            response = await CategoriesService.updateCategory(currentCategoryId.value, categoryForm.value)
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: t('category.message.success.update'),
                life: 3000
            })
        } else {
            response = await CategoriesService.createCategory(categoryForm.value)
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: t('category.message.success.create'),
                life: 3000
            })
        }

        closeDialog()
        loadCategories()
    } catch (error) {
        console.error('Error saving category:', error)
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {}
        }
    } finally {
        submitting.value = false
    }
}

const isDeleting = ref(false)
const confirmDelete = (category) => {
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
                console.log("Lỗi này xuất hiện 2 lần")
                if (error.response?.status === 400 && !isHandlingError.value) {
                    isHandlingError.value = true
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.response.data.message,
                        life: 3000
                    })
                    setTimeout(() => {
                        isHandlingError.value = false
                    }, 100)
                }
            } finally {
                isDeleting.value = false
            }
        }
    })
}

const viewCategoryDetails = async (category) => {
    try {
        selectedCategory.value = category
        detailsDialogVisible.value = true
        loadingBooks.value = true
        
        const response = await CategoriesService.getCategoryBooks(category.id)
        if (response && response.success) {
            categoryBooks.value = response.data
        } else {
            categoryBooks.value = []
        }
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

onMounted(() => {
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
:deep(.p-textarea) {
    width: 100%;
}

:deep(.p-dialog-content) {
    padding: 2rem;
}
</style>