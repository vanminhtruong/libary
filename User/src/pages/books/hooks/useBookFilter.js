import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useBookFilter = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categorySearchQuery,
        setCategorySearchQuery
    };
};

export default useBookFilter; 