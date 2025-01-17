export default {
    title: '도서 관리',
    addBook: '새 도서 추가',
    editBook: '도서 수정',
    table: {
        stt: '번호',
        name: '도서명',
        author: '저자',
        status: '상태',
        actions: '작업',
        available: '재고 있음',
        outOfStock: '재고 없음'
    },
    form: {
        basicInfo: '기본 정보',
        detailInfo: '상세 정보',
        inventoryInfo: '재고 정보',
        additionalInfo: '추가 정보',
        name: {
            label: '도서명',
            placeholder: '도서명을 입력하세요'
        },
        author: {
            label: '저자',
            placeholder: '저자명을 입력하세요'
        },
        isbn: {
            label: 'ISBN',
            placeholder: 'ISBN을 입력하세요'
        },
        publisher: {
            label: '출판사',
            placeholder: '출판사명을 입력하세요'
        },
        publicationYear: {
            label: '출판년도',
            placeholder: '출판년도를 입력하세요'
        },
        category: {
            label: '카테고리',
            placeholder: '카테고리를 선택하세요'
        },
        price: {
            label: '가격 (VND)',
            placeholder: '도서 가격을 입력하세요'
        },
        totalCopies: {
            label: '총 수량',
            placeholder: '총 수량을 입력하세요'
        },
        availableCopies: {
            label: '가용 수량',
            placeholder: '가용 수량을 입력하세요'
        },
        locationShelf: {
            label: '서가 위치',
            placeholder: '서가 위치를 입력하세요'
        },
        description: {
            label: '설명',
            placeholder: '도서 설명을 입력하세요'
        },
        image: {
            label: '이미지',
            chooseImage: '이미지 선택',
            selected: '선택됨'
        }
    },
    button: {
        save: '저장',
        cancel: '취소',
        edit: '수정',
        delete: '삭제'
    },
    message: {
        confirmDelete: '이 도서를 삭제하시겠습니까?',
        confirmTitle: '삭제 확인',
        success: {
            create: '도서가 성공적으로 생성되었습니다',
            update: '도서가 성공적으로 업데이트되었습니다',
            delete: '도서가 성공적으로 삭제되었습니다'
        },
        error: {
            load: '도서 목록을 불러올 수 없습니다'
        }
    }
} 