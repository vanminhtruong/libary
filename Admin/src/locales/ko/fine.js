export default {
    title: '벌금 관리',
    noData: '데이터가 없습니다',
    fields: {
        no: '번호',
        user: '사용자',
        book: '도서',
        amount: '금액',
        fineDate: '벌금 날짜',
        status: '상태',
        paymentMethod: '결제 방법',
        actions: '작업'
    },
    status: {
        pending: '대기 중',
        paid: '결제 완료',
        cancelled: '취소됨'
    },
    actions: {
        viewDetails: '상세 보기',
        confirmPayment: '결제 확인',
        cancel: '벌금 취소'
    },
    dialog: {
        details: {
            title: '벌금 상세',
            user: '사용자',
            book: '도서',
            amount: '금액',
            fineDate: '벌금 날짜',
            status: '상태',
            paymentMethod: '결제 방법',
            reason: '벌금 사유'
        }
    },
    messages: {
        paymentSuccess: '결제가 성공적으로 확인되었습니다',
        cancelSuccess: '벌금이 성공적으로 취소되었습니다'
    }
}
