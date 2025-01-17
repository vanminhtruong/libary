export default {
    title: '카테고리 관리',
    addCategory: '카테고리 추가',
    editCategory: '카테고리 수정',
    table: {
        stt: '번호',
        name: '카테고리명',
        description: '설명',
        actions: '작업'
    },
    form: {
        name: {
            label: '카테고리명',
            placeholder: '카테고리명을 입력하세요'
        },
        description: {
            label: '설명',
            placeholder: '카테고리 설명을 입력하세요'
        }
    },
    button: {
        save: '저장',
        cancel: '취소',
        edit: '수정',
        delete: '삭제'
    },
    message: {
        confirmDelete: '이 카테고리를 삭제하시겠습니까?',
        confirmTitle: '삭제 확인',
        success: {
            create: '카테고리가 성공적으로 생성되었습니다',
            update: '카테고리가 성공적으로 업데이트되었습니다',
            delete: '카테고리가 성공적으로 삭제되었습니다'
        },
        error: {
            load: '카테고리 목록을 불러올 수 없습니다'
        }
    }
} 