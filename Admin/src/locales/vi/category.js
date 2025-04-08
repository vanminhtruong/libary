export default {
    title: 'Quản lý danh mục',
    addCategory: 'Thêm danh mục mới',
    editCategory: 'Sửa danh mục',
    table: {
        stt: 'STT',
        name: 'Tên danh mục',
        description: 'Mô tả',
        actions: 'Thao tác'
    },
    form: {
        name: {
            label: 'Tên danh mục',
            placeholder: 'Nhập tên danh mục'
        },
        description: {
            label: 'Mô tả',
            placeholder: 'Nhập mô tả danh mục'
        }
    },
    button: {
        save: 'Lưu',
        cancel: 'Hủy',
        edit: 'Sửa',
        delete: 'Xóa'
    },
    details: {
        description: 'Mô tả',
        books: 'Sách trong danh mục này',
        noDescription: 'Không có mô tả',
        noBooks: 'Không có sách nào trong danh mục này'
    },
    message: {
        confirmDelete: 'Bạn có chắc chắn muốn xóa danh mục này?',
        confirmTitle: 'Xác nhận xóa',
        success: {
            create: 'Thêm danh mục thành công',
            update: 'Cập nhật danh mục thành công',
            delete: 'Xóa danh mục thành công'
        },
        error: {
            load: 'Không thể tải danh sách danh mục',
            loadBooks: 'Không thể tải sách cho danh mục này'
        }
    }
} 