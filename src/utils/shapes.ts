/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockShape } from '../types/game';

// Vibrant palettes for BLOCK BLAST
export const SHAPE_DEFINITIONS: BlockShape[] = [
  // 1x1 Single Square
  {
    id: 'dot_1x1',
    name: 'Single Dot',
    matrix: [[1]],
    color: '#10B981', // Emerald
    accentColor: '#34D399',
    gradient: 'from-emerald-400 to-emerald-600',
    weight: 12,
  },

  // 2-cell Lines
  {
    id: 'line_2x1_h',
    name: '2-Bar Horiz',
    matrix: [[1, 1]],
    color: '#06B6D4', // Cyan
    accentColor: '#67E8F9',
    gradient: 'from-cyan-400 to-cyan-600',
    weight: 10,
  },
  {
    id: 'line_1x2_v',
    name: '2-Bar Vert',
    matrix: [[1], [1]],
    color: '#06B6D4',
    accentColor: '#67E8F9',
    gradient: 'from-cyan-400 to-cyan-600',
    weight: 10,
  },

  // 3-cell Lines
  {
    id: 'line_3x1_h',
    name: '3-Bar Horiz',
    matrix: [[1, 1, 1]],
    color: '#0284C7', // Sky Blue
    accentColor: '#38BDF8',
    gradient: 'from-sky-400 to-sky-600',
    weight: 9,
  },
  {
    id: 'line_1x3_v',
    name: '3-Bar Vert',
    matrix: [[1], [1], [1]],
    color: '#0284C7',
    accentColor: '#38BDF8',
    gradient: 'from-sky-400 to-sky-600',
    weight: 9,
  },

  // 4-cell Lines
  {
    id: 'line_4x1_h',
    name: '4-Bar Horiz',
    matrix: [[1, 1, 1, 1]],
    color: '#6366F1', // Indigo
    accentColor: '#818CF8',
    gradient: 'from-indigo-400 to-indigo-600',
    weight: 6,
  },
  {
    id: 'line_1x4_v',
    name: '4-Bar Vert',
    matrix: [[1], [1], [1], [1]],
    color: '#6366F1',
    accentColor: '#818CF8',
    gradient: 'from-indigo-400 to-indigo-600',
    weight: 6,
  },

  // 5-cell Lines (Rare tactical clears)
  {
    id: 'line_5x1_h',
    name: '5-Bar Horiz',
    matrix: [[1, 1, 1, 1, 1]],
    color: '#8B5CF6', // Purple
    accentColor: '#A78BFA',
    gradient: 'from-purple-400 to-purple-600',
    weight: 3,
  },
  {
    id: 'line_1x5_v',
    name: '5-Bar Vert',
    matrix: [[1], [1], [1], [1], [1]],
    color: '#8B5CF6',
    accentColor: '#A78BFA',
    gradient: 'from-purple-400 to-purple-600',
    weight: 3,
  },

  // Squares
  {
    id: 'sq_2x2',
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: '#F59E0B', // Amber
    accentColor: '#FCD34D',
    gradient: 'from-amber-400 to-amber-600',
    weight: 8,
  },
  {
    id: 'sq_3x3',
    name: 'Square 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#E11D48', // Rose Red (Big high-risk high-reward piece)
    accentColor: '#FB7185',
    gradient: 'from-rose-400 to-rose-600',
    weight: 2,
  },

  // Rectangles
  {
    id: 'rect_2x3',
    name: 'Rect 2x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#F97316', // Orange
    accentColor: '#FDBA74',
    gradient: 'from-orange-400 to-orange-600',
    weight: 3,
  },
  {
    id: 'rect_3x2',
    name: 'Rect 3x2',
    matrix: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    color: '#F97316',
    accentColor: '#FDBA74',
    gradient: 'from-orange-400 to-orange-600',
    weight: 3,
  },

  // Small Corner Ls (3 cells)
  {
    id: 'corner_3_tl',
    name: 'Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    color: '#84CC16', // Lime
    accentColor: '#BEF264',
    gradient: 'from-lime-400 to-lime-600',
    weight: 7,
  },
  {
    id: 'corner_3_tr',
    name: 'Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    color: '#84CC16',
    accentColor: '#BEF264',
    gradient: 'from-lime-400 to-lime-600',
    weight: 7,
  },
  {
    id: 'corner_3_bl',
    name: 'Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: '#84CC16',
    accentColor: '#BEF264',
    gradient: 'from-lime-400 to-lime-600',
    weight: 7,
  },
  {
    id: 'corner_3_br',
    name: 'Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    color: '#84CC16',
    accentColor: '#BEF264',
    gradient: 'from-lime-400 to-lime-600',
    weight: 7,
  },

  // 4-cell L-shapes (4 rotations)
  {
    id: 'l_4_down',
    name: 'L-Shape Down',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: '#3B82F6', // Blue
    accentColor: '#93C5FD',
    gradient: 'from-blue-400 to-blue-600',
    weight: 6,
  },
  {
    id: 'l_4_up',
    name: 'L-Shape Up',
    matrix: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    color: '#3B82F6',
    accentColor: '#93C5FD',
    gradient: 'from-blue-400 to-blue-600',
    weight: 6,
  },
  {
    id: 'l_4_right',
    name: 'L-Shape Right',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    color: '#3B82F6',
    accentColor: '#93C5FD',
    gradient: 'from-blue-400 to-blue-600',
    weight: 6,
  },
  {
    id: 'l_4_left',
    name: 'L-Shape Left',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#3B82F6',
    accentColor: '#93C5FD',
    gradient: 'from-blue-400 to-blue-600',
    weight: 6,
  },

  // 4-cell Reverse L-shapes / J-shapes (4 rotations)
  {
    id: 'j_4_down',
    name: 'Reverse L Down',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: '#A855F7', // Purple/Violet
    accentColor: '#D8B4FE',
    gradient: 'from-purple-400 to-purple-600',
    weight: 6,
  },
  {
    id: 'j_4_up',
    name: 'Reverse L Up',
    matrix: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    color: '#A855F7',
    accentColor: '#D8B4FE',
    gradient: 'from-purple-400 to-purple-600',
    weight: 6,
  },
  {
    id: 'j_4_right',
    name: 'Reverse L Right',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#A855F7',
    accentColor: '#D8B4FE',
    gradient: 'from-purple-400 to-purple-600',
    weight: 6,
  },
  {
    id: 'j_4_left',
    name: 'Reverse L Left',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: '#A855F7',
    accentColor: '#D8B4FE',
    gradient: 'from-purple-400 to-purple-600',
    weight: 6,
  },

  // T-shapes (4 rotations)
  {
    id: 't_down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#EC4899', // Pink
    accentColor: '#F472B6',
    gradient: 'from-pink-400 to-pink-600',
    weight: 5,
  },
  {
    id: 't_up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#EC4899',
    accentColor: '#F472B6',
    gradient: 'from-pink-400 to-pink-600',
    weight: 5,
  },
  {
    id: 't_right',
    name: 'T-Shape Right',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: '#EC4899',
    accentColor: '#F472B6',
    gradient: 'from-pink-400 to-pink-600',
    weight: 5,
  },
  {
    id: 't_left',
    name: 'T-Shape Left',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: '#EC4899',
    accentColor: '#F472B6',
    gradient: 'from-pink-400 to-pink-600',
    weight: 5,
  },

  // Zigzag Z & S
  {
    id: 'z_horiz',
    name: 'Z-Shape Horiz',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: '#EAB308', // Gold/Yellow
    accentColor: '#FDE047',
    gradient: 'from-yellow-400 to-yellow-600',
    weight: 5,
  },
  {
    id: 's_horiz',
    name: 'S-Shape Horiz',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: '#EAB308',
    accentColor: '#FDE047',
    gradient: 'from-yellow-400 to-yellow-600',
    weight: 5,
  },
  {
    id: 'z_vert',
    name: 'Z-Shape Vert',
    matrix: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: '#EAB308',
    accentColor: '#FDE047',
    gradient: 'from-yellow-400 to-yellow-600',
    weight: 5,
  },
  {
    id: 's_vert',
    name: 'S-Shape Vert',
    matrix: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    color: '#EAB308',
    accentColor: '#FDE047',
    gradient: 'from-yellow-400 to-yellow-600',
    weight: 5,
  },

  // Plus-shaped piece (+)
  {
    id: 'plus_5',
    name: 'Plus Shape',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#EF4444', // Red
    accentColor: '#FCA5A5',
    gradient: 'from-red-400 to-red-600',
    weight: 3,
  },

  // Staircase 3-cell diagonal
  {
    id: 'stair_left',
    name: 'Staircase Left',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: '#14B8A6', // Teal
    accentColor: '#5EEAD4',
    gradient: 'from-teal-400 to-teal-600',
    weight: 6,
  },
];

// Mulberry32 seeded PRNG
export function createSeededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted random piece picker.
 * Ensures a balanced tray so the player never gets 3 giant impossible pieces at once.
 */
export function pickRandomPiece(rng: () => number = Math.random, existingPiecesInTray: BlockShape[] = []): BlockShape {
  // Count how many large pieces (size >= 5 or 3x3) are already in tray
  const largeCount = existingPiecesInTray.filter(
    (p) => p.matrix.length >= 3 && p.matrix[0].length >= 3
  ).length;

  // Filter or adjust weights dynamically
  const totalWeight = SHAPE_DEFINITIONS.reduce((sum, shape) => {
    let weight = shape.weight;
    // If tray already has a large piece, drastically suppress 3x3 or huge pieces
    if (largeCount > 0 && (shape.id === 'sq_3x3' || shape.id === 'rect_2x3' || shape.id === 'rect_3x2')) {
      weight = Math.max(1, Math.floor(weight / 3));
    }
    return sum + weight;
  }, 0);

  let rand = rng() * totalWeight;
  for (const shape of SHAPE_DEFINITIONS) {
    let weight = shape.weight;
    if (largeCount > 0 && (shape.id === 'sq_3x3' || shape.id === 'rect_2x3' || shape.id === 'rect_3x2')) {
      weight = Math.max(1, Math.floor(weight / 3));
    }
    if (rand < weight) {
      return shape;
    }
    rand -= weight;
  }

  return SHAPE_DEFINITIONS[0];
}

/**
 * Generate a set of 3 tray pieces.
 * Guarantees at least 1 small piece (1-3 cells) so the player has tactical recovery moves.
 */
export function generateTray(rng: () => number = Math.random): BlockShape[] {
  const tray: BlockShape[] = [];

  for (let i = 0; i < 3; i++) {
    const piece = pickRandomPiece(rng, tray);
    tray.push(piece);
  }

  // Check total cell count of the 3 pieces; if all 3 are 4+ cells, replace one with a small dot or 2-bar
  const allLarge = tray.every((p) => {
    const cells = p.matrix.reduce((acc, row) => acc + row.filter((c) => c === 1).length, 0);
    return cells >= 4;
  });

  if (allLarge) {
    const smallShapes = SHAPE_DEFINITIONS.filter((s) => s.id === 'dot_1x1' || s.id === 'line_2x1_h' || s.id === 'line_1x2_v');
    const replacement = smallShapes[Math.floor(rng() * smallShapes.length)];
    tray[0] = replacement;
  }

  return tray;
}
