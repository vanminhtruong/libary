export default {
    title: '대출 관리',
    fields: {
        no: '번호',
        borrower: '대출자',
        book: '도서',
        borrowDate: '대출일',
        dueDate: '반납예정일',
        status: '상태',
        actions: '작업'
    },
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
        createFine: '벌금 생성'
    },
    dialog: {
        fine: {
            title: '벌금 생성',
            amount: '벌금액',
            reason: '벌금 사유',
            submit: '제출',
            cancel: '취소'
        }
    },
    messages: {
        fineCreated: '벌금이 성공적으로 생성되었습니다',
        approveSuccess: '대출 요청이 승인되었습니다',
        rejectSuccess: '대출 요청이 거절되었습니다'
    }
}
