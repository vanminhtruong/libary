<template>
    <div class="card">
        <div class="text-center uppercase">
            <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ $t('category.title') }}</h1>
        </div>

        <div class="flex justify-content-end mb-3">
            <Button :label="$t('category.addCategory')" icon="pi pi-plus" @click="openForm()" />
        </div>

        <CategoryTable 
            :categories="categories" 
            :loading="loading"
            @view-details="viewCategoryDetails"
            @edit="editCategory"
            @delete="deleteCategory"
        />

        <CategoryDetailDialog
            :visible="detailsDialogVisible"
            @update:visible="detailsDialogVisible = $event"
            :category="selectedCategory"
            @edit="editCategory"
        />

        <CategoryFormDialog
            :visible="dialogVisible"
            @update:visible="dialogVisible = $event"
            :category-data="categoryForm"
            :is-editing="isEditing"
            :submitting="submitting"
            :errors="errors"
            @save="handleSubmit"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import CategoryTable from './components/CategoryTable.vue'
import CategoryDetailDialog from './components/CategoryDetailDialog.vue'
import CategoryFormDialog from './components/CategoryFormDialog.vue'
import { useCategories, useCategoryForm, useCategoryDetails } from './composables'

const { t } = useI18n()

// Use composables
const { categories, loading, saveCategory, loadCategories, deleteCategory: confirmDeleteCategory } = useCategories()
const { 
    dialogVisible, 
    submitting, 
    errors, 
    isEditing, 
    currentCategoryId, 
    categoryForm, 
    openDialog, 
    closeDialog 
} = useCategoryForm()
const { 
    detailsDialogVisible, 
    selectedCategory, 
    categoryBooks, 
    viewCategoryDetails 
} = useCategoryDetails()

// Methods
const openForm = () => {
    openDialog()
}

const editCategory = (category) => {
    if (detailsDialogVisible.value) {
        detailsDialogVisible.value = false
    }
    openDialog(true, category)
}

const deleteCategory = (category) => {
    confirmDeleteCategory(category)
}

const handleSubmit = async (formData) => {
    submitting.value = true
    errors.value = {}
    
    try {
        const result = await saveCategory(formData, isEditing.value, currentCategoryId.value)
        
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
    loadCategories()
})
</script>

<style scoped>
/* No additional styles needed as they're in the component files */
</style>