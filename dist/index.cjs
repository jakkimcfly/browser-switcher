"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BrowserSwitcher: () => BrowserSwitcher,
  SUPPORTED_BROWSERS: () => SUPPORTED_BROWSERS
});
module.exports = __toCommonJS(index_exports);

// src/core/browsers.ts
var SUPPORTED_BROWSERS = {
  chrome: {
    id: "chrome",
    label: "Google Chrome",
    iosScheme: (url) => `googlechrome://${url}`,
    androidPackage: "com.android.chrome"
  },
  firefox: {
    id: "firefox",
    label: "Mozilla Firefox",
    iosScheme: (url) => `firefox://open-url?url=https://${url}`,
    androidPackage: "org.mozilla.firefox"
  },
  brave: {
    id: "brave",
    label: "Brave Browser",
    iosScheme: (url) => `brave://open-url?url=https://${url}`,
    androidPackage: "com.brave.browser"
  },
  edge: {
    id: "edge",
    label: "Microsoft Edge",
    iosScheme: (url) => `microsoft-edge-https://${url}`,
    androidPackage: "com.microsoft.emmx"
  },
  opera: {
    id: "opera",
    label: "Opera Browser",
    iosScheme: (url) => `touch-https://${url}`,
    androidPackage: "com.opera.browser"
  },
  operagx: {
    id: "operagx",
    label: "Opera GX",
    iosScheme: (url) => `opera-gx://open-url?url=https://${url}`,
    androidPackage: "com.opera.gx"
  },
  duckduckgo: {
    id: "duckduckgo",
    label: "DuckDuckGo Browser",
    iosScheme: (url) => `ddgQuickLink://${url}`,
    androidPackage: "com.duckduckgo.mobile.android"
  },
  samsung: {
    id: "samsung",
    label: "Samsung Browser",
    iosScheme: null,
    androidPackage: "com.sec.android.app.sbrowser"
  },
  vivaldi: {
    id: "vivaldi",
    label: "Vivaldi Browser",
    iosScheme: (url) => `vivaldi://${url}`,
    androidPackage: "com.vivaldi.browser"
  },
  uc: {
    id: "uc",
    label: "UC Browser",
    iosScheme: null,
    androidPackage: "com.UCMobile.intl"
  },
  yandex: {
    id: "yandex",
    label: "Yandex Browser",
    iosScheme: null,
    androidPackage: "com.yandex.browser"
  },
  safari: {
    id: "safari",
    label: "Safari",
    iosScheme: (url) => `x-safari-https://${url}`,
    androidPackage: null
  }
};

