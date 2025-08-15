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
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "android";
    if (/iPad|iPhone|iPod/.test(ua)) return "ios";
    return "desktop";
  }
  /**
   * Checks if a known browser is currently in use based on user agent.
   * @returns {BrowserInfo | null} Browser info or null if not detected
   */
  static getCurrentBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    const uaData = (navigator == null ? void 0 : navigator.userAgentData) || null;
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
    if (uaData == null ? void 0 : uaData.brands) {
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
   * @returns {BrowserConfig} Browser info
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
        const intentUrl = `intent://${formattedUrl}#Intent;scheme=https;${(browserInfo == null ? void 0 : browserInfo.androidPackage) ? `package=${browserInfo.androidPackage};` : ""}end;`;
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
    var _a, _b;
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
          (_a = windowOptions == null ? void 0 : windowOptions.target) != null ? _a : "_blank",
          (_b = windowOptions == null ? void 0 : windowOptions.features) != null ? _b : "noopener,noreferrer"
        );
      }
    }
  }
  /**
   * Detects if the current browser is an in-app browser (WebView inside social apps)
   * @returns {InAppBrowserName | null} The name of the in-app browser or `null` if not in-app
   */
  static detectInAppBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("fban") || ua.includes("fbav")) {
      return "facebook";
    }
    if (ua.includes("instagram")) {
      return "instagram";
    }
    if (ua.includes("twitter") || ua.includes("tweetbot")) {
      return "twitter";
    }
    if (ua.includes("tiktok")) {
      return "tiktok";
    }
    if (ua.includes("whatsapp")) {
      return "whatsapp";
    }
    if (ua.includes("linkedin")) {
      return "linkedin";
    }
    if (ua.includes("messenger")) {
      return "messenger";
    }
    if (ua.includes(" line/")) {
      return "line";
    }
    if (ua.includes("snapchat")) {
      return "snapchat";
    }
    if (ua.includes("pinterest")) {
      return "pinterest";
    }
    if (this.detectPlatform() === "android" && ua.includes("; wv)") || this.detectPlatform() === "ios" && ua.includes("applewebkit") && !ua.includes("safari") && !ua.includes("chrome") && !ua.includes("firefox") && !ua.includes("edge")) {
      return "generic";
    }
    return null;
  }
  /**
   * Checks if the current browser is an in-app browser
   * @returns {boolean} `True` if in-app browser is detected
   */
  static isInAppBrowser() {
    return this.detectInAppBrowser() !== null;
  }
};
var BrowserSwitcher_default = BrowserSwitcher;
export {
  SUPPORTED_BROWSERS,
  BrowserSwitcher_default as default
};
