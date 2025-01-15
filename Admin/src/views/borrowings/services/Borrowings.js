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
    }
}

export default BorrowingsService;