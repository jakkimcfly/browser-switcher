/**
 * Supported platforms.
 *
 * This type defines the operating system or environment where the browser may be used.
 * It's primarily used to conditionally apply logic based on the user's device type.
 *
 * - 'android' — Android smartphones and tablets.
 * - 'ios' — Apple iPhones and iPads running iOS.
 * - 'desktop' — Desktop or laptop environments (Windows, macOS, Linux).
 */
type Platform = 'android' | 'ios' | 'desktop';

/**
 * List of supported browser identifiers.
 *
 * These identifiers are used internally to distinguish between major browsers
 * when performing platform-specific redirections or feature support checks.
 *
 * - 'chrome' — Google Chrome browser.
 * - 'firefox' — Mozilla Firefox browser.
 * - 'brave' — Brave privacy-focused browser.
 * - 'edge' — Microsoft Edge browser.
 * - 'opera' — Opera browser.
 * - 'operagx' — Opera GX browser.
 * - 'duckduckgo' — DuckDuckGo privacy browser.
 * - 'samsung' — Samsung Internet browser (default on Samsung devices).
 * - 'vivaldi' — Vivaldi browser.
 * - 'uc' — UC Browser (popular in some regions, especially Asia).
 * - 'yandex' — Yandex browser (popular in Russia and CIS countries).
 * - 'safari' — Apple Safari browser (primarily on iOS/macOS).
 */
type SupportedBrowserId =
  | 'chrome'
  | 'firefox'
  | 'brave'
  | 'edge'
  | 'opera'
  | 'operagx'
  | 'duckduckgo'
  | 'samsung'
  | 'vivaldi'
  | 'uc'
  | 'yandex'
  | 'safari';

/**
 * Contains information about a specific browser,
 * used to construct platform-specific redirection logic.
 */
interface BrowserInfo {
  /**
   * Internal browser ID.
   */
  id: string;

  /**
   * A human-readable name of the browser, used for display or logging purposes.
   *
   * Example: "Google Chrome", "Safari"
   */
  label: string;

  /**
   * A function that returns the iOS custom URL scheme for the given URL, if supported.
   * If the browser does not support a URL scheme (or not on iOS), this will be `null`.
   *
   * Example return: "googlechrome://www.example.com"
   *
   * This is used to trigger opening the link in a specific browser from within another app.
   */
  iosScheme: ((url: string) => string) | null;

  /**
   * The Android package name of the browser app, used for creating intent-based redirects.
   *
   * Example: "com.android.chrome", "org.mozilla.firefox"
   *
   * If the browser does not have a known package name or is unsupported on Android, this will be `null`.
   */
  androidPackage: string | null;
}

/**
 * Available redirect methods.
 */
type OpenMethod = 'href' | 'replace' | 'open';

/**
 * Additional options for customizing the behavior of window opening
 * when using the 'open' redirection method.
 */
interface OpenWindowOptions {
  /**
   * Specifies the target browsing context in which to open the URL.
   *
   * Common values:
   * - "_blank" — opens the URL in a new tab or window (default).
   * - "_self" — opens the URL in the current tab or window.
   * - "_parent" — opens in the parent frame (if nested).
   * - "_top" — opens in the full body of the window, removing any frames.
   * - Any named window — reuses an existing tab with the same name if available.
   *
   * @default '_blank'
   */
  target?: string;

  /**
   * A comma-separated list of features or flags to customize the newly opened window.
   * These features are relevant when opening popups via `window.open()` in browsers.
   *
   * Common features:
   * - 'noopener' — ensures the new window cannot access the originating window.
   * - 'noreferrer' — prevents sending the referrer header.
   * - 'width' and 'height' — define dimensions of the popup window.
   * - 'resizable', 'scrollbars', etc. — control window UI behavior.
   *
   * Example: 'noopener,noreferrer,width=600,height=400'
   */
  features?: string;
}

/**
 * Configuration options for opening URL in target browser.
 */
interface BrowserOpenOptions {
  /**
   * The full URL to be opened in the specified target browser.
   * This should be a valid, properly formatted HTTP or HTTPS URL.
   *
   * Example: "https://example.com"
   */
  targetUrl: string;

  /**
   * The target platform for which the redirect URL is intended.
   *
   * This property determines the platform context (e.g., Android, iOS, desktop) the URL should be used for.
   *
   * If set to `'auto'` (default), the platform will be automatically detected at runtime using the user's browser environment.
   *
   * This is useful when you need to generate platform-specific URLs (e.g., using different schemes or intents).
   *
   * Example values:
   * - `'android'`
   * - `'ios'`
   * - `'desktop'`
   * - `'auto'` — detect based on user agent.
   */
  platform: Platform | 'auto';

