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
    createFine(data) {
        return POST('/admin/fines', data)
    },
    markFineAsPaid(id) {
        return POST(`/admin/fines/${id}/pay`)
    },
    cancelFine(id) {
        return POST(`/admin/fines/${id}/cancel`)
    }
}

export default BorrowingsService;