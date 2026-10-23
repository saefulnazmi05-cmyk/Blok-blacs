/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_KEY_DISMISSED = 'blockblast_pwa_dismissed_at';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours cooldown before auto-prompting again

export type PlatformType = 'android' | 'ios' | 'desktop' | 'other';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [platform, setPlatform] = useState<PlatformType>('other');
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Check if currently running in standalone (installed) mode
  const checkIsInstalled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    // Check display-mode standalone or fullscreen
    const isStandaloneMQ =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches;

    // Check iOS Safari standalone property
    const isIOSStandalone =
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // Check Android TWA referrer
    const isAndroidApp =
      typeof document !== 'undefined' && Boolean(document.referrer && document.referrer.startsWith('android-app://'));

    return Boolean(isStandaloneMQ || isIOSStandalone || isAndroidApp);
  }, []);

  // Check dismissal cooldown from localStorage
  const checkIsDismissed = useCallback((): boolean => {
    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY_DISMISSED);
      if (!dismissedAt) return false;
      const timestamp = parseInt(dismissedAt, 10);
      if (isNaN(timestamp)) return false;
      return Date.now() - timestamp < COOLDOWN_MS;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial checks
    const installed = checkIsInstalled();
    setIsInstalled(installed);
    setIsDismissed(checkIsDismissed());

    // Platform detection
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroidDevice = /android/.test(ua);
    const isDesktopDevice = !isIOSDevice && !isAndroidDevice && /chrome|edge|chromium|crios/.test(ua);

    setIsIOS(isIOSDevice);
    if (isIOSDevice) {
      setPlatform('ios');
    } else if (isAndroidDevice) {
      setPlatform('android');
    } else if (isDesktopDevice) {
      setPlatform('desktop');
    } else {
      setPlatform('other');
    }

    // Delay showing auto-invitation slightly so initial page load is lightning fast & serene
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1200);

    // Event listener: beforeinstallprompt (Chromium, Android Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Event listener: appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(STORAGE_KEY_DISMISSED);
      } catch {}
    };

    // Check on visibility changes (e.g. user added to home screen and switched back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentlyInstalled = checkIsInstalled();
        setIsInstalled(currentlyInstalled);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkIsInstalled, checkIsDismissed]);

  // Trigger installation
  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (!deferredPrompt) {
      return 'unsupported';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return 'accepted';
      } else {
        // User clicked cancel in native prompt - set dismissal cooldown
        dismiss();
        return 'dismissed';
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
      return 'unsupported';
    }
  };

  // Dismiss invitation with cooldown
  const dismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, Date.now().toString());
    } catch {}
  };

  // Explicitly reset dismissal (e.g. when user clicks install button manually from menu/header)
  const resetDismissal = () => {
    setIsDismissed(false);
  };

  return {
    isInstallable: !!deferredPrompt || isIOS,
    hasNativePrompt: !!deferredPrompt,
    isInstalled,
    isIOS,
    platform,
    isDismissed,
    isReady,
    canShowInvitation: !isInstalled && isReady && (!isDismissed || isIOS || !!deferredPrompt),
    promptInstall,
    dismiss,
    resetDismissal,
  };
}
