# Browser Switcher

[![npm version](https://img.shields.io/npm/v/browser-switcher?style=flat-square&color=red)](https://www.npmjs.com/package/browser-switcher)
![npm downloads](https://img.shields.io/npm/dm/browser-switcher?style=flat-square&color=red)
![GitHub Repo Stars](https://img.shields.io/github/stars/jakkimcfly/browser-switcher?style=flat-square)
![GitHub Forks](https://img.shields.io/github/forks/jakkimcfly/browser-switcher?style=flat-square)
[![License: MIT](https://img.shields.io/github/license/jakkimcfly/browser-switcher?style=flat-square)](https://opensource.org/licenses/MIT)

Redirect users to specific browsers on Android (using Intents) and iOS (using URL schemes).

## 📖 Tables of Contents
- [Features](#-features)
- [Supported Browsers](#-supported-browsers)
- [Installation](#-installation)
- [Usage](#-usage)
- [Live Demo](#️-live-demo)
- [How It Works (Technical Deep Dive)](#-how-it-works-technical-deep-dive)
  - [Android Intent System](#android-intent-system)
  - [iOS URL Scheme Handling](#ios-url-scheme-handling)
  - [Important](#️-important)
  - [References](#-references)
- [API Reference](#-api-reference)
- [Support This Project](#-support-this-project)
- [Got Issues?](#-got-issues)
- [License (MIT)](#-license-mit)

## 🚀 Features

- 🛠 TypeScript support (Fully typed, tree-shakable, and framework-agnostic).
- 🔍 Platform detection (Android / iOS).
- 🧭 In-App browser detection (Instagram, Facebook, TikTok, etc.).
- 🔁 Redirects via URL schemes or Android intents.
- ✅ 10+ supported browsers.

## 🌐 Supported Browsers

| Browser              | Android Package Name            | iOS URL Scheme              |
| -------------------- | ------------------------------- | --------------------------- |
| `Google Chrome`      | *com.android.chrome*            | `googlechrome://`           |
| `Mozilla Firefox`    | *org.mozilla.firefox*           | `firefox://open-url?url=`   |
| `Brave Browser`      | *com.brave.browser*             | `brave://open-url?url=`     |
| `Microsoft Edge`     | *com.microsoft.emmx*            | `microsoft-edge-https://`   |
| `Opera Browser`      | *com.opera.browser*             | `touch-https://`            |
| `Opera GX`           | *com.opera.gx*                  | `opera-gx://open-url?url=`  |
| `DuckDuckGo Browser` | *com.duckduckgo.mobile.android* | `ddgQuickLink://`           |
| `Samsung Browser`    | *com.sec.android.app.sbrowser*  | -                           |
| `Vivaldi Browser`    | *com.vivaldi.browser*           | `vivaldi://`                |
| `UC Browser`         | *com.UCMobile.intl*             | -                           |
| `Yandex Browser`     | *com.yandex.browser*            | -                           |
| `Safari`             | -                               | `x-safari-https://`         |

## 📦 Installation

### Yarn

```bash
yarn add browser-switcher
```

### npm
```bash
npm install browser-switcher
```

### CDN

**Uncompressed:**
```html
<script src="https://unpkg.com/browser-switcher/dist/index.js"></script>
```

**Minified:**

```html
<script src="https://unpkg.com/browser-switcher/dist/index.min.js"></script>
```

> If you want a previous version, check the instructions at https://unpkg.com.

## 🛠 Usage

```typescript
import BrowserSwitcher from 'browser-switcher';

try {
  BrowserSwitcher.open({
    targetUrl: 'https://example.com',
    platform: 'auto',
    browser: 'chrome',
    method: 'href'
  });
} catch (error) {
  console.log(error);
}

const currentPlatfrom = BrowserSwitcher.detectPlatform();
console.log(currentPlatfrom);
```

## 🖥️ Live Demo

You can explore a fully interactive demo of the package here:
[browser-switcher-demo.jakkimcfly.com](https://browser-switcher-demo.jakkimcfly.com)

The demo includes clickable browser icons, so you can test how redirection works for each supported browser on your device.

> You can also find the example code in the `example` directory of this package.

## 🔧 How It Works (Technical Deep Dive)

This library uses platform-specific mechanisms to launch URLs in external browsers or apps. Here's how redirection works under the hood for each platform:

### Android Intent System

- **Mechanism:** Uses [Android intents](https://developer.chrome.com/docs/multidevice/android/intents) to open URLs in a specific browser.

- **Format:**
	```text
	intent://<host>/<path>#Intent;scheme=https;package=<browser-package>;end;
	```

### iOS URL Scheme Handling

- **Mechanism:** Uses custom URL schemes registered by each browser app (e.g., `googlechrome://`).

- **Format:**

	```text
	googlechrome://www.example.com
	```

- **Limitations:** Only works if the corresponding browser app is **installed**.

### ⚠️ Important

**Android:**

- Android intents **may show** an app chooser.
- If the specified browser is not installed, the system **may** either open its `Google Play` page for download or simply fail to perform the redirect (e.g., in some browsers like **DuckDuckGo Browser** or **Mozilla Firefox**).

**iOS:**

- iOS **always shows** an alert before switching apps.

### 📚 References

- [Android Intents](https://developer.chrome.com/docs/multidevice/android/intents)
- [iOS URL Schemes](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app)

## 📘 API Reference

#### `BrowserSwitcher.open(options: BrowserOpenOptions): void`

Redirects the user to a specific browser using platform-specific deep linking (Android intents, iOS URL schemes, or standard links).

**Parameters:**

| Parameter       | Type                 | Required | Description                                                         |
| --------------- | -------------------- | -------- | ------------------------------------------------------------------- |
| `targetUrl`     | *string*             | ✅ Yes  | The URL to open.                                                    |
| `platform`      | *Platform \| 'auto'* | ✅ Yes  | Platform to target. If `'auto'`, it will be detected automatically. |
| `browser`       | *SupportedBrowserId* | ❌ No   | Target browser ID (e.g., `'chrome'`, `'firefox'`, `'safari'`).      |
| `method`        | *OpenMethod*         | ❌ No   | Redirect method: `'href'` (default), `'replace'` or `'open'`.       |
| `windowOptions` | *OpenWindowOptions*  | ❌ No   | Only used with `'open'` method to customize window.                 |

**Important:**

If the `browser` parameter is not specified:

- On **iOS**, the link will be opened in **Safari** by default.
- On **Android**, the `intent://` scheme will be used **without specifying a package name**, allowing the system to choose the appropriate application to handle the link.

**Recommendation:**

- Wrap the call in a `try...catch` block.

> If you specify a browser that is not supported on the selected platform, the method will throw an error (`throw new Error`). This allows you to handle the case gracefully instead of letting it break execution.

**Opening Methods:**

This package supports three strategies to open a link. Each has different browser behaviors and use cases:

- `href` - Standard navigation, user can go back.
- `replace` - Redirects where "Back" button should not return.
- `open` - Open in new tab or window.

---

#### `BrowserSwitcher.detectPlatform(): Platform`

Detects the user's platform based on the `navigator.userAgent`.

**Returns:** `'android' | 'ios' | 'desktop'`

---

#### `BrowserSwitcher.getCurrentBrowser(): BrowserInfo | null`

Attempts to detect the currently used browser.

**Returns:** A `BrowserInfo` object or `null` if not recognized.

---

#### `BrowserSwitcher.getBrowserConfig(browserId: SupportedBrowserId): BrowserInfo`

Returns configuration (Internal ID, label, Android package, iOS URL scheme) for a specific browser.

**Example:**

```typescript
const config = BrowserSwitcher.getBrowserConfig('chrome');
console.log(config.androidPackage); // com.android.chrome
```

---

#### `BrowserSwitcher.supportedBrowsers(platform?: Platform | null): BrowserInfo[]`

Returns a list of supported browsers for a given platform (or auto-detected if not specified).

**Example:**

```typescript
const androidBrowsers = BrowserSwitcher.supportedBrowsers('android');
```

---

#### `BrowserSwitcher.detectInAppBrowser(): InAppBrowserName | null`

Detects if the user is currently inside an **in-app browser** (e.g., facebook, instagram, tiktok).

**Returns:** Name of the in-app browser or `null` if not detected.

---

#### `BrowserSwitcher.isInAppBrowser(): boolean`

Shorthand for checking if `detectInAppBrowser()` returns a value.

**Example:**

```typescript
if (BrowserSwitcher.isInAppBrowser()) {
  console.log('You are in an in-app browser');
}
```

## 🚨 Got Issues?

Before reporting:

1. Check if someone already reported it.
2. Try the latest version (`npm update` or `yarn upgrade`).

**When reporting:**

```plaintext
- What you expected vs what actually happened  
- OS/Browser/Node versions  
- Code snippet that triggers the issue  
- Any error messages
```  
*Be kind – I work on this in my free time.*

## ✨ Support This Project
This is an open-source passion project. If you find it useful, here’s how you can help keep it alive:

**Code Contributions:**

- Found a bug? Send a PR with a fix!
- Want a feature? [Open an issue](https://github.com/jakkimcfly/browser-switcher/issues/new/choose) and let’s discuss.
- Improved something? I’d love to see your improvements.

**Other Ways to Help:**

- ⭐ **Star the repo** – helps more folks discover it
- 🐛 **Report bugs** – even just "this broke on [X]" helps
- 💬 **Share your use case** – tell me how you’re using it

*No pressure, but if you’re feeling generous:*

<a href="https://www.buymeacoffee.com/jakkimcfly" target="_blank">
	<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="54" width="auto">
</a>

## 📃 License (MIT)

This project is open-source and licensed under the [MIT License](LICENSE) - one of the most permissive licenses that gives you a lot of freedom with few restrictions.

**TL;DR:**

- ✅ Use it anywhere (even commercially)
- ✅ Modify as needed
- ✅ No need to credit (but appreciated)
- ❌ Don’t sue me if something breaks
