/**
 * Robustly detects if the user is on a mobile or tablet device.
 * Checks user agent, iPad Pro touch features, pointer capabilities, and hover support.
 */
export function isMobileDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // 1. User Agent string match
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const uaMatch = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());

  // 2. iPad Pro / Apple tablet detection (hides behind "Macintosh" user agent but supports multi-touch)
  const isIPad = /iPad|Macintosh/i.test(ua) && navigator.maxTouchPoints > 0;

  // 3. Media query checks for touch layout and screen size
  const hasTouchCoarse = window.matchMedia('(pointer: coarse)').matches;
  const hasHoverNone = window.matchMedia('(hover: none)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;

  return uaMatch || isIPad || ((hasTouchCoarse || hasHoverNone) && isSmallScreen);
}

/**
 * Attempts to make the application enter Fullscreen mode and lock screen orientation to landscape.
 */
export async function requestFullscreenAndLockOrientation() {
  const docEl = document.documentElement;

  // 1. Enter Fullscreen Mode
  try {
    const requestFs =
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen;

    if (requestFs) {
      await requestFs.call(docEl);
    }
  } catch (err) {
    console.warn("Fullscreen request rejected or not supported on this browser:", err);
  }

  // 2. Lock Screen Orientation to Landscape
  try {
    const screenObj = window.screen;
    if (screenObj && screenObj.orientation && screenObj.orientation.lock) {
      await screenObj.orientation.lock('landscape');
    } else if (screenObj.lockOrientation) {
      screenObj.lockOrientation('landscape');
    } else if (screenObj.webkitLockOrientation) {
      screenObj.webkitLockOrientation('landscape');
    } else if (screenObj.mozLockOrientation) {
      screenObj.mozLockOrientation('landscape');
    } else if (screenObj.msLockOrientation) {
      screenObj.msLockOrientation('landscape');
    }
  } catch (err) {
    console.warn("Screen orientation locking failed or not supported on this browser:", err);
  }
}

/**
 * Exits Fullscreen mode.
 */
export async function exitFullscreen() {
  try {
    const exitFs =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen ||
      document.msExitFullscreen;

    if (exitFs) {
      await exitFs.call(document);
    }
  } catch (err) {
    console.warn("Exiting fullscreen failed:", err);
  }
}

/**
 * Checks if the document is currently in Fullscreen mode.
 */
export function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}
