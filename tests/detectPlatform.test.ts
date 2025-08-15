import { describe, test, expect, beforeEach } from 'vitest';
import BrowserSwitcher from '../src';

describe('detectPlatform()', () => {
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  test('should detect Android platform', () => {
    const androidUserAgents = [
      'Mozilla/5.0 (Linux; Android 12; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.61 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36',
      'Dalvik/2.1.0 (Linux; U; Android 11; Pixel 4 XL Build/RQ3A.211001.001)',
      'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/118.0 Firefox/118.0',
    ];

    androidUserAgents.forEach((ua) => {
      Object.defineProperty(navigator, 'userAgent', { value: ua });
      expect(BrowserSwitcher.detectPlatform()).toBe('android');
    });
  });

  test('should detect iOS platform', () => {
    const iosUserAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.5993.69 Mobile/15E148 Safari/604.1',
    ];

    iosUserAgents.forEach((ua) => {
      Object.defineProperty(navigator, 'userAgent', { value: ua });
      expect(BrowserSwitcher.detectPlatform()).toBe('ios');
    });
  });

  test('should detect desktop platform for non-mobile user agents', () => {
    const desktopUserAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/118.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    ];

    desktopUserAgents.forEach((ua) => {
      Object.defineProperty(navigator, 'userAgent', { value: ua });
      expect(BrowserSwitcher.detectPlatform()).toBe('desktop');
    });
  });

  test('should handle empty user agent string', () => {
    Object.defineProperty(navigator, 'userAgent', { value: '' });
    expect(BrowserSwitcher.detectPlatform()).toBe('desktop');
  });

  test('should handle undefined user agent', () => {
    Object.defineProperty(navigator, 'userAgent', { value: undefined });
    expect(BrowserSwitcher.detectPlatform()).toBe('desktop');
  });

  test('should handle custom non-standard user agents', () => {
    const customUserAgents = [
      'Mozilla/5.0 (PlayStation; PlayStation 5/2.26) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15',
      'Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/601.6 (KHTML, like Gecko) NF/4.0.0.5.10 NintendoBrowser/5.1.0.20393',
      'Mozilla/5.0 (SmartHub; SMART-TV; U; Linux/SmartTV) AppleWebKit/531.2+ (KHTML, like Gecko) WebBrowser/1.0 SmartTV Safari/531.2+',
    ];

    customUserAgents.forEach((ua) => {
      Object.defineProperty(navigator, 'userAgent', { value: ua });
      expect(BrowserSwitcher.detectPlatform()).toBe('desktop');
    });
  });

  test('should prioritize Android detection over iOS for Android devices with iPad in user agent', () => {
    const trickyUserAgent =
      'Mozilla/5.0 (Linux; Android 13; iPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36';
    Object.defineProperty(navigator, 'userAgent', { value: trickyUserAgent });
    expect(BrowserSwitcher.detectPlatform()).toBe('android');
  });
});
