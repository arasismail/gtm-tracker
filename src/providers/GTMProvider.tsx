// src/providers/GTMProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import Script from 'next/script';
import { initializeConsent, pushEvent, pushPageView as pushPageViewCore, updateConsent as updateConsentCore } from '../lib/gtm';

export interface GTMContextType {
  isLoaded: boolean;
  pushEvent: (eventName: string, parameters?: Record<string, any>) => void;
  pushPageView: (url?: string, title?: string) => void;
  updateConsent: (consentSettings: Record<string, any>) => void;
}

const GTMContext = createContext<GTMContextType | undefined>(undefined);

export interface GTMProviderProps {
  gtmId: string;
  children: React.ReactNode;
  debug?: boolean;
  enableInDevelopment?: boolean;
  defaultConsent?: Record<string, any>;
  nonce?: string;
}

export function GTMProvider({
  gtmId,
  children,
  debug = false,
  enableInDevelopment = false,
  defaultConsent = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  },
  nonce
}: GTMProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConsentInitialized, setIsConsentInitialized] = useState(false);
  
  const shouldLoad = useMemo(() => {
    return enableInDevelopment || process.env.NODE_ENV === 'production';
  }, [enableInDevelopment]);

  // CRITICALLY IMPORTANT: Initialize consent BEFORE GTM loads
  useEffect(() => {
    if (shouldLoad && typeof window !== 'undefined' && !isConsentInitialized) {
      // 1. FIRST: Initialize consent with denied state
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function if not exists
      window.gtag = window.gtag || function(...args: any[]) {
        window.dataLayer!.push(args);
      };
      
      // Push consent default BEFORE GTM loads
      window.gtag('consent', 'default', {
        ...defaultConsent,
        wait_for_update: 500 // Wait up to 500ms for consent update
      });
      
      // Also push as an event for visibility in dataLayer
      window.dataLayer.push({
        event: 'consent_default',
        consent_settings: defaultConsent
      });
      
      if (debug) {
        console.log('🔐 Consent initialized BEFORE GTM:', defaultConsent);
        console.log('📊 DataLayer after consent init:', window.dataLayer);
      }
      
      setIsConsentInitialized(true);
    }
  }, [shouldLoad, defaultConsent, debug, isConsentInitialized]);

  // Load GTM script AFTER consent is initialized
  const shouldLoadGTM = shouldLoad && isConsentInitialized;

  // GTM onLoad handler
  useEffect(() => {
    if (!shouldLoadGTM) return;

    const handleGTMLoad = () => {
      setIsLoaded(true);
      
      if (debug) {
        console.log('🚀 GTM loaded successfully with ID:', gtmId);
        console.log('📊 Current dataLayer:', window.dataLayer);
      }
      
      // Push initial page view after GTM loads
      pushPageViewCore();
    };

    // Check if GTM is already loaded
    if (window.dataLayer && window.dataLayer.find((item: any) => item.event === 'gtm.js')) {
      handleGTMLoad();
    } else {
      // Listen for GTM load event
      const checkInterval = setInterval(() => {
        if (window.dataLayer && window.dataLayer.find((item: any) => item.event === 'gtm.js')) {
          clearInterval(checkInterval);
          handleGTMLoad();
        }
      }, 100);

      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [shouldLoadGTM, gtmId, debug]);

  // Memoized update consent function
  const updateConsentStable = useCallback((consentSettings: Record<string, any>) => {
    if (!shouldLoad || !isConsentInitialized) return;
    
    // Use gtag to update consent
    window.gtag = window.gtag || function(...args: any[]) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };
    
    // Update consent via gtag
    window.gtag('consent', 'update', consentSettings);
    
    // Also push as event for tracking
    pushEvent('consent_update', {
      consent_settings: consentSettings,
      timestamp: new Date().toISOString()
    });
    
    if (debug) {
      console.log('🔐 Consent updated:', consentSettings);
      console.log('📊 DataLayer after update:', window.dataLayer);
    }
    
    // Trigger GTM to re-evaluate tags
    // This helps tags that were waiting for consent to fire
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'gtm.init_consent' });
    }
  }, [shouldLoad, isConsentInitialized, debug]);

  // Context value with memoization
  const contextValue: GTMContextType = {
    isLoaded,
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
      {/* GTM Script - Only load AFTER consent is initialized */}
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
          
          {/* GTM noscript fallback */}
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