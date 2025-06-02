import React from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadWrapper from '../../../components/common/LazyLoadWrapper';

const BenefitsSection = ({ benefits }) => {
    const { t } = useTranslation();
    
    return (
        <div className="py-20 px-6">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                    {t('home.benefits.title')}
                </h2>
                <div className="max-w-3xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <LazyLoadWrapper 
                                key={index}
                                rootMargin="50px"
                                threshold={0.1}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <i className="pi pi-check text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                    <p className="text-lg dark:text-gray-300">{benefit}</p>
                                </div>
                            </LazyLoadWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BenefitsSection; 