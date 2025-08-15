import type { BrowserInfo, SupportedBrowserId } from './types';

export const SUPPORTED_BROWSERS: Record<SupportedBrowserId, BrowserInfo> = {
  chrome: {
    id: 'chrome',
    label: 'Google Chrome',
    iosScheme: (url: string) => `googlechrome://${url}`,
    androidPackage: 'com.android.chrome',
  },
  firefox: {
    id: 'firefox',
    label: 'Mozilla Firefox',
    iosScheme: (url: string) => `firefox://open-url?url=https://${url}`,
    androidPackage: 'org.mozilla.firefox',
  },
  brave: {
    id: 'brave',
    label: 'Brave Browser',
    iosScheme: (url: string) => `brave://open-url?url=https://${url}`,
    androidPackage: 'com.brave.browser',
  },
  edge: {
    id: 'edge',
    label: 'Microsoft Edge',
    iosScheme: (url: string) => `microsoft-edge-https://${url}`,
    androidPackage: 'com.microsoft.emmx',
  },
  opera: {
    id: 'opera',
    label: 'Opera Browser',
    iosScheme: (url: string) => `touch-https://${url}`,
    androidPackage: 'com.opera.browser',
  },
  operagx: {
    id: 'operagx',
    label: 'Opera GX',
    iosScheme: (url: string) => `opera-gx://open-url?url=https://${url}`,
    androidPackage: 'com.opera.gx',
  },
  duckduckgo: {
    id: 'duckduckgo',
    label: 'DuckDuckGo Browser',
    iosScheme: (url: string) => `ddgQuickLink://${url}`,
    androidPackage: 'com.duckduckgo.mobile.android',
  },
  samsung: {
    id: 'samsung',
    label: 'Samsung Browser',
    iosScheme: null,
    androidPackage: 'com.sec.android.app.sbrowser',
  },
  vivaldi: {
    id: 'vivaldi',
    label: 'Vivaldi Browser',
    iosScheme: (url: string) => `vivaldi://${url}`,
    androidPackage: 'com.vivaldi.browser',
  },
  uc: {
    id: 'uc',
    label: 'UC Browser',
    iosScheme: null,
    androidPackage: 'com.UCMobile.intl',
  },
  yandex: {
    id: 'yandex',
    label: 'Yandex Browser',
    iosScheme: null,
    androidPackage: 'com.yandex.browser',
  },
  safari: {
    id: 'safari',
    label: 'Safari',
    iosScheme: (url: string) => `x-safari-https://${url}`,
    androidPackage: null,
  },
};
