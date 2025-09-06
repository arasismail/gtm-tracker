// src/providers/GTMProvider.tsx
'use client';

import * as React from 'react';
import Script from 'next/script';
import { ConsentSettings } from '../types';
import { isClient } from '../utils/isClient';
import { 
  pushEvent, 
  pushPageView as pushPageViewCore,
  updateConsent as updateConsentCore 
} from '../lib/gtm';
import { DEFAULT_CONSENT_SETTINGS } from '../constants';

const { createContext, useContext, useEffect } = React;

interface GTMContextValue {
  gtmId: string;
  pushEvent: (eventName: string, parameters?: Record<string, any>) => void;
  pushPageView: (url?: string, title?: string) => void;
  updateConsent: (settings: Record<string, any>) => void; 
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
  // Development modda çalışmasını kontrol et
  const shouldLoad = process.env.NODE_ENV === 'production' || enableInDevelopment;

  useEffect(() => {
    if (!isClient) return;
    
    if (!shouldLoad) {
      if (debug) {
        console.log('🚫 GTM disabled in development mode');
      }
      return;
    }

    if (debug) {
      console.log('🚀 GTM initialized with ID:', gtmId);
      console.log('📊 Default consent:', defaultConsent);
    }
  }, [shouldLoad, defaultConsent, gtmId, debug]);

  // Context value
  const contextValue: GTMContextValue = {
    gtmId,
    pushEvent: (eventName, parameters) => {
      if (shouldLoad) {
        pushEvent(eventName, parameters);
        if (debug) {
          console.log('📤 Event pushed:', eventName, parameters);
        }
      }
    },
    pushPageView: (url, title) => {
      if (shouldLoad) {
        pushPageViewCore(url, title);
        if (debug) {
          console.log('📄 Page view:', url || window.location.href);
        }
      }
    },
    updateConsent: (settings) => {
      // ConsentSettings'i Record<string, any> olarak cast et
      updateConsentCore(settings as Record<string, any>);
      if (debug) {
        console.log('🔐 Consent updated:', settings);
      }
    }
  };

  if (!shouldLoad) {
    return <>{children}</>;
  }

  return (
    <GTMContext.Provider value={contextValue}>
      {/* Phase 1: Set consent defaults before GTM loads */}
      <Script
        id="consent-defaults"
        strategy="beforeInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            // Set wait_for_update to wait for user consent
            gtag('consent', 'default', {
              ...${JSON.stringify(defaultConsent)},
              'wait_for_update': 2000
            });
            
            // Push initial dataLayer event
            window.dataLayer.push({
              'event': 'consent_default_set'
            });
          `
        }}
      />
      
      {/* Phase 2: Load GTM */}
      <Script
        id="gtm-script"
        strategy="beforeInteractive"
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
      
      {children}
    </GTMContext.Provider>
  );
}

// Hook to use GTM context
export function useGTMContext() {
  const context = useContext(GTMContext);
  if (!context) {
    throw new Error('useGTMContext must be used within GTMProvider');
  }
  return context;
}