import React from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadWrapper from '../../../components/common/LazyLoadWrapper';

const FeaturesSection = ({ features }) => {
    const { t } = useTranslation();
    
    return (
        <div className="py-20 px-6">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
                    {t('home.features.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <LazyLoadWrapper 
                            key={index}
                            rootMargin="50px"
                            threshold={0.1}
                        >
                            <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow h-[280px] flex flex-col">
                                <i className={`${feature.icon} text-4xl text-blue-600 dark:text-blue-400 mb-4`}></i>
                                <h3 className="text-xl font-semibold mb-4 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-4">{feature.description}</p>
                            </div>
                        </LazyLoadWrapper>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;