/// <reference types="user-agent-data-types" />
import type { WebApp } from 'telegram-web-app';
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
    const ua = (navigator.userAgent || '').toLowerCase();
    if (/android/i.test(ua)) return 'android';
    if (/ipad|iphone|ipod/.test(ua)) return 'ios';
    return 'desktop';
  }

  /**
   * Checks if a known browser is currently in use based on user agent.
   * @returns {BrowserInfo | null} Browser info or null if not detected
   */
  static getCurrentBrowser(): BrowserInfo | null {
    const ua = (navigator.userAgent || '').toLowerCase();
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
   * @returns {BrowserInfo} Browser info
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
   * Detects known in-app browsers and common mobile WebView user agents.
   * @param userAgent - Optional user agent string to check.
   * @returns {InAppBrowserName | null} The detected name or `null` if not detected.
   */
  static detectInAppBrowser(userAgent?: string): InAppBrowserName | null {
    // Check for Telegram WebApp first
    if (this.isTelegram()) {
      return 'telegram';
    }

    const ua = (userAgent || navigator.userAgent || '').toLowerCase();
    if (!ua) return null;

    // 1. Instagram
    if (/\binstagram\b/.test(ua)) {
      return 'instagram';
    }

    // 2. Threads
    if (/\bbarcelona\b/.test(ua)) {
      return 'threads';
    }

    // 3. Facebook Messenger
    if (/\bmessenger\b|\bfban\/(?:messenger|orca)/.test(ua)) {
      return 'messenger';
    }

    // 4. Facebook
    if (/\b(?:fban|fbav|fb_iab|fb4a|fbios)\b/.test(ua)) {
      return 'facebook';
    }

    // 5. Twitter / X
    if (/\b(?:twitter|tweetbot)\b/.test(ua)) {
      return 'twitter';
    }

    // 6. TikTok / ByteDance apps
    if (/\b(?:tiktok|musical_ly|aweme|bytedancewebview|trill)\b/.test(ua)) {
      return 'tiktok';
    }

    // 7. WhatsApp
    if (/\bwhatsapp\b/.test(ua)) {
      return 'whatsapp';
    }

    // 8. LinkedIn
    if (/\blinkedin(?:app)?\b/.test(ua)) {
      return 'linkedin';
    }

    // 9. Line
    if (/\bline\//.test(ua)) {
      return 'line';
    }

    // 10. Snapchat
    if (/\bsnapchat\b/.test(ua)) {
      return 'snapchat';
    }

    // 11. Pinterest
    if (/\bpinterest\b/.test(ua)) {
      return 'pinterest';
    }

    // 12. KakaoTalk
    if (/\bkakaotalk\b/.test(ua)) {
      return 'kakaotalk';
    }

    // 13. Zalo
    if (/\bzalo\b/.test(ua)) {
      return 'zalo';
    }

    // 14. Reddit
    if (/\breddit\b/.test(ua)) {
      return 'reddit';
    }

    // 15. Discord
    if (/\bdiscord\b/.test(ua)) {
      return 'discord';
    }

    // 16. QQ / QQ Browser
    if (/\bqq\/\d/.test(ua)) {
      return 'qq';
    }

    // 17. Viber
    if (/\bviber\b/.test(ua)) {
      return 'viber';
    }

    // 18. WeChat
    if (/\bmicromessenger\b/.test(ua)) {
      return 'wechat';
    }

    // 19. VK
    if (/\b(?:vkclient|vkontakte|vkshare)\b/.test(ua)) {
      return 'vk';
    }

    // 20. Generic WebView detection
    const platform = this.detectPlatform();
    if (
      (platform === 'android' && /;\s*wv\s*[;)]/.test(ua)) ||
      (platform === 'ios' &&
        ua.includes('applewebkit') &&
        !ua.includes('safari') &&
        !/\b(?:chrome|crios|firefox|fxios|edge|edgios|opios|opt|yabrowser|duckduckgo|brave|aloha)\//.test(
          ua
        ))
    ) {
      return 'generic';
    }
    return null;
  }

  /**
   * Checks whether the current page is running inside Telegram's WebApp.
   * @returns {boolean} `True` if running inside Telegram's WebApp, otherwise `false`
   */
  static isTelegram(): boolean {
    if (typeof window === 'undefined') return false;

    const win = window as typeof window & {
      Telegram?: { WebApp?: WebApp };
      TelegramWebviewProxy?: unknown;
      TelegramWebviewProxyProto?: unknown;
      TelegramWebview?: unknown;
      TelegramGameProxy?: unknown;
    };
    const webApp = win.Telegram?.WebApp;

    // 1. Check if the page is actually running inside Telegram Mini App
    const isMiniApp =
      Boolean(webApp?.initData) || Boolean(webApp?.platform && webApp.platform !== 'unknown');

    // 2. Detect native WebView bridges injected by the Telegram client
    const isNativeWebView =
      Boolean(win.TelegramWebviewProxy) ||
      Boolean(win.TelegramWebviewProxyProto) ||
      Boolean(win.TelegramWebview) ||
      Boolean(win.TelegramGameProxy);

    // 3. Check the URL hash (added when opened via Web App / bot buttons)
    const hasTgHash = window.location.hash.includes('tgWebAppData=');

    return isMiniApp || isNativeWebView || hasTgHash;
  }

  /**
   * Checks if the current browser is an in-app browser
   * @param {string} [userAgent] Optional user agent string to check against
   * @returns {boolean} `True` if in-app browser is detected
   */
  static isInAppBrowser(userAgent?: string): boolean {
    return this.detectInAppBrowser(userAgent) !== null;
  }
}

export { BrowserSwitcher };
