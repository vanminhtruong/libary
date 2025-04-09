<template>
  <div>
    <DataTable :value="books" :paginator="true" :rows="10" 
              :rowsPerPageOptions="[5,10,20]" responsiveLayout="scroll"
              :loading="loading">
      <Column :header="$t('book.table.stt')">
        <template #body="slotProps">
          {{ books.indexOf(slotProps.data) + 1 }}
        </template>
      </Column>
      <Column field="title" :header="$t('book.table.name')"></Column>
      <Column field="author" :header="$t('book.table.author')"></Column>
      <Column field="available_copies" :header="$t('book.table.status')">
        <template #body="slotProps">
          <Tag :severity="slotProps.data.available_copies > 0 ? 'success' : 'danger'">
            {{ slotProps.data.available_copies > 0 ? $t('book.table.available') : $t('book.table.outOfStock') }}
          </Tag>
        </template>
      </Column>
      <Column :header="$t('book.table.actions')">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" 
                 @click="viewBookDetails(slotProps.data)" />
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" 
                  @click="editBook(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" 
                  @click="confirmDelete(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
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
  books: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view', 'edit', 'delete'])

// Methods
const viewBookDetails = (book) => {
  emit('view', book)
}

const editBook = (book) => {
  emit('edit', book)
}

const confirmDelete = (book) => {
  emit('delete', book)
}
</script>

<style scoped>
/* No additional styles needed as they're inherited from the parent component */
</style> 