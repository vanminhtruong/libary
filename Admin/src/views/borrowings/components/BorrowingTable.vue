<template>
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
    <template #empty>
      <div class="text-center p-4">
        <i class="pi pi-info-circle text-3xl text-blue-500 mb-3"></i>
        <p>{{ $t('borrowing.noData') || 'Chưa có dữ liệu mượn trả' }}</p>
      </div>
    </template>
    <Column field="id" :header="$t('borrowing.fields.no')" style="width: 80px">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column field="user.name" :header="$t('borrowing.fields.borrower')">
      <template #body="{ data }">
        <div class="flex items-center">
          <div>
            <p class="font-medium">{{ data.user?.name }}</p>
            <p class="text-sm text-gray-500">{{ data.user?.email }}</p>
          </div>
        </div>
      </template>
    </Column>
    <Column field="book.title" :header="$t('borrowing.fields.book')">
      <template #body="{ data }">
        <div class="flex items-center">
          <div>
            <p class="font-medium">{{ data.book?.title }}</p>
            <p class="text-sm text-gray-500">{{ data.book?.author }}</p>
          </div>
        </div>
      </template>
    </Column>
    <Column field="borrow_date" :header="$t('borrowing.fields.borrowDate')">
      <template #body="{ data }">
        {{ formatDate(data.borrow_date) }}
      </template>
    </Column>
    <Column field="due_date" :header="$t('borrowing.fields.dueDate')">
      <template #body="{ data }">
        {{ formatDate(data.due_date) }}
      </template>
    </Column>
    <Column field="status" :header="$t('borrowing.fields.status')">
      <template #body="{ data }">
        <Tag :severity="getStatusSeverity(data.status)" :value="getStatusLabel(data.status)" />
      </template>
    </Column>
    <Column :header="$t('borrowing.fields.actions')" style="width: 200px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-eye"
            severity="info"
            @click="viewDetails(data)"
            :tooltip="$t('borrowing.actions.viewDetails')"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t } = useI18n()

// Props
const props = defineProps({
  borrowings: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-details'])

// Methods
const viewDetails = (borrowing) => {
  emit('view-details', borrowing)
}

// Format date utility
const formatDate = (dateString) => {
  if (!dateString) return t('borrowing.notAvailable')
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', { 
    dateStyle: 'medium'
  }).format(date)
}

// Get status severity for Tag component
const getStatusSeverity = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'borrowed': 
    case 'approved': return 'success'
    case 'rejected': return 'danger'
    case 'returned': return 'info'
    case 'overdue': return 'danger'
    default: return 'secondary'
  }
}

// Get translated status label
const getStatusLabel = (status) => {
  return t(`borrowing.status.${status}`) || status
}
</script>

<style scoped>
/* No additional styles needed */
</style> 