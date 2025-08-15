/// <reference types="user-agent-data-types" />
import { SUPPORTED_BROWSERS } from './browsers';
import type {
  BrowserInfo,
  BrowserOpenOptions,
  InAppBrowserName,
  OpenMethod,
  OpenWindowOptions,
  Platform,
  SupportedBrowserId,
} from '../types/types';

class BrowserSwitcher {
  /**
   * Detects the current platform based on user agent
   * @returns {Platform} Detected platform: android, ios or desktop
   */
  static detectPlatform(): Platform {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
    return 'desktop';
  }

  /**
   * Checks if a known browser is currently in use based on user agent.
   * @returns {BrowserInfo | null} Browser info or null if not detected
   */
  static getCurrentBrowser(): BrowserInfo | null {
    const ua = navigator.userAgent.toLowerCase();
    const uaData = navigator?.userAgentData || null;

    if (ua.includes('firefox')) return SUPPORTED_BROWSERS['firefox'];
    if (ua.includes('brave')) return SUPPORTED_BROWSERS['brave'];
    if (ua.includes('edg')) return SUPPORTED_BROWSERS['edge'];
    if (ua.includes('opx') || ua.includes('opera gx')) return SUPPORTED_BROWSERS['operagx'];
    if (ua.includes('opt') || ua.includes('opr') || ua.includes('opera'))
      return SUPPORTED_BROWSERS['opera'];
    if (ua.includes('duckduckgo') || ua.includes('ddg')) return SUPPORTED_BROWSERS['duckduckgo'];
    if (ua.includes('samsungbrowser')) return SUPPORTED_BROWSERS['samsung'];
    if (ua.includes('vivaldi')) return SUPPORTED_BROWSERS['vivaldi'];
    if (ua.includes('ucbrowser')) return SUPPORTED_BROWSERS['uc'];
    if (ua.includes('yabrowser')) return SUPPORTED_BROWSERS['yandex'];

    if (uaData?.brands) {
      for (const brandInfo of uaData.brands) {
        const brand = brandInfo.brand.toLowerCase();
        if (brand.includes('chrome') && !brand.includes('edge') && !brand.includes('opera'))
          return SUPPORTED_BROWSERS['chrome'];
        if (brand.includes('edge')) return SUPPORTED_BROWSERS['edge'];
        if (brand.includes('opera')) return SUPPORTED_BROWSERS['opera'];
      }
    }

    switch (this.detectPlatform()) {
      case 'ios':
        if (ua.includes('crios')) return SUPPORTED_BROWSERS['chrome'];
        if (ua.includes('fxios')) return SUPPORTED_BROWSERS['firefox'];
        if (ua.includes('edgios')) return SUPPORTED_BROWSERS['edge'];
        if (
          ua.includes('safari') &&
          !ua.includes('chrome') &&
          !ua.includes('crios') &&
          !ua.includes('android')
        )
          return SUPPORTED_BROWSERS['safari'];
        break;
      default:
        if (
          ua.includes('chrome') &&
          !ua.includes('edg') &&
          !ua.includes('opr') &&
          !ua.includes('brave')
        )
          return SUPPORTED_BROWSERS['chrome'];
        break;
    }

    return null;
  }

  /**
   * Gets the configuration for a specific browser on current platform
   * @param {SupportedBrowserId} browserId - Target browser name
   * @returns {BrowserConfig} Browser info
   */
  static getBrowserConfig(browserId: SupportedBrowserId): BrowserInfo {
    return SUPPORTED_BROWSERS[browserId];
  }

  /**
   * Gets a list of supported browsers for platform
   * @param {Platform | null} platform - Target platform or current if `null`
   * @returns {BrowserInfo[]} Array of supported browsers
   */
  static supportedBrowsers(platform: Platform | null = null): BrowserInfo[] {
    switch (platform || this.detectPlatform()) {
      case 'android':
        return Object.values(SUPPORTED_BROWSERS).filter(
          (browser) => browser.androidPackage !== null
        );
      case 'ios':
        return Object.values(SUPPORTED_BROWSERS).filter((browser) => browser.iosScheme !== null);
      case 'desktop':
        return [];
    }
  }

