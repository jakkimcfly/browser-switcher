import './style.css';

import BrowserSwitcher from 'browser-switcher';

const platform = BrowserSwitcher.detectPlatform();
switch (platform) {
  case 'android':
    document.querySelector<HTMLDivElement>('#android-browsers')!.classList.add('active');
    break;
  case 'ios':
    document.querySelector<HTMLDivElement>('#ios-browsers')!.classList.add('active');
    break;
  default:
    document.querySelector<HTMLDivElement>('#desktop-browsers')!.classList.add('active');
}

const targetUrl = 'https://google.com/qwerty?foo=bar#hello';

/**
 * iOS Buttons
 */

// Safari
document.querySelector<HTMLLinkElement>('#safari')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'ios',
  })
});

// Chrome iOS
document.querySelector<HTMLLinkElement>('#chrome-ios')?.addEventListener('click', (e) => {
  e.preventDefault();
  try {
    BrowserSwitcher.open({
      targetUrl: targetUrl,
      platform: 'ios',
      browser: 'chrome',
    })
  } catch (error) {
    console.log(error);
    
  }
});

// Opera iOS
document.querySelector<HTMLLinkElement>('#opera-ios')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'ios',
    browser: 'opera',
    method: 'href',
  })
});

// Microsoft Edge iOS
document.querySelector<HTMLLinkElement>('#edge-ios')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'ios',
    browser: 'edge',
    method: 'replace',
  })
});

/**
 * Android Buttons
 */

// Chrome Android
document.querySelector<HTMLLinkElement>('#chrome-android')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'auto',
    browser: 'chrome',
  })
});

// Opera Android
document.querySelector<HTMLLinkElement>('#opera-android')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'android',
    browser: 'opera',
  })
});

// Microsoft Edge Android
document.querySelector<HTMLLinkElement>('#edge-android')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'auto',
    browser: 'edge',
    method: 'replace',
  })
});

// Default Android
document.querySelector<HTMLLinkElement>('#edge-android')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'android',
  })
});

/**
 * Desktop Buttons
 */

document.querySelector<HTMLLinkElement>('#desktop')?.addEventListener('click', (e) => {
  e.preventDefault();
  BrowserSwitcher.open({
    targetUrl: targetUrl,
    platform: 'desktop',
    method: 'open',
    windowOptions: {
      target: '_blank',
      features: 'width=600,height=400,noopener,noreferrer'
    }
  })
});