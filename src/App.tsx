/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, GameState, GridCell, ActiveTrayPiece, FloatingScore, ComboNotification, GameStats } from './types/game';
import { GRID_SIZE, createEmptyGrid, canPlaceShape, placeShapeOnGrid, findCompletedLines, removeCompletedLines, calculateTurnScore, canAnyPieceFit } from './utils/gameLogic';
import { generateTray, createSeededRandom } from './utils/shapes';
import { soundManager } from './utils/audio';
import { ParticleCanvas, ParticleCanvasRef } from './components/ParticleCanvas';
import { GridBoard, GridBoardRef } from './components/GridBoard';
import { BlockPieceView } from './components/BlockPieceView';
import { HeaderHUD } from './components/HeaderHUD';
import { MainMenu } from './components/MainMenu';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { HowToPlayModal } from './components/HowToPlayModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [grid, setGrid] = useState<GridCell[][]>(createEmptyGrid);
  const [trayPieces, setTrayPieces] = useState<ActiveTrayPiece[]>([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);

  // Score & Stats
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('blockblast_best_score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [movesMade, setMovesMade] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(90);

  // Visual Effects & Feedback
  const [shakeType, setShakeType] = useState<'none' | 'sm' | 'lg'>('none');
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [comboBanner, setComboBanner] = useState<ComboNotification | null>(null);

  // Audio toggles state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isSoundEnabled);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(soundManager.isMusicEnabled);

  // High-performance Dragging State (No continuous React state updates during drag!)
  const [activeDragPieceIndex, setActiveDragPieceIndex] = useState<number | null>(null);
  const [hoverGridPos, setHoverGridPos] = useState<{ row: number; col: number } | null>(null);

  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const isTouchDragRef = useRef<boolean>(false);
  const hoverGridPosRef = useRef<{ row: number; col: number } | null>(null);
  const dragPieceIndexRef = useRef<number | null>(null);
  const rafMoveRef = useRef<number | null>(null);
  const latestPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const gridBoardRef = useRef<GridBoardRef | null>(null);
  const particleCanvasRef = useRef<ParticleCanvasRef | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const dailyRngRef = useRef<(() => number) | null>(null);

  // Update piece canFit status whenever grid or tray changes
  const updateTrayPieceFit = useCallback((currentGrid: GridCell[][], pieces: ActiveTrayPiece[]) => {
    return pieces.map((piece) => {
      if (piece.isUsed) return piece;
      let canFit = false;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlaceShape(currentGrid, piece.shape.matrix, r, c)) {
            canFit = true;
            break;
          }
        }
        if (canFit) break;
      }
      return { ...piece, canFit };
    });
  }, []);

  // Initialize a new round
  const startNewGame = useCallback((mode: GameMode = gameMode) => {
    const emptyGrid = createEmptyGrid();
    setGrid(emptyGrid);
    setScore(0);
    setLinesCleared(0);
    setComboStreak(0);
    setMaxCombo(0);
    setMovesMade(0);
    setIsNewBest(false);
    setSelectedPieceIndex(null);
    setActiveDragPieceIndex(null);
    dragPieceIndexRef.current = null;
    hoverGridPosRef.current = null;
    setHoverGridPos(null);
    setFloatingScores([]);
    setComboBanner(null);

    let rng = Math.random;
    if (mode === 'daily') {
      const today = new Date().toISOString().slice(0, 10);
      dailyRngRef.current = createSeededRandom(today);
      rng = dailyRngRef.current;
    }

    const initialShapes = generateTray(rng);
    const initialPieces: ActiveTrayPiece[] = initialShapes.map((shape, idx) => ({
      instanceId: `p-${Date.now()}-${idx}`,
      shape,
      isUsed: false,
      canFit: true,
    }));

    setTrayPieces(updateTrayPieceFit(emptyGrid, initialPieces));
    setGameMode(mode);

    if (mode === 'time_attack') {
      setTimeRemaining(90);
    }

    setGameState('PLAYING');
    soundManager.playButtonClick();
  }, [gameMode, updateTrayPieceFit]);

  // Handle Time Attack Timer
  useEffect(() => {
    if (gameState === 'PLAYING' && gameMode === 'time_attack') {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState, gameMode]);

  // Check game over
  const handleGameOver = useCallback(() => {
    soundManager.playGameOver();
    setGameState('GAME_OVER');
  }, []);

  // Trigger floating score animation
  const addFloatingScore = (x: number, y: number, text: string, color: string = '#FBBF24', isCombo: boolean = false) => {
    const id = `score-${Date.now()}-${Math.random()}`;
    setFloatingScores((prev) => [...prev, { id, x, y, text, color, isCombo }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== id));
    }, 1100);
  };

  // Perform placement of a tray piece onto the grid at (row, col)
  const executePlacement = useCallback(
    (pieceIdx: number, startRow: number, startCol: number) => {
      const piece = trayPieces[pieceIdx];
      if (!piece || piece.isUsed) return;

      if (!canPlaceShape(grid, piece.shape.matrix, startRow, startCol)) {
        soundManager.playInvalid();
        return;
      }

      // Legal placement!
      soundManager.playDrop();

      // Place shape
      const newGrid = placeShapeOnGrid(grid, piece.shape, startRow, startCol);
      const cellCount = piece.shape.matrix.reduce(
        (sum, row) => sum + row.filter((c) => c === 1).length,
        0
      );

      // Check lines
      const lineResult = findCompletedLines(newGrid);
      const isLinesCleared = lineResult.totalLines > 0;
      const nextComboStreak = isLinesCleared ? comboStreak + 1 : 0;

      // Score calculation
      const turnScore = calculateTurnScore(cellCount, lineResult.totalLines, nextComboStreak);
      const updatedScore = score + turnScore.totalPoints;

      // Check best score
      if (updatedScore > bestScore) {
        setBestScore(updatedScore);
        try {
          localStorage.setItem('blockblast_best_score', String(updatedScore));
        } catch {}
        if (!isNewBest && bestScore > 0) {
          setIsNewBest(true);
          particleCanvasRef.current?.celebrate();
        }
      }

      setScore(updatedScore);
      setComboStreak(nextComboStreak);
      if (nextComboStreak > maxCombo) setMaxCombo(nextComboStreak);
      setMovesMade((m) => m + 1);

      // Show floating placement score
      const anchorCoords = gridBoardRef.current?.getCellCoordinates(startRow, startCol);
      if (anchorCoords) {
        addFloatingScore(anchorCoords.x, anchorCoords.y - 20, `+${turnScore.totalPoints}`);
      }

      // Mark piece as used
      const nextTray = trayPieces.map((p, idx) =>
        idx === pieceIdx ? { ...p, isUsed: true } : p
      );

      setSelectedPieceIndex(null);

      // Handle Line Clears
      if (isLinesCleared) {
        if (gameMode === 'time_attack') {
          setTimeRemaining((prev) => prev + lineResult.totalLines * 3);
        }

        setLinesCleared((l) => l + lineResult.totalLines);

        // Shake & Audio
        setShakeType(lineResult.totalLines >= 3 ? 'lg' : 'sm');
        setTimeout(() => setShakeType('none'), 240);

        soundManager.playLineClear(lineResult.totalLines, nextComboStreak);
        if (nextComboStreak > 1) {
          soundManager.playCombo(nextComboStreak);
        }

        // Combo banner
        if (turnScore.comboText) {
          const banner: ComboNotification = {
            id: `combo-${Date.now()}`,
            title: turnScore.comboText,
            multiplier: nextComboStreak,
            color: piece.shape.color,
          };
          setComboBanner(banner);
          setTimeout(() => setComboBanner(null), 1200);
        }

        // Particle bursts from center of every clearing cell
        const clearedCoords: { x: number; y: number; color?: string }[] = [];
        for (const cell of lineResult.cellsToClear) {
          const coords = gridBoardRef.current?.getCellCoordinates(cell.r, cell.c);
          if (coords) {
            clearedCoords.push({ ...coords, color: cell.color || piece.shape.color });
          }
        }
        if (clearedCoords.length > 0) {
          particleCanvasRef.current?.burstAtCells(clearedCoords);
        }

        // Mark cells as clearing on grid
        const clearingGrid = newGrid.map((row, r) =>
          row.map((cell, c) => {
            const isClearingCell = lineResult.cellsToClear.some((cl) => cl.r === r && cl.c === c);
            return isClearingCell ? { ...cell, isClearing: true } : cell;
          })
        );
        setGrid(clearingGrid);

        // Remove cleared cells quickly
        setTimeout(() => {
          const cleanedGrid = removeCompletedLines(newGrid, lineResult.cellsToClear);
          setGrid(cleanedGrid);
          finishTurn(cleanedGrid, nextTray);
        }, 200);
      } else {
        setGrid(newGrid);
        finishTurn(newGrid, nextTray);
      }
    },
    [grid, trayPieces, score, bestScore, comboStreak, maxCombo, isNewBest, gameMode]
  );

  // Conclude turn: check if all 3 pieces used, spawn new tray if needed, check game over
  const finishTurn = (currentGrid: GridCell[][], currentTray: ActiveTrayPiece[]) => {
    const allUsed = currentTray.every((p) => p.isUsed);

    let nextTray = currentTray;
    if (allUsed) {
      const rng = gameMode === 'daily' && dailyRngRef.current ? dailyRngRef.current : Math.random;
      const newShapes = generateTray(rng);
      nextTray = newShapes.map((shape, idx) => ({
        instanceId: `p-${Date.now()}-${idx}`,
        shape,
        isUsed: false,
        canFit: true,
      }));
    }

    const updatedTray = updateTrayPieceFit(currentGrid, nextTray);
    setTrayPieces(updatedTray);

    const canFitAny = canAnyPieceFit(currentGrid, updatedTray);
    if (!canFitAny) {
      setTimeout(() => {
        handleGameOver();
      }, 300);
    }
  };

  // High-performance pointer handlers (Zero lag, direct transform)
  const handlePiecePointerDown = (
    pieceIdx: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const isTouch = e.pointerType === 'touch';
    isTouchDragRef.current = isTouch;
    dragPieceIndexRef.current = pieceIdx;

    // Cache board bounding box once at pointer down to prevent layout thrashing
    gridBoardRef.current?.cacheBounds();

    soundManager.playPickup();

    setActiveDragPieceIndex(pieceIdx);
    setSelectedPieceIndex(pieceIdx);

    const targetY = e.clientY + (isTouch ? -65 : 0);
    latestPointerPosRef.current = { x: e.clientX, y: e.clientY };

    if (dragPreviewRef.current) {
      dragPreviewRef.current.style.transform = `translate3d(${e.clientX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      dragPreviewRef.current.style.opacity = '1';
    }

    const gridPos = gridBoardRef.current?.getRowColFromPointer(
      e.clientX,
      targetY
    );
    hoverGridPosRef.current = gridPos || null;
    setHoverGridPos(gridPos || null);
  };

  useEffect(() => {
    if (activeDragPieceIndex === null) return;

    const onPointerMove = (e: PointerEvent) => {
      latestPointerPosRef.current = { x: e.clientX, y: e.clientY };

      if (rafMoveRef.current !== null) return;

      rafMoveRef.current = requestAnimationFrame(() => {
        rafMoveRef.current = null;
        const { x, y } = latestPointerPosRef.current;
        const targetY = y + (isTouchDragRef.current ? -65 : 0);

        // Hardware-accelerated GPU transform without triggering React re-renders!
        if (dragPreviewRef.current) {
          dragPreviewRef.current.style.transform = `translate3d(${x}px, ${targetY}px, 0) translate(-50%, -50%)`;
        }

        // Only trigger React state update if hover cell actually changed!
        const newPos = gridBoardRef.current?.getRowColFromPointer(x, targetY) || null;
        const prevPos = hoverGridPosRef.current;

        const changed =
          (newPos === null && prevPos !== null) ||
          (newPos !== null && prevPos === null) ||
          (newPos !== null && prevPos !== null && (newPos.row !== prevPos.row || newPos.col !== prevPos.col));

        if (changed) {
          hoverGridPosRef.current = newPos;
          setHoverGridPos(newPos);
        }
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (rafMoveRef.current) {
        cancelAnimationFrame(rafMoveRef.current);
        rafMoveRef.current = null;
      }

      const currentPieceIdx = dragPieceIndexRef.current;
      const targetY = e.clientY + (isTouchDragRef.current ? -65 : 0);
      const gridPos = gridBoardRef.current?.getRowColFromPointer(e.clientX, targetY);

      if (currentPieceIdx !== null && gridPos) {
        executePlacement(currentPieceIdx, gridPos.row, gridPos.col);
      }

      dragPieceIndexRef.current = null;
      hoverGridPosRef.current = null;
      setActiveDragPieceIndex(null);
      setHoverGridPos(null);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: false });
    window.addEventListener('pointercancel', onPointerUp, { passive: false });

    return () => {
      if (rafMoveRef.current) {
        cancelAnimationFrame(rafMoveRef.current);
        rafMoveRef.current = null;
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [activeDragPieceIndex, executePlacement]);

  // Click-to-place fallback: click tray piece to select, then click grid cell to place
  const handleCellClick = (row: number, col: number) => {
    if (selectedPieceIndex !== null && activeDragPieceIndex === null) {
      executePlacement(selectedPieceIndex, row, col);
    }
  };

  const handleCellPointerEnter = (row: number, col: number) => {
    if (selectedPieceIndex !== null && activeDragPieceIndex === null) {
      setHoverGridPos({ row, col });
    }
  };

  // Audio toggles
  const handleToggleSound = () => {
    const val = soundManager.toggleSound();
    setSoundEnabled(val);
  };

  const handleToggleMusic = () => {
    const val = soundManager.toggleMusic();
    setMusicEnabled(val);
  };

  const activeShape =
    activeDragPieceIndex !== null
      ? trayPieces[activeDragPieceIndex]?.shape
      : selectedPieceIndex !== null
      ? trayPieces[selectedPieceIndex]?.shape
      : null;

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden select-none touch-none font-sans">
      {/* Particle Canvas layer */}
      <ParticleCanvas ref={particleCanvasRef} />

      {/* Main Menu Screen */}
      {gameState === 'MENU' && (
        <MainMenu
          bestScore={bestScore}
          selectedMode={gameMode}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onSelectMode={(mode) => setGameMode(mode)}
          onStartGame={() => startNewGame(gameMode)}
          onOpenHowToPlay={() => setGameState('HOW_TO_PLAY')}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {/* Active Play Screen */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'GAME_OVER') && (
        <div className="relative flex-1 flex flex-col justify-between w-full max-w-lg mx-auto py-2 px-3">
          {/* Header HUD */}
          <HeaderHUD
            mode={gameMode}
            score={score}
            bestScore={bestScore}
            comboStreak={comboStreak}
            timeRemaining={gameMode === 'time_attack' ? timeRemaining : undefined}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onPause={() => {
              soundManager.playButtonClick();
              setGameState('PAUSED');
            }}
            onRestart={() => startNewGame(gameMode)}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
          />

          {/* 10x10 Playfield Grid */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            <GridBoard
              ref={gridBoardRef}
              grid={grid}
              activeShape={activeShape || null}
              hoverPos={hoverGridPos}
              shakeType={shakeType}
              onCellClick={handleCellClick}
              onCellPointerEnter={handleCellPointerEnter}
            />

            {/* Combo Shoutout Banner */}
            {comboBanner && (
              <div className="absolute z-40 pointer-events-none flex flex-col items-center animate-pop-banner">
                <div
                  className="px-6 py-2 rounded-2xl border-2 shadow-[0_0_30px_rgba(255,255,255,0.4)] backdrop-blur-md flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: comboBanner.color,
                  }}
                >
                  <span
                    className="font-heading text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(to right, #FFFFFF, ${comboBanner.color})`,
                    }}
                  >
                    {comboBanner.title}
                  </span>
                  {comboBanner.multiplier > 1 && (
                    <span className="font-heading text-xl font-extrabold text-amber-300">
                      x{comboBanner.multiplier}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Piece Tray (3 slots) */}
          <div className="w-full max-w-[420px] mx-auto pb-2">
            <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm min-h-[105px]">
              {trayPieces.map((piece, idx) => (
                <div
                  key={piece.instanceId}
                  className="relative flex items-center justify-center rounded-xl bg-slate-950/40 p-1 cursor-pointer transition hover:bg-slate-950/60"
                  onClick={() => {
                    if (!piece.isUsed) {
                      soundManager.playButtonClick();
                      setSelectedPieceIndex((prev) => (prev === idx ? null : idx));
                    }
                  }}
                >
                  <BlockPieceView
                    shape={piece.shape}
                    cellSize={22}
                    isUsed={piece.isUsed}
                    canFit={piece.canFit}
                    isSelected={selectedPieceIndex === idx && activeDragPieceIndex === null}
                    onPointerDown={(e) => {
                      if (!piece.isUsed) {
                        handlePiecePointerDown(idx, e);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            {selectedPieceIndex !== null && activeDragPieceIndex === null && (
              <p className="text-center text-[11px] text-amber-300 font-medium mt-1.5 animate-pulse">
                Click any cell on the grid to place selected piece
              </p>
            )}
          </div>
        </div>
      )}

      {/* Ultra High Performance GPU Floating Drag Element (Single DOM node, no re-rendering) */}
      {activeDragPieceIndex !== null && trayPieces[activeDragPieceIndex] && (
        <div
          ref={dragPreviewRef}
          className="fixed pointer-events-none z-50 gpu-accelerated top-0 left-0"
          style={{
            willChange: 'transform',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
          }}
        >
          <BlockPieceView
            shape={trayPieces[activeDragPieceIndex].shape}
            cellSize={34} // Full scale matching board cell size!
            isDragging={true}
          />
        </div>
      )}

      {/* Floating Score Popups */}
      {floatingScores.map((scoreItem) => (
        <div
          key={scoreItem.id}
          className="fixed pointer-events-none z-50 font-heading text-xl sm:text-2xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-bounce gpu-accelerated"
          style={{
            left: `${scoreItem.x}px`,
            top: `${scoreItem.y}px`,
            color: scoreItem.color,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {scoreItem.text}
        </div>
      ))}

      {/* Modals */}
      {gameState === 'PAUSED' && (
        <PauseModal
          score={score}
          bestScore={bestScore}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onResume={() => {
            soundManager.playButtonClick();
            setGameState('PLAYING');
          }}
          onRestart={() => startNewGame(gameMode)}
          onHome={() => {
            soundManager.playButtonClick();
            setGameState('MENU');
          }}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          stats={{
            score,
            bestScore,
            linesCleared,
            comboStreak,
            maxCombo,
            movesMade,
            isNewBest,
          }}
          onRestart={() => startNewGame(gameMode)}
          onHome={() => {
            soundManager.playButtonClick();
            setGameState('MENU');
          }}
        />
      )}

      {gameState === 'HOW_TO_PLAY' && (
        <HowToPlayModal
          onClose={() => {
            soundManager.playButtonClick();
            setGameState('MENU');
          }}
        />
      )}
    </div>
  );
}
