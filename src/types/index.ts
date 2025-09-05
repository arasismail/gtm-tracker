// src/types/index.ts
import { CONSENT_MODES, CONSENT_TYPES } from '../constants';

export interface GTMConfig {
  gtmId: string;
  debug?: boolean;
  enableInDevelopment?: boolean;
  defaultConsent?: ConsentSettings;
  cookieExpiry?: number;
  cookieName?: string;
  nonce?: string;
}

export type ConsentMode = typeof CONSENT_MODES[keyof typeof CONSENT_MODES];
export type ConsentType = typeof CONSENT_TYPES[keyof typeof CONSENT_TYPES];

export interface ConsentSettings {
  [CONSENT_TYPES.ANALYTICS]: ConsentMode;
  [CONSENT_TYPES.AD_STORAGE]: ConsentMode;
  [CONSENT_TYPES.AD_USER_DATA]: ConsentMode;
  [CONSENT_TYPES.AD_PERSONALIZATION]: ConsentMode;
  [CONSENT_TYPES.FUNCTIONALITY]?: ConsentMode;
  [CONSENT_TYPES.SECURITY]?: ConsentMode;
}

export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'partial';

export interface CookieConsentProps {
  title?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  privacyPolicyUrl?: string;
  className?: string;
  position?: 'bottom' | 'top' | 'center';
}

// GTMContext için interface - YENİ EKLENEN
export interface GTMContextValue {
  gtmId: string;
  pushEvent: (eventName: string, parameters?: Record<string, any>) => void;
  pushPageView: (url?: string, title?: string) => void;
  updateConsent: (settings: Record<string, any>) => void;
}

// UseGTM hook'u için return type - TEK TANE KALACAK
export interface UseGTMReturn {
  pushEvent: (eventName: string, parameters?: Record<string, any>) => void;
  pushPageView: (url?: string, title?: string) => void;
  updateConsent: (settings: Record<string, any>) => void; // ConsentSettings yerine Record<string, any>
  trackButtonClick: (label: string, value?: any) => void;
  trackFormSubmit: (formName: string, formData?: Record<string, any>) => void;
  trackFileDownload: (fileName: string, fileType: string) => void;
}

// Cookie consent hook'u için return type
export interface UseCookieConsentReturn {
  consentStatus: ConsentStatus;
  consentSettings: ConsentSettings;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (settings: Partial<ConsentSettings>) => void;
  isConsentGiven: boolean;
}