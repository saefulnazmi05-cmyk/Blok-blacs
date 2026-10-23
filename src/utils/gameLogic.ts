/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridCell, BlockShape, ActiveTrayPiece } from '../types/game';

export const GRID_SIZE = 10;

/**
 * Initializes a clean 10x10 grid
 */
export function createEmptyGrid(): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      row.push({ filled: false });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Checks whether a given piece matrix can be legally placed at (startRow, startCol)
 */
export function canPlaceShape(
  grid: GridCell[][],
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (matrix[r][c] === 1) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;

        // Check board bounds
        if (targetRow < 0 || targetRow >= GRID_SIZE || targetCol < 0 || targetCol >= GRID_SIZE) {
          return false;
        }

        // Check if cell is already occupied
        if (grid[targetRow][targetCol].filled) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if a shape can fit ANYWHERE on the 10x10 board
 */
export function canPieceFitAnywhere(grid: GridCell[][], matrix: number[][]): boolean {
  const shapeRows = matrix.length;
  const shapeCols = matrix[0].length;

  for (let r = 0; r <= GRID_SIZE - shapeRows; r++) {
    for (let c = 0; c <= GRID_SIZE - shapeCols; c++) {
      if (canPlaceShape(grid, matrix, r, c)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if at least one available piece in the tray can fit on the current board.
 * If all remaining available pieces return false, the game is OVER.
 */
export function canAnyPieceFit(grid: GridCell[][], trayPieces: ActiveTrayPiece[]): boolean {
  const available = trayPieces.filter((p) => !p.isUsed);
  if (available.length === 0) return true; // Will generate new tray

  for (const piece of available) {
    if (canPieceFitAnywhere(grid, piece.shape.matrix)) {
      return true;
    }
  }

  return false;
}

/**
 * Places a shape onto the grid and returns the new cloned grid
 */
export function placeShapeOnGrid(
  grid: GridCell[][],
  shape: BlockShape,
  startRow: number,
  startCol: number
): GridCell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const matrix = shape.matrix;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 1) {
        newGrid[startRow + r][startCol + c] = {
          filled: true,
          color: shape.color,
          accentColor: shape.accentColor,
          shapeId: shape.id,
        };
      }
    }
  }

  return newGrid;
}

export interface LineClearResult {
  fullRows: number[];
  fullCols: number[];
  cellsToClear: { r: number; c: number; color?: string }[];
  totalLines: number;
}

/**
 * Identifies all completed rows and columns on the board.
 * Correctly accounts for intersections without duplicate clears.
 */
export function findCompletedLines(grid: GridCell[][]): LineClearResult {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  // Check rows
  for (let r = 0; r < GRID_SIZE; r++) {
    let isFull = true;
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c].filled) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      fullRows.push(r);
    }
  }

  // Check cols
  for (let c = 0; c < GRID_SIZE; c++) {
    let isFull = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (!grid[r][c].filled) {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      fullCols.push(c);
    }
  }

  const cellsMap = new Map<string, { r: number; c: number; color?: string }>();

  for (const r of fullRows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${r},${c}`;
      cellsMap.set(key, { r, c, color: grid[r][c].color });
    }
  }

  for (const c of fullCols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      const key = `${r},${c}`;
      cellsMap.set(key, { r, c, color: grid[r][c].color });
    }
  }

  return {
    fullRows,
    fullCols,
    cellsToClear: Array.from(cellsMap.values()),
    totalLines: fullRows.length + fullCols.length,
  };
}

/**
 * Clears the completed lines from the grid
 */
export function removeCompletedLines(grid: GridCell[][], cellsToClear: { r: number; c: number }[]): GridCell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (const { r, c } of cellsToClear) {
    newGrid[r][c] = { filled: false };
  }

  return newGrid;
}

/**
 * Computes points for a turn
 */
export function calculateTurnScore(
  cellsPlacedCount: number,
  linesClearedCount: number,
  comboStreak: number
): {
  placementPoints: number;
  linePoints: number;
  comboBonus: number;
  totalPoints: number;
  comboText?: string;
} {
  const placementPoints = cellsPlacedCount; // 1 point per cell

  let linePoints = 0;
  if (linesClearedCount === 1) linePoints = 10;
  else if (linesClearedCount === 2) linePoints = 40;
  else if (linesClearedCount === 3) linePoints = 90;
  else if (linesClearedCount === 4) linePoints = 160;
  else if (linesClearedCount >= 5) linePoints = 250 + (linesClearedCount - 5) * 50;

  let comboBonus = 0;
  if (linesClearedCount > 0 && comboStreak > 1) {
    comboBonus = comboStreak * 15;
  }

  const totalPoints = placementPoints + linePoints + comboBonus;

  // Determine combo banner shoutout
  let comboText: string | undefined;
  if (linesClearedCount >= 4) {
    comboText = 'SUPER BLAST!';
  } else if (linesClearedCount === 3) {
    comboText = 'AWESOME!';
  } else if (linesClearedCount === 2) {
    comboText = 'GREAT!';
  } else if (comboStreak >= 4) {
    comboText = 'BLOCK MASTER!';
  } else if (comboStreak >= 2) {
    comboText = 'MEGA COMBO!';
  } else if (linesClearedCount === 1) {
    comboText = 'NICE!';
  }

  return {
    placementPoints,
    linePoints,
    comboBonus,
    totalPoints,
    comboText,
  };
}
