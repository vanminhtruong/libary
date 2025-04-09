<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('borrowing.dialog.fine.title')"
    :modal="true"
    :style="{ width: '400px' }"
    class="dark:bg-gray-800"
    headerClassName="dark:bg-gray-800 dark:text-white"
    contentClassName="dark:bg-gray-800"
  >
    <div class="flex flex-col gap-4 p-4">
      <div class="field">
        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('borrowing.dialog.fine.amount') }}
        </label>
        <InputNumber
          id="amount"
          v-model="formData.amount"
          :min="0"
          mode="currency"
          currency="VND"
          locale="vi-VN"
          class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          :placeholder="$t('borrowing.dialog.fine.amountPlaceholder')"
        />
      </div>

      <div class="field">
        <label for="fine_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('borrowing.dialog.fine.fineDate') }}
        </label>
        <Calendar
          id="fine_date"
          v-model="formData.fine_date"
          dateFormat="dd/mm/yy"
          class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          :placeholder="$t('borrowing.dialog.fine.fineDatePlaceholder')"
        />
      </div>

      <div class="field">
        <label for="payment_method" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('borrowing.dialog.fine.paymentMethod') }}
        </label>
        <InputText
          id="payment_method"
          v-model="formData.payment_method"
          :placeholder="$t('borrowing.dialog.fine.paymentMethodPlaceholder')"
          class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      <div class="field">
        <label for="reason" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ $t('borrowing.dialog.fine.reason') }}
        </label>
        <Textarea
          id="reason"
          v-model="formData.reason"
          rows="3"
          class="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Enter reason for fine"
        />
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('borrowing.dialog.fine.cancel')"
        icon="pi pi-times"
        @click="close"
        class="p-button-text"
      />
      <Button
        :label="$t('borrowing.dialog.fine.submit')"
        icon="pi pi-check"
        @click="submit"
        :loading="submitting"
        severity="warning"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const { t } = useI18n()

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  borrowingId: {
    type: [Number, String],
    default: null
  },
  userId: {
    type: [Number, String],
    default: null
  },
  submitting: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:visible', 'submit'])

// Data
const formData = reactive({
  borrow_id: null,
  user_id: null,
  amount: 0,
  fine_date: new Date(),
  payment_method: '',
  reason: 'overdue',
  status: 'pending'
})

// Watch for changes in borrowingId prop
watch(() => props.borrowingId, (newValue) => {
  if (newValue) {
    formData.borrow_id = newValue
    // Tìm thông tin user_id từ selectedBorrowing
    formData.user_id = props.userId || null
  }
}, { immediate: true })

// Methods
const close = () => {
  emit('update:visible', false)
}

const submit = () => {
  emit('submit', { ...formData })
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style> 