  /**
   * Open URL in a specific browser
   * @param {BrowserOpenOptions} options - Configuration options.
   */
  static open(options: BrowserOpenOptions): void {
    const {
      targetUrl,
      browser = null,
      platform = 'auto',
      method = 'href',
      windowOptions,
    } = options;

    // Remove the protocol (http/https) for internal formatting
    const formattedUrl = targetUrl.replace(/^https?:\/\//, '');

    // Retrieve browser configuration by name
    let browserInfo = browser && this.getBrowserConfig(browser);
    switch (platform) {
      case 'android': {
        if (browserInfo && !browserInfo.androidPackage) {
          throw new Error(`Unsupported browser for Android: ${browser}`);
        }
        const intentUrl = `intent://${formattedUrl}#Intent;scheme=https;${browserInfo?.androidPackage ? `package=${browserInfo.androidPackage};` : ''}end;`;
        // Open the intent URL using the specified method
        this.openWithMethod(intentUrl, method, windowOptions);
        return;
      }
      case 'ios':
        if (browserInfo === null) {
          // Fallback to Safari if browser is not specified
          browserInfo = this.getBrowserConfig('safari');
        }
        if (browserInfo!.iosScheme !== null) {
          // Open using the iOS scheme if available
          this.openWithMethod(browserInfo!.iosScheme(formattedUrl), method, windowOptions);
          return;
        }
        throw new Error(`Unsupported browser for iOS: ${browser}`);
      case 'desktop':
        // Open the regular HTTPS URL for desktop
        this.openWithMethod(`https://${formattedUrl}`, method, windowOptions);
        return;
      // Automatically detect the platform and call open again with resolved platform
      case 'auto':
        this.open({
          targetUrl: targetUrl,
          browser: browser,
          platform: this.detectPlatform(),
          method: method,
          windowOptions: windowOptions,
        });
    }
  }

  /**
   * Open URL using the specified method.
   *
   * @param targetUrl - The URL.
   * @param method - The open method.
   * @param windowOptions - Optional `window.open` parameters.
   */
  private static openWithMethod(
    targetUrl: string,
    method: OpenMethod,
    windowOptions?: OpenWindowOptions
  ): void {
    switch (method) {
      case 'href':
        window.location.href = targetUrl;
        break;
      case 'replace':
        window.location.replace(targetUrl);
        break;
      case 'open': {
        window.open(
          targetUrl,
          windowOptions?.target ?? '_blank',
          windowOptions?.features ?? 'noopener,noreferrer'
        );
      }
    }
  }

  /**
   * Detects if the current browser is an in-app browser (WebView inside social apps)
   * @returns {InAppBrowserName | null} The name of the in-app browser or `null` if not in-app
   */
  static detectInAppBrowser(): InAppBrowserName | null {
    const ua = navigator.userAgent.toLowerCase();
    // Facebook apps
    if (ua.includes('fban') || ua.includes('fbav')) {
      return 'facebook';
    }

    // Instagram
    if (ua.includes('instagram')) {
      return 'instagram';
    }

    // Twitter
    if (ua.includes('twitter') || ua.includes('tweetbot')) {
      return 'twitter';
    }

    // TikTok
    if (ua.includes('tiktok')) {
      return 'tiktok';
    }

    // WhatsApp
    if (ua.includes('whatsapp')) {
      return 'whatsapp';
    }

    // LinkedIn
    if (ua.includes('linkedin')) {
      return 'linkedin';
    }

    // Facebook Messenger
    if (ua.includes('messenger')) {
      return 'messenger';
    }

    // Line
    if (ua.includes(' line/')) {
      return 'line';
    }

    // Snapchat
    if (ua.includes('snapchat')) {
      return 'snapchat';
    }

    // Pinterest
    if (ua.includes('pinterest')) {
      return 'pinterest';
    }

    // Generic WebView detection
    if (
      (this.detectPlatform() === 'android' && ua.includes('; wv)')) ||
      (this.detectPlatform() === 'ios' &&
        ua.includes('applewebkit') &&
        !ua.includes('safari') &&
        !ua.includes('chrome') &&
        !ua.includes('firefox') &&
        !ua.includes('edge'))
    ) {
      return 'generic';
    }
    return null;
  }

  /**
   * Checks if the current browser is an in-app browser
   * @returns {boolean} `True` if in-app browser is detected
   */
  static isInAppBrowser(): boolean {
    return this.detectInAppBrowser() !== null;
  }
}

export default BrowserSwitcher;