  /**
   * The browser to open the URL in.
   * This must be one of the supported browser identifiers.
   *
   * Supported values:
   * - "chrome" — Google Chrome browser
   * - "firefox" — Mozilla Firefox browser
   * - "brave" — Brave browser
   *
   * This option determines the underlying URL scheme or intent used to open the browser,
   * especially on mobile platforms where app-specific schemes are required.
   */
  browser?: SupportedBrowserId | null;

  /**
   * Method used to open the URL.
   *
   * Supported values:
   * - `'href'`: Directly assigns the URL to `window.location.href`, which navigates the current page to the new URL.
   * - `'replace'`: Uses `window.location.replace()` to replace the current page in the session history with the new URL (won't be accessible via the "Back" button).
   * - `'open'`: Opens the URL in a new browser window or tab using `window.open()`.
   *
   * Default: `'href'`
   */
  method?: OpenMethod;

  /**
   * Optional window options to customize behavior when using the `'open'` method.
   *
   * These options are only applicable if `method === 'open'`.
   *
   * Includes:
   * - `target`: Specifies where to open the URL, e.g., `_blank`, `_self`, or a named window.
   * - `features`: A comma-separated string of window features such as size, position, scrollbars, etc.
   *   Example: `'width=600,height=400,noopener,noreferrer'`
   */
  windowOptions?: OpenWindowOptions;
}

/**
 * A list of known in-app browsers for popular social and messaging platforms.
 *
 * This type is used to identify which in-app browser the user is currently using,
 * which can be useful for adjusting behavior (e.g., redirect methods, user experience tweaks)
 * when inside limited web environments such as embedded browsers.
 *
 * Values:
 * - `'facebook'` — Facebook's in-app browser (including Facebook app and WebView)
 * - `'instagram'` — Instagram's in-app browser
 * - `'twitter'` — Twitter's in-app browser (X)
 * - `'tiktok'` — TikTok's in-app browser
 * - `'whatsapp'` — WhatsApp's built-in browser (used when opening links inside chats)
 * - `'linkedin'` — LinkedIn's in-app browser
 * - `'messenger'` — Facebook Messenger's in-app browser
 * - `'line'` — LINE messenger's in-app browser
 * - `'snapchat'` — Snapchat's in-app browser
 * - `'pinterest'` — Pinterest's in-app browser
 * - `'generic'` — A generic/unknown in-app browser that does not match any of the above
 */
type InAppBrowserName =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'whatsapp'
  | 'linkedin'
  | 'messenger'
  | 'line'
  | 'snapchat'
  | 'pinterest'
  | 'generic';

declare class BrowserSwitcher {
    /**
     * Detects the current platform based on user agent
     * @returns {Platform} Detected platform: android, ios or desktop
     */
    static detectPlatform(): Platform;
    /**
     * Checks if a known browser is currently in use based on user agent.
     * @returns {BrowserInfo | null} Browser info or null if not detected
     */
    static getCurrentBrowser(): BrowserInfo | null;
    /**
     * Gets the configuration for a specific browser on current platform
     * @param {SupportedBrowserId} browserId - Target browser name
     * @returns {BrowserConfig} Browser info
     */
    static getBrowserConfig(browserId: SupportedBrowserId): BrowserInfo;
    /**
     * Gets a list of supported browsers for platform
     * @param {Platform | null} platform - Target platform or current if `null`
     * @returns {BrowserInfo[]} Array of supported browsers
     */
    static supportedBrowsers(platform?: Platform | null): BrowserInfo[];
    /**
     * Open URL in a specific browser
     * @param {BrowserOpenOptions} options - Configuration options.
     */
    static open(options: BrowserOpenOptions): void;
    /**
     * Open URL using the specified method.
     *
     * @param targetUrl - The URL.
     * @param method - The open method.
     * @param windowOptions - Optional `window.open` parameters.
     */
    private static openWithMethod;
    /**
     * Detects if the current browser is an in-app browser (WebView inside social apps)
     * @returns {InAppBrowserName | null} The name of the in-app browser or `null` if not in-app
     */
    static detectInAppBrowser(): InAppBrowserName | null;
    /**
     * Checks if the current browser is an in-app browser
     * @returns {boolean} `True` if in-app browser is detected
     */
    static isInAppBrowser(): boolean;
}

export { BrowserSwitcher as default };
