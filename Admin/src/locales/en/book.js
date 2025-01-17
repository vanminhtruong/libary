export default {
    title: 'Book Management',
    addBook: 'Add New Book',
    editBook: 'Edit Book',
    table: {
        stt: 'No.',
        name: 'Book Name',
        author: 'Author',
        status: 'Status',
        actions: 'Actions',
        available: 'In Stock',
        outOfStock: 'Out of Stock'
    },
    form: {
        basicInfo: 'Basic Information',
        detailInfo: 'Detail Information',
        inventoryInfo: 'Inventory Information',
        additionalInfo: 'Additional Information',
        name: {
            label: 'Book Name',
            placeholder: 'Enter book name'
        },
        author: {
            label: 'Author',
            placeholder: 'Enter author name'
        },
        isbn: {
            label: 'ISBN',
            placeholder: 'Enter ISBN'
        },
        publisher: {
            label: 'Publisher',
            placeholder: 'Enter publisher name'
        },
        publicationYear: {
            label: 'Publication Year',
            placeholder: 'Enter publication year'
        },
        category: {
            label: 'Category',
            placeholder: 'Select category'
        },
        price: {
            label: 'Price (VND)',
            placeholder: 'Enter book price'
        },
        totalCopies: {
            label: 'Total Copies',
            placeholder: 'Enter total copies'
        },
        availableCopies: {
            label: 'Available Copies',
            placeholder: 'Enter available copies'
        },
        locationShelf: {
            label: 'Shelf Location',
            placeholder: 'Enter shelf location'
        },
        description: {
            label: 'Description',
            placeholder: 'Enter book description'
        },
        image: {
            label: 'Image',
            chooseImage: 'Choose Image',
            selected: 'Selected'
        }
    },
    button: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete'
    },
    message: {
        confirmDelete: 'Are you sure you want to delete this book?',
        confirmTitle: 'Confirm Delete',
        success: {
            create: 'Book created successfully',
            update: 'Book updated successfully',
            delete: 'Book deleted successfully'
        },
        error: {
            load: 'Could not load book list'
        }
    }
} 