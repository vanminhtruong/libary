export default {
    title: 'Quản lý phạt',
    noData: 'Chưa có dữ liệu phạt',
    fields: {
        no: 'STT',
        user: 'Người dùng',
        book: 'Sách',
        amount: 'Số tiền',
        fineDate: 'Ngày phạt',
        status: 'Trạng thái',
        paymentMethod: 'Phương thức thanh toán',
        actions: 'Thao tác'
    },
    status: {
        pending: 'Chưa thanh toán',
        paid: 'Đã thanh toán',
        cancelled: 'Đã hủy'
    },
    actions: {
        viewDetails: 'Xem chi tiết',
        confirmPayment: 'Xác nhận thanh toán',
        cancel: 'Hủy phạt'
    },
    dialog: {
        details: {
            title: 'Chi tiết khoản phạt',
            user: 'Người dùng',
            book: 'Sách',
            amount: 'Số tiền',
            fineDate: 'Ngày phạt',
            status: 'Trạng thái',
            paymentMethod: 'Phương thức thanh toán',
            reason: 'Lý do phạt'
        }
    },
    messages: {
        paymentSuccess: 'Đã xác nhận thanh toán thành công',
        cancelSuccess: 'Đã hủy khoản phạt thành công'
    }
}
