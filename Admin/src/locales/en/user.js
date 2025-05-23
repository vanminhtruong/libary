export default {
    title: 'User Management',
    addUser: 'Add User',
    editUser: 'Edit User',
    userDetail: 'User Detail',
    table: {
        stt: 'No.',
        avatar: 'Avatar',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        createdAt: 'Created Date',
        actions: 'Actions',
        notUpdated: 'Not Updated'
    },
    form: {
        name: {
            label: 'User Name',
            placeholder: 'Enter user name'
        },
        email: {
            label: 'Email',
            placeholder: 'Enter email address'
        },
        password: {
            label: 'Password',
            placeholder: 'Enter password',
            editHint: 'Leave empty if you don\'t want to change the password'
        },
        phone: {
            label: 'Phone Number',
            placeholder: 'Enter phone number'
        },
        image: {
            label: 'Profile Image',
            chooseImage: 'Choose Image',
            selected: 'Selected',
            current: 'Current Image'
        }
    },
    detail: {
        information: 'User Information',
        timeInfo: 'Timeline',
        status: 'Account Status',
        accountStatus: 'Verification Status',
        verified: 'Verified',
        notVerified: 'Not Verified',
        createdDate: 'Created Date',
        lastUpdate: 'Last Update',
        imagePreview: 'View Profile Image',
        clickToZoom: 'Click to zoom'
    },
    status: {
        active: 'Active',
        inactive: 'Inactive'
    },
    action: {
        activate: 'Activate Account',
        deactivate: 'Deactivate Account'
    },
    button: {
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
        edit: 'Edit',
        delete: 'Delete'
    },
    message: {
        confirmDelete: 'Are you sure you want to delete this user?',
        confirmTitle: 'Confirm Delete',
        success: {
            create: 'User created successfully',
            update: 'User updated successfully',
            delete: 'User deleted successfully'
        },
        error: {
            load: 'Unable to load user list',
            loadDetail: 'Unable to load user details',
            delete: 'Unable to delete user',
            toggleActive: 'Unable to change account status'
        }
    },
    toast: {
        success: 'Success',
        error: 'Error'
    }
} 