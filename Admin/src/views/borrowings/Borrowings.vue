<template>
    <div class="card">
        <h1 class="text-3xl font-bold mb-6 text-center uppercase mb-[40px]">{{ t('borrowing.title') }}</h1>
        <DataTable
            :value="borrowings"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            responsiveLayout="scroll"
            class="p-datatable-sm"
            :loading="loading"
        >
            <Column field="id" :header="t('borrowing.fields.no')" style="width: 80px">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <Column field="user.name" :header="t('borrowing.fields.borrower')">
                <template #body="{ data }">
                    <div class="flex items-center">
                        <div>
                            <p class="font-medium">{{ data.user?.name }}</p>
                            <p class="text-sm text-gray-500">{{ data.user?.email }}</p>
                        </div>
                    </div>
                </template>
            </Column>
            <Column field="book.title" :header="t('borrowing.fields.book')">
                <template #body="{ data }">
                    <div class="flex items-center">
                        <div>
                            <p class="font-medium">{{ data.book?.title }}</p>
                            <p class="text-sm text-gray-500">{{ data.book?.author }}</p>
                        </div>
                    </div>
                </template>
            </Column>
            <Column field="borrow_date" :header="t('borrowing.fields.borrowDate')">
                <template #body="{ data }">
                    {{ formatDate(data.borrow_date) }}
                </template>
            </Column>
            <Column field="due_date" :header="t('borrowing.fields.dueDate')">
                <template #body="{ data }">
                    {{ formatDate(data.due_date) }}
                </template>
            </Column>
            <Column field="status" :header="t('borrowing.fields.status')">
                <template #body="{ data }">
                    <Tag :severity="getStatusSeverity(data.status)" :value="getStatusLabel(data.status)" />
                </template>
            </Column>
            <Column :header="t('borrowing.fields.actions')" style="width: 200px">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-eye"
                            severity="info"
                            @click="viewDetails(data)"
                            :tooltip="t('borrowing.actions.viewDetails')"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Details Dialog -->
        <Dialog
            :visible="showDetailsDialog"
            @update:visible="showDetailsDialog = $event"
            :header="selectedBorrowing?.book?.title"
            :modal="true"
            :style="{ width: '500px' }"
            class="dark:bg-gray-800"
            headerClassName="dark:bg-gray-800 dark:text-white"
            contentClassName="dark:bg-gray-800"
        >
            <div v-if="selectedBorrowing" class="space-y-4">
                <div class="p-4 flex items-center gap-6 surface-card border-round dark:bg-gray-700/50 dark:border-gray-700">
                    <div class="relative w-[180px] h-[240px] surface-ground border-round overflow-hidden dark:bg-gray-800">
                        <img 
                            :src="getImageUrl(selectedBorrowing.book?.image)" 
                            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            alt="Book cover"
                            @error="handleImageError"
                            ref="bookImage"
                        />
                        <div v-if="imageError" class="absolute inset-0 flex items-center justify-center surface-ground dark:bg-gray-800">
                            <i class="pi pi-image text-500 text-4xl"></i>
                        </div>
                    </div>
                    <div class="flex-1 space-y-3">
                        <h3 class="text-2xl font-bold text-900 leading-tight dark:text-white">{{ selectedBorrowing.book?.title }}</h3>
                        <p class="text-lg text-700 dark:text-gray-300">{{ selectedBorrowing.book?.author }}</p>
                        <div class="flex items-center gap-2 text-sm text-500 dark:text-gray-400">
                            <i class="pi pi-book"></i>
                            <span>{{ selectedBorrowing.book?.category || 'Chưa phân loại' }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-500 dark:text-gray-400">
                            <i class="pi pi-calendar"></i>
                            <span>{{ selectedBorrowing.book?.published_year || 'N/A' }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-4 surface-card border-round dark:bg-gray-700/50 dark:border-gray-700">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-500 mb-2 dark:text-gray-400">{{ t('borrowing.fields.borrower') }}</p>
                            <p class="text-900 font-medium dark:text-white">{{ selectedBorrowing.user?.name }}</p>
                            <p class="text-600 text-sm dark:text-gray-300">{{ selectedBorrowing.user?.email }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2 dark:text-gray-400">{{ t('borrowing.fields.borrowDate') }}</p>
                            <p class="text-900 font-medium dark:text-white">{{ formatDate(selectedBorrowing.borrow_date) }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2 dark:text-gray-400">{{ t('borrowing.fields.dueDate') }}</p>
                            <p class="text-900 font-medium dark:text-white">{{ formatDate(selectedBorrowing.due_date) }}</p>
                        </div>
                        <div>
                            <p class="text-500 mb-2 dark:text-gray-400">{{ t('borrowing.fields.status') }}</p>
                            <Tag :severity="getStatusSeverity(selectedBorrowing.status)" :value="getStatusLabel(selectedBorrowing.status)" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 pt-4">
                    <!-- Approve/Reject buttons for pending status -->
                    <template v-if="selectedBorrowing.status === 'pending'">
                        <Button
                            :label="t('borrowing.actions.reject')"
                            icon="pi pi-times"
                            severity="danger"
                            @click="handleReject(selectedBorrowing.id)"
                            class="p-button-outlined"
                        />
                        <Button
                            :label="t('borrowing.actions.approve')"
                            icon="pi pi-check"
                            severity="success"
                            @click="handleApprove(selectedBorrowing.id)"
                        />
                    </template>

                    <!-- Fine button for all statuses -->
                    <Button
                        :label="t('borrowing.actions.createFine')"
                        icon="pi pi-exclamation-triangle"
                        severity="warning"
                        @click="openFineDialog"
                        class="p-button-outlined"
                    />
                </div>
            </div>
        </Dialog>

        <!-- Fine Dialog -->
        <Dialog
            :visible="showFineDialog"
            @update:visible="showFineDialog = $event"
            :header="t('borrowing.dialog.fine.title')"
            :modal="true"
            :style="{ width: '400px' }"
            class="dark:bg-gray-800"
            headerClassName="dark:bg-gray-800 dark:text-white"
            contentClassName="dark:bg-gray-800"
        >
            <div class="flex flex-col gap-4 p-4">
                <div class="field">
                    <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('borrowing.dialog.fine.amount') }}</label>
                    <InputNumber
                        id="amount"
                        v-model="newFine.amount"
                        :min="0"
                        mode="currency"
                        currency="VND"
                        locale="vi-VN"
                        class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        :placeholder="t('borrowing.dialog.fine.amountPlaceholder')"
                    />
                </div>

                <div class="field">
                    <label for="fine_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('borrowing.dialog.fine.fineDate') }}</label>
                    <Calendar
                        id="fine_date"
                        v-model="newFine.fine_date"
                        dateFormat="dd/mm/yy"
                        class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        :placeholder="t('borrowing.dialog.fine.fineDatePlaceholder')"
                    />
                </div>

                <div class="field">
                    <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('borrowing.dialog.fine.paymentMethod') }}</label>
                    <InputText
                        id="payment_method"
                        v-model="newFine.payment_method"
                        :placeholder="t('borrowing.dialog.fine.paymentMethodPlaceholder')"
                        class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>
            </div>

            <template #footer>
                <Button
                    :label="t('borrowing.dialog.fine.cancel')"
                    icon="pi pi-times"
                    @click="showFineDialog = false"
                    class="p-button-text"
                />
                <Button
                    :label="t('borrowing.dialog.fine.submit')"
                    icon="pi pi-check"
                    @click="handleCreateFine"
                    :loading="loading"
                    severity="warning"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { BorrowingsService } from './services/Borrowings'
