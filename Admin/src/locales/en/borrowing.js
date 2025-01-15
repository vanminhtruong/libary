export default {
    title: 'Borrowing Management',
    fields: {
        no: 'No.',
        borrower: 'Borrower',
        book: 'Book',
        borrowDate: 'Borrow Date',
        dueDate: 'Due Date',
        status: 'Status',
        actions: 'Actions'
    },
    status: {
        pending: 'Pending',
        borrowed: 'Borrowed',
        approved: 'Approved',
        rejected: 'Rejected',
        returned: 'Returned',
        overdue: 'Overdue'
    },
    actions: {
        viewDetails: 'View Details',
        approve: 'Approve',
        reject: 'Reject',
        createFine: 'Create Fine'
    },
    dialog: {
        fine: {
            title: 'Create Fine',
            amount: 'Fine Amount',
            reason: 'Fine Reason',
            submit: 'Submit',
            cancel: 'Cancel'
        }
    },
    messages: {
        fineCreated: 'Fine created successfully',
        approveSuccess: 'Borrowing request approved',
        rejectSuccess: 'Borrowing request rejected'
    }
}
