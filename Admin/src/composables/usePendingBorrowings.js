import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

export function usePendingBorrowings() {
    const pendingCount = ref(0);
    const loading = ref(false);
    const error = ref(null);
    let intervalId = null;

    const fetchPendingCount = async () => {
        try {
            loading.value = true;
            // Sửa lại đường dẫn API cho đúng với định nghĩa trong routes/api.php
            const response = await axios.get('/admin/borrowings/pending-count');
            pendingCount.value = response.data.count;
            console.log('Pending count:', pendingCount.value); // Log để debug
        } catch (err) {
            console.error('Error fetching pending borrowings count:', err);
            error.value = err;
            // Đặt giá trị mặc định để test giao diện
            pendingCount.value = 5; // Giá trị test
        } finally {
            loading.value = false;
        }
    };

    // Start polling when component is mounted
    onMounted(() => {
        fetchPendingCount(); 
        // Poll every 30 seconds
        intervalId = setInterval(fetchPendingCount, 30000);
    });

    // Clean up interval when component is unmounted
    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    return {
        pendingCount,
        loading,
        error,
        fetchPendingCount
    };
}
