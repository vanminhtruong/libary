import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';

export const useFines = (toast) => {
    const { t } = useTranslation();
    const [finesData, setFinesData] = useState(null);
    const [showFinesDialog, setShowFinesDialog] = useState(false);
    const [loadingFines, setLoadingFines] = useState(false);

    const handleViewFines = async () => {
        try {
            setLoadingFines(true);
            console.log('Sending request to get fines data');
            
            const response = await bookService.checkFines();
            console.log('Fines API response processed by service:', JSON.stringify(response, null, 2));
            
            // Đảm bảo chúng ta có cấu trúc dữ liệu hợp lệ
            if (response) {
                // Đảm bảo total_fine được định nghĩa
                if (response.total_fine === undefined) {
                    console.log('Adding default total_fine property');
                    response.total_fine = 0;
                }
                
                // Đảm bảo fine_details là một mảng
                if (!response.fine_details || !Array.isArray(response.fine_details)) {
                    console.log('Adding default fine_details array');
                    response.fine_details = [];
                }
                
                console.log(`Setting fines data with total: ${response.total_fine}, details: ${response.fine_details.length}`);
            } else {
                console.warn('Empty response from checkFines');
                // Tạo đối tượng phản hồi mặc định
                response = {
                    total_fine: 0,
                    fine_details: []
                };
            }
            
            setFinesData(response);
            setShowFinesDialog(true);
        } catch (error) {
            console.error('Error loading fines:', error);
            toast.current.show({
                severity: 'error',
                summary: t('common.error'),
                detail: error.message || t('borrowings.fines_load_error'),
                life: 3000
            });
            
            // Đặt dữ liệu phạt mặc định trong trường hợp lỗi
            setFinesData({
                total_fine: 0,
                fine_details: [],
                message: error.message || t('borrowings.fines_load_error')
            });
            
            // Vẫn hiển thị hộp thoại để hiển thị thông báo lỗi
            setShowFinesDialog(true);
        } finally {
            setLoadingFines(false);
        }
    };

    return {
        finesData,
        showFinesDialog,
        loadingFines,
        setShowFinesDialog,
        handleViewFines
    };
}; 