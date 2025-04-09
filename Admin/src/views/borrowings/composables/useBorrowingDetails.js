import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useBorrowingDetails() {
  const { t } = useI18n()
  
  const detailsDialogVisible = ref(false)
  const selectedBorrowing = ref(null)
  const imageError = ref(false)
  
  const viewDetails = (borrowing) => {
    selectedBorrowing.value = borrowing
    detailsDialogVisible.value = true
    imageError.value = false
  }
  
  const closeDetailsDialog = () => {
    detailsDialogVisible.value = false
    selectedBorrowing.value = null
  }
  
  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return t('borrowing.notAvailable')
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('default', { 
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  }
  
  // Get status severity for Tag component
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
  
  // Get translated status label
  const getStatusLabel = (status) => {
    return t(`borrowing.status.${status}`) || status
  }
  
  // Handle image loading error
  const handleImageError = () => {
    imageError.value = true
  }
  
  // Get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/book-placeholder.png'
    
    // Check if image path is already a URL
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Otherwise, construct URL from image path
    return `/images/${imagePath}`
  }
  
  return {
    detailsDialogVisible,
    selectedBorrowing,
    imageError,
    viewDetails,
    closeDetailsDialog,
    formatDate,
    getStatusSeverity,
    getStatusLabel,
    handleImageError,
    getImageUrl
  }
} 