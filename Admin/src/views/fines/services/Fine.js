import { GET, POST, DELETE } from '../../../service/ApiService'

export const FineService = {
    getFines() {
        return GET('/admin/fines')
    },
    markAsPaid(id) {
        return POST(`/admin/fines/${id}/pay`)
    },
    cancel(id) {
        return POST(`/admin/fines/${id}/cancel`)
    }
}

export default FineService

