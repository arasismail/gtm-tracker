// src/providers/GTMProvider.tsx
'use client';

import * as React from 'react';
import Script from 'next/script';
import { ConsentSettings } from '../types';
import { isClient } from '../utils/isClient';
import { 
  initializeConsent, 
  pushEvent, 
  pushPageView as pushPageViewCore,
  updateConsent as updateConsentCore 
} from '../lib/gtm';
import { DEFAULT_CONSENT_SETTINGS } from '../constants';

const { createContext, useContext, useEffect, useState, useRef, useCallback } = React;

interface GTMContextValue {
  gtmId: string;
  pushEvent: (eventName: string, parameters?: Record<string, any>) => void;
  pushPageView: (url?: string, title?: string) => void;
  updateConsent: (settings: Record<string, any>) => void;
  isConsentInitialized: boolean; // Yeni eklendi
}

const GTMContext = createContext<GTMContextValue | undefined>(undefined);

interface GTMProviderProps {
  children: React.ReactNode;
  gtmId: string;
  debug?: boolean;
  enableInDevelopment?: boolean;
  defaultConsent?: ConsentSettings;
  nonce?: string;
}

export function GTMProvider({
  children,
  gtmId,
  debug = false,
  enableInDevelopment = false,
  defaultConsent = DEFAULT_CONSENT_SETTINGS,
  nonce
}: GTMProviderProps) {
  const [isConsentInitialized, setIsConsentInitialized] = useState(false);
  const [shouldLoadGTM, setShouldLoadGTM] = useState(false);
  const isInitialized = useRef(false);
  const lastConsentState = useRef<string>('');
  
  const shouldLoad = process.env.NODE_ENV === 'production' || enableInDevelopment;

  // İlk olarak consent'i initialize et - Sadece bir kez çalışacak
  useEffect(() => {
    if (!isClient || !shouldLoad || isInitialized.current) return;
    
    isInitialized.current = true; // Sadece 1 kez çalışmasını garantile
    
    // Consent'i initialize et (GTM yüklenmeden önce!)
    initializeConsent(defaultConsent as Record<string, any>);
    setIsConsentInitialized(true);
    
    if (debug) {
      console.log('🔐 Consent initialized with:', defaultConsent);
    }
    
    // Consent initialize edildikten sonra GTM'i yükle
    // Küçük bir delay ile consent'in dataLayer'a yazılmasını garantile
    setTimeout(() => {
      setShouldLoadGTM(true);
      if (debug) {
        console.log('🚀 GTM loading after consent initialization');
      }
    }, 100);
  }, []); // Boş dependency array - çok önemli!

  // Stable updateConsent with duplicate check
  const updateConsentStable = useCallback((settings: Record<string, any>) => {
    const settingsStr = JSON.stringify(settings);
    
    // Duplicate kontrolü - aynı consent tekrar gönderilmesin
    if (lastConsentState.current === settingsStr) {
      if (debug) {
        console.log('🔐 Consent already in this state, skipping update');
      }
      return;
    }
    
    lastConsentState.current = settingsStr;
    updateConsentCore(settings);
    
    if (debug) {
      console.log('🔐 Consent updated:', settings);
    }
  }, [debug]);

  // Context value
  const contextValue: GTMContextValue = {
    gtmId,
    isConsentInitialized,
    pushEvent: useCallback((eventName: string, parameters?: Record<string, any>) => {
      if (shouldLoad && isConsentInitialized) {
        pushEvent(eventName, parameters);
        if (debug) {
          console.log('📤 Event pushed:', eventName, parameters);
        }
      }
    }, [shouldLoad, isConsentInitialized, debug]),
    pushPageView: useCallback((url?: string, title?: string) => {
      if (shouldLoad && isConsentInitialized) {
        pushPageViewCore(url, title);
        if (debug) {
          console.log('📄 Page view:', url || window.location.href);
        }
      }
    }, [shouldLoad, isConsentInitialized, debug]),
    updateConsent: updateConsentStable
  };

  if (!shouldLoad) {
    return <>{children}</>;
  }

  return (
    <GTMContext.Provider value={contextValue}>
      {/* GTM Script - Sadece consent initialize edildikten sonra yükle */}
      {shouldLoadGTM && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `
            }}
          />
          
          {/* GTM noscript */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
      
      {children}
    </GTMContext.Provider>
  );
}

export function useGTMContext() {
  const context = useContext(GTMContext);
  if (!context) {
    throw new Error('useGTMContext must be used within GTMProvider');
  }
  return context;
}