// src/core/BrowserSwitcher.ts
var BrowserSwitcher = class {
  /**
   * Detects the current platform based on user agent
   * @returns {Platform} Detected platform: android, ios or desktop
   */
  static detectPlatform() {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (/android/i.test(ua)) return "android";
    if (/ipad|iphone|ipod/.test(ua)) return "ios";
    return "desktop";
  }
  /**
   * Checks if a known browser is currently in use based on user agent.
   * @returns {BrowserInfo | null} Browser info or null if not detected
   */
  static getCurrentBrowser() {
    const ua = (navigator.userAgent || "").toLowerCase();
    const uaData = navigator?.userAgentData || null;
    if (ua.includes("firefox")) return SUPPORTED_BROWSERS["firefox"];
    if (ua.includes("brave")) return SUPPORTED_BROWSERS["brave"];
    if (ua.includes("edg")) return SUPPORTED_BROWSERS["edge"];
    if (ua.includes("opx") || ua.includes("opera gx")) return SUPPORTED_BROWSERS["operagx"];
    if (ua.includes("opt") || ua.includes("opr") || ua.includes("opera"))
      return SUPPORTED_BROWSERS["opera"];
    if (ua.includes("duckduckgo") || ua.includes("ddg")) return SUPPORTED_BROWSERS["duckduckgo"];
    if (ua.includes("samsungbrowser")) return SUPPORTED_BROWSERS["samsung"];
    if (ua.includes("vivaldi")) return SUPPORTED_BROWSERS["vivaldi"];
    if (ua.includes("ucbrowser")) return SUPPORTED_BROWSERS["uc"];
    if (ua.includes("yabrowser")) return SUPPORTED_BROWSERS["yandex"];
    if (uaData?.brands) {
      for (const brandInfo of uaData.brands) {
        const brand = brandInfo.brand.toLowerCase();
        if (brand.includes("chrome") && !brand.includes("edge") && !brand.includes("opera"))
          return SUPPORTED_BROWSERS["chrome"];
        if (brand.includes("edge")) return SUPPORTED_BROWSERS["edge"];
        if (brand.includes("opera")) return SUPPORTED_BROWSERS["opera"];
      }
    }
    switch (this.detectPlatform()) {
      case "ios":
        if (ua.includes("crios")) return SUPPORTED_BROWSERS["chrome"];
        if (ua.includes("fxios")) return SUPPORTED_BROWSERS["firefox"];
        if (ua.includes("edgios")) return SUPPORTED_BROWSERS["edge"];
        if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios") && !ua.includes("android"))
          return SUPPORTED_BROWSERS["safari"];
        break;
      default:
        if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr") && !ua.includes("brave"))
          return SUPPORTED_BROWSERS["chrome"];
        break;
    }
    return null;
  }
  /**
   * Gets the configuration for a specific browser on current platform
   * @param {SupportedBrowserId} browserId - Target browser name
   * @returns {BrowserInfo} Browser info
   */
  static getBrowserConfig(browserId) {
    return SUPPORTED_BROWSERS[browserId];
  }
  /**
   * Gets a list of supported browsers for platform
   * @param {Platform | null} platform - Target platform or current if `null`
   * @returns {BrowserInfo[]} Array of supported browsers
   */
  static supportedBrowsers(platform = null) {
    switch (platform || this.detectPlatform()) {
      case "android":
        return Object.values(SUPPORTED_BROWSERS).filter(
          (browser) => browser.androidPackage !== null
        );
      case "ios":
        return Object.values(SUPPORTED_BROWSERS).filter((browser) => browser.iosScheme !== null);
      case "desktop":
        return [];
    }
  }
  /**
   * Open URL in a specific browser
   * @param {BrowserOpenOptions} options - Configuration options.
   */
  static open(options) {
    const {
      targetUrl,
      browser = null,
      platform = "auto",
      method = "href",
      windowOptions
    } = options;
    const formattedUrl = targetUrl.replace(/^https?:\/\//, "");
    let browserInfo = browser && this.getBrowserConfig(browser);
    switch (platform) {
      case "android": {
        if (browserInfo && !browserInfo.androidPackage) {
          throw new Error(`Unsupported browser for Android: ${browser}`);
        }
        const intentUrl = `intent://${formattedUrl}#Intent;scheme=https;${browserInfo?.androidPackage ? `package=${browserInfo.androidPackage};` : ""}end;`;
        this.openWithMethod(intentUrl, method, windowOptions);
        return;
      }
      case "ios":
        if (browserInfo === null) {
          browserInfo = this.getBrowserConfig("safari");
        }
        if (browserInfo.iosScheme !== null) {
          this.openWithMethod(browserInfo.iosScheme(formattedUrl), method, windowOptions);
          return;
        }
        throw new Error(`Unsupported browser for iOS: ${browser}`);
      case "desktop":
        this.openWithMethod(`https://${formattedUrl}`, method, windowOptions);
        return;
      // Automatically detect the platform and call open again with resolved platform
      case "auto":
        this.open({
          targetUrl,
          browser,
          platform: this.detectPlatform(),
          method,
          windowOptions
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
  static openWithMethod(targetUrl, method, windowOptions) {
    switch (method) {
      case "href":
        window.location.href = targetUrl;
        break;
      case "replace":
        window.location.replace(targetUrl);
        break;
      case "open": {
        window.open(
          targetUrl,
          windowOptions?.target ?? "_blank",
          windowOptions?.features ?? "noopener,noreferrer"
        );
      }
    }
  }
  /**
   * Detects known in-app browsers and common mobile WebView user agents.
   * @param userAgent - Optional user agent string to check.
   * @returns {InAppBrowserName | null} The detected name or `null` if not detected.
   */
  static detectInAppBrowser(userAgent) {
    if (this.isTelegram()) {
      return "telegram";
    }
    const ua = (userAgent || navigator.userAgent || "").toLowerCase();
    if (!ua) return null;
    if (/\binstagram\b/.test(ua)) {
      return "instagram";
    }
    if (/\bbarcelona\b/.test(ua)) {
      return "threads";
    }
    if (/\bmessenger\b|\bfban\/(?:messenger|orca)/.test(ua)) {
      return "messenger";
    }
    if (/\b(?:fban|fbav|fb_iab|fb4a|fbios)\b/.test(ua)) {
      return "facebook";
    }
    if (/\b(?:twitter|tweetbot)\b/.test(ua)) {
      return "twitter";
    }
    if (/\b(?:tiktok|musical_ly|aweme|bytedancewebview|trill)\b/.test(ua)) {
      return "tiktok";
    }
    if (/\bwhatsapp\b/.test(ua)) {
      return "whatsapp";
    }
    if (/\blinkedin(?:app)?\b/.test(ua)) {
      return "linkedin";
    }
    if (/\bline\//.test(ua)) {
      return "line";
    }
    if (/\bsnapchat\b/.test(ua)) {
      return "snapchat";
    }
    if (/\bpinterest\b/.test(ua)) {
      return "pinterest";
    }
    if (/\bkakaotalk\b/.test(ua)) {
      return "kakaotalk";
    }
    if (/\bzalo\b/.test(ua)) {
      return "zalo";
    }
    if (/\breddit\b/.test(ua)) {
      return "reddit";
    }
    if (/\bdiscord\b/.test(ua)) {
      return "discord";
    }
    if (/\bqq\/\d/.test(ua)) {
      return "qq";
    }
    if (/\bviber\b/.test(ua)) {
      return "viber";
    }
    if (/\bmicromessenger\b/.test(ua)) {
      return "wechat";
    }
    if (/\b(?:vkclient|vkontakte|vkshare)\b/.test(ua)) {
      return "vk";
    }
    const platform = this.detectPlatform();
    if (platform === "android" && /;\s*wv\s*[;)]/.test(ua) || platform === "ios" && ua.includes("applewebkit") && !ua.includes("safari") && !/\b(?:chrome|crios|firefox|fxios|edge|edgios|opios|opt|yabrowser|duckduckgo|brave|aloha)\//.test(
      ua
    )) {
      return "generic";
    }
    return null;
  }
  /**
   * Checks whether the current page is running inside Telegram's WebApp.
   * @returns {boolean} `True` if running inside Telegram's WebApp, otherwise `false`
   */
  static isTelegram() {
    if (typeof window === "undefined") return false;
    const win = window;
    const webApp = win.Telegram?.WebApp;
    const isMiniApp = Boolean(webApp?.initData) || Boolean(webApp?.platform && webApp.platform !== "unknown");
    const isNativeWebView = Boolean(win.TelegramWebviewProxy) || Boolean(win.TelegramWebviewProxyProto) || Boolean(win.TelegramWebview) || Boolean(win.TelegramGameProxy);
    const hasTgHash = window.location.hash.includes("tgWebAppData=");
    return isMiniApp || isNativeWebView || hasTgHash;
  }
  /**
   * Checks if the current browser is an in-app browser
   * @param {string} [userAgent] Optional user agent string to check against
   * @returns {boolean} `True` if in-app browser is detected
   */
  static isInAppBrowser(userAgent) {
    return this.detectInAppBrowser(userAgent) !== null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserSwitcher,
  SUPPORTED_BROWSERS
});
