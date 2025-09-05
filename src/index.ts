// src/index.ts
// Types
export * from './types';

// Constants
export * from './constants';

// Core functions
export { 
  pushEvent, 
  pushPageView, 
  updateConsent, 
  initializeConsent 
} from './lib/gtm';

// Providers
export { GTMProvider, useGTMContext } from './providers';

// Hooks
export { useGTM, useCookieConsent } from './hooks';

// Components
export { RouteChangeListener, CookieConsent } from './components';

// Version
export const VERSION = '0.1.0';