import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import LazyLoadWrapper from '../../../components/common/LazyLoadWrapper';

const CTASection = ({ handleNavigate }) => {
    const { t } = useTranslation();
    
    return (
        <LazyLoadWrapper rootMargin="100px">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-20 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                        {t('home.cta.title')}
                    </h2>
                    <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
                        {t('home.cta.description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            label={t('home.cta.register')}
                            icon="pi pi-user-plus" 
                            className="p-button-lg"
                            onClick={() => handleNavigate('/register')}
                            severity="secondary"
                        />
                    </div>
                </div>
            </div>
        </LazyLoadWrapper>
    );
};

export default CTASection; 