import { useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // threshold: 0.1 and rootMargin help trigger earlier
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      }, {
        threshold: 0.1,
        rootMargin: '500px', // Preload before the user reaches the last 500px
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );

  return { lastElementRef };
};

export default useInfiniteScroll;
