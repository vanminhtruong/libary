export default {
    title: 'Quản lý người dùng',
    addUser: 'Thêm người dùng',
    editUser: 'Sửa người dùng',
    userDetail: 'Chi tiết người dùng',
    table: {
        stt: 'STT',
        avatar: 'Ảnh',
        name: 'Tên',
        email: 'Email',
        phone: 'Số điện thoại',
        createdAt: 'Ngày tạo',
        actions: 'Thao tác',
        notUpdated: 'Chưa cập nhật'
    },
    form: {
        name: {
            label: 'Tên người dùng',
            placeholder: 'Nhập tên người dùng'
        },
        email: {
            label: 'Email',
            placeholder: 'Nhập địa chỉ email'
        },
        password: {
            label: 'Mật khẩu',
            placeholder: 'Nhập mật khẩu',
            editHint: 'Để trống nếu không muốn thay đổi mật khẩu'
        },
        phone: {
            label: 'Số điện thoại',
            placeholder: 'Nhập số điện thoại'
        },
        image: {
            label: 'Ảnh đại diện',
            chooseImage: 'Chọn ảnh',
            selected: 'Đã chọn',
            current: 'Ảnh hiện tại'
        }
    },
    detail: {
        information: 'Thông tin chi tiết',
        timeInfo: 'Thời gian',
        status: 'Trạng thái hoạt động',
        accountStatus: 'Trạng thái tài khoản',
        verified: 'Đã xác thực',
        notVerified: 'Chưa xác thực',
        createdDate: 'Ngày tạo tài khoản',
        lastUpdate: 'Cập nhật lần cuối',
        imagePreview: 'Xem ảnh đại diện',
        clickToZoom: 'Nhấp để phóng to'
    },
    status: {
        active: 'Đang hoạt động',
        inactive: 'Bị vô hiệu hóa'
    },
    action: {
        activate: 'Kích hoạt tài khoản',
        deactivate: 'Vô hiệu hóa tài khoản'
    },
    button: {
        save: 'Lưu',
        cancel: 'Hủy',
        close: 'Đóng',
        edit: 'Sửa',
        delete: 'Xóa'
    },
    message: {
        confirmDelete: 'Bạn có chắc chắn muốn xóa người dùng này?',
        confirmTitle: 'Xác nhận xóa',
        success: {
            create: 'Thêm người dùng thành công',
            update: 'Cập nhật người dùng thành công',
            delete: 'Xóa người dùng thành công'
        },
        error: {
            load: 'Không thể tải danh sách người dùng',
            loadDetail: 'Không thể tải thông tin chi tiết người dùng',
            delete: 'Không thể xóa người dùng',
            toggleActive: 'Không thể thay đổi trạng thái hoạt động của tài khoản này'
        }
    },
    toast: {
        success: 'Thành công',
        error: 'Lỗi'
    }
} 