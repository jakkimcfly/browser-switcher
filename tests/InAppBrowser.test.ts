import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BrowserSwitcher } from '../src/core/BrowserSwitcher';

const telegramGlobalNames = [
  'Telegram',
  'TelegramWebviewProxy',
  'TelegramWebviewProxyProto',
  'TelegramWebview',
  'TelegramGameProxy',
];

function setWindowGlobal(name: string, value: unknown): void {
  Object.defineProperty(window, name, {
    configurable: true,
    value,
    writable: true,
  });
}

describe('In-App Browser Detection', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: '',
      writable: true,
      configurable: true,
    });
  });

  test('Detects Facebook In-App browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBDV/iPhone13,3;FBMD/iPhone;FBSN/iOS;FBSV/15.0;FBSS/3;FBID/phone;FBLC/en_US;FBOP/5]',
      writable: true,
    });

    expect(BrowserSwitcher.isInAppBrowser()).toBe(true);
    expect(BrowserSwitcher.detectInAppBrowser()).toBe('facebook');
  });

  test('Detects Instagram In-App browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 265.0.0.19.103 (iPhone13,3; iOS 15_0; en_US; en-US; scale=3.00; 1125x2436; 387362449)',
      writable: true,
    });

    expect(BrowserSwitcher.detectInAppBrowser()).toBe('instagram');
  });

  test.each([
    ['Instagram with Facebook markers', 'Instagram 265.0 [FBAN/Instagram;FBAV/265.0]', 'instagram'],
    ['Messenger with Facebook markers', '[FBAN/MessengerForiOS;FBAV/420.0]', 'messenger'],
    ['Messenger for Android', '[FBAN/Orca-Android;FBAV/420.0]', 'messenger'],
    ['Facebook in-app marker', '[FB_IAB/FB4A;]', 'facebook'],
    ['TikTok musical.ly marker', 'musical_ly/2023000000', 'tiktok'],
    ['TikTok aweme marker', 'aweme/2023000000', 'tiktok'],
  ] as const)('Detects %s', (_description, userAgent, expected) => {
    Object.defineProperty(navigator, 'userAgent', { value: userAgent });
    expect(BrowserSwitcher.detectInAppBrowser()).toBe(expected);
    expect(BrowserSwitcher.isInAppBrowser()).toBe(true);
  });

  test.each([
    ['Instagram/1.0', 'instagram'],
    ['Barcelona/1.0', 'threads'],
    ['Messenger/1.0', 'messenger'],
    ['FBAN/MessengerForiOS', 'messenger'],
    ['FBAN/Orca-Android', 'messenger'],
    ['FBAN/FBIOS', 'facebook'],
    ['FBAV/1.0', 'facebook'],
    ['FB_IAB/1.0', 'facebook'],
    ['FB4A/1.0', 'facebook'],
    ['FBIOS/1.0', 'facebook'],
    ['Twitter/1.0', 'twitter'],
    ['Tweetbot/1.0', 'twitter'],
    ['TikTok/1.0', 'tiktok'],
    ['musical_ly/1.0', 'tiktok'],
    ['aweme/1.0', 'tiktok'],
    ['BytedanceWebview/1.0', 'tiktok'],
    ['trill/1.0', 'tiktok'],
    ['WhatsApp/1.0', 'whatsapp'],
    ['LinkedIn/1.0', 'linkedin'],
    ['LinkedInApp/1.0', 'linkedin'],
    ['Line/1.0', 'line'],
    ['Snapchat/1.0', 'snapchat'],
    ['Pinterest/1.0', 'pinterest'],
    ['KakaoTalk/1.0', 'kakaotalk'],
    ['Zalo/1.0', 'zalo'],
    ['Reddit/1.0', 'reddit'],
    ['Discord/1.0', 'discord'],
    ['QQ/1.0', 'qq'],
    ['Viber/1.0', 'viber'],
    ['MicroMessenger/1.0', 'wechat'],
    ['VKClient/1.0', 'vk'],
    ['VKontakte/1.0', 'vk'],
    ['VKShare/1.0', 'vk'],
  ] as const)('Detects marker %s as %s', (userAgent, expected) => {
    Object.defineProperty(navigator, 'userAgent', { value: userAgent });

    expect(BrowserSwitcher.detectInAppBrowser()).toBe(expected);
    expect(BrowserSwitcher.detectInAppBrowser(userAgent.toUpperCase())).toBe(expected);
    expect(BrowserSwitcher.isInAppBrowser()).toBe(true);
  });

  test.each([
    ['Instagram Barcelona [FBAN/Messenger;FBAV/1.0]', 'instagram'],
    ['Barcelona [FBAN/Messenger;FBAV/1.0]', 'threads'],
    ['Messenger [FBAN/FBIOS;FBAV/1.0]', 'messenger'],
    ['Mozilla/5.0 (Linux; Android 12; wv) Twitter/1.0', 'twitter'],
  ] as const)('Prefers the specific app in %s', (userAgent, expected) => {
    Object.defineProperty(navigator, 'userAgent', { value: userAgent });
    expect(BrowserSwitcher.detectInAppBrowser()).toBe(expected);
  });

  test('Uses the supplied user agent instead of the navigator user agent', () => {
    Object.defineProperty(navigator, 'userAgent', { value: 'Instagram/1.0' });

    expect(BrowserSwitcher.detectInAppBrowser('Twitter/1.0')).toBe('twitter');
    expect(BrowserSwitcher.detectInAppBrowser('')).toBe('instagram');
  });

  test.each(['', 'instagrammer', 'fbanalysis', 'Lineage/1.0', 'QQ/browser', 'myvkontakte'])(
    'Does not detect an app from %j',
    (userAgent) => {
      Object.defineProperty(navigator, 'userAgent', { value: userAgent });
      expect(BrowserSwitcher.detectInAppBrowser()).toBeNull();
      expect(BrowserSwitcher.isInAppBrowser()).toBe(false);
    }
  );

  test('Detects generic Android WebView', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 11; V2025; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36 VivoBrowser/6.3.3.1',
      writable: true,
    });

    expect(BrowserSwitcher.detectPlatform()).toBe('android');
    expect(BrowserSwitcher.detectInAppBrowser()).toBe('generic');
  });

  test('Detects generic iOS WebView', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/20C5039e',
      writable: true,
    });

    expect(BrowserSwitcher.detectPlatform()).toBe('ios');
    expect(BrowserSwitcher.detectInAppBrowser()).toBe('generic');
  });

  test('Detects Android WebView with differently spaced markers', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 12; wv ; Pixel) AppleWebKit/537.36',
    });

    expect(BrowserSwitcher.detectInAppBrowser()).toBe('generic');
  });

  test.each([
    'Chrome',
    'CriOS',
    'Firefox',
    'FxiOS',
    'Edge',
    'EdgiOS',
    'OPiOS',
    'OPT',
    'YaBrowser',
    'DuckDuckGo',
    'Brave',
    'Aloha',
  ])('Does not mistake iOS %s for a WebView when Safari is absent', (browser) => {
    Object.defineProperty(navigator, 'userAgent', {
      value: `Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 ${browser}/1.0 Mobile/15E148`,
    });

    expect(BrowserSwitcher.detectInAppBrowser()).toBeNull();
  });

  test.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Mobile/15E148',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 12; wvextra) AppleWebKit/537.36',
    'Mozilla/5.0 (Windows NT 10.0; wv) AppleWebKit/537.36',
  ])('Does not detect a generic WebView in %s', (userAgent) => {
    Object.defineProperty(navigator, 'userAgent', { value: userAgent });
    expect(BrowserSwitcher.detectInAppBrowser()).toBeNull();
  });

  test('Does not mistake incidental Facebook or Instagram text for app markers', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 12) Chrome/112.0 Safari/537.36 fbanalysis instagrammer',
    });

    expect(BrowserSwitcher.detectInAppBrowser()).toBeNull();
  });

  test('Returns false for regular Chrome', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      writable: true,
    });

    expect(BrowserSwitcher.isInAppBrowser()).toBe(false);
  });
});

