# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-11-24

### Added

- Added in-app browser detection for Threads, KakaoTalk, Zalo, Reddit, Discord, QQ, Viber, WeChat, and VK, along with additional Facebook, Messenger, and TikTok user-agent markers.
- Added 'isTelegram' method to detect if running inside Telegram's WebApp: `BrowserSwitcher.isTelegram()`. 'detectInAppBrowser' or 'isInAppBrowser' will also detect Telegram  in-app browser.
- Added an optional `userAgent` argument to `BrowserSwitcher.detectInAppBrowser(userAgent?: string)`.
- Added an optional `userAgent` argument to `BrowserSwitcher.isInAppBrowser(userAgent?: string)`.

### Fixed

- Improved user-agent matching to reduce false positives and distinguish generic Android/iOS WebViews from regular browsers.
- Made platform and browser detection handle empty user-agent strings and case variations.

### Changed

- Replaced the default export with the named `BrowserSwitcher` export; use `import { BrowserSwitcher } from 'browser-switcher'`. The IIFE build exposes `BrowserSwitcher` and `SUPPORTED_BROWSERS` as globals, so call `BrowserSwitcher` directly without `.default`.
- Updated CommonJS usage to destructure the export: `const { BrowserSwitcher } = require('browser-switcher/dist/index.cjs')`.
- Corrected the package entry points for ESM and CommonJS and set the `unpkg` entry to the ESM bundle.

## [1.1.2] - 2025-08-19

### Added

- Added detailed instructions in README for using the package via **CDN (unpkg.com)**, including both **ES module** and **IIFE** versions.  
- Added `unpkg` field in `package.json` pointing to `"./dist/index.min.js"` for CDN usage.  

### Changed

- Updated `tsup.config.ts` to include proper configuration for **IIFE build**.  
- Updated `build` script in `package.json` to reflect new tsup configuration and outputs.  

## [1.1.1] - 2025-08-17

### Fixed

- Fix README.md

## [1.1.0] - 2025-08-16

### Added

- Import of package types.
- Import of variable `"SUPPORTED_BROWSERS"`.

### Changed

- Structure of files in the package.
- Import package in `/example`.

## [1.0.0] - 2025-08-15

### Added

- Initial release 🎉.
- Fully typed with TypeScript.
- Type definitions for common mobile browsers and their bundle IDs.
- Method to detect in-app browsers (like Facebook, Instagram, etc.).
- Support for three navigation strategies: `href`, `.replace`, `open`.
- Unit tests using [Vitest](https://vitest.dev).
- ESM-compatible build.
- Complete documentation (README).