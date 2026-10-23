/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { GridCell, BlockShape } from '../types/game';
import { GRID_SIZE, canPlaceShape } from '../utils/gameLogic';

export interface GridBoardRef {
  getCellCoordinates: (row: number, col: number) => { x: number; y: number } | null;
  getGridBounds: () => DOMRect | null;
  cacheBounds: () => DOMRect | null;
  getRowColFromPointer: (clientX: number, clientY: number) => { row: number; col: number } | null;
}

interface GridBoardProps {
  grid: GridCell[][];
  activeShape: BlockShape | null;
  hoverPos: { row: number; col: number } | null;
  shakeType: 'none' | 'sm' | 'lg';
  onCellClick?: (row: number, col: number) => void;
  onCellPointerEnter?: (row: number, col: number) => void;
}

export const GridBoard = forwardRef<GridBoardRef, GridBoardProps>(
  ({ grid, activeShape, hoverPos, shakeType, onCellClick, onCellPointerEnter }, ref) => {
    const boardRef = useRef<HTMLDivElement | null>(null);
    const cachedRectRef = useRef<DOMRect | null>(null);
    const cellRefs = useRef<(HTMLDivElement | null)[][]>(
      Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
    );

    useImperativeHandle(ref, () => ({
      getCellCoordinates: (row: number, col: number) => {
        const el = cellRefs.current[row]?.[col];
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      },
      getGridBounds: () => {
        if (!boardRef.current) return null;
        return boardRef.current.getBoundingClientRect();
      },
      cacheBounds: () => {
        if (!boardRef.current) return null;
        cachedRectRef.current = boardRef.current.getBoundingClientRect();
        return cachedRectRef.current;
      },
      getRowColFromPointer: (clientX: number, clientY: number) => {
        const rect = cachedRectRef.current || (boardRef.current ? boardRef.current.getBoundingClientRect() : null);
        if (!rect) return null;

        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        ) {
          return null;
        }

        const cellSize = rect.width / GRID_SIZE;
        const col = Math.floor((clientX - rect.left) / cellSize);
        const row = Math.floor((clientY - rect.top) / cellSize);

        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
          return { row, col };
        }
        return null;
      },
    }));

    // Calculate ghost placement and predicted line clears
    let isValidPlacement = false;
    const ghostCells = new Set<string>();
    const predictedRowClears = new Set<number>();
    const predictedColClears = new Set<number>();

    if (activeShape && hoverPos) {
      isValidPlacement = canPlaceShape(grid, activeShape.matrix, hoverPos.row, hoverPos.col);

      const matrix = activeShape.matrix;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
          if (matrix[r][c] === 1) {
            const tr = hoverPos.row + r;
            const tc = hoverPos.col + c;
            if (tr >= 0 && tr < GRID_SIZE && tc >= 0 && tc < GRID_SIZE) {
              ghostCells.add(`${tr},${tc}`);
            }
          }
        }
      }

      // If valid, simulate which rows and columns would clear to show dazzling preview!
      if (isValidPlacement) {
        // Check rows
        for (let r = 0; r < GRID_SIZE; r++) {
          let wouldBeFull = true;
          for (let c = 0; c < GRID_SIZE; c++) {
            const isFilledNow = grid[r][c].filled;
            const willBeFilled = ghostCells.has(`${r},${c}`);
            if (!isFilledNow && !willBeFilled) {
              wouldBeFull = false;
              break;
            }
          }
          if (wouldBeFull) predictedRowClears.add(r);
        }

        // Check cols
        for (let c = 0; c < GRID_SIZE; c++) {
          let wouldBeFull = true;
          for (let r = 0; r < GRID_SIZE; r++) {
            const isFilledNow = grid[r][c].filled;
            const willBeFilled = ghostCells.has(`${r},${c}`);
            if (!isFilledNow && !willBeFilled) {
              wouldBeFull = false;
              break;
            }
          }
          if (wouldBeFull) predictedColClears.add(c);
        }
      }
    }

    const shakeClass =
      shakeType === 'sm'
        ? 'animate-shake-sm'
        : shakeType === 'lg'
        ? 'animate-shake-lg'
        : '';

    return (
      <div className="relative w-full max-w-[420px] aspect-square mx-auto p-2 sm:p-2.5">
        {/* Outer glowing board border */}
        <div
          ref={boardRef}
          className={`w-full h-full rounded-2xl bg-slate-900/90 border-2 border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-2 grid grid-cols-10 grid-rows-10 gap-1 sm:gap-1.5 backdrop-blur-md relative select-none ${shakeClass}`}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const cellKey = `${r},${c}`;
              const isGhost = ghostCells.has(cellKey);
              const isPredictedLine = predictedRowClears.has(r) || predictedColClears.has(c);

              return (
                <div
                  key={cellKey}
                  ref={(el) => {
                    cellRefs.current[r][c] = el;
                  }}
                  onClick={() => onCellClick?.(r, c)}
                  onPointerEnter={() => onCellPointerEnter?.(r, c)}
                  className={`relative rounded-[5px] sm:rounded-[6px] overflow-hidden flex items-center justify-center transition-colors duration-100 ${
                    cell.filled
                      ? cell.isClearing
                        ? 'animate-flash-line z-20'
                        : 'block-bevel z-10'
                      : isGhost
                      ? isValidPlacement
                        ? 'block-bevel-ghost ring-2 ring-white/70 z-10'
                        : 'bg-red-500/30 ring-1 ring-red-400/60 z-10'
                      : isPredictedLine
                      ? 'bg-amber-400/20 ring-1 ring-amber-300/40'
                      : 'block-empty-slot'
                  }`}
                  style={{
                    backgroundColor: cell.filled
                      ? cell.color
                      : isGhost
                      ? isValidPlacement
                        ? activeShape?.color
                        : undefined
                      : undefined,
                    opacity: isGhost ? (isValidPlacement ? 0.8 : 0.6) : 1,
                  }}
                >
                  {/* Glass sheen for filled block cells */}
                  {cell.filled && !cell.isClearing && (
                    <>
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[5px] pointer-events-none" />
                      <div
                        className="absolute inset-[15%] rounded-[3px] border border-white/20 pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.25) 0%, transparent 70%)',
                        }}
                      />
                    </>
                  )}

                  {/* Predicted line clear glimmer pulse */}
                  {isPredictedLine && !cell.filled && !isGhost && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                  )}

                  {/* Ghost block specular sheen */}
                  {isGhost && isValidPlacement && (
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-[5px] pointer-events-none" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
);

GridBoard.displayName = 'GridBoard';
