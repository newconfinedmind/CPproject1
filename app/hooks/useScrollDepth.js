// hooks/useScrollDepth.ts
import { useState, useEffect } from 'react';

export function useScrollDepth() {
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const depth = (currentScrollTop / documentHeight) * 100; // 백분율로 표현

      setScrollDepth(depth);
    };

    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollDepth;
}
