/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, HelpCircle, Trophy, Volume2, VolumeX, Music, Clock, Calendar, Sparkles } from 'lucide-react';
import { GameMode } from '../types/game';

interface MainMenuProps {
  bestScore: number;
  selectedMode: GameMode;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  bestScore,
  selectedMode,
  soundEnabled,
  musicEnabled,
  onSelectMode,
  onStartGame,
  onOpenHowToPlay,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden bg-slate-950 text-white select-none">
      {/* Ambient background wallpaper with dark vignette overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('/src/assets/images/block_blast_cover_1792650790027.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/95 pointer-events-none" />

      {/* Floating decorative jewel blocks in corners */}
      <div className="absolute top-12 left-6 w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-float-slow opacity-60 pointer-events-none block-bevel" />
      <div className="absolute top-28 right-8 w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-600 shadow-[0_0_16px_rgba(236,72,153,0.4)] animate-float-reverse opacity-60 pointer-events-none block-bevel" />
      <div className="absolute bottom-32 left-8 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_18px_rgba(245,158,11,0.4)] animate-float-slow opacity-60 pointer-events-none block-bevel" />
      <div className="absolute bottom-24 right-10 w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_22px_rgba(16,185,129,0.4)] animate-float-reverse opacity-60 pointer-events-none block-bevel" />

      {/* Top Bar with Best Score & Sound Controls */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-2">
        {/* High score badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md backdrop-blur-md">
          <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
          <div className="flex items-baseline gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">BEST</span>
            <span className="font-heading font-extrabold text-amber-300 tabular-nums text-sm">
              {bestScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Audio toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
              musicEnabled
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-500'
            }`}
            title="Music"
            aria-label="Toggle Background Music"
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleSound}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
              soundEnabled
                ? 'bg-amber-600/30 border-amber-500/50 text-amber-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-500'
            }`}
            title="Sound Effects"
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Hero Lockup */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4 max-w-md w-full">
        {/* Custom Bespoke Logo Lockup */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 blur-xl rounded-full pointer-events-none" />
          
          <div className="relative flex flex-col items-center">
            {/* Visual Block Cluster Mascot */}
            <div className="flex gap-1.5 mb-2 scale-90 sm:scale-100">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 block-bevel" />
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 block-bevel" />
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 block-bevel" />
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 block-bevel" />
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
              BLOCK BLAST
            </h1>
            <div className="mt-1 px-3 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-bold text-slate-300 tracking-widest uppercase">
              THE GAME
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base font-semibold text-slate-300 italic tracking-wide mb-6">
          "Susun Balokmu. Pecahkan Rekormu!"
        </p>

        {/* Game Mode Picker Tabs */}
        <div className="w-full bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-sm grid grid-cols-3 gap-1.5 mb-6">
          <button
            onClick={() => onSelectMode('classic')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
              selectedMode === 'classic'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Classic</span>
          </button>

          <button
            onClick={() => onSelectMode('time_attack')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
              selectedMode === 'time_attack'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Time 90s</span>
          </button>

          <button
            onClick={() => onSelectMode('daily')}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
              selectedMode === 'daily'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Daily</span>
          </button>
        </div>

        {/* Primary START CTA */}
        <button
          onClick={onStartGame}
          className="w-full py-4 px-8 rounded-2xl font-heading text-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 active:scale-95 transition-all duration-150 shadow-[0_8px_30px_rgba(245,158,11,0.45)] flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-110" />
          <span>PLAY NOW</span>
        </button>

        {/* Secondary Action: How To Play */}
        <button
          onClick={onOpenHowToPlay}
          className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 py-1.5 px-3 rounded-lg hover:bg-slate-900/60 transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How to Play & Rules</span>
        </button>
      </div>

      {/* Footer Info & Control Hint */}
      <div className="relative z-10 w-full max-w-md text-center pb-2">
        <p className="text-[11px] text-slate-500 tracking-wide">
          Drag & drop pieces · Clear rows & cols · Infinite casual blast
        </p>
      </div>
    </div>
  );
};
