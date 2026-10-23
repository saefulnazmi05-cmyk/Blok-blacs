/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';

interface PauseModalProps {
  score: number;
  bestScore: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  bestScore,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onHome,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center">
        <h2 className="font-heading text-2xl font-bold text-white tracking-tight mb-1">
          GAME PAUSED
        </h2>
        <p className="text-xs text-slate-400">Take a breath, your game is safe.</p>

        {/* Current Score Snapshot */}
        <div className="w-full my-5 py-3.5 px-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex justify-around items-center">
          <div>
            <span className="block text-[11px] text-slate-400 uppercase font-semibold">
              Current
            </span>
            <span className="font-heading text-2xl font-bold text-white tabular-nums">
              {score.toLocaleString()}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="block text-[11px] text-slate-400 uppercase font-semibold">
              Best
            </span>
            <span className="font-heading text-2xl font-bold text-amber-300 tabular-nums">
              {bestScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Audio Toggles inside pause screen */}
        <div className="w-full flex items-center justify-center gap-3 mb-6">
          <button
            onClick={onToggleSound}
            className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Sound FX</span>
          </button>
          <button
            onClick={onToggleMusic}
            className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${
              musicEnabled
                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-5 rounded-2xl font-heading text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 active:scale-98 transition shadow-[0_4px_16px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-5 rounded-2xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 active:scale-98 border border-slate-700/80 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Game</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 px-5 rounded-2xl font-semibold text-xs text-slate-400 hover:text-slate-200 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Exit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
