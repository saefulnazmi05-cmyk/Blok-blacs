/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Share, PlusSquare, Check } from 'lucide-react';

interface IOSInstallGuideModalProps {
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src="/pwa-192x192.png"
              alt="Block Blast"
              className="w-9 h-9 rounded-xl shadow-md border border-slate-700/60"
            />
            <div>
              <h3 className="font-heading text-base font-bold text-white tracking-tight">
                Install on iPhone / iPad
              </h3>
              <p className="text-[11px] text-slate-400">Play full screen with no browser bars</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-4 flex flex-col gap-3 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">1. Tap Share</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tap the <strong className="text-slate-200">Share</strong> icon in the bottom Safari toolbar.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">2. Add to Home Screen</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Scroll down in the share sheet and tap <strong className="text-slate-200">Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">3. Tap Add</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tap <strong className="text-slate-200">Add</strong> in the top-right corner to launch instantly!
              </p>
            </div>
          </div>
        </div>

        {/* Got It Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-heading text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 active:scale-98 transition shadow"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};
