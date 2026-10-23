/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Music, Pause, RotateCcw, Trophy, Flame } from 'lucide-react';
import { GameMode } from '../types/game';

interface HeaderHUDProps {
  mode: GameMode;
  score: number;
  bestScore: number;
  comboStreak: number;
  timeRemaining?: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onPause: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  mode,
  score,
  bestScore,
  comboStreak,
  timeRemaining,
  soundEnabled,
  musicEnabled,
  onPause,
  onRestart,
  onToggleSound,
  onToggleMusic,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'time_attack':
        return 'TIME ATTACK';
      case 'daily':
        return 'DAILY CHALLENGE';
      default:
        return 'CLASSIC';
    }
  };

  return (
    <header className="w-full max-w-[440px] mx-auto px-3 pt-2 pb-1 flex flex-col gap-2 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPause}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-200 transition-transform shadow-sm"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={onRestart}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-200 transition-transform shadow-sm"
            aria-label="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="ml-1 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] font-bold tracking-wider text-slate-300">
            {getModeLabel()}
          </div>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform active:scale-95 shadow-sm ${
              musicEnabled
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            aria-label="Toggle Music"
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleSound}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform active:scale-95 shadow-sm ${
              soundEnabled
                ? 'bg-amber-600/30 border-amber-500/50 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Score Dashboard */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Current Score */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 p-2.5 border border-slate-800 shadow-inner flex flex-col items-center justify-center overflow-hidden">
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Score
          </span>
          <span className="font-heading text-3xl font-extrabold tabular-nums tracking-tight text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">
            {score.toLocaleString()}
          </span>

          {/* Combo Flame Indicator */}
          {comboStreak > 1 && (
            <div className="absolute top-1.5 right-2 flex items-center gap-0.5 text-amber-400 font-bold text-[11px] animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>x{comboStreak}</span>
            </div>
          )}
        </div>

        {/* Best Score or Time Remaining */}
        {mode === 'time_attack' && timeRemaining !== undefined ? (
          <div
            className={`rounded-2xl p-2.5 border shadow-inner flex flex-col items-center justify-center transition-colors ${
              timeRemaining <= 10
                ? 'bg-red-950/70 border-red-700/80 text-red-200 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Time Left
            </span>
            <span className="font-heading text-3xl font-extrabold tabular-nums tracking-tight">
              {formatTime(timeRemaining)}
            </span>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 p-2.5 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
              <Trophy className="w-3 h-3 fill-amber-400" />
              <span>Best</span>
            </div>
            <span className="font-heading text-3xl font-extrabold tabular-nums tracking-tight text-amber-300">
              {bestScore.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
