import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const useHome = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const features = useMemo(() => [
        {
            icon: 'pi pi-search',
            title: t('home.features.digital_catalog.title'),
            description: t('home.features.digital_catalog.description')
        },
        {
            icon: 'pi pi-book',
            title: t('home.features.easy_borrowing.title'),
            description: t('home.features.easy_borrowing.description')
        },
        {
            icon: 'pi pi-user',
            title: t('home.features.personalized.title'),
            description: t('home.features.personalized.description')
        }
    ], [t]);

    const benefits = useMemo(() => [
        t('home.benefits.list.0'),
        t('home.benefits.list.1'),
        t('home.benefits.list.2'),
        t('home.benefits.list.3'),
        t('home.benefits.list.4')
    ], [t]);

    const handleNavigate = (path) => {
        navigate(path);
    };

    return {
        features,
        benefits,
        handleNavigate,
    };
};

export default useHome; 