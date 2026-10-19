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
  MoveRight
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

  // Touch swipe gesture handling
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

  // Mouse drag support for desktop/trackpads
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

  // Cell click & double-click pathfinding auto-walk
  const handleCellClick = (x: number, y: number) => {
    const now = Date.now();
    // Double click / tap detected (within 380ms)
    if (
      lastClickRef.current &&
      lastClickRef.current.x === x &&
      lastClickRef.current.y === y &&
      now - lastClickRef.current.time < 380
    ) {
      lastClickRef.current = null;
      if (onAutoWalk) {
        onAutoWalk(x, y);
      }
      return;
    }

    lastClickRef.current = { x, y, time: now };
    setTappedCell({ x, y });
    setTimeout(() => setTappedCell(null), 250);
    onMoveToCell(x, y);
  };

  // Current active push step from solution guide
  const activePush = solutionPushes.length > 0 ? solutionPushes[activePushIndex] || solutionPushes[0] : null;

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-square p-2 select-none flex items-center justify-center">
      {/* Outer Chamber Frame - Clean Matte Porcelain/Warm Slate Frame (Gentle on the eyes, zero neon glare) */}
      <div 
        ref={boardRef}
        className={`relative w-full h-full bg-[#f1f5f9] rounded-3xl p-3 shadow-xl overflow-hidden touch-none border transition-colors ${
          isHardcore 
            ? 'border-rose-300 shadow-rose-900/10' 
            : 'border-slate-300 shadow-slate-300/40'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Subtle Warm Grid Texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1.2px, transparent 0)`,
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
          {/* Ground & 3D Wall Tiles */}
          {level.grid.map((row, y) =>
            row.map((cell, x) => {
              const isExit = x === level.exitPos.x && y === level.exitPos.y;
              const isPlate = level.plates.some(pl => pl.x === x && pl.y === y);
              const isPlateOccupied = isPlate && boxes.some(b => b.x === x && b.y === y);
              const isLaser = level.laserPos && x === level.laserPos.x && y === level.laserPos.y;
              const isWall = cell === 'WALL';
              const isTapped = tappedCell?.x === x && tappedCell?.y === y;
              const isAutoWalkTarget = autoWalkTarget?.x === x && autoWalkTarget?.y === y;

              const distToPlayer = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
              const isAdjacent = distToPlayer === 1;

              // Check if this cell is where player needs to stand to make the active push
              const isApproachCell = activePush && activePush.playerApproachPos.x === x && activePush.playerApproachPos.y === y;
              // Check if this cell is the destination of the active push
              const isPushTargetCell = activePush && activePush.to.x === x && activePush.to.y === y;

              return (
                <div
                  key={`cell-${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (onAutoWalk) onAutoWalk(x, y);
                  }}
                  className={`relative rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isWall
                      ? 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 border-t-2 border-l-2 border-slate-400 border-r-2 border-b-2 border-slate-900 shadow-[0_3px_0_#334155] z-10'
                      : isExit
                      ? isExitUnlocked
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-rose-50 border-2 border-rose-400 text-rose-800 shadow-sm'
                      : isPlate
                      ? isPlateOccupied
                        ? 'bg-emerald-100/80 border-2 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-amber-100/70 border-2 border-dashed border-amber-500 text-amber-800 shadow-sm'
                      : isApproachCell
                      ? 'bg-amber-100/80 border-2 border-amber-400 ring-2 ring-amber-400/40'
                      : isPushTargetCell
                      ? 'bg-sky-100/80 border-2 border-dashed border-sky-400'
                      : isAdjacent
                      ? 'bg-white border border-slate-300 shadow-sm'
                      : 'bg-[#e9edf2] border border-slate-200 hover:bg-[#e2e8f0]'
                  } ${isTapped ? 'ring-2 ring-amber-500' : ''}`}
                >
                  {/* Subtle Floor Tile Center Dot */}
                  {!isWall && !isExit && !isPlate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    </div>
                  )}

                  {/* 3D Wall Architectural Details */}
                  {isWall && (
                    <div className="w-full h-full p-1 flex flex-col justify-between pointer-events-none select-none">
                      <div className="w-full flex items-center justify-between opacity-40">
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <div className="flex-1 mx-1 h-[1px] bg-slate-400" />
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <div className="w-3 h-0.5 rounded-full bg-slate-400/50" />
                      </div>
                      <div className="w-full flex items-center justify-between opacity-40">
                        <div className="w-1 h-1 rounded-full bg-slate-900" />
                        <div className="flex-1 mx-1 h-[1px] bg-slate-900" />
                        <div className="w-1 h-1 rounded-full bg-slate-900" />
                      </div>
                    </div>
                  )}

                  {/* Exit Portal Tile */}
                  {isExit && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
                      {isExitUnlocked ? (
                        <>
                          <div className="w-3/4 h-3/4 rounded-xl border-2 border-emerald-500 bg-emerald-100 flex flex-col items-center justify-center shadow-sm">
                            <span className="text-[8px] font-black tracking-wider text-emerald-800">OPEN</span>
                          </div>
                          <span className="absolute -bottom-1 px-1 rounded bg-white border border-emerald-500 text-[7px] font-bold text-emerald-700 shadow">
                            EXIT
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-3/4 h-3/4 rounded-xl border-2 border-rose-400 bg-rose-100 flex flex-col items-center justify-center gap-0.5 shadow-sm">
                            <Lock className="w-3 h-3 text-rose-600" />
                            <span className="text-[6px] font-bold text-rose-700 tracking-wider">LOCKED</span>
                          </div>
                          <span className="absolute -bottom-1 px-1 rounded bg-white border border-rose-400 text-[6px] font-mono font-bold text-rose-700 shadow">
                            {coveredPlatesCount}/{level.plates.length} CORES
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Target Socket (Pressure Plate) */}
                  {isPlate && (
                    <div className="relative w-3/4 h-3/4 rounded-xl flex items-center justify-center pointer-events-none">
                      {isPlateOccupied ? (
                        <div className="w-full h-full rounded-lg border-2 border-emerald-500 bg-emerald-200/70 flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 text-emerald-800 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-lg border-2 border-dashed border-amber-500 bg-amber-100/60 flex flex-col items-center justify-center gap-0.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          <span className="text-[6px] font-bold text-amber-800 tracking-wider">TARGET</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hint: Stand here to push */}
                  {isApproachCell && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15">
                      <div className="px-1 py-0.5 rounded bg-amber-500 text-white font-bold text-[7px] shadow animate-bounce">
                        STAND
                      </div>
                    </div>
                  )}

                  {/* Hint: Box moves here */}
                  {isPushTargetCell && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-15">
                      <div className="px-1 py-0.5 rounded bg-sky-600 text-white font-bold text-[7px] shadow">
                        TARGET
                      </div>
                    </div>
                  )}

                  {/* Laser Gate Barrier */}
                  {isLaser && laserActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="w-full h-1.5 bg-rose-500 rounded-full shadow-sm" />
                      <div className="absolute w-1.5 h-full bg-rose-500 rounded-full shadow-sm" />
                    </div>
                  )}

                  {/* Auto-walk target indicator */}
                  {isAutoWalkTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <MapPin className="w-5 h-5 text-indigo-600 animate-bounce stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Render 3D Movable Cubes */}
          {boxes.map((box, bIdx) => {
            const isOnPlate = level.plates.some(pl => pl.x === box.x && pl.y === box.y);
            const isDeadlocked = !isOnPlate && isBoxDeadlocked(box, level.width, level.height, level.grid, level.plates);

            // Is this box the one to be pushed next in the solution guide?
            const isNextToPush = activePush && activePush.from.x === box.x && activePush.from.y === box.y;

            return (
              <div
                key={`box-${box.id}`}
                onClick={() => handleCellClick(box.x, box.y)}
                className={`absolute transition-all duration-150 ease-out z-20 cursor-pointer ${
                  isDeadlocked ? 'ring-2 ring-rose-500 rounded-xl shadow-lg' : ''
                } ${isNextToPush ? 'ring-3 ring-amber-400 rounded-xl animate-pulse' : ''}`}
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

                {/* Deadlock corner warning */}
                {isDeadlocked && (
                  <div 
                    title="Corner Deadlock! Box cannot move in any direction. Press Undo."
                    className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded-full bg-rose-600 border border-white text-white flex items-center gap-0.5 text-[7px] font-black shadow z-30 pointer-events-none"
                  >
                    <AlertTriangle className="w-2 h-2" />
                    <span>TRAPPED</span>
                  </div>
                )}

                {/* Clear Hint Arrow directly on the active Cube */}
                {isNextToPush && activePush && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                    <div className="p-1 rounded-full bg-amber-400 text-slate-950 font-black shadow-md border-2 border-white flex items-center justify-center">
                      {activePush.dir === 'UP' && <MoveUp className="w-4 h-4 stroke-[3]" />}
                      {activePush.dir === 'DOWN' && <MoveDown className="w-4 h-4 stroke-[3]" />}
                      {activePush.dir === 'LEFT' && <MoveLeft className="w-4 h-4 stroke-[3]" />}
                      {activePush.dir === 'RIGHT' && <MoveRight className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <span className="mt-0.5 px-1 py-0.2 rounded bg-slate-900 text-amber-300 text-[7px] font-bold uppercase shadow">
                      PUSH {activePush.pushNumber}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Render Android Mascot Droid */}
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

          {/* Render Hint Trail Arrows for Droid's approach path */}
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
              <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 font-bold text-[9px] flex items-center justify-center shadow-md border border-white">
                {step.dir === 'UP' ? <ArrowUp className="w-3 h-3 stroke-[3]" /> :
                 step.dir === 'DOWN' ? <ArrowDown className="w-3 h-3 stroke-[3]" /> :
                 step.dir === 'LEFT' ? <ArrowLeft className="w-3 h-3 stroke-[3]" /> :
                 <ArrowRight className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
