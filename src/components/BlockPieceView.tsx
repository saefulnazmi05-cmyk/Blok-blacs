/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BlockShape } from '../types/game';

interface BlockPieceViewProps {
  shape: BlockShape;
  cellSize?: number; // pixel size of one cell
  isDragging?: boolean;
  isSelected?: boolean;
  isUsed?: boolean;
  canFit?: boolean;
  onClick?: () => void;
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const BlockPieceView: React.FC<BlockPieceViewProps> = React.memo(({
  shape,
  cellSize = 24,
  isDragging = false,
  isSelected = false,
  isUsed = false,
  canFit = true,
  onClick,
  onPointerDown,
}) => {
  if (isUsed) {
    return <div className="w-full h-full flex items-center justify-center opacity-0" />;
  }

  const matrix = shape.matrix;
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  return (
    <div
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={`relative inline-flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-150 touch-none select-none ${
        !canFit ? 'opacity-40 grayscale-[25%]' : 'opacity-100 hover:scale-105'
      } ${isSelected ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]' : ''}`}
      style={{
        width: `${numCols * cellSize}px`,
        height: `${numRows * cellSize}px`,
        touchAction: 'none',
      }}
    >
      {isSelected && (
        <div className="absolute -inset-2 rounded-xl border-2 border-white/60 animate-pulse pointer-events-none" />
      )}

      {matrix.map((row, rIdx) => (
        <div key={rIdx} className="flex flex-row">
          {row.map((val, cIdx) => {
            if (val === 0) {
              return (
                <div
                  key={cIdx}
                  style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                  className="pointer-events-none"
                />
              );
            }

            return (
              <div
                key={cIdx}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  padding: '2px',
                }}
              >
                <div
                  className="w-full h-full rounded-[6px] relative block-bevel overflow-hidden"
                  style={{
                    backgroundColor: shape.color,
                  }}
                >
                  {/* Glass / 3D Specular Highlight */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[5px] pointer-events-none" />
                  {/* Subtle inner center gem sheen */}
                  <div
                    className="absolute inset-[15%] rounded-[3px] border border-white/25 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

BlockPieceView.displayName = 'BlockPieceView';

