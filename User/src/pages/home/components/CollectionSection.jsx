import React from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadWrapper from '../../../components/common/LazyLoadWrapper';

const CollectionSection = () => {
    const { t } = useTranslation();
    
    return (
        <LazyLoadWrapper rootMargin="100px">
            <div className="bg-gray-100 dark:bg-gray-700 py-20 px-6">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6 dark:text-white">
                            {t('home.collection.title')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            {t('home.collection.description')}
                        </p>
                    </div>
                </div>
            </div>
        </LazyLoadWrapper>
    );
};

export default CollectionSection; 