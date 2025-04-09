import { GET, POST, PUT, DELETE } from '../../../service/ApiService'

export const BorrowingsService = {
    getBorrowings() {
        return GET('/admin/borrowings')
    },
    approveBorrowing(id) {
        return POST(`/admin/borrowings/approve/${id}`)
    },
    rejectBorrowing(id, reason) {
        const data = { reason }
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return POST(`/admin/borrowings/reject/${id}`, data, config)
    },
    // Fine management methods
    createFine(data) {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return POST('/admin/fines', data, config)
    },
    markFineAsPaid(id) {
        return POST(`/admin/fines/${id}/pay`)
    },
    cancelFine(id) {
        return POST(`/admin/fines/${id}/cancel`)
    }
}

export default BorrowingsService;