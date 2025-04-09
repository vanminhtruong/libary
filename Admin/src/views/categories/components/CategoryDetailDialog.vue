<template>
  <Dialog :visible="visible" 
         @update:visible="$emit('update:visible', $event)" 
         :header="$t('category.viewCategory')"
         modal 
         :style="{width: '450px'}"
         class="dark:bg-gray-800"
         headerClassName="dark:bg-gray-800 dark:text-white"
         contentClassName="dark:bg-gray-800">
    <div v-if="category" class="category-details">
      <div class="detail-row">
        <span class="detail-label">{{ $t('category.field.name') }}:</span>
        <span class="detail-value">{{ category.name }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">{{ $t('category.field.description') }}:</span>
        <span class="detail-value">{{ category.description || $t('category.details.noDescription') }}</span>
      </div>
    </div>
    <div v-else class="flex justify-content-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>
    <template #footer>
      <div class="flex justify-content-end">
        <Button :label="$t('category.button.close')" 
               icon="pi pi-times" 
               @click="close" 
               class="p-button-text" />
        <Button v-if="category" 
               :label="$t('category.button.edit')" 
               icon="pi pi-pencil" 
               @click="edit" 
               class="p-button-primary ml-2" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  category: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'edit'])

// Methods
const close = () => {
  emit('update:visible', false)
}

const edit = () => {
  emit('edit', props.category)
  close()
}
</script>

<style scoped>
.category-details {
  padding: 0.5rem 0;
}

.detail-row {
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
}

.detail-label {
  font-weight: 600;
  min-width: 120px;
  margin-right: 1rem;
  color: var(--surface-700);
}

.detail-value {
  flex: 1;
  color: var(--text-color);
  word-break: break-word;
}
</style>