export default {
    title: 'Category Management',
    addCategory: 'Add New Category',
    editCategory: 'Edit Category',
    viewCategory: 'Category Details',
    table: {
        stt: 'No.',
        name: 'Category Name',
        description: 'Description',
        actions: 'Actions'
    },
    field: {
        name: 'Category Name',
        description: 'Description',
        createdAt: 'Created Date',
        updatedAt: 'Updated Date'
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
    actions: {
        viewDetails: 'View Details'
    },
    button: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        close: 'Close'
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
    },
    notAvailable: 'Not available',
    uncategorized: 'Uncategorized'
} 