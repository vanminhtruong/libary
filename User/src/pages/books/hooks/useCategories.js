import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import bookService from '../../../services/book.service';

const useCategories = (categorySearchQuery) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const toast = useRef(null);

    const loadCategories = async () => {
        try {
            let response;
            if (categorySearchQuery) {
                response = await bookService.searchCategories(categorySearchQuery);
            } else {
                response = await bookService.getCategories();
            }
            const categoriesList = response || [];
            setCategories([
                { label: t('common.all_categories'), value: 'all' },
                ...categoriesList.map(cat => ({
                    label: cat.name,
                    value: cat.id
                }))
            ]);
        } catch (error) {
            console.error('Load categories error:', error);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: t('common.error'),
                    detail: t('book.message.error.loadCategories'),
                    life: 3000
                });
            }
        }
    };

    useEffect(() => {
        loadCategories();
    }, [categorySearchQuery]);

    return {
        categories,
        toast
    };
};

export default useCategories; 