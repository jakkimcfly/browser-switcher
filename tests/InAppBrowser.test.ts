import { describe, test, expect, beforeEach } from 'vitest';
import BrowserSwitcher from '../src/core/BrowserSwitcher';

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

  test('Returns false for regular Chrome', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
      writable: true,
    });

    expect(BrowserSwitcher.isInAppBrowser()).toBe(false);
  });
});
