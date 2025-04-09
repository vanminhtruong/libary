<template>
  <DataTable :value="categories" :paginator="true" :rows="10" 
            :rowsPerPageOptions="[5,10,20]" responsiveLayout="scroll"
            :loading="loading"
            class="p-datatable-sm">
    <Column :header="$t('category.table.stt')" style="width: 80px">
      <template #body="{ index }">
        {{ index + 1 }}
      </template>
    </Column>
    <Column field="name" :header="$t('category.table.name')"></Column>
    <Column field="description" :header="$t('category.table.description')"></Column>
    <Column :header="$t('category.table.actions')" style="width: 200px">
      <template #body="slotProps">
        <div class="flex gap-2">
          <Button icon="pi pi-eye" 
                  class="p-button-rounded p-button-info mr-2" 
                  @click="viewDetails(slotProps.data)" 
                  :tooltip="$t('category.actions.viewDetails')" />
          <Button icon="pi pi-pencil" 
                  class="p-button-rounded p-button-success mr-2" 
                  @click="editCategory(slotProps.data)" 
                  :tooltip="$t('category.button.edit')" />
          <Button icon="pi pi-trash" 
                  class="p-button-rounded p-button-danger" 
                  @click="confirmDelete(slotProps.data)" 
                  :tooltip="$t('category.button.delete')" />
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

const { t } = useI18n()

// Props
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-details', 'edit', 'delete'])

// Methods
const viewDetails = (category) => {
  emit('view-details', category)
}

const editCategory = (category) => {
  emit('edit', category)
}

const confirmDelete = (category) => {
  emit('delete', category)
}
</script>

<style scoped>
/* No additional styles needed */
</style> 