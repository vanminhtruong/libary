<template>
  <Dialog :visible="visible"
         @update:visible="$emit('update:visible', $event)"
         :header="$t('book.viewBook')"
         :modal="true"
         :style="{width: '850px'}"
         class="p-fluid book-details-dialog"
         :showHeader="false">
    <div v-if="book" class="book-details-container">
      <!-- Header with close button -->
      <div class="details-header">
        <h2 class="text-2xl font-bold">{{ $t('book.viewBook') }}</h2>
        <Button icon="pi pi-times" class="p-button-rounded p-button-text" @click="close" />
      </div>
      
      <div class="grid">
        <!-- Left side - Book cover -->
        <div class="col-12 md:col-4 book-cover-container">
          <div class="book-cover-wrapper">
            <img 
              :src="getImageUrl(book.image)"
              class="book-cover-image"
              alt="Book cover"
              @error="(e) => e.target.src = '/assets/images/book-placeholder.png'"
            />
            <div v-if="!book.image" class="book-cover-placeholder">
              <i class="pi pi-book text-4xl"></i>
            </div>
          </div>
          
          <!-- Status badge -->
          <div class="status-badge mt-3">
            <Tag :severity="book.available_copies > 0 ? 'success' : 'danger'" class="text-sm px-3 py-2">
              <i :class="book.available_copies > 0 ? 'pi pi-check-circle mr-2' : 'pi pi-times-circle mr-2'"></i>
              {{ book.available_copies > 0 ? $t('book.table.available') : $t('book.table.outOfStock') }}
            </Tag>
          </div>
          
          <!-- Price information if available -->
          <div v-if="book.price" class="price-tag mt-3">
            <span class="text-lg font-bold">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price) }}</span>
          </div>
        </div>
        
        <!-- Right side - Book details -->
        <div class="col-12 md:col-8 book-info-container">
          <!-- Title and author -->
          <div class="book-title-section mb-4">
            <h2 class="text-2xl font-bold m-0">{{ book.title }}</h2>
            <div class="author-info mt-1">
              <i class="pi pi-user mr-2 text-500"></i>
              <span class="text-lg text-500">{{ book.author }}</span>
            </div>
          </div>
          
          <!-- Divider -->
          <div class="book-info-divider"></div>
          
          <!-- Basic info section -->
          <div class="info-section">
            <h3 class="section-header">{{ $t('book.form.basicInfo') }}</h3>
            
            <div class="grid">
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-id-card text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.isbn.label') }}</div>
                  <div class="info-value">{{ book.isbn || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-calendar text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.publicationYear.label') }}</div>
                  <div class="info-value">{{ book.publication_year || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-building text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.publisher.label') }}</div>
                  <div class="info-value">{{ book.publisher || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-tag text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.category.label') }}</div>
                  <div class="info-value">{{ book.category_name || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Inventory section -->
          <div class="info-section">
            <h3 class="section-header">{{ $t('book.form.inventoryInfo') }}</h3>
            
            <div class="grid">
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-list text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.totalCopies.label') }}</div>
                  <div class="info-value">{{ book.total_copies || '0' }}</div>
                </div>
              </div>
              
              <div class="col-12 md:col-6 info-item">
                <i class="pi pi-check-square text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.availableCopies.label') }}</div>
                  <div class="info-value">
                    <span class="font-bold" :class="{'text-green-500': book.available_copies > 0, 'text-red-500': book.available_copies <= 0}">
                      {{ book.available_copies || '0' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="col-12 md:col-6 info-item" v-if="book.location_shelf">
                <i class="pi pi-map-marker text-primary mr-2"></i>
                <div class="info-content">
                  <div class="info-label">{{ $t('book.form.locationShelf.label') }}</div>
                  <div class="info-value">{{ book.location_shelf }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Description section -->
          <div class="info-section" v-if="book.description">
            <h3 class="section-header">{{ $t('book.form.description.label') }}</h3>
            <div class="description-content p-3 surface-ground border-round">
              <p style="white-space: pre-line">{{ book.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer actions -->
      <div class="details-footer">
        <Button :label="$t('book.button.close')" icon="pi pi-times" @click="close" 
               class="p-button-outlined" />
        <Button :label="$t('book.button.edit')" icon="pi pi-pencil" @click="edit" 
               class="p-button-primary" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  selectedBook: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'edit'])

// Computed
const book = computed(() => props.selectedBook)

// Methods
const close = () => {
  emit('update:visible', false)
}

const edit = () => {
  emit('edit', book.value)
  close()
}

const getImageUrl = (filename) => {
  if (!filename) return '';
  return `${import.meta.env.VITE_API_URL}/books/image/${filename.split('/').pop()}`;
}
</script>

<style scoped>
/* Book details dialog styles */
.book-details-dialog :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

.book-details-container {
  display: flex;
  flex-direction: column;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-200);
}

.book-cover-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-cover-wrapper {
  position: relative;
  width: 220px;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background-color: var(--surface-ground);
}

.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.book-cover-image:hover {
  transform: scale(1.05);
}

.book-cover-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-200);
  color: var(--surface-500);
}

.status-badge {
  display: flex;
  justify-content: center;
}

.status-badge :deep(.p-tag) {
  font-weight: 600;
}

.price-tag {
  display: flex;
  justify-content: center;
  color: var(--primary-color);
}

.book-info-container {
  padding: 1.5rem;
  padding-left: 0;
}

.book-title-section {
  padding-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
}

.book-info-divider {
  height: 1px;
  background-color: var(--surface-200);
  margin-bottom: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.section-header {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
}

.section-header::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 1rem;
  background-color: var(--primary-color);
  margin-right: 0.5rem;
  border-radius: 2px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.info-content {
  flex: 1;
}

.info-label {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
}

.description-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-color-secondary);
}

.details-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--surface-200);
}

/* Dark mode adjustments */
:deep(.dark) .book-details-container {
  background-color: var(--surface-800);
  color: var(--surface-0);
}

:deep(.dark) .details-header,
:deep(.dark) .details-footer {
  border-color: var(--surface-700);
}

:deep(.dark) .book-info-divider {
  background-color: var(--surface-700);
}

:deep(.dark) .book-cover-wrapper {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

:deep(.dark) .book-cover-placeholder {
  background-color: var(--surface-700);
  color: var(--surface-300);
}

:deep(.dark) .description-content {
  background-color: var(--surface-700);
  color: var(--surface-200);
}

:deep(.dark) .info-label {
  color: var(--surface-300);
}
</style> 