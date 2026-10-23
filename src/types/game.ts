/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'classic' | 'time_attack' | 'daily';

export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'HOW_TO_PLAY';

export interface GridCell {
  filled: boolean;
  color?: string;
  accentColor?: string;
  shapeId?: string;
  isClearing?: boolean;
  clearOrder?: number;
}

export interface BlockShape {
  id: string;
  name: string;
  matrix: number[][]; // 2D binary matrix where 1 = filled
  color: string;
  accentColor: string;
  gradient: string;
  weight: number; // For sensible random distribution
}

export interface ActiveTrayPiece {
  instanceId: string;
  shape: BlockShape;
  isUsed: boolean;
  canFit: boolean; // Computed dynamically to dim unusable pieces
}

export interface FloatingScore {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  isCombo?: boolean;
}

export interface ComboNotification {
  id: string;
  title: string;
  multiplier: number;
  color: string;
}

export interface GameStats {
  score: number;
  bestScore: number;
  linesCleared: number;
  comboStreak: number;
  maxCombo: number;
  movesMade: number;
  timeRemaining?: number; // for Time Attack
  dailySeed?: string;
  isNewBest?: boolean;
}
