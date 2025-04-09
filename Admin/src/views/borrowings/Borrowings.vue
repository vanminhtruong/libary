<template>
    <div class="card">
        <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ t('borrowing.title') }}</h1>
        
        <BorrowingTable 
            :borrowings="borrowings" 
            :loading="loading"
            @view-details="viewDetails"
        />

        <BorrowingDetailDialog
            :visible="detailsDialogVisible"
            @update:visible="detailsDialogVisible = $event"
            :borrowing="selectedBorrowing"
            :image-error="imageError"
            :loading="loading"
            @approve="handleApprove"
            @reject="handleReject"
            @create-fine="openFineDialog"
            @image-error="handleImageError"
        />

        <FineDialog
            :visible="showFineDialog"
            @update:visible="showFineDialog = $event"
            :borrowing-id="selectedBorrowingId"
            :user-id="selectedBorrowingUserId"
            :submitting="submitting"
            @submit="handleCreateFine"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BorrowingTable from './components/BorrowingTable.vue'
import BorrowingDetailDialog from './components/BorrowingDetailDialog.vue'
import FineDialog from './components/FineDialog.vue'
import { useBorrowings, useBorrowingDetails, useFineForm } from './composables'

const { t } = useI18n()

// Use composables
const { borrowings, loading, loadBorrowings, approveBorrowing, rejectBorrowing, createFine } = useBorrowings()
const { 
    detailsDialogVisible, 
    selectedBorrowing, 
    imageError, 
    viewDetails, 
    closeDetailsDialog,
    handleImageError
} = useBorrowingDetails()
const { 
    showFineDialog, 
    submitting, 
    newFine, 
    openFineDialog: openFineDialogComp, 
    closeFineDialog 
} = useFineForm()

// Computed properties
const selectedBorrowingId = computed(() => selectedBorrowing.value?.id)
const selectedBorrowingUserId = computed(() => selectedBorrowing.value?.user?.id)

// Methods
const handleApprove = async (id) => {
    const success = await approveBorrowing(id)
    if (success) {
        closeDetailsDialog()
    }
}

const handleReject = async (id, reason) => {
    const success = await rejectBorrowing(id, reason)
    if (success) {
        closeDetailsDialog()
    }
}

const openFineDialog = (borrowingId, userId) => {
    openFineDialogComp(borrowingId, userId)
}

const handleCreateFine = async (fineData) => {
    submitting.value = true
    
    try {
        const success = await createFine(fineData)
        if (success) {
            closeFineDialog()
            loadBorrowings()
        }
    } finally {
        submitting.value = false
    }
}

// Lifecycle hooks
onMounted(() => {
    loadBorrowings()
})
</script>

<style scoped>
/* No additional styles needed */
</style>
