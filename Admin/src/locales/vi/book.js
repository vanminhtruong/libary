export default {
    title: 'Quản lý sách',
    addBook: 'Thêm sách mới',
    editBook: 'Sửa sách',
    viewBook: 'Chi tiết sách',
    table: {
        stt: 'STT',
        name: 'Tên sách',
        author: 'Tác giả',
        status: 'Trạng thái',
        actions: 'Thao tác',
        available: 'Còn sách',
        outOfStock: 'Hết sách'
    },
    form: {
        basicInfo: 'Thông tin cơ bản',
        detailInfo: 'Thông tin chi tiết',
        inventoryInfo: 'Thông tin kho',
        additionalInfo: 'Thông tin bổ sung',
        name: {
            label: 'Tên sách',
            placeholder: 'Nhập tên sách'
        },
        author: {
            label: 'Tác giả',
            placeholder: 'Nhập tên tác giả'
        },
        isbn: {
            label: 'ISBN',
            placeholder: 'Nhập mã ISBN'
        },
        publisher: {
            label: 'Nhà xuất bản',
            placeholder: 'Nhập tên nhà xuất bản'
        },
        publicationYear: {
            label: 'Năm xuất bản',
            placeholder: 'Nhập năm xuất bản'
        },
        category: {
            label: 'Danh mục',
            placeholder: 'Chọn danh mục'
        },
        price: {
            label: 'Giá (VNĐ)',
            placeholder: 'Nhập giá sách'
        },
        totalCopies: {
            label: 'Tổng số bản sao',
            placeholder: 'Nhập tổng số bản'
        },
        availableCopies: {
            label: 'Số bản sao có sẵn',
            placeholder: 'Nhập số bản có sẵn'
        },
        locationShelf: {
            label: 'Vị trí kệ',
            placeholder: 'Nhập vị trí kệ sách'
        },
        description: {
            label: 'Mô tả',
            placeholder: 'Nhập mô tả sách'
        },
        image: {
            label: 'Hình ảnh',
            chooseImage: 'Chọn ảnh',
            selected: 'Đã chọn'
        }
    },
    button: {
        save: 'Lưu',
        cancel: 'Hủy',
        edit: 'Sửa',
        delete: 'Xóa',
        close: 'Đóng'
    },
    message: {
        confirmDelete: 'Bạn có chắc chắn muốn xóa sách này?',
        confirmTitle: 'Xác nhận xóa',
        success: {
            create: 'Thêm sách thành công',
            update: 'Cập nhật sách thành công',
            delete: 'Xóa sách thành công'
        },
        error: {
            load: 'Không thể tải danh sách sách',
            fetch: 'Không thể tải chi tiết sách'
        }
    }
} 