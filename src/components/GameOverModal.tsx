/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { GameStats } from '../types/game';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart, onHome }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* New Record Banner or Trophy */}
        {stats.isNewBest ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 animate-bounce">
            <Sparkles className="w-4 h-4 fill-amber-400 text-amber-300" />
            <span>New Best Score!</span>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 mb-3 shadow-inner">
            <Trophy className="w-7 h-7 text-amber-400" />
          </div>
        )}

        <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          No remaining piece can fit on the board.
        </p>

        {/* Score Showcase */}
        <div className="w-full my-5 py-4 px-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Final Score
          </span>
          <span className="font-heading text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 tabular-nums my-1">
            {stats.score.toLocaleString()}
          </span>

          <div className="w-full h-px bg-slate-800 my-3" />

          {/* Stats Breakdown Grid */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
            <div className="flex flex-col">
              <span className="text-slate-500">Best</span>
              <span className="font-bold text-slate-200 tabular-nums mt-0.5">
                {stats.bestScore.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Lines</span>
              <span className="font-bold text-emerald-400 tabular-nums mt-0.5 flex items-center justify-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                {stats.linesCleared}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500">Max Combo</span>
              <span className="font-bold text-orange-400 tabular-nums mt-0.5 flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3 fill-orange-400" />
                x{stats.maxCombo}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-5 rounded-2xl font-heading text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 active:scale-98 transition shadow-[0_4px_20px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 px-5 rounded-2xl font-semibold text-sm text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 active:scale-98 border border-slate-700/80 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
