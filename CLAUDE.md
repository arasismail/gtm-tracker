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

This is a TypeScript library for Google Tag Manager (GTM) integration in Next.js applications with cookie consent management.

### Core Structure
- **Entry Point**: `src/index.ts` exports all public APIs
- **Provider Pattern**: `GTMProvider` component wraps the app and manages GTM script injection and context
- **Event System**: Direct dataLayer manipulation through `lib/gtm.ts` functions
- **Consent Management**: Built-in cookie consent with Google Consent Mode v2 support

### Key Components
- `GTMProvider`: Main wrapper that initializes GTM and provides context
- `RouteChangeListener`: Tracks Next.js route changes automatically
- `RouteChangeListenerWithParams`: Alternative listener that includes query parameters
- `CookieConsent`: GDPR/KVKK compliant consent banner component
- `useGTM` hook: Provides typed event tracking methods
- `useCookieConsent` hook: Manages consent state

### Build Configuration
- Uses Rollup for bundling with TypeScript plugin
- Outputs both CommonJS and ESM formats with `'use client'` directive preserved
- Generates TypeScript declarations
- Peer dependencies: React 17+, Next.js 12+
- External dependencies: js-cookie for cookie management

### Important Implementation Details
- GTM script is injected via Next.js Script component with `afterInteractive` strategy
- Consent defaults to denied state for all tracking categories
- Debug mode available for development logging
- Supports CSP nonce for security
- Turkish comments exist in some files (e.g., GTMProvider.tsx line 44, rollup.config.js)
- All components use `'use client'` directive for Next.js App Router compatibility
- RouteChangeListener uses Suspense boundary for useSearchParams hook

## Testing Approach
Currently no test suite is implemented (`npm test` outputs "No test specified"). When adding tests, consider testing:
- Event pushing to dataLayer
- Consent state management
- Route change detection
- Cookie operations