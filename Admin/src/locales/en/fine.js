export default {
    title: 'Fine Management',
    noData: 'No fine data available',
    fields: {
        no: 'No.',
        user: 'User',
        book: 'Book',
        amount: 'Amount',
        fineDate: 'Fine Date',
        status: 'Status',
        paymentMethod: 'Payment Method',
        actions: 'Actions'
    },
    status: {
        pending: 'Pending',
        paid: 'Paid',
        cancelled: 'Cancelled'
    },
    actions: {
        viewDetails: 'View Details',
        confirmPayment: 'Confirm Payment',
        cancel: 'Cancel Fine'
    },
    dialog: {
        details: {
            title: 'Fine Details',
            user: 'User',
            book: 'Book',
            amount: 'Amount',
            fineDate: 'Fine Date',
            status: 'Status',
            paymentMethod: 'Payment Method',
            reason: 'Fine Reason'
        }
    },
    messages: {
        paymentSuccess: 'Payment confirmed successfully',
        cancelSuccess: 'Fine cancelled successfully'
    }
}
