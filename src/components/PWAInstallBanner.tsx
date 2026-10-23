/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';

interface PWAInstallBannerProps {
  variant?: 'menu-inline' | 'floating' | 'compact-button';
  onInstallSuccess?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  variant = 'menu-inline',
  onInstallSuccess,
}) => {
  const {
    isInstalled,
    isIOS,
    hasNativePrompt,
    isDismissed,
    isReady,
    promptInstall,
    dismiss,
    resetDismissal,
  } = usePWAInstall();

  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If already installed, hide completely!
  if (isInstalled) {
    return null;
  }

  // Handle click on Install button
  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (hasNativePrompt) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        onInstallSuccess?.();
      }
    } else {
      // Browser doesn't support beforeinstallprompt or prompt expired
      setShowAndroidGuide(true);
    }
  };

  // If compact-button variant (e.g. for Top Bar or Pause Menu):
  if (variant === 'compact-button') {
    return (
      <>
        <button
          onClick={() => {
            resetDismissal();
            handleInstallClick();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 hover:text-white hover:bg-amber-500/30 active:scale-95 transition text-xs font-bold shadow-sm"
          title="Install App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  // If dismissed or not ready yet, hide auto banner
  if (isDismissed || !isReady) {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto my-2 px-1 animate-fade-in">
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-850/95 to-slate-900/95 border border-amber-500/30 p-3 sm:p-3.5 shadow-xl backdrop-blur-md overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            aria-label="Dismiss installation prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3">
            {/* App Icon */}
            <div className="relative shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="Block Blast Icon"
                className="w-12 h-12 rounded-xl shadow-md border border-slate-700/80 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-slate-950">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>

            {/* Content & Actions */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading text-sm font-extrabold text-white tracking-tight truncate">
                  Install BLOCK BLAST
                </h4>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Play fullscreen without browser bars · Faster launch from home screen
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleInstallClick}
                  className="py-1.5 px-3.5 rounded-xl font-heading text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 active:scale-95 transition shadow flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isIOS ? 'How to Install' : 'Install Now'}</span>
                </button>

                <button
                  onClick={dismiss}
                  className="py-1.5 px-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>

          {/* Android browser manual hint if native prompt wasn't fired */}
          {showAndroidGuide && (
            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex items-start gap-2 animate-fade-in">
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span>To install manually:</span>
                <p className="text-slate-400 mt-0.5">
                  Tap browser menu (<strong>⋮</strong> or Share) and select <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
};
