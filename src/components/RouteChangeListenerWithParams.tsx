// src/components/RouteChangeListenerWithParams.tsx
'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGTM } from '../hooks/useGTM';

const { useEffect, Suspense, useState } = React;

/**
 * Internal component that uses useSearchParams
 * Must be wrapped in Suspense
 */
function RouteChangeListenerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { pushPageView } = useGTM();
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // Skip the first mount to avoid duplicate with GTM's automatic page_view
    if (isFirstMount) {
      setIsFirstMount(false);
      return;
    }
    
    // Construct full URL with search params
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Push page view event only on route changes
    pushPageView(url);
  }, [pathname, searchParams, pushPageView, isFirstMount]);

  return null;
}

/**
 * Listens to route changes including search params and pushes page view events to GTM
 * Wrapped in Suspense for Next.js 13+ compatibility
 */
export function RouteChangeListenerWithParams() {
  return (
    <Suspense fallback={null}>
      <RouteChangeListenerInner />
    </Suspense>
  );
}