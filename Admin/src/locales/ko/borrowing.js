export default {
    title: '대출 관리',
    fields: {
        no: '번호',
        borrower: '대출자',
        book: '도서',
        borrowDate: '대출일',
        dueDate: '반납예정일',
        status: '상태',
        actions: '작업',
        reason: '사유'
    },
    uncategorized: '미분류',
    status: {
        pending: '대기 중',
        borrowed: '대출 중',
        approved: '승인됨',
        rejected: '거절됨',
        returned: '반납됨',
        overdue: '연체'
    },
    actions: {
        viewDetails: '상세 보기',
        approve: '승인',
        reject: '거절',
        createFine: '벌금 처리',
        markAsPaid: '납부 완료 표시',
        cancelFine: '벌금 취소'
    },
    dialog: {
        fine: {
            title: '벌금 처리',
            amount: '벌금액',
            amountPlaceholder: '벌금액 입력',
            fineDate: '벌금 날짜',
            fineDatePlaceholder: '벌금 날짜 선택',
            paymentMethod: '결제 방법',
            paymentMethodPlaceholder: '결제 방법 입력',
            reason: '사유',
            submit: '확인',
            cancel: '취소'
        }
    },
    toast: {
        success: '성공',
        error: '오류',
        loadError: '대출 목록을 불러올 수 없습니다',
        approveError: '대출 요청을 승인할 수 없습니다',
        rejectError: '대출 요청을 거절할 수 없습니다',
        fine: {
            success: '성공',
            error: '오류',
            created: '벌금이 성공적으로 처리되었습니다',
            createError: '벌금 처리를 할 수 없습니다',
            paid: '벌금 납부가 완료되었습니다',
            payError: '벌금 납부 표시를 할 수 없습니다',
            cancelled: '벌금이 취소되었습니다',
            cancelError: '벌금을 취소할 수 없습니다'
        }
    },
    messages: {
        fineCreated: '벌금이 성공적으로 처리되었습니다',
        approveSuccess: '대출 요청이 승인되었습니다',
        rejectSuccess: '대출 요청이 거절되었습니다'
    },
    placeholder: {
        reason: '거절 사유 입력...'
    },
    validation: {
        reasonRequired: '사유가 필요합니다'
    }
}
