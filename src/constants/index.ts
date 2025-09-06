// src/constants/index.ts
export const GTM_EVENTS = {
  // Page events
  PAGE_VIEW: 'page_view',
  VIRTUAL_PAGE_VIEW: 'virtual_page_view',
  
  // User interactions
  BUTTON_CLICK: 'button_click',
  LINK_CLICK: 'link_click',
  SCROLL_DEPTH: 'scroll_depth',
  
  // Form events
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  
  // Content events
  FILE_DOWNLOAD: 'file_download',
  VIDEO_PLAY: 'video_play',
  VIDEO_PAUSE: 'video_pause',
  VIDEO_COMPLETE: 'video_complete',
  
  // E-commerce (opsiyonel)
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  PURCHASE: 'purchase',
  
  // Consent
  CONSENT_UPDATE: 'consent_update',
  CONSENT_DEFAULT: 'consent_default'
} as const;

export const CONSENT_MODES = {
  GRANTED: 'granted',
  DENIED: 'denied'
} as const;

export const CONSENT_TYPES = {
  ANALYTICS: 'analytics_storage',
  AD_STORAGE: 'ad_storage',
  AD_USER_DATA: 'ad_user_data',
  AD_PERSONALIZATION: 'ad_personalization',
  FUNCTIONALITY: 'functionality_storage',
  SECURITY: 'security_storage'
} as const;

export const DEFAULT_CONSENT_SETTINGS = {
  [CONSENT_TYPES.ANALYTICS]: CONSENT_MODES.DENIED,
  [CONSENT_TYPES.AD_STORAGE]: CONSENT_MODES.DENIED,
  [CONSENT_TYPES.AD_USER_DATA]: CONSENT_MODES.DENIED,
  [CONSENT_TYPES.AD_PERSONALIZATION]: CONSENT_MODES.DENIED,
  [CONSENT_TYPES.FUNCTIONALITY]: CONSENT_MODES.GRANTED,
  [CONSENT_TYPES.SECURITY]: CONSENT_MODES.GRANTED
};

export const COOKIE_NAME = 'gtm_consent';
export const COOKIE_EXPIRY_DAYS = 365;