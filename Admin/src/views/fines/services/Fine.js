import { GET, POST, DELETE } from '../../../service/ApiService'

export const FineService = {
    getFines() {
        return GET('/admin/fines')
    },
    createFine(data) {
        return POST('/admin/fines', data)
    },
    markAsPaid(id) {
        return POST(`/admin/fines/${id}/pay`)
    },
    cancel(id) {
        return POST(`/admin/fines/${id}/cancel`)
    },
    delete(id) {
        return DELETE(`/admin/fines/${id}`)
    }
}

export default FineService

