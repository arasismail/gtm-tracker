// src/components/RouteChangeListener.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGTM } from '../hooks/useGTM';

export function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pushPageView } = useGTM();

  useEffect(() => {
    // Construct full URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Push page view event
    pushPageView(url);
  }, [pathname, searchParams, pushPageView]);

  return null;
}