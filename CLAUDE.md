# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development & Building
```bash
npm run build       # Build the library using Rollup
npm run dev         # Build with watch mode for development
npm run lint        # Run ESLint on src/ directory
```

### Publishing
The library is published to GitHub Packages registry. Build happens automatically on `prepare` and `prepublishOnly` hooks.

## Architecture Overview

This is a TypeScript library for Google Tag Manager (GTM) integration in Next.js applications with cookie consent management and Google Consent Mode v2 support.

### Core Structure
- **Entry Point**: `src/index.ts` exports all public APIs
- **Provider Pattern**: `GTMProvider` component wraps the app and manages GTM script injection and context
- **Event System**: Direct dataLayer manipulation through `lib/gtm.ts` functions  
- **Consent Management**: Built-in cookie consent with Google Consent Mode v2 support

### Key Components
- `GTMProvider`: Main wrapper that initializes GTM and provides context. Uses `beforeInteractive` strategy for consent initialization
- `RouteChangeListener`: Tracks Next.js route changes automatically using `usePathname` hook
- `RouteChangeListenerWithParams`: Alternative listener that includes query parameters
- `CookieConsent`: GDPR/KVKK compliant consent banner component with customizable UI
- `useGTM` hook: Provides typed event tracking methods
- `useCookieConsent` hook: Manages consent state with js-cookie

### Build Configuration
- Uses Rollup for bundling with TypeScript plugin
- Outputs both CommonJS and ESM formats
- Generates TypeScript declarations
- Preserves 'use client' directives for Next.js App Router compatibility
- Peer dependencies: React 17+, Next.js 12+

### Important Implementation Details
- GTM script is injected via Next.js Script component with `beforeInteractive` strategy to ensure consent is set before GTM loads
- Consent defaults to denied state for all tracking categories
- Debug mode available for development logging
- Supports CSP nonce for security
- Cookie consent stored in 'gtm_consent' cookie with 365-day expiry
- Turkish comments and documentation exist throughout (library is from Bisasoft)
- Consent settings follow Google Consent Mode v2 categories: analytics_storage, ad_storage, ad_user_data, ad_personalization, functionality_storage, security_storage

## Testing Approach
Currently no test suite is implemented (`npm test` outputs "No test specified"). When adding tests, consider testing:
- Event pushing to dataLayer
- Consent state management
- Route change detection
- Cookie operations