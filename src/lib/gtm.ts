// src/lib/gtm.ts
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Initialize default consent - GTM yüklenmeden önce çağrılmalı!
 */
export function initializeConsent(defaultSettings: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // DataLayer'ı initialize et
  window.dataLayer = window.dataLayer || [];
  
  // gtag fonksiyonunu initialize et
  window.gtag = window.gtag || function(...args: unknown[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  };
  
  // SADECE gtag command kullan - duplicate event'i önlemek için
  window.gtag('consent', 'default', defaultSettings);
  
  // GTM'nin beklediği formatta consent_default event'i gönder
  window.dataLayer.push({
    event: 'consent_default',
    ...defaultSettings  // Direkt spread - wrapper olmadan
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Consent initialized before GTM:', defaultSettings);
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
 * Update consent status - GTM uyumlu format
 */
export function updateConsent(consentSettings: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  // DataLayer'ı kesinlikle initialize et
  window.dataLayer = window.dataLayer || [];
  
  // gtag fonksiyonunu initialize et
  window.gtag = window.gtag || function(...args: unknown[]) {
    window.dataLayer!.push(args);  // ! ile undefined olmadığını belirt
  };
  
  // gtag ile consent'i güncelle
  window.gtag('consent', 'update', consentSettings);
  
  // GTM'nin beklediği formatta consent_update event'i gönder
  // TypeScript'e dataLayer'ın tanımlı olduğunu söyle
  window.dataLayer!.push({  
    event: 'consent_update',
    ...consentSettings,  // Direkt spread - wrapper olmadan
    timestamp: new Date().toISOString()
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Consent updated via gtag:', consentSettings);
    console.log('📊 DataLayer format:', {
      event: 'consent_update',
      ...consentSettings
    });
  }
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