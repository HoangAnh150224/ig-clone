import { useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // threshold: 0.1 và rootMargin giúp trigger sớm hơn
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      }, {
        threshold: 0.1,
        rootMargin: '500px', // Tải trước khi người dùng chạm tới 500px cuối cùng
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );

  return { lastElementRef };
};

export default useInfiniteScroll;
