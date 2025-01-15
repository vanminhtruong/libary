import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const features = [
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
    ];

    const benefits = [
        t('home.benefits.list.0'),
        t('home.benefits.list.1'),
        t('home.benefits.list.2'),
        t('home.benefits.list.3'),
        t('home.benefits.list.4')
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="container mx-auto px-6 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {t('home.welcome_title')}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            {t('home.welcome_subtitle')}
                        </p>
                        <p className="text-lg mb-12">
                            {t('home.intro')}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                label={t('home.cta.register')}
                                icon="pi pi-user-plus"
                                className="p-button-lg"
                                onClick={() => navigate('/register')}
                            />
                            <Button
                                label={t('home.cta.browse')}
                                icon="pi pi-search"
                                className="p-button-lg p-button-outlined"
                                onClick={() => navigate('/books')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t('home.features.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <i className={`${feature.icon} text-4xl text-blue-600 mb-4`}></i>
                                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Collection Section */}
            <div className="bg-gray-100 py-20 px-6">
                <div className="container mx-auto">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            {t('home.collection.title')}
                        </h2>
                        <p className="text-lg text-gray-600">
                            {t('home.collection.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-20 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t('home.benefits.title')}
                    </h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i className="pi pi-check text-blue-600"></i>
                                    </div>
                                    <p className="text-lg">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-900 text-white py-20 px-6">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('home.cta.title')}
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        {t('home.cta.description')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            label={t('home.cta.register')}
                            icon="pi pi-user-plus"
                            className="p-button-lg"
                            onClick={() => navigate('/register')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 