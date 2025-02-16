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
        createFine: 'Xử lý phạt',
        markAsPaid: 'Đánh dấu đã thanh toán',
        cancelFine: 'Hủy phạt'
    },
    dialog: {
        fine: {
            title: 'Xử lý phạt',
            amount: 'Số tiền phạt',
            amountPlaceholder: 'Nhập số tiền phạt',
            fineDate: 'Ngày phạt',
            fineDatePlaceholder: 'Chọn ngày phạt',
            paymentMethod: 'Phương thức thanh toán',
            paymentMethodPlaceholder: 'Nhập phương thức thanh toán',
            reason: 'Lý do phạt',
            submit: 'Xác nhận',
            cancel: 'Hủy'
        }
    },
    toast: {
        fine: {
            success: 'Thành công',
            error: 'Lỗi',
            created: 'Đã xử lý phạt thành công',
            createError: 'Không thể xử lý phạt',
            paid: 'Đã đánh dấu thanh toán thành công',
            payError: 'Không thể đánh dấu thanh toán',
            cancelled: 'Đã hủy phạt thành công',
            cancelError: 'Không thể hủy phạt'
        }
    },
    messages: {
        fineCreated: 'Đã xử lý phạt thành công',
        approveSuccess: 'Đã duyệt yêu cầu mượn sách',
        rejectSuccess: 'Đã từ chối yêu cầu mượn sách'
    }
}
