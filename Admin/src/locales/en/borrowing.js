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
        createFine: 'Process Fine',
        markAsPaid: 'Mark as Paid',
        cancelFine: 'Cancel Fine'
    },
    dialog: {
        fine: {
            title: 'Process Fine',
            amount: 'Fine Amount',
            amountPlaceholder: 'Enter fine amount',
            fineDate: 'Fine Date',
            fineDatePlaceholder: 'Select fine date',
            paymentMethod: 'Payment Method',
            paymentMethodPlaceholder: 'Enter payment method',
            reason: 'Reason',
            submit: 'Submit',
            cancel: 'Cancel'
        }
    },
    toast: {
        success: 'Success',
        error: 'Error',
        loadError: 'Unable to load borrowing list',
        approveError: 'Unable to approve borrowing request',
        rejectError: 'Unable to reject borrowing request',
        fine: {
            success: 'Success',
            error: 'Error',
            created: 'Fine processed successfully',
            createError: 'Unable to process fine',
            paid: 'Fine marked as paid successfully',
            payError: 'Unable to mark fine as paid',
            cancelled: 'Fine cancelled successfully',
            cancelError: 'Unable to cancel fine'
        }
    },
    messages: {
        fineCreated: 'Fine processed successfully',
        approveSuccess: 'Borrowing request approved',
        rejectSuccess: 'Borrowing request rejected'
    }
}
