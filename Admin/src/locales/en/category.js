export default {
    title: 'Category Management',
    addCategory: 'Add New Category',
    editCategory: 'Edit Category',
    table: {
        stt: 'No.',
        name: 'Category Name',
        description: 'Description',
        actions: 'Actions'
    },
    form: {
        name: {
            label: 'Category Name',
            placeholder: 'Enter category name'
        },
        description: {
            label: 'Description',
            placeholder: 'Enter category description'
        }
    },
    button: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete'
    },
    details: {
        description: 'Description',
        books: 'Books in this category',
        noDescription: 'No description available',
        noBooks: 'No books found in this category'
    },
    message: {
        confirmDelete: 'Are you sure you want to delete this category?',
        confirmTitle: 'Confirm Delete',
        success: {
            create: 'Category created successfully',
            update: 'Category updated successfully',
            delete: 'Category deleted successfully'
        },
        error: {
            load: 'Could not load category list',
            loadBooks: 'Could not load books for this category'
        }
    }
} 