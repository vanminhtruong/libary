import { useState } from 'react';

const useViewMode = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    return {
        viewMode,
        setViewMode
    };
};

export default useViewMode; 