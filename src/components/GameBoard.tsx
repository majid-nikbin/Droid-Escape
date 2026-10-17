import React, { useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { LevelData, Position, BoxItem, Direction } from '../types/game';
import { AndroidMascot } from './AndroidMascot';
import { CubeBox } from './CubeBox';

export interface HintStep {
  x: number;
  y: number;
  dir: Direction;
  step: number;
}

interface GameBoardProps {
  level: LevelData;
  playerPos: Position;
  playerDir: Direction;
  boxes: BoxItem[];
  isMoving: boolean;
  isVictorious: boolean;
  hintSteps?: HintStep[];
  onMove: (dir: Direction) => void;
  onMoveToCell: (x: number, y: number) => void;
  laserActive: boolean;
  isHardcore?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  playerPos,
  playerDir,
  boxes,
  isMoving,
  isVictorious,
  hintSteps = [],
  onMove,
  onMoveToCell,
  laserActive,
  isHardcore = false,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastMovedTimeRef = useRef<number>(0);
  const [tappedCell, setTappedCell] = useState<Position | null>(null);

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Follow finger path in real-time as finger drags across cells
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!boardRef.current) return;
    const now = Date.now();
    if (now - lastMovedTimeRef.current < 110) return; // Smooth pacing throttle

    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const relX = touch.clientX - rect.left;
    const relY = touch.clientY - rect.top;

    if (relX < 0 || relX >= rect.width || relY < 0 || relY >= rect.height) return;

    const tileX = Math.floor((relX / rect.width) * level.width);
    const tileY = Math.floor((relY / rect.height) * level.height);

    const dx = tileX - playerPos.x;
    const dy = tileY - playerPos.y;

    // If finger moves to an adjacent cell, step directly into it
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      lastMovedTimeRef.current = now;
      if (dx === 1) onMove('RIGHT');
      else if (dx === -1) onMove('LEFT');
      else if (dy === 1) onMove('DOWN');
      else if (dy === -1) onMove('UP');
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 24;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipeDistance) {
        onMove(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minSwipeDistance) {
        onMove(dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  // Direct click/tap on a specific target square
  const handleCellClick = (x: number, y: number) => {
    setTappedCell({ x, y });
    setTimeout(() => setTappedCell(null), 250);
    onMoveToCell(x, y);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square p-2 select-none flex items-center justify-center">
      {/* Outer Chamber Frame / High-Tech Cyber Deck */}
      <div 
        ref={boardRef}
        className={`relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 rounded-3xl p-3 shadow-2xl overflow-hidden backdrop-blur touch-none border-2 transition-colors ${
          isHardcore 
            ? 'border-rose-900/60 shadow-[0_0_30px_rgba(244,63,94,0.15)]' 
            : 'border-slate-800/80 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Futuristic Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isHardcore ? '#f43f5e' : '#38bdf8'} 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Dynamic Grid Layout */}
        <div
          className="relative w-full h-full grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
          }}
        >
          {/* Render Ground & 3D Wall Tiles */}
          {level.grid.map((row, y) =>
            row.map((cell, x) => {
              const isExit = x === level.exitPos.x && y === level.exitPos.y;
              const isPlate = level.plates.some(pl => pl.x === x && pl.y === y);
              const isLaser = level.laserPos && x === level.laserPos.x && y === level.laserPos.y;
              const isWall = cell === 'WALL';
              const isTapped = tappedCell?.x === x && tappedCell?.y === y;

              // Proximity light halo around player droid
              const distToPlayer = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
              const isNearPlayer = distToPlayer <= 2;

              return (
                <div
                  key={`cell-${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className={`relative rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isWall
                      ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-t-2 border-l border-slate-500/70 border-r-2 border-b-2 border-slate-950 shadow-[0_4px_0_#090d16,0_8px_16px_rgba(0,0,0,0.6)] z-10'
                      : isExit
                      ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-teal-950/80 border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                      : isPlate
                      ? 'bg-purple-950/70 border-2 border-purple-500/60 shadow-inner'
                      : isNearPlayer
                      ? 'bg-slate-950/90 border border-emerald-500/25 shadow-inner'
                      : 'bg-slate-950/80 border border-slate-800/50 hover:bg-slate-900/60 active:bg-slate-800/60'
                  } ${isTapped ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  {/* High-Tech Floor Circuit Accent (Empty Walkable Tiles) */}
                  {!isWall && !isExit && !isPlate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                    </div>
                  )}

                  {/* 3D Isometric Wall Top Surface Bevel & Sci-Fi Seam */}
                  {isWall && (
                    <div className="w-full h-full p-1 flex flex-col justify-between pointer-events-none select-none">
                      <div className="w-full flex items-center justify-between opacity-40">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex-1 mx-1 h-[1px] bg-slate-400/50" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <div className={`w-2 h-0.5 rounded-full ${isHardcore ? 'bg-rose-500/40' : 'bg-cyan-500/40'}`} />
                      </div>
                      <div className="w-full flex items-center justify-between opacity-30">
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                        <div className="flex-1 mx-1 h-[1px] bg-slate-600/50" />
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                      </div>
                    </div>
                  )}

                  {/* Gorgeous Quantum Exit Portal Visual */}
                  {isExit && (
                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                      {/* Outer Swirling Holographic Ring */}
                      <div 
                        className="absolute w-[85%] h-[85%] rounded-full border-2 border-dashed border-emerald-400/90 animate-spin" 
                        style={{ animationDuration: '4s' }} 
                      />
                      {/* Inner Counter-Rotating Ring */}
                      <div 
                        className="absolute w-[65%] h-[65%] rounded-full border border-teal-300/80 animate-spin" 
                        style={{ animationDuration: '6s', animationDirection: 'reverse' }} 
                      />
                      {/* Radiant Center Vortex */}
                      <div className="w-1/2 h-1/2 rounded-full bg-emerald-500/40 flex items-center justify-center shadow-[0_0_16px_#10b981]">
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
                      </div>
                      {/* Quantum Label */}
                      <span className="absolute -bottom-1.5 px-1 rounded bg-emerald-950/90 border border-emerald-500/60 text-[7px] font-black tracking-widest text-emerald-300 shadow">
                        EXIT
                      </span>
                    </div>
                  )}

                  {/* Pressure Plate Switch Visual */}
                  {isPlate && (
                    <div className="relative w-3/4 h-3/4 rounded-lg border-2 border-purple-400/80 bg-purple-900/40 flex items-center justify-center pointer-events-none shadow-[0_0_10px_#a855f7]">
                      <div className="w-2.5 h-2.5 rounded-sm bg-purple-300 animate-ping opacity-75" />
                    </div>
                  )}

                  {/* Laser Forcefield Barrier Visual */}
                  {isLaser && laserActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="w-full h-2 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse" />
                      <div className="absolute w-2 h-full bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Render 3D Cubic Boxes */}
          {boxes.map(box => {
            const isOnPlate = level.plates.some(pl => pl.x === box.x && pl.y === box.y);
            return (
              <div
                key={`box-${box.id}`}
                onClick={() => handleCellClick(box.x, box.y)}
                className="absolute transition-all duration-150 ease-out z-20 cursor-pointer"
                style={{
                  width: `${100 / level.width}%`,
                  height: `${100 / level.height}%`,
                  left: `${(box.x / level.width) * 100}%`,
                  top: `${(box.y / level.height) * 100}%`,
                }}
              >
                <CubeBox
                  id={box.id}
                  type={box.type}
                  isOnPlate={isOnPlate}
                />
              </div>
            );
          })}

          {/* Render Animated Android Droid Mascot */}
          <div
            className="absolute transition-all duration-150 ease-out z-30 pointer-events-none"
            style={{
              width: `${100 / level.width}%`,
              height: `${100 / level.height}%`,
              left: `${(playerPos.x / level.width) * 100}%`,
              top: `${(playerPos.y / level.height) * 100}%`,
            }}
          >
            <AndroidMascot
              direction={playerDir}
              isMoving={isMoving}
              isVictorious={isVictorious}
            />
          </div>

          {/* Multi-Step Animated Directional Hint Arrows */}
          {hintSteps.map(step => (
            <div
              key={`hint-step-${step.step}-${step.x}-${step.y}`}
              className="absolute z-40 pointer-events-none flex items-center justify-center transition-all duration-200"
              style={{
                width: `${100 / level.width}%`,
                height: `${100 / level.height}%`,
                left: `${(step.x / level.width) * 100}%`,
                top: `${(step.y / level.height) * 100}%`,
              }}
            >
              <div className="relative w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-500/40 flex items-center justify-center shadow-[0_0_14px_#f59e0b] animate-pulse">
                {step.dir === 'UP' && <ArrowUp className="w-5 h-5 text-amber-200 stroke-[3]" />}
                {step.dir === 'DOWN' && <ArrowDown className="w-5 h-5 text-amber-200 stroke-[3]" />}
                {step.dir === 'LEFT' && <ArrowLeft className="w-5 h-5 text-amber-200 stroke-[3]" />}
                {step.dir === 'RIGHT' && <ArrowRight className="w-5 h-5 text-amber-200 stroke-[3]" />}

                {/* Step sequence badge */}
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                  {step.step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
