import { useState, useRef, useEffect } from 'react';

const LazyLoadWrapper = ({ children, threshold = 0.1, rootMargin = '0px', onVisible, hideOnExit = false }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [wasVisible, setWasVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Khi phần tử xuất hiện trong viewport
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setWasVisible(true);
                    if (onVisible) onVisible();
                } else {
                    // Khi phần tử ra khỏi viewport
                    if (hideOnExit) {
                        setIsVisible(false);
                    }
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin, onVisible, hideOnExit]);

    // Nếu phần tử chưa bao giờ xuất hiện, hiển thị placeholder
    // Nếu đã xuất hiện rồi nhưng hiện tại không hiển thị, hiển thị fadeOut
    // Nếu đang hiển thị, hiển thị nội dung với fadeIn

    return (
        <div ref={ref} className="w-full">
            {!wasVisible ? (
                // Chưa bao giờ xuất hiện, hiển thị placeholder
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            ) : isVisible ? (
                // Đang hiển thị, hiển thị nội dung với fadeIn
                <div className="animate-fadeIn">{children}</div>
            ) : (
                // Đã xuất hiện nhưng hiện tại không hiển thị, hiển thị fadeOut
                <div className="animate-fadeOut">{children}</div>
            )}
        </div>
    );
};

export default LazyLoadWrapper;
