import React from 'react';
import { useSelector } from 'react-redux';
import useBackToTop from '../../hooks/useBackToTop';

const BackToTop = () => {
  const { showBackToTop, scrollToTop } = useBackToTop();

  if (!showBackToTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-full p-3 shadow-lg z-50 transition-all duration-300 transform hover:scale-110"
      aria-label="Back to top"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 15l7-7 7 7" 
        />
      </svg>
    </button>
  );
};

export default BackToTop; 