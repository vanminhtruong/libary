<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('borrowing.actions.reject')"
    :modal="true"
    :style="{ width: '450px' }"
    class="dark:bg-gray-800"
    headerClassName="dark:bg-gray-800 dark:text-white"
    contentClassName="dark:bg-gray-800"
  >
    <div class="p-fluid">
      <div class="field">
        <label for="reason" class="font-medium mb-2 block dark:text-white">{{ $t('borrowing.fields.reason') }} <span class="text-red-500">*</span></label>
        <Textarea 
          id="reason" 
          v-model="reason" 
          :placeholder="$t('borrowing.placeholder.reason')" 
          class="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="5"
          :class="{ 'p-invalid': submitted && !reason }"
          autoResize
        />
        <small v-if="submitted && !reason" class="p-error">{{ $t('borrowing.validation.reasonRequired') }}</small>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button 
          :label="$t('cancel')" 
          icon="pi pi-times" 
          @click="$emit('update:visible', false)"
          class="p-button-text dark:text-gray-300 dark:hover:bg-gray-700"
        />
        <Button 
          :label="$t('confirm')" 
          icon="pi pi-check" 
          @click="submit"
          :loading="loading"
          class="dark:bg-blue-600 dark:text-white dark:border-blue-700 dark:hover:bg-blue-700"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  borrowingId: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:visible',
  'confirm'
])

// State
const reason = ref('')
const submitted = ref(false)

// Methods
const submit = () => {
  submitted.value = true
  
  if (!reason.value) {
    return
  }
  
  emit('confirm', {
    id: props.borrowingId,
    reason: reason.value
  })
  
  // Reset form after submit
  reason.value = ''
  submitted.value = false
}
</script> 