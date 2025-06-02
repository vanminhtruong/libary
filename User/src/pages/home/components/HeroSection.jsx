import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';

const HeroSection = ({ handleNavigate }) => {
    const { t } = useTranslation();
    
    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-700 dark:to-gray-900 text-white">
            <div className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {t('home.welcome_title')}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-gray-300">
                        {t('home.welcome_subtitle')}
                    </p>
                    <p className="text-lg mb-12 dark:text-gray-400">
                        {t('home.intro')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            label={t('home.cta.register')}
                            icon="pi pi-user-plus" 
                            className="p-button-lg"
                            onClick={() => handleNavigate('/register')}
                        />
                        <Button
                            label={t('home.cta.browse')}
                            icon="pi pi-search"
                            className="p-button-lg p-button-outlined dark:text-white dark:border-white dark:hover:bg-gray-800"
                            onClick={() => handleNavigate('/books')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection; 