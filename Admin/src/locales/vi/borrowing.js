export default {
    title: 'Quản lý mượn sách',
    fields: {
        no: 'STT',
        borrower: 'Người mượn',
        book: 'Sách',
        borrowDate: 'Ngày mượn',
        dueDate: 'Ngày hẹn trả',
        status: 'Trạng thái',
        actions: 'Thao tác'
    },
    status: {
        pending: 'Chờ duyệt',
        borrowed: 'Đang mượn',
        approved: 'Đã duyệt',
        rejected: 'Từ chối',
        returned: 'Đã trả',
        overdue: 'Quá hạn'
    },
    actions: {
        viewDetails: 'Xem chi tiết',
        approve: 'Duyệt',
        reject: 'Từ chối',
        createFine: 'Tạo phiếu phạt'
    },
    dialog: {
        fine: {
            title: 'Tạo phiếu phạt',
            amount: 'Số tiền phạt',
            reason: 'Lý do phạt',
            submit: 'Xác nhận',
            cancel: 'Hủy'
        }
    },
    messages: {
        fineCreated: 'Đã tạo phiếu phạt thành công',
        approveSuccess: 'Đã duyệt yêu cầu mượn sách',
        rejectSuccess: 'Đã từ chối yêu cầu mượn sách'
    }
}
