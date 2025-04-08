import { GET, POST, PUT, DELETE } from '../../../service/ApiService'

export const BorrowingsService = {
    getBorrowings() {
        return GET('/admin/borrowings')
    },
    approveBorrowing(id) {
        return POST(`/admin/borrowings/approve/${id}`)
    },
    rejectBorrowing(id) {
        return POST(`/admin/borrowings/reject/${id}`)
    },
    // Fine management methods
    getFines() {
        return GET('/admin/fines')
    },
    createFine(data) {
        return POST('/admin/fines', data)
    },
    markFineAsPaid(id) {
        return POST(`/admin/fines/${id}/pay`)
    },
    cancelFine(id) {
        return POST(`/admin/fines/${id}/cancel`)
    },
    deleteFine(id) {
        return DELETE(`/admin/fines/${id}`)
    }
}

export default BorrowingsService;