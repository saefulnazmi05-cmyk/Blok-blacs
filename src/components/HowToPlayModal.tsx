/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, HandMetal, Sparkles, LayoutGrid, AlertCircle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="font-heading text-xl font-bold text-white tracking-tight">
              HOW TO PLAY
            </h2>
            <p className="text-xs text-slate-400">Master the art of the Block Blast!</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="py-4 flex flex-col gap-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <HandMetal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">1. Drag & Place Blocks</h3>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Drag shapes from your tray onto the 10x10 grid. On desktop, you can also click a piece then click any valid board cell!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">2. Blast Full Lines</h3>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Completely fill any horizontal row or vertical column to blast it off the board and free up vital space.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">3. Combos & Super Blasts</h3>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Clear multiple rows and columns in a single move, or clear lines in consecutive turns to rack up massive combo multipliers!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">4. Game Over Condition</h3>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Pieces cannot overlap or be placed outside the board. If none of your 3 available pieces can fit anywhere on the board, the game ends!
              </p>
            </div>
          </div>
        </div>

        {/* Got it CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-heading text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 active:scale-98 transition shadow"
        >
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};
