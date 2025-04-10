import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useBookFilter = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    const statuses = [
        { label: t('common.all_statuses'), value: null },
        { label: t('status.available'), value: 'available' },
        { label: t('status.borrowed'), value: 'borrowed' }
    ];

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        categorySearchQuery,
        setCategorySearchQuery,
        statuses
    };
};

export default useBookFilter; 