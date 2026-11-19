import React, { useRef, useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Lock,
  Check,
  AlertTriangle,
  MapPin,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  DoorOpen,
} from 'lucide-react';
import { LevelData, Position, BoxItem, Direction, SolutionPushStep } from '../types/game';
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
  solutionPushes?: SolutionPushStep[];
  activePushIndex?: number;
  autoWalkTarget?: Position | null;
  onMove: (dir: Direction) => void;
  onMoveToCell: (x: number, y: number) => void;
  onAutoWalk?: (x: number, y: number) => void;
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
  solutionPushes = [],
  activePushIndex = 0,
  autoWalkTarget = null,
  onMove,
  onMoveToCell,
  onAutoWalk,
  laserActive,
  isHardcore = false,
  isExitUnlocked = true,
  coveredPlatesCount = 0,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mouseDownRef = useRef<{ x: number; y: number } | null>(null);
  const lastClickRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const [tappedCell, setTappedCell] = useState<Position | null>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    const dx = e.clientX - mouseDownRef.current.x;
    const dy = e.clientY - mouseDownRef.current.y;
    mouseDownRef.current = null;

    const minDragDistance = 30;
    if (Math.abs(dx) > minDragDistance || Math.abs(dy) > minDragDistance) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onMove(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onMove(dy > 0 ? 'DOWN' : 'UP');
      }
    }
  };

  const handleCellClick = (x: number, y: number) => {
    const now = Date.now();
    if (
      lastClickRef.current &&
      lastClickRef.current.x === x &&
      lastClickRef.current.y === y &&
      now - lastClickRef.current.time < 380
    ) {
      lastClickRef.current = null;
      if (onAutoWalk) onAutoWalk(x, y);
      return;
    }

    lastClickRef.current = { x, y, time: now };
    setTappedCell({ x, y });
    setTimeout(() => setTappedCell(null), 220);
    onMoveToCell(x, y);
  };

  const activePush = solutionPushes.length > 0 ? solutionPushes[activePushIndex] || solutionPushes[0] : null;

  return (
    <div className="relative w-full max-w-[460px] mx-auto aspect-square p-1.5 select-none flex items-center justify-center">
      {/* Outer Sculpted Architectural Chassis */}
      <div
        ref={boardRef}
        className={`relative w-full h-full rounded-[26px] p-2.5 sm:p-3 touch-none border transition-colors shadow-[0_14px_30px_rgba(31,36,44,0.12),inset_0_1px_0_rgba(255,255,255,0.65)] ${
          isHardcore
            ? 'bg-[#e8dcd9] border-[#c89f9a]'
            : 'bg-[#dfd9cc] border-[#c7bfb0]'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Recessed Playfield Well */}
        <div
          className={`relative w-full h-full rounded-[18px] p-1.5 shadow-[inset_0_2px_6px_rgba(31,36,44,0.16)] ${
            isHardcore ? 'bg-[#cfc0bd]' : 'bg-[#cbc4b6]'
          }`}
        >
          {/* Dynamic Grid Layout */}
          <div
            className="relative w-full h-full grid gap-[3px] sm:gap-1"
            style={{
              gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
            }}
          >
            {level.grid.map((row, y) =>
              row.map((cell, x) => {
                const isExit = x === level.exitPos.x && y === level.exitPos.y;
                const isPlate = level.plates.some(pl => pl.x === x && pl.y === y);
                const isPlateOccupied = isPlate && boxes.some(b => b.x === x && b.y === y);
                const isLaser = level.laserPos && x === level.laserPos.x && y === level.laserPos.y;
                const isWall = cell === 'WALL';
                const isTapped = tappedCell?.x === x && tappedCell?.y === y;
                const isAutoWalkTarget = autoWalkTarget?.x === x && autoWalkTarget?.y === y;
                const isCheckerAlt = (x + y) % 2 === 1;

                const distToPlayer = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
                const isAdjacent = distToPlayer === 1;

                const isApproachCell =
                  activePush && activePush.playerApproachPos.x === x && activePush.playerApproachPos.y === y;
                const isPushTargetCell = activePush && activePush.to.x === x && activePush.to.y === y;

                return (
                  <div
                    key={`cell-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    onDoubleClick={e => {
                      e.stopPropagation();
                      if (onAutoWalk) onAutoWalk(x, y);
                    }}
                    className={`relative rounded-[7px] flex items-center justify-center transition-colors duration-150 cursor-pointer overflow-hidden ${
                      isWall
                        ? 'bg-gradient-to-b from-[#545d6c] to-[#343b46] border-t border-[#7b8698]/70 shadow-[0_2px_0_#1e232a] z-10'
                        : isExit
                        ? isExitUnlocked
                          ? 'bg-[#d1fae5] border-2 border-[#0d9488] text-[#065f46]'
                          : 'bg-[#f5e9e7] border border-[#c98a84] text-[#991b1b]'
                        : isPlate
                        ? isPlateOccupied
                          ? 'bg-[#ccfbf1] border border-[#0d9488] text-[#0f766e]'
                          : 'bg-[#fef3c7]/80 border border-[#d97706]/55 text-[#92400e]'
                        : isApproachCell
                        ? 'bg-[#fde68a]/85 border-2 border-[#d97706]'
                        : isPushTargetCell
                        ? 'bg-[#dbeafe] border-2 border-dashed border-[#0284c7]'
                        : isAdjacent
                        ? 'bg-[#faf8f2] border border-[#d5cdc0]'
                        : isCheckerAlt
                        ? 'bg-[#f4f0e7] border border-[#e3dccf]'
                        : 'bg-[#ede8dc] border border-[#ddd5c7]'
                    } ${isTapped ? 'ring-2 ring-[#d97706]' : ''}`}
                  >
                    {/* Subtle Floor Tile Inlay */}
                    {!isWall && !isExit && !isPlate && (
                      <div className="w-1 h-1 rounded-full bg-[#8c8372]/25 pointer-events-none" />
                    )}

                    {/* Architectural Beveled Wall Tile */}
                    {isWall && (
                      <div className="w-full h-full p-[3px] pointer-events-none select-none flex items-center justify-center">
                        <div className="w-full h-full rounded-[4px] bg-gradient-to-br from-[#646e7f]/55 to-[#2b313b]/60 border border-[#8a95a8]/25 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-[2px] bg-[#252a33]/60 border-t border-[#8b96aa]/30" />
                        </div>
                      </div>
                    )}

                    {/* Clean Inset Exit Vault */}
                    {isExit && (
                      <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none px-0.5 leading-none">
                        {isExitUnlocked ? (
                          <>
                            <DoorOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0d9488]" />
                            <span className="text-[7px] font-extrabold tracking-wide text-[#065f46] mt-0.5">
                              OPEN
                            </span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#b91c1c]" />
                            <span className="text-[8px] font-mono font-bold text-[#991b1b] tabular-nums mt-0.5">
                              {coveredPlatesCount}/{level.plates.length}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Precision Brass/Jade Docking Pad (No Overflowing Text) */}
                    {isPlate && (
                      <div className="w-[74%] h-[74%] rounded-[6px] flex items-center justify-center pointer-events-none">
                        {isPlateOccupied ? (
                          <div className="w-full h-full rounded-[5px] bg-[#99f6e4]/60 border border-[#0d9488] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-[#0f766e] stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-[5px] border-2 border-dashed border-[#d97706] flex items-center justify-center bg-[#fef3c7]/50">
                            <div className="w-2.5 h-2.5 rotate-45 rounded-[2px] bg-[#d97706]/85 ring-2 ring-[#f59e0b]/25" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Hint: Stand position */}
                    {isApproachCell && (
                      <div className="absolute inset-x-0 bottom-0.5 flex justify-center pointer-events-none z-15">
                        <span className="px-1 rounded bg-[#d97706] text-white font-bold text-[7px] shadow-xs">
                          STAND
                        </span>
                      </div>
                    )}

                    {/* Hint: Cube push target */}
                    {isPushTargetCell && !isPlate && (
                      <div className="absolute inset-x-0 bottom-0.5 flex justify-center pointer-events-none z-15">
                        <span className="px-1 rounded bg-[#0284c7] text-white font-bold text-[7px] shadow-xs">
                          HERE
                        </span>
                      </div>
                    )}

                    {/* Laser Gate Barrier */}
                    {isLaser && laserActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="w-full h-1.5 bg-rose-500 rounded-full" />
                        <div className="absolute w-1.5 h-full bg-rose-500 rounded-full" />
                      </div>
                    )}

                    {/* Auto-walk indicator */}
                    {isAutoWalkTarget && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f766e] animate-bounce stroke-[2.5]" />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Movable Isometric Cubes */}
            {boxes.map(box => {
              const isOnPlate = level.plates.some(pl => pl.x === box.x && pl.y === box.y);
              const isDeadlocked =
                !isOnPlate &&
                isBoxDeadlocked(box, level.width, level.height, level.grid, level.plates, [], level.exitPos);
              const isNextToPush = activePush && activePush.from.x === box.x && activePush.from.y === box.y;

              return (
                <div
                  key={`box-${box.id}`}
                  onClick={() => handleCellClick(box.x, box.y)}
                  className={`absolute transition-all duration-150 ease-out z-20 cursor-pointer ${
                    isDeadlocked ? 'ring-2 ring-rose-500 rounded-lg' : ''
                  } ${isNextToPush ? 'ring-2 ring-[#d97706] rounded-lg' : ''}`}
                  style={{
                    width: `${100 / level.width}%`,
                    height: `${100 / level.height}%`,
                    left: `${(box.x / level.width) * 100}%`,
                    top: `${(box.y / level.height) * 100}%`,
                  }}
                >
                  <CubeBox id={box.id} type={box.type} isOnPlate={isOnPlate} />

                  {isDeadlocked && (
                    <div
                      title="Core trapped! Press Undo."
                      className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-rose-600 border border-white text-white flex items-center gap-0.5 text-[7px] font-bold shadow z-30 pointer-events-none"
                    >
                      <AlertTriangle className="w-2 h-2" />
                    </div>
                  )}

                  {isNextToPush && activePush && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                      <div className="p-1 rounded-full bg-[#d97706] text-white shadow-md border-2 border-white flex items-center justify-center">
                        {activePush.dir === 'UP' && <MoveUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                        {activePush.dir === 'DOWN' && <MoveDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                        {activePush.dir === 'LEFT' && <MoveLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                        {activePush.dir === 'RIGHT' && <MoveRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                      </div>
                      <span className="mt-0.5 px-1 rounded bg-[#1f242c] text-amber-300 text-[7px] font-mono font-bold shadow">
                        #{activePush.pushNumber}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Android Mascot */}
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
              <AndroidMascot direction={playerDir} isMoving={isMoving} isVictorious={isVictorious} />
            </div>

            {/* Droid Approach Trail */}
            {hintSteps.map((step, idx) => (
              <div
                key={`hint-${step.x}-${step.y}-${idx}`}
                className="absolute pointer-events-none z-25 flex items-center justify-center"
                style={{
                  width: `${100 / level.width}%`,
                  height: `${100 / level.height}%`,
                  left: `${(step.x / level.width) * 100}%`,
                  top: `${(step.y / level.height) * 100}%`,
                }}
              >
                <div className="w-4 h-4 rounded-full bg-[#0284c7]/90 text-white flex items-center justify-center shadow-sm border border-white">
                  {step.dir === 'UP' ? (
                    <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />
                  ) : step.dir === 'DOWN' ? (
                    <ArrowDown className="w-2.5 h-2.5 stroke-[3]" />
                  ) : step.dir === 'LEFT' ? (
                    <ArrowLeft className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
