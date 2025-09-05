# gtm-tracker## README.md Güncellemesi

İşte profesyonel ve detaylı bir README:

```markdown
# @arasismail/gtm-tracker

A comprehensive Google Tag Manager (GTM) implementation for Next.js applications with built-in cookie consent management, TypeScript support, and GDPR/KVKK compliance.

## Features

- 🚀 **Easy GTM Integration** - Simple setup for Next.js App Router and Pages Router
- 🍪 **Cookie Consent Management** - GDPR/KVKK compliant consent banner
- 📊 **Google Analytics 4 Support** - Seamless GA4 integration through GTM
- 🔄 **SPA Route Tracking** - Automatic route change detection for Next.js
- 📝 **TypeScript Support** - Full type safety and IntelliSense
- 🎯 **Custom Event Helpers** - Pre-built functions for common tracking needs
- ⚡ **Lightweight** - Only ~3KB gzipped
- 🔒 **Consent Mode v2** - Google's latest consent framework support
- 🐛 **Debug Mode** - Built-in debugging for development

## Installation

### Using npm with GitHub Packages (Private)

First, create a `.npmrc` file in your project root:

```bash
@arasismail:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @arasismail/gtm-tracker
```

### Using GitHub URL (Public)

```bash
npm install github:arasismail/gtm-tracker
```

Or add to `package.json`:

```json
{
  "dependencies": {
    "gtm-tracker": "github:arasismail/gtm-tracker"
  }
}
```

## Quick Start

### Basic Setup (App Router)

```typescript
// app/layout.tsx
import { GTMProvider, CookieConsent, RouteChangeListener } from '@arasismail/gtm-tracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GTMProvider 
          gtmId={process.env.NEXT_PUBLIC_GTM_ID!}
          debug={process.env.NODE_ENV === 'development'}
          enableInDevelopment={true}
        >
          {children}
          <RouteChangeListener />
          <CookieConsent />
        </GTMProvider>
      </body>
    </html>
  );
}
```

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Usage Examples

### Custom Event Tracking

```typescript
import { useGTM } from '@arasismail/gtm-tracker';

export function ContactForm() {
  const { trackFormSubmit } = useGTM();

  const handleSubmit = async (data) => {
    // Your form submission logic
    await submitForm(data);
    
    // Track the event
    trackFormSubmit('contact_form', {
      email: data.email,
      subject: data.subject
    });
  };

  return (
    // Your form JSX
  );
}
```

### Button Click Tracking

```typescript
import { useGTM } from '@arasismail/gtm-tracker';

export function HeroSection() {
  const { trackButtonClick } = useGTM();

  return (
    <button 
      onClick={() => trackButtonClick('hero_cta', 'Get Started')}
    >
      Get Started
    </button>
  );
}
```

### File Download Tracking

```typescript
import { useGTM } from '@arasismail/gtm-tracker';

export function DownloadSection() {
  const { trackFileDownload } = useGTM();

  const handleDownload = (filename: string, type: string) => {
    trackFileDownload(filename, type);
    // Trigger download
  };

  return (
    <button onClick={() => handleDownload('catalog.pdf', 'pdf')}>
      Download Catalog
    </button>
  );
}
```

### Direct Event Push

```typescript
import { pushEvent, GTM_EVENTS } from '@arasismail/gtm-tracker';

// Anywhere in your code
pushEvent(GTM_EVENTS.VIDEO_PLAY, {
  video_title: 'Product Demo',
  video_duration: 120,
  video_provider: 'youtube'
});
```

## Cookie Consent Management

The package includes a customizable cookie consent banner:

```typescript
<CookieConsent 
  title="Cookie Policy"
  description="We use cookies to enhance your experience."
  acceptLabel="Accept All"
  rejectLabel="Reject"
  privacyPolicyUrl="/privacy"
  position="bottom"
/>
```

### Cookie Consent Hook

```typescript
import { useCookieConsent } from '@arasismail/gtm-tracker';

export function MyComponent() {
  const { 
    consentStatus,    // 'pending' | 'accepted' | 'rejected' | 'partial'
    acceptAll,        // Function to accept all cookies
    rejectAll,        // Function to reject all cookies
    isConsentGiven    // Boolean
  } = useCookieConsent();

  // Use consent status in your logic
  if (!isConsentGiven) {
    return <div>Please accept cookies to continue</div>;
  }
}
```

## Available Events

Pre-defined event constants for consistency:

```typescript
import { GTM_EVENTS } from '@arasismail/gtm-tracker';

// Page events
GTM_EVENTS.PAGE_VIEW
GTM_EVENTS.VIRTUAL_PAGE_VIEW

// User interactions
GTM_EVENTS.BUTTON_CLICK
GTM_EVENTS.LINK_CLICK
GTM_EVENTS.SCROLL_DEPTH

// Form events
GTM_EVENTS.FORM_START
GTM_EVENTS.FORM_SUBMIT
GTM_EVENTS.FORM_ERROR

// Content events
GTM_EVENTS.FILE_DOWNLOAD
GTM_EVENTS.VIDEO_PLAY
GTM_EVENTS.VIDEO_PAUSE
GTM_EVENTS.VIDEO_COMPLETE

// E-commerce (optional)
GTM_EVENTS.VIEW_ITEM
GTM_EVENTS.ADD_TO_CART
GTM_EVENTS.PURCHASE

// Consent
GTM_EVENTS.CONSENT_UPDATE
```

## GTM Configuration

### Required GTM Setup

1. Create a Google Tag Manager account and container
2. Add Google Analytics 4 Configuration tag
3. Set up triggers for custom events
4. Configure Consent Mode v2

### Recommended GTM Variables

Create these Data Layer Variables in GTM:

- `event` - Event name
- `form_name` - Form identifier
- `button_label` - Button text
- `file_name` - Downloaded file name
- `video_title` - Video name

### Example GTM Trigger

For form submissions:

```
Trigger Type: Custom Event
Event Name: form_submit
This trigger fires on: All Custom Events
```

## Advanced Configuration

### GTMProvider Props

```typescript
interface GTMProviderProps {
  gtmId: string;                    // Your GTM container ID
  debug?: boolean;                   // Enable console logging
  enableInDevelopment?: boolean;     // Load GTM in development
  defaultConsent?: ConsentSettings; // Initial consent state
  nonce?: string;                   // CSP nonce value
}
```

### Consent Settings

```typescript
const customConsent = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted'
};

<GTMProvider 
  gtmId="GTM-XXXXXX"
  defaultConsent={customConsent}
>
```

## TypeScript Support

The package is fully typed. Import types as needed:

```typescript
import type { 
  GTMConfig,
  ConsentSettings,
  ConsentStatus,
  GTMEvent 
} from '@arasismail/gtm-tracker';
```

## Debug Mode

Enable debug mode to see all GTM events in console:

```typescript
<GTMProvider 
  gtmId="GTM-XXXXXX"
  debug={true}
>
```

Console output:
```
🚀 GTM initialized with ID: GTM-XXXXXX
📤 Event pushed: form_submit {form_name: "contact"}
📄 Page view: /about
🔐 Consent updated: {analytics_storage: "granted"}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Requirements

- Next.js 12.0.0 or higher
- React 17.0.0 or higher
- TypeScript 4.0.0 or higher (optional)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please use [GitHub Issues](https://github.com/arasismail/gtm-tracker/issues).

## Author

**İsmail Aras**
- GitHub: [@arasismail](https://github.com/arasismail)

## Changelog

### v0.1.0 (2024-01-05)
- Initial release
- GTM integration for Next.js
- Cookie consent management
- TypeScript support
- Route change tracking
- Custom event helpers
```

