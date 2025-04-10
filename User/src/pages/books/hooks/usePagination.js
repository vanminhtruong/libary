import { useState } from 'react';

const usePagination = () => {
    const [pagination, setPagination] = useState({
        first: 0,
        rows: 12,
        page: 0,
        totalRecords: 0
    });

    const onPageChange = (event) => {
        setPagination(prev => ({ ...prev, ...event }));
    };

    return {
        pagination,
        setPagination,
        onPageChange
    };
};

export default usePagination; 