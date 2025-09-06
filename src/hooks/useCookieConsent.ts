// src/hooks/useCookieConsent.ts
import { useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { 
  ConsentSettings, 
  ConsentStatus, 
  UseCookieConsentReturn 
} from '../types';
import { 
  COOKIE_NAME, 
  COOKIE_EXPIRY_DAYS,
  DEFAULT_CONSENT_SETTINGS,
  CONSENT_MODES
} from '../constants';
import { useGTM } from './useGTM';

export function useCookieConsent(): UseCookieConsentReturn {
  const { updateConsent } = useGTM();
  
  // Read consent synchronously on initialization
  const getInitialConsent = (): { status: ConsentStatus; settings: ConsentSettings } => {
    if (typeof window === 'undefined') {
      return { status: 'pending', settings: DEFAULT_CONSENT_SETTINGS };
    }
    
    const savedConsent = Cookies.get(COOKIE_NAME);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        // Update GTM immediately with saved consent
        if (window.gtag) {
          window.gtag('consent', 'update', parsed.settings);
        }
        return { status: parsed.status, settings: parsed.settings };
      } catch (error) {
        console.error('Failed to parse consent cookie:', error);
      }
    }
    
    return { status: 'pending', settings: DEFAULT_CONSENT_SETTINGS };
  };
  
  const initial = getInitialConsent();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(initial.status);
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>(initial.settings);

  // Keep useEffect only for subscription/monitoring purposes if needed
  useEffect(() => {
    // Can be used for listening to consent changes from other tabs/windows
    // or for other side effects
  }, []);

  // Save consent to cookie
  const saveConsent = useCallback((status: ConsentStatus, settings: ConsentSettings) => {
    const consentData = {
      status,
      settings,
      timestamp: new Date().toISOString()
    };
    
    Cookies.set(COOKIE_NAME, JSON.stringify(consentData), { 
      expires: COOKIE_EXPIRY_DAYS,
      sameSite: 'lax'
    });
    
    setConsentStatus(status);
    setConsentSettings(settings);
    updateConsent(settings);
  }, [updateConsent]);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allGranted: ConsentSettings = {
      analytics_storage: CONSENT_MODES.GRANTED,
      ad_storage: CONSENT_MODES.GRANTED,
      ad_user_data: CONSENT_MODES.GRANTED,
      ad_personalization: CONSENT_MODES.GRANTED,
      functionality_storage: CONSENT_MODES.GRANTED,
      security_storage: CONSENT_MODES.GRANTED
    };
    
    saveConsent('accepted', allGranted);
  }, [saveConsent]);

  // Reject all cookies (except necessary)
  const rejectAll = useCallback(() => {
    const allDenied: ConsentSettings = {
      analytics_storage: CONSENT_MODES.DENIED,
      ad_storage: CONSENT_MODES.DENIED,
      ad_user_data: CONSENT_MODES.DENIED,
      ad_personalization: CONSENT_MODES.DENIED,
      functionality_storage: CONSENT_MODES.GRANTED,
      security_storage: CONSENT_MODES.GRANTED
    };
    
    saveConsent('rejected', allDenied);
  }, [saveConsent]);

  // Update partial consent
  const updatePartialConsent = useCallback((settings: Partial<ConsentSettings>) => {
    const newSettings = { ...consentSettings, ...settings };
    saveConsent('partial', newSettings);
  }, [consentSettings, saveConsent]);

  return {
    consentStatus,
    consentSettings,
    acceptAll,
    rejectAll,
    updateConsent: updatePartialConsent,
    isConsentGiven: consentStatus !== 'pending'
  };
}