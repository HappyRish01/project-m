// This hook is often part of shadcn/ui's sidebar component.
// If you don't have it, here's a basic implementation.
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 1024) { // Default to 'lg' breakpoint
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