describe('Telegram in-app browser detection', () => {
  let originalGlobals: Map<string, PropertyDescriptor | undefined>;
  let originalHash: string;

  beforeEach(() => {
    originalGlobals = new Map(
      telegramGlobalNames.map((name) => [name, Object.getOwnPropertyDescriptor(window, name)])
    );
    for (const name of telegramGlobalNames) {
      Reflect.deleteProperty(window, name);
    }

    originalHash = window.location.hash;
    window.location.hash = '';
  });

  afterEach(() => {
    for (const name of telegramGlobalNames) {
      const descriptor = originalGlobals.get(name);
      if (descriptor) {
        Object.defineProperty(window, name, descriptor);
      } else {
        Reflect.deleteProperty(window, name);
      }
    }

    window.location.hash = originalHash;
  });

  test.each([
    ['WebApp initData', () => setWindowGlobal('Telegram', { WebApp: { initData: 'user=123' } })],
    ['WebApp platform', () => setWindowGlobal('Telegram', { WebApp: { platform: 'ios' } })],
    ['TelegramWebviewProxy bridge', () => setWindowGlobal('TelegramWebviewProxy', {})],
    ['TelegramWebviewProxyProto bridge', () => setWindowGlobal('TelegramWebviewProxyProto', {})],
    ['TelegramWebview bridge', () => setWindowGlobal('TelegramWebview', {})],
    ['TelegramGameProxy bridge', () => setWindowGlobal('TelegramGameProxy', {})],
    ['tgWebAppData URL hash', () => (window.location.hash = '#tgWebAppData=user%3D123')],
  ])('Detects Telegram through %s', (_signal, setup) => {
    setup();

    expect(BrowserSwitcher.isTelegram()).toBe(true);
    expect(BrowserSwitcher.detectInAppBrowser('Chrome/1.0')).toBe('telegram');
    expect(BrowserSwitcher.isInAppBrowser()).toBe(true);
  });

  test.each([
    ['no Telegram signal', () => {}],
    ['Telegram global without WebApp', () => setWindowGlobal('Telegram', {})],
    [
      'uninitialized WebApp',
      () => setWindowGlobal('Telegram', { WebApp: { initData: '', platform: 'unknown' } }),
    ],
    ['unrelated URL hash', () => (window.location.hash = '#foo=bar')],
  ])('Does not detect Telegram with %s', (_condition, setup) => {
    setup();

    expect(BrowserSwitcher.isTelegram()).toBe(false);
    expect(BrowserSwitcher.detectInAppBrowser()).toBeNull();
    expect(BrowserSwitcher.isInAppBrowser()).toBe(false);
  });
});
