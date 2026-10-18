import React, { useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Lock, Check } from 'lucide-react';
import { LevelData, Position, BoxItem, Direction } from '../types/game';
import { AndroidMascot } from './AndroidMascot';
import { CubeBox } from './CubeBox';
import { isBoxDeadlocked } from '../utils/puzzleSolver';

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
  isExitUnlocked?: boolean;
  coveredPlatesCount?: number;
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
  isExitUnlocked = true,
  coveredPlatesCount = 0,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [tappedCell, setTappedCell] = useState<Position | null>(null);

  // Crisp Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
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

  // Direct click/tap on an adjacent square or intentional step
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
              const isPlateOccupied = isPlate && boxes.some(b => b.x === x && b.y === y);
              const isLaser = level.laserPos && x === level.laserPos.x && y === level.laserPos.y;
              const isWall = cell === 'WALL';
              const isTapped = tappedCell?.x === x && tappedCell?.y === y;

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
                      ? isExitUnlocked
                        ? 'bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-teal-950/80 border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-br from-rose-950/80 via-slate-900/60 to-rose-950/80 border-2 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : isPlate
                      ? isPlateOccupied
                        ? 'bg-emerald-950/80 border-2 border-emerald-400/80 shadow-[0_0_12px_#10b981]'
                        : 'bg-purple-950/80 border-2 border-purple-400/80 shadow-[0_0_12px_#a855f7]'
                      : isNearPlayer
                      ? 'bg-slate-950/90 border border-emerald-500/25 shadow-inner'
                      : 'bg-slate-950/80 border border-slate-800/50 hover:bg-slate-900/60 active:bg-slate-800/60'
                  } ${isTapped ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  {/* High-Tech Floor Circuit Accent */}
                  {!isWall && !isExit && !isPlate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-1 h-1 rounded-full bg-slate-400" />
                    </div>
                  )}

                  {/* 3D Wall Surface Accent */}
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

                  {/* Exit Portal Visual (Locked vs Unlocked) */}
                  {isExit && (
                    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
                      {isExitUnlocked ? (
                        <>
                          {/* Unlocked Radiant Portal */}
                          <div 
                            className="absolute w-[85%] h-[85%] rounded-full border-2 border-dashed border-emerald-400/90 animate-spin" 
                            style={{ animationDuration: '4s' }} 
                          />
                          <div 
                            className="absolute w-[65%] h-[65%] rounded-full border border-teal-300/80 animate-spin" 
                            style={{ animationDuration: '6s', animationDirection: 'reverse' }} 
                          />
                          <div className="w-1/2 h-1/2 rounded-full bg-emerald-500/40 flex items-center justify-center shadow-[0_0_16px_#10b981]">
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping" />
                          </div>
                          <span className="absolute -bottom-1.5 px-1 rounded bg-emerald-950/90 border border-emerald-500/60 text-[7px] font-black tracking-widest text-emerald-300 shadow">
                            ESCAPE
                          </span>
                        </>
                      ) : (
                        <>
                          {/* Locked Security Forcefield */}
                          <div className="w-3/4 h-3/4 rounded-xl border-2 border-rose-500/80 bg-rose-950/60 flex flex-col items-center justify-center gap-0.5 shadow-[0_0_14px_rgba(244,63,94,0.4)]">
                            <Lock className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                            <span className="text-[6px] font-black text-rose-300 tracking-wider">SEALED</span>
                          </div>
                          <span className="absolute -bottom-1.5 px-1 rounded bg-rose-950 border border-rose-500/60 text-[6px] font-bold text-rose-300 shadow">
                            {coveredPlatesCount}/{level.plates.length} CORES
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Target Socket / Pressure Plate Visual */}
                  {isPlate && (
                    <div className="relative w-3/4 h-3/4 rounded-xl flex items-center justify-center pointer-events-none">
                      {isPlateOccupied ? (
                        <div className="w-full h-full rounded-lg border-2 border-emerald-400 bg-emerald-950/70 flex items-center justify-center shadow-[0_0_12px_#10b981]">
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg border-2 border-dashed border-purple-400/90 bg-purple-950/40 flex flex-col items-center justify-center gap-0.5 shadow-[0_0_10px_#a855f7]">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                          <span className="text-[6px] font-bold text-purple-300 tracking-wider">TARGET</span>
                        </div>
                      )}
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
            const isDeadlocked = !isOnPlate && isBoxDeadlocked(box, level.width, level.height, level.grid, level.plates);

            return (
              <div
                key={`box-${box.id}`}
                onClick={() => handleCellClick(box.x, box.y)}
                className={`absolute transition-all duration-150 ease-out z-20 cursor-pointer ${
                  isDeadlocked ? 'ring-2 ring-rose-500/80 rounded-xl shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse' : ''
                }`}
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
                {isDeadlocked && (
                  <div 
                    title="Corner Deadlock! Box cannot be pushed in any direction. Use Undo."
                    className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-rose-600 border border-white text-white flex items-center justify-center text-[8px] font-black shadow z-30 pointer-events-none"
                  >
                    بن‌بست!
                  </div>
                )}
              </div>
            );
          })}

          {/* Render Animated Android Droid Mascot */}
          <div
            className={`absolute transition-all duration-150 ease-out z-30 pointer-events-none ${
              isMoving ? 'scale-105' : 'scale-100'
            }`}
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

          {/* Render Hint Trail Arrows */}
          {hintSteps.map((step, idx) => (
            <div
              key={`hint-${step.x}-${step.y}-${idx}`}
              className="absolute pointer-events-none z-25 flex items-center justify-center animate-bounce"
              style={{
                width: `${100 / level.width}%`,
                height: `${100 / level.height}%`,
                left: `${(step.x / level.width) * 100}%`,
                top: `${(step.y / level.height) * 100}%`,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-[0_0_14px_#f59e0b] border border-white">
                {step.dir === 'UP' && <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />}
                {step.dir === 'DOWN' && <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />}
                {step.dir === 'LEFT' && <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />}
                {step.dir === 'RIGHT' && <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
