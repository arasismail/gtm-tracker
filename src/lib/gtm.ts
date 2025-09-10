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
  
  // Consent'i dataLayer'a push et (GTM yüklenmeden önce!)
  window.dataLayer.push({
    'event': 'consent_default',
    'consent': 'default',
    ...defaultSettings
  });
  
  // gtag fonksiyonunu initialize et
  window.gtag = window.gtag || function(...args: unknown[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  };
  
  // gtag ile de consent'i ayarla
  window.gtag('consent', 'default', defaultSettings);
  
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
 * Update consent status
 */
export function updateConsent(consentSettings: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  
  window.gtag = window.gtag || function(...args: unknown[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  };
  
  // Sadece gtag consent update yap, ayrıca event push etme (duplicate önleme)
  window.gtag('consent', 'update', consentSettings);
  
  // consent_update event'i otomatik olarak GTM tarafından oluşturulacak
  // Manuel push kaldırıldı çünkü duplicate'e neden oluyor
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Consent updated via gtag:', consentSettings);
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