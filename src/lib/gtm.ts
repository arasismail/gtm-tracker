// src/lib/gtm.ts
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Push event to GTM dataLayer
 */
export function pushEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...parameters
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 GTM Event:', eventName, parameters);
  }
}

/**
 * Update consent status
 */
export function updateConsent(consentSettings: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  window.gtag = window.gtag || function(...args: any[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(...args);
  };
  
  window.gtag('consent', 'update', consentSettings);
  pushEvent('consent_update', consentSettings);
}
/**
 * Initialize default consent
 */
export function initializeConsent(defaultSettings: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  window.gtag = window.gtag || function(...args: any[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(...args);
  };
  
  window.gtag('consent', 'default', defaultSettings);
}

/**
 * Push page view event
 */
export function pushPageView(url?: string, title?: string) {
  pushEvent('page_view', {
    page_location: url || window.location.href,
    page_title: title || document.title,
    page_path: window.location.pathname
  });
}