export default {
    title: '사용자 관리',
    addUser: '사용자 추가',
    editUser: '사용자 수정',
    userDetail: '사용자 상세정보',
    table: {
        stt: '번호',
        avatar: '프로필',
        name: '이름',
        email: '이메일',
        phone: '전화번호',
        createdAt: '생성일',
        actions: '작업',
        notUpdated: '미업데이트'
    },
    form: {
        name: {
            label: '사용자 이름',
            placeholder: '사용자 이름을 입력하세요'
        },
        email: {
            label: '이메일',
            placeholder: '이메일 주소를 입력하세요'
        },
        phone: {
            label: '전화번호',
            placeholder: '전화번호를 입력하세요'
        },
        image: {
            label: '프로필 이미지',
            chooseImage: '이미지 선택',
            selected: '선택됨',
            current: '현재 이미지'
        }
    },
    detail: {
        information: '상세 정보',
        timeInfo: '시간 정보',
        status: '활성 상태',
        accountStatus: '계정 상태',
        verified: '인증됨',
        notVerified: '미인증',
        createdDate: '계정 생성일',
        lastUpdate: '최근 업데이트',
        imagePreview: '프로필 이미지 보기',
        clickToZoom: '확대하려면 클릭하세요'
    },
    status: {
        active: '활성화됨',
        inactive: '비활성화됨'
    },
    action: {
        activate: '계정 활성화',
        deactivate: '계정 비활성화'
    },
    button: {
        save: '저장',
        cancel: '취소',
        close: '닫기',
        edit: '수정',
        delete: '삭제'
    },
    message: {
        confirmDelete: '이 사용자를 삭제하시겠습니까?',
        confirmTitle: '삭제 확인',
        success: {
            create: '사용자가 성공적으로 생성되었습니다',
            update: '사용자 정보가 성공적으로 업데이트되었습니다',
            delete: '사용자가 성공적으로 삭제되었습니다'
        },
        error: {
            load: '사용자 목록을 불러올 수 없습니다',
            loadDetail: '사용자 상세정보를 불러올 수 없습니다',
            delete: '사용자를 삭제할 수 없습니다',
            toggleActive: '계정 상태를 변경할 수 없습니다'
        }
    },
    toast: {
        success: '성공',
        error: '오류'
    }
} 