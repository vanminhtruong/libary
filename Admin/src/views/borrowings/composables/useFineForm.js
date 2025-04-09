import { ref, reactive } from 'vue'

export default function useFineForm() {
  const showFineDialog = ref(false)
  const submitting = ref(false)
  
  const newFine = reactive({
    borrow_id: null,
    user_id: null,
    amount: 0,
    fine_date: new Date(),
    payment_method: '',
    reason: 'overdue',
    status: 'pending'
  })
  
  const resetForm = () => {
    newFine.borrow_id = null
    newFine.user_id = null
    newFine.amount = 0
    newFine.fine_date = new Date()
    newFine.payment_method = ''
    newFine.reason = 'overdue'
    newFine.status = 'pending'
  }
  
  const openFineDialog = (borrowingId, userId) => {
    resetForm()
    newFine.borrow_id = borrowingId
    newFine.user_id = userId
    showFineDialog.value = true
  }
  
  const closeFineDialog = () => {
    showFineDialog.value = false
    resetForm()
  }
  
  return {
    showFineDialog,
    submitting,
    newFine,
    resetForm,
    openFineDialog,
    closeFineDialog
  }
} 