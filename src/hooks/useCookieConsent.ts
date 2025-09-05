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
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>(DEFAULT_CONSENT_SETTINGS);
  const { updateConsent } = useGTM();

  // Load saved consent on mount
  useEffect(() => {
    const savedConsent = Cookies.get(COOKIE_NAME);
    
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsentStatus(parsed.status);
        setConsentSettings(parsed.settings);
        
        // Update GTM with saved consent
        updateConsent(parsed.settings);
      } catch (error) {
        console.error('Failed to parse consent cookie:', error);
      }
    }
  }, [updateConsent]);

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