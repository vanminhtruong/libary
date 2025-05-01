export default {
    title: 'Quản lý mượn sách',
    noData: 'Chưa có dữ liệu mượn trả',
    fields: {
        no: 'STT',
        borrower: 'Người mượn',
        book: 'Sách',
        borrowDate: 'Ngày mượn',
        dueDate: 'Ngày hẹn trả',
        status: 'Trạng thái',
        actions: 'Thao tác',
        reason: 'Lý do'
    },
    uncategorized: 'Chưa phân loại',
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
        success: 'Thành công',
        error: 'Lỗi',
        loadError: 'Không thể tải danh sách mượn sách',
        approveError: 'Không thể phê duyệt yêu cầu',
        rejectError: 'Không thể từ chối yêu cầu',
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
    },
    placeholder: {
        reason: 'Nhập lý do từ chối...'
    },
    validation: {
        reasonRequired: 'Lý do không được để trống'
    }
}
