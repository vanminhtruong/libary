import { useState, useEffect } from 'react';

/**
 * Hook to track scroll position and direction of the window
 * @param {number} threshold - The scroll threshold in pixels
 * @param {number} delay - Delay in ms before navbar hides
 * @returns {Object} scrollState - The current scroll state
 * @returns {number} scrollState.scrollY - The vertical scroll position
 * @returns {boolean} scrollState.isScrollingDown - Whether user is scrolling down
 * @returns {boolean} scrollState.isAtTop - Whether the page is at the top
 * @returns {boolean} scrollState.shouldShowNavbar - Whether navbar should be visible
 */
const useScrollPosition = (threshold = 80, delay = 500) => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    prevScrollY: 0,
    isScrollingDown: false,
    isAtTop: true,
    shouldShowNavbar: true
  });

  useEffect(() => {
    let timeoutId = null;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY < threshold;
      const isScrollingDown = currentScrollY > scrollState.prevScrollY;
      
      // Always show navbar when at top of page
      if (isAtTop) {
        setScrollState({
          scrollY: currentScrollY,
          prevScrollY: currentScrollY,
          isScrollingDown,
          isAtTop: true,
          shouldShowNavbar: true
        });
        return;
      }
      
      // Update scroll direction immediately
      setScrollState(prevState => ({
        ...prevState,
        scrollY: currentScrollY,
        prevScrollY: prevState.scrollY,
        isScrollingDown,
        isAtTop: false
      }));
      
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set timeout to hide navbar when scrolling down
      if (isScrollingDown) {
        timeoutId = setTimeout(() => {
          setScrollState(prevState => ({
            ...prevState,
            shouldShowNavbar: false
          }));
        }, delay);
      } else {
        // Show navbar immediately when scrolling up
        setScrollState(prevState => ({
          ...prevState,
          shouldShowNavbar: true
        }));
      }
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Call handler right away to initialize state
    handleScroll();

    // Remove event listener and clear timeout on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, delay, scrollState.prevScrollY]);

  return scrollState;
};

export default useScrollPosition;