import { FineService } from '../fines/services/Fine'

// Components
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'

const { t } = useI18n()
const toast = useToast()
const borrowings = ref([])
const showDetailsDialog = ref(false)
const showFineDialog = ref(false)
const selectedBorrowing = ref(null)
const newFine = ref({
    amount: 0,
    fine_date: new Date(),
    payment_method: '',
    borrowing_id: null
})
const imageError = ref(false)
const bookImage = ref(null)
const loading = ref(false)

// Load borrowings
const loadBorrowings = async () => {
    try {
        loading.value = true
        const response = await BorrowingsService.getBorrowings()
        if (response.success) {
            borrowings.value = response.data
        } else {
            toast.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: response.message || 'Không thể tải danh sách mượn sách',
                life: 3000
            })
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.message || 'Không thể tải danh sách mượn sách',
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

// Handle approve
const handleApprove = async (id) => {
    try {
        const response = await BorrowingsService.approveBorrowing(id)
        toast.add({
            severity: 'success',
            summary: 'Thành công',
            detail: response.message || 'Đã phê duyệt yêu cầu mượn sách',
            life: 3000
        })
        await loadBorrowings()
        showDetailsDialog.value = false
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.message || 'Không thể phê duyệt yêu cầu',
            life: 3000
        })
    }
}

// Handle reject
const handleReject = async (id) => {
    try {
        const response = await BorrowingsService.rejectBorrowing(id)
        toast.add({
            severity: 'success',
            summary: 'Thành công',
            detail: response.message || 'Đã từ chối yêu cầu mượn sách',
            life: 3000
        })
        await loadBorrowings()
        showDetailsDialog.value = false
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: error.message || 'Không thể từ chối yêu cầu',
            life: 3000
        })
    }
}

// View details
const viewDetails = (borrowing) => {
    selectedBorrowing.value = borrowing
    showDetailsDialog.value = true
}

// Status utilities
const getStatusSeverity = (status) => {
    const map = {
        pending: 'warning',
        borrowed: 'success',
        returned: 'info',
        rejected: 'danger',
        overdue: 'danger'
    }
    return map[status] || 'info'
}

const getStatusLabel = (status) => {
    return t(`borrowing.status.${status}`)
}

// Format date
const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// Get image URL
const getImageUrl = (filename) => {
    if (!filename) return '/images/book-placeholder.png'
    if (filename.startsWith('http')) return filename
    return `${import.meta.env.VITE_API_URL}/books/image/${filename.replace('profile_image/', '')}`
}

// Handle create fine
const handleCreateFine = async () => {
    try {
        loading.value = true
        const fineData = {
            borrow_id: selectedBorrowing.value.id,
            user_id: selectedBorrowing.value.user.id,
            amount: newFine.value.amount,
            fine_date: newFine.value.fine_date,
            payment_method: newFine.value.payment_method,
            status: 'pending'
        }

        await BorrowingsService.createFine(fineData)
        
        toast.add({
            severity: 'success',
            summary: t('borrowing.toast.fine.success'),
            detail: t('borrowing.toast.fine.created'),
            life: 3000
        })
        
        showFineDialog.value = false
        // Reset form
        newFine.value = {
            amount: 0,
            fine_date: new Date(),
            payment_method: '',
            borrowing_id: null
        }
        await loadBorrowings() // Refresh the list
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('borrowing.toast.fine.error'),
            detail: error.message || t('borrowing.toast.fine.createError'),
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

const openFineDialog = () => {
    newFine.value = {
        amount: 0,
        fine_date: new Date(),
        payment_method: '',
        borrowing_id: selectedBorrowing.value.id
    }
    showFineDialog.value = true
}

// Handle mark fine as paid
const handleMarkFineAsPaid = async (id) => {
    try {
        loading.value = true
        await BorrowingsService.markFineAsPaid(id)
        toast.add({
            severity: 'success',
            summary: t('borrowing.toast.fine.success'),
            detail: t('borrowing.toast.fine.paid'),
            life: 3000
        })
        await loadBorrowings()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('borrowing.toast.fine.error'),
            detail: error.message || t('borrowing.toast.fine.payError'),
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

// Handle cancel fine
const handleCancelFine = async (id) => {
    try {
        loading.value = true
        await BorrowingsService.cancelFine(id)
        toast.add({
            severity: 'success',
            summary: t('borrowing.toast.fine.success'),
            detail: t('borrowing.toast.fine.cancelled'),
            life: 3000
        })
        await loadBorrowings()
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: t('borrowing.toast.fine.error'),
            detail: error.message || t('borrowing.toast.fine.cancelError'),
            life: 3000
        })
    } finally {
        loading.value = false
    }
}

const handleImageError = () => {
    imageError.value = true
    if (bookImage.value) {
        bookImage.value.src = '/images/book-placeholder.png'
    }
}

onMounted(() => {
    loadBorrowings()
})
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.loading-text {
    color: #4B5563;
    font-size: 0.875rem;
    font-weight: 500;
}

:deep(.p-progress-spinner) {
    width: 50px;
    height: 50px;
}

:deep(.p-progress-spinner-circle) {
    stroke: #10B981;
    stroke-width: 4;
}
</style>
