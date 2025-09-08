// src/components/RouteChangeListener.tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useGTM } from '../hooks/useGTM';

const { useEffect, useRef } = React;

export function RouteChangeListener() {
  const pathname = usePathname();
  const { pushPageView } = useGTM();
  const lastPathname = useRef<string | null>(null);

  useEffect(() => {
    // İlk mount'ta skip et
    if (lastPathname.current === null) {
      lastPathname.current = pathname;
      return;
    }
    
    // Aynı pathname için tekrar gönderme
    if (lastPathname.current === pathname) {
      return;
    }
    
    lastPathname.current = pathname;
    pushPageView(pathname);
  }, [pathname]); // pushPageView ve isFirstMount dependency'den çıkarıldı

  return null;
}