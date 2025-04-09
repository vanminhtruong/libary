<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="borrowing?.book?.title"
    :modal="true"
    :style="{ width: '500px' }"
    class="dark:bg-gray-800"
    headerClassName="dark:bg-gray-800 dark:text-white"
    contentClassName="dark:bg-gray-800"
  >
    <div v-if="borrowing" class="space-y-4">
      <div class="p-4 flex items-center gap-6 surface-card border-round dark:bg-gray-700/50 dark:border-gray-700">
        <div class="relative w-[180px] h-[240px] surface-ground border-round overflow-hidden dark:bg-gray-800">
          <img 
            :src="getImageUrl(borrowing.book?.image)" 
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            alt="Book cover"
            @error="handleImageError"
          />
          <div v-if="imageError" class="absolute inset-0 flex items-center justify-center surface-ground dark:bg-gray-800">
            <i class="pi pi-image text-500 text-4xl"></i>
          </div>
        </div>
        <div class="flex-1 space-y-3">
          <h3 class="text-2xl font-bold text-900 leading-tight dark:text-white">{{ borrowing.book?.title }}</h3>
          <p class="text-lg text-700 dark:text-gray-300">{{ borrowing.book?.author }}</p>
          <div class="flex items-center gap-2 text-sm text-500 dark:text-gray-400">
            <i class="pi pi-book"></i>
            <span>{{ borrowing.book?.category_name || $t('borrowing.uncategorized') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-500 dark:text-gray-400">
            <i class="pi pi-calendar"></i>
            <span>{{ borrowing.book?.publication_year || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="p-4 surface-card border-round dark:bg-gray-700/50 dark:border-gray-700">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-500 mb-2 dark:text-gray-400">{{ $t('borrowing.fields.borrower') }}</p>
            <p class="text-900 font-medium dark:text-white">{{ borrowing.user?.name }}</p>
            <p class="text-600 text-sm dark:text-gray-300">{{ borrowing.user?.email }}</p>
          </div>
          <div>
            <p class="text-500 mb-2 dark:text-gray-400">{{ $t('borrowing.fields.borrowDate') }}</p>
            <p class="text-900 font-medium dark:text-white">{{ formatDate(borrowing.borrow_date) }}</p>
          </div>
          <div>
            <p class="text-500 mb-2 dark:text-gray-400">{{ $t('borrowing.fields.dueDate') }}</p>
            <p class="text-900 font-medium dark:text-white">{{ formatDate(borrowing.due_date) }}</p>
          </div>
          <div>
            <p class="text-500 mb-2 dark:text-gray-400">{{ $t('borrowing.fields.status') }}</p>
            <Tag :severity="getStatusSeverity(borrowing.status)" :value="getStatusLabel(borrowing.status)" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <!-- Approve/Reject buttons for pending status -->
        <template v-if="borrowing.status === 'pending'">
          <Button
            :label="$t('borrowing.actions.reject')"
            icon="pi pi-times"
            severity="danger"
            @click="showRejectDialog = true"
            class="p-button-outlined"
          />
          <Button
            :label="$t('borrowing.actions.approve')"
            icon="pi pi-check"
            severity="success"
            @click="approve"
          />
        </template>

        <!-- Fine button for all statuses -->
        <Button
          :label="$t('borrowing.actions.createFine')"
          icon="pi pi-exclamation-triangle"
          severity="warning"
          @click="createFine"
          class="p-button-outlined"
        />
      </div>
    </div>
    <div v-else class="flex justify-content-center p-4">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>
    
    <!-- Reject Dialog -->
    <RejectDialog
      :visible="showRejectDialog"
      @update:visible="showRejectDialog = $event"
      :borrowingId="borrowing?.id"
      :loading="loading"
      @confirm="handleReject"
    />
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import RejectDialog from './RejectDialog.vue'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  borrowing: {
    type: Object,
    default: null
  },
  imageError: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// State
const showRejectDialog = ref(false)

// Emits
const emit = defineEmits([
  'update:visible',
  'approve',
  'reject',
  'create-fine',
  'image-error'
])

// Methods
const formatDate = (dateString) => {
  if (!dateString) return t('borrowing.notAvailable')
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('default', { 
    dateStyle: 'medium'
  }).format(date)
}

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

const getStatusLabel = (status) => {
  return t(`borrowing.status.${status}`) || status
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/book-placeholder.png'
  
  // Check if image path is already a URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Otherwise, construct URL from image path
  return `/images/${imagePath}`
}

const handleImageError = () => {
  emit('image-error')
}

const approve = () => {
  emit('approve', props.borrowing.id)
}

const handleReject = (data) => {
  emit('reject', data.id, data.reason)
  showRejectDialog.value = false
}

const createFine = () => {
  emit('create-fine', props.borrowing.id, props.borrowing.user?.id)
}
</script>

<style scoped>
/* All necessary styling is handled by utility classes */
</style> 