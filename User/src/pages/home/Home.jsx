import React from 'react';
import useHome from './hooks/useHome';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CollectionSection from './components/CollectionSection';
import BenefitsSection from './components/BenefitsSection';
import CTASection from './components/CTASection';

const Home = () => {
    const { features, benefits, handleNavigate } = useHome();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
            <HeroSection handleNavigate={handleNavigate} />
            <FeaturesSection features={features} />
            <CollectionSection />
            <BenefitsSection benefits={benefits} />
            <CTASection handleNavigate={handleNavigate} />
        </div>
    );
};

export default Home;