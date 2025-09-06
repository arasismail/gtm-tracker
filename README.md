# GTM Tracker

Next.js uygulamaları için TypeScript tabanlı Google Tag Manager (GTM) entegrasyon paketi. Cookie consent yönetimi ve Google Consent Mode v2 desteği ile birlikte gelir.

## Özellikler

- 🚀 **Kolay GTM Entegrasyonu**: Next.js uygulamanıza tek satırla GTM ekleyin
- 🍪 **Cookie Consent Yönetimi**: GDPR/KVKK uyumlu hazır consent banner
- 📊 **Google Consent Mode v2**: Otomatik consent durumu yönetimi
- 🎯 **TypeScript Desteği**: Tam tip güvenliği ile geliştirme
- 🔄 **Otomatik Route Takibi**: Next.js route değişimlerini otomatik takip
- 🎨 **Özelleştirilebilir**: Consent banner'ı tamamen özelleştirilebilir
- 🔧 **Debug Modu**: Geliştirme sırasında detaylı loglama
- 🔐 **CSP Desteği**: Content Security Policy nonce desteği

## Kurulum

```bash
npm install @your-org/gtm-tracker
# veya
yarn add @your-org/gtm-tracker
# veya
pnpm add @your-org/gtm-tracker
```

## Hızlı Başlangıç

### 1. GTMProvider'ı Uygulamanıza Ekleyin

`app/layout.tsx` veya `pages/_app.tsx` dosyanızda:

```tsx
import { GTMProvider } from '@your-org/gtm-tracker';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <GTMProvider 
          gtmId="GTM-XXXXXXX"
          auth="your-auth-key" // Opsiyonel: GTM environment için
          preview="env-preview" // Opsiyonel: GTM environment için
        >
          {children}
        </GTMProvider>
      </body>
    </html>
  );
}
```

### 2. Cookie Consent Banner'ı Ekleyin

```tsx
import { CookieConsent } from '@your-org/gtm-tracker';

export default function App() {
  return (
    <>
      {/* Uygulama içeriğiniz */}
      <CookieConsent />
    </>
  );
}
```

### 3. Route Değişimlerini Takip Edin

```tsx
import { RouteChangeListener } from '@your-org/gtm-tracker';

export default function App() {
  return (
    <>
      <RouteChangeListener />
      {/* Uygulama içeriğiniz */}
    </>
  );
}
```

## Detaylı Kullanım

### GTM Event'leri Göndermek

```tsx
import { useGTM } from '@your-org/gtm-tracker';

function ProductPage() {
  const { pushEvent } = useGTM();

  const handleAddToCart = () => {
    pushEvent({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'TRY',
        value: 99.99,
        items: [{
          item_id: 'SKU123',
          item_name: 'Ürün Adı',
          price: 99.99,
          quantity: 1
        }]
      }
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Sepete Ekle
    </button>
  );
}
```

### Cookie Consent Yönetimi

```tsx
import { useCookieConsent } from '@your-org/gtm-tracker';

function MyComponent() {
  const { 
    consentState, 
    updateConsent, 
    resetConsent 
  } = useCookieConsent();

  // Mevcut consent durumunu kontrol et
  console.log(consentState);
  // { analytics: true, marketing: false, personalization: false, functionality: true }

  // Consent'i güncelle
  const handleAcceptMarketing = () => {
    updateConsent({ marketing: true });
  };

  // Tüm consent'leri sıfırla
  const handleResetAll = () => {
    resetConsent();
  };

  return (
    <div>
      <button onClick={handleAcceptMarketing}>
        Pazarlama Çerezlerini Kabul Et
      </button>
      <button onClick={handleResetAll}>
        Tercihlerimi Sıfırla
      </button>
    </div>
  );
}
```

### Özel Cookie Consent Banner

```tsx
import { CookieConsent } from '@your-org/gtm-tracker';

function App() {
  return (
    <CookieConsent
      position="bottom-left"
      theme="dark"
      buttonText="Kabul Et"
      declineButtonText="Reddet"
      customizeButtonText="Özelleştir"
      message="Web sitemizde size daha iyi hizmet verebilmek için çerezler kullanıyoruz."
      privacyPolicyUrl="/gizlilik-politikasi"
      cookiePolicyUrl="/cerez-politikasi"
      onAccept={(consentState) => {
        console.log('Kabul edildi:', consentState);
      }}
      onDecline={() => {
        console.log('Reddedildi');
      }}
      className="custom-consent-banner"
      style={{ backgroundColor: '#1a1a1a' }}
    />
  );
}
```

### Debug Modu

Geliştirme sırasında detaylı loglama için:

```tsx
<GTMProvider 
  gtmId="GTM-XXXXXXX"
  debug={true}
>
  {children}
</GTMProvider>
```

### CSP (Content Security Policy) Desteği

```tsx
<GTMProvider 
  gtmId="GTM-XXXXXXX"
  nonce="your-csp-nonce"
>
  {children}
</GTMProvider>
```

## API Referansı

### GTMProvider Props

| Prop | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `gtmId` | `string` | ✅ | Google Tag Manager container ID'si |
| `auth` | `string` | ❌ | GTM environment auth parametresi |
| `preview` | `string` | ❌ | GTM environment preview parametresi |
| `debug` | `boolean` | ❌ | Debug modunu aktifleştirir (default: false) |
| `nonce` | `string` | ❌ | CSP nonce değeri |
| `children` | `ReactNode` | ✅ | Uygulama içeriği |

### CookieConsent Props

| Prop | Tip | Açıklama |
|------|-----|----------|
| `position` | `'bottom-left' \| 'bottom-right' \| 'top-left' \| 'top-right'` | Banner pozisyonu |
| `theme` | `'light' \| 'dark'` | Tema seçimi |
| `buttonText` | `string` | Kabul butonu metni |
| `declineButtonText` | `string` | Reddet butonu metni |
| `customizeButtonText` | `string` | Özelleştir butonu metni |
| `message` | `string` | Banner mesajı |
| `privacyPolicyUrl` | `string` | Gizlilik politikası linki |
| `cookiePolicyUrl` | `string` | Çerez politikası linki |
| `onAccept` | `(consentState: ConsentState) => void` | Kabul callback'i |
| `onDecline` | `() => void` | Reddetme callback'i |
| `className` | `string` | Özel CSS class |
| `style` | `CSSProperties` | Inline style |

### useGTM Hook

```tsx
const { pushEvent, dataLayer } = useGTM();
```

- `pushEvent(data: DataLayerObject)`: DataLayer'a event gönderir
- `dataLayer`: Window dataLayer referansı

### useCookieConsent Hook

```tsx
const { 
  consentState, 
  updateConsent, 
  resetConsent,
  acceptAll,
  declineAll 
} = useCookieConsent();
```

- `consentState`: Mevcut consent durumu
- `updateConsent(updates: Partial<ConsentState>)`: Consent'i günceller
- `resetConsent()`: Tüm consent'leri sıfırlar
- `acceptAll()`: Tüm kategorileri kabul eder
- `declineAll()`: Tüm kategorileri reddeder

## GTM'de Desteklenen Tag'ler

Bu paket GTM container'ınıza eklediğiniz **tüm tag türlerini** destekler:

- ✅ Google Analytics 4 (GA4)
- ✅ Google Ads (Conversion Tracking, Remarketing)
- ✅ Facebook Pixel
- ✅ LinkedIn Insight Tag
- ✅ Twitter Pixel
- ✅ TikTok Pixel
- ✅ Hotjar
- ✅ Microsoft Clarity
- ✅ Custom HTML Tags
- ✅ Ve GTM'de kurduğunuz diğer tüm tag'ler

## Consent Kategorileri

Google Consent Mode v2 ile uyumlu 4 kategori:

- **analytics_storage**: Analitik çerezleri (GA4, vb.)
- **ad_storage**: Reklam çerezleri (Google Ads, Facebook Pixel, vb.)
- **ad_personalization**: Kişiselleştirilmiş reklamlar
- **ad_user_data**: Kullanıcı verisi paylaşımı

## Örnek Projeler

### E-Ticaret Entegrasyonu

```tsx
// Ürün görüntüleme
pushEvent({
  event: 'view_item',
  ecommerce: {
    currency: 'TRY',
    value: 150.00,
    items: [{
      item_id: 'SKU123',
      item_name: 'Ürün Adı',
      item_category: 'Kategori',
      price: 150.00,
      quantity: 1
    }]
  }
});

// Satın alma
pushEvent({
  event: 'purchase',
  ecommerce: {
    transaction_id: '12345',
    value: 350.00,
    currency: 'TRY',
    items: [...]
  }
});
```

### Form Takibi

```tsx
// Form gönderimi
pushEvent({
  event: 'form_submit',
  form_name: 'contact_form',
  form_destination: '/api/contact'
});
```

### Özel Event'ler

```tsx
// Video izleme
pushEvent({
  event: 'video_play',
  video_title: 'Ürün Tanıtımı',
  video_duration: 120
});

// Dosya indirme
pushEvent({
  event: 'file_download',
  file_name: 'katalog.pdf',
  file_type: 'pdf'
});
```

## Geliştirme

### Projeyi Klonlama

```bash
git clone https://github.com/your-org/gtm-tracker.git
cd gtm-tracker
npm install
```

### Komutlar

```bash
npm run build       # Kütüphaneyi derle
npm run dev         # Watch modunda geliştirme
npm run lint        # ESLint kontrolü
```

### Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT

## Destek

Sorularınız veya önerileriniz için [issue](https://github.com/your-org/gtm-tracker/issues) açabilirsiniz.

---

Made with ❤️ for Next.js developers