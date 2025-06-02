import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowBackToTop } from '../store/slices/uiSlice';

const useBackToTop = (scrollThreshold = 300) => {
  const dispatch = useDispatch();
  const showBackToTop = useSelector((state) => state.ui.showBackToTop);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      dispatch(setShowBackToTop(scrollY > scrollThreshold));
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return {
    showBackToTop,
    scrollToTop
  };
};

export default useBackToTop; 