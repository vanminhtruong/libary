<template>
  <Dialog :visible="visible" 
         @update:visible="$emit('update:visible', $event)" 
         :header="isEditing ? $t('category.editCategory') : $t('category.addCategory')"
         modal 
         :style="{width: '450px'}" 
         class="p-fluid dark:bg-gray-800"
         headerClassName="dark:bg-gray-800 dark:text-white"
         contentClassName="dark:bg-gray-800">
    <div class="field">
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ $t('category.form.name.label') }}
      </label>
      <InputText id="name" v-model="formData.name" 
                :class="{'p-invalid': errors.name, 'w-full dark:bg-gray-700 dark:text-white dark:border-gray-600': true}"
                :placeholder="$t('category.form.name.placeholder')"
                required autofocus />
      <small class="p-error" v-if="errors.name">{{ errors.name[0] }}</small>
    </div>
    <div class="field">
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ $t('category.form.description.label') }}
      </label>
      <Textarea id="description" v-model="formData.description" 
               :class="{'p-invalid': errors.description, 'w-full dark:bg-gray-700 dark:text-white dark:border-gray-600': true}"
               :placeholder="$t('category.form.description.placeholder')"
               rows="3" />
      <small class="p-error" v-if="errors.description">{{ errors.description[0] }}</small>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :label="$t('category.button.cancel')" 
               icon="pi pi-times" 
               @click="close" 
               class="p-button-text" 
               :disabled="submitting" />
        <Button :label="$t('category.button.save')" 
               icon="pi pi-check" 
               @click="save" 
               class="p-button-primary" 
               :loading="submitting" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  categoryData: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  submitting: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:visible', 'save'])

// Data
const formData = reactive({
  name: '',
  description: ''
})

// Watch for changes in categoryData prop
watch(() => props.categoryData, (newValue) => {
  if (newValue) {
    // Copy properties from categoryData to formData
    Object.keys(formData).forEach(key => {
      if (newValue[key] !== undefined) {
        formData[key] = newValue[key]
      }
    })
  }
}, { immediate: true, deep: true })

// Methods
const close = () => {
  emit('update:visible', false)
}

const save = () => {
  emit('save', { ...formData })
}
</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

:deep(.p-inputtext),
:deep(.p-textarea) {
  width: 100%;
}

.p-error {
  display: block;
  margin-top: 0.5rem;
  color: var(--red-500);
  font-size: 0.875rem;
}
</style> 