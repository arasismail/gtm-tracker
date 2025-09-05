// src/components/RouteChangeListener.tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useGTM } from '../hooks/useGTM';

const { useEffect } = React;

/**
 * Listens to route changes and pushes page view events to GTM
 * Note: GTM automatically captures query parameters, so we only track pathname
 */
export function RouteChangeListener() {
  const pathname = usePathname();
  const { pushPageView } = useGTM();

  useEffect(() => {
    // Push page view with pathname only
    // GTM will automatically capture any query parameters
    pushPageView(pathname);
  }, [pathname, pushPageView]);

  return null;
}