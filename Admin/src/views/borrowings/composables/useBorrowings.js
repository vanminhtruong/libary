import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { BorrowingsService } from '../services/Borrowings'

export default function useBorrowings() {
  const { t } = useI18n()
  const toast = useToast()
  
  const borrowings = ref([])
  const loading = ref(false)
  
  const loadBorrowings = async () => {
    try {
      loading.value = true
      const response = await BorrowingsService.getBorrowings()
      borrowings.value = response.data
    } catch (error) {
      console.error('Error loading borrowings:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: t('borrowing.toast.loadError'),
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }
  
  const approveBorrowing = async (id) => {
    try {
      loading.value = true
      await BorrowingsService.approveBorrowing(id)
      toast.add({
        severity: 'success',
        summary: t('borrowing.toast.success'),
        detail: t('borrowing.messages.approveSuccess'),
        life: 3000
      })
      await loadBorrowings()
      return true
    } catch (error) {
      console.error('Error approving borrowing:', error)
      toast.add({
        severity: 'error',
        summary: t('borrowing.toast.error'),
        detail: t('borrowing.toast.approveError'),
        life: 3000
      })
      return false
    } finally {
      loading.value = false
    }
  }
  
  const rejectBorrowing = async (id, reason) => {
    try {
      loading.value = true
      await BorrowingsService.rejectBorrowing(id, reason)
      toast.add({
        severity: 'success',
        summary: t('borrowing.toast.success'),
        detail: t('borrowing.messages.rejectSuccess'),
        life: 3000
      })
      await loadBorrowings()
      return true
    } catch (error) {
      console.error('Error rejecting borrowing:', error)
      toast.add({
        severity: 'error',
        summary: t('borrowing.toast.error'),
        detail: t('borrowing.toast.rejectError'),
        life: 3000
      })
      return false
    } finally {
      loading.value = false
    }
  }
  
  const createFine = async (data) => {
    try {
      loading.value = true
      await BorrowingsService.createFine(data)
      toast.add({
        severity: 'success',
        summary: t('borrowing.toast.success'),
        detail: t('borrowing.toast.fine.created'),
        life: 3000
      })
      return true
    } catch (error) {
      console.error('Error creating fine:', error)
      toast.add({
        severity: 'error',
        summary: t('borrowing.toast.error'),
        detail: t('borrowing.toast.fine.createError'),
        life: 3000
      })
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    borrowings,
    loading,
    loadBorrowings,
    approveBorrowing,
    rejectBorrowing,
    createFine
  }
} 