import { Direction, Position, CellType, SolutionPushStep } from '../types/game';

interface SolverState {
  player: Position;
  boxes: Position[];
  path: Direction[];
  pushes: number;
}

function stateKey(player: Position, boxes: Position[]): string {
  const sortedBoxes = [...boxes].sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
  return `${player.x},${player.y}|` + sortedBoxes.map(b => `${b.x},${b.y}`).join(';');
}

const DIRS: { dir: Direction; dx: number; dy: number }[] = [
  { dir: 'UP', dx: 0, dy: -1 },
  { dir: 'DOWN', dx: 0, dy: 1 },
  { dir: 'LEFT', dx: -1, dy: 0 },
  { dir: 'RIGHT', dx: 1, dy: 0 },
];

export interface SolverResult {
  solvable: boolean;
  minMoves: number;
  pushes: number;
  solutionMoves: Direction[];
  solutionPushes: SolutionPushStep[];
  nextMove?: Direction;
}


export function isBoxDeadlocked(
  box: Position,
  width: number,
  height: number,
  grid: CellType[][],
  plates: Position[],
  fixedObstacles: Position[] = []
): boolean {
  // If box is on a target plate, it is productive and not deadlocked
  if (plates.some(p => p.x === box.x && p.y === box.y)) return false;

  const isWallOrSolid = (x: number, y: number) =>
    x < 0 || x >= width || y < 0 || y >= height || grid[y][x] === 'WALL' || fixedObstacles.some(f => f.x === x && f.y === y);

  const blockedH = isWallOrSolid(box.x - 1, box.y) || isWallOrSolid(box.x + 1, box.y);
  const blockedV = isWallOrSolid(box.x, box.y - 1) || isWallOrSolid(box.x, box.y + 1);

  return blockedH && blockedV;
}

/**
 * Fast Breadth-First Search solver for Droid Escape chamber puzzles.
 * Finds shortest sequence of moves for the droid to activate all power sockets and clear the chamber.
 * Incorporates intelligent deadlock pruning to solve complex Sokoban puzzles in milliseconds.
 */
export function solvePuzzle(
  width: number,
  height: number,
  grid: CellType[][],
  initialPlayer: Position,
  initialMovableBoxes: Position[],
  exitPos: Position,
  hasLaser = false,
  laserPos?: Position,
  plates: Position[] = [],
  fixedObstacles: Position[] = [],
  maxSearchStates = 40000
): SolverResult {
  // If all plates are already covered at start
  const initialAllPlatesCovered =
    plates.length > 0 &&
    plates.every(pl => initialMovableBoxes.some(b => b.x === pl.x && b.y === pl.y));
  if (initialAllPlatesCovered) {
    return { solvable: true, minMoves: 0, pushes: 0, solutionMoves: [], solutionPushes: [] };
  }

  const queue: SolverState[] = [
    {
      player: { ...initialPlayer },
      boxes: initialMovableBoxes.map(b => ({ ...b })),
      path: [],
      pushes: 0,
    },
  ];

  const visited = new Set<string>();
  visited.add(stateKey(initialPlayer, initialMovableBoxes));

  let statesCount = 0;

  while (queue.length > 0 && statesCount < maxSearchStates) {
    statesCount++;
    const current = queue.shift()!;

    // Win condition check:
    // 1. If plates exist: All plates must have boxes!
    // 2. If plates are all filled, puzzle is cleared!
    if (plates.length > 0) {
      const allPlatesCovered = plates.every(pl =>
        current.boxes.some(b => b.x === pl.x && b.y === pl.y)
      );
      if (allPlatesCovered) {
        const pushes = extractPushSteps(initialPlayer, initialMovableBoxes, current.path);
        return {
          solvable: true,
          minMoves: current.path.length,
          pushes: current.pushes,
          solutionMoves: current.path,
          solutionPushes: pushes,
          nextMove: current.path[0],
        };
      }
    } else {
      // If no plates, reaching exit is win condition
      if (current.player.x === exitPos.x && current.player.y === exitPos.y) {
        const pushes = extractPushSteps(initialPlayer, initialMovableBoxes, current.path);
        return {
          solvable: true,
          minMoves: current.path.length,
          pushes: current.pushes,
          solutionMoves: current.path,
          solutionPushes: pushes,
          nextMove: current.path[0],
        };
      }
    }


    // Determine if laser is currently blocking
    let laserActive = false;
    if (hasLaser && laserPos && plates.length > 0) {
      const isAnyPlateCovered = plates.some(
        pl =>
          current.boxes.some(b => b.x === pl.x && b.y === pl.y) ||
          (current.player.x === pl.x && current.player.y === pl.y)
      );
      laserActive = !isAnyPlateCovered;
    }

    for (const { dir, dx, dy } of DIRS) {
      const nx = current.player.x + dx;
      const ny = current.player.y + dy;

      // Bounds check
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

      // Wall check
      if (grid[ny][nx] === 'WALL') continue;

      // Fixed immovable obstacle check
      if (fixedObstacles.some(f => f.x === nx && f.y === ny)) continue;

      // Laser barrier check
      if (laserActive && laserPos && nx === laserPos.x && ny === laserPos.y) {
        continue;
      }

      // Check if moving into a movable box
      const boxIdx = current.boxes.findIndex(b => b.x === nx && b.y === ny);

      if (boxIdx !== -1) {
        // Pushing movable box
        const pushX = nx + dx;
        const pushY = ny + dy;

        // Can box go to push target?
        if (pushX < 0 || pushX >= width || pushY < 0 || pushY >= height) continue;
        if (grid[pushY][pushX] === 'WALL') continue;
        if (fixedObstacles.some(f => f.x === pushX && f.y === pushY)) continue;
        if (laserActive && laserPos && pushX === laserPos.x && pushY === laserPos.y) continue;
        if (current.boxes.some(b => b.x === pushX && b.y === pushY)) continue;

        // Deadlock Pruning: If pushed into an unrecoverable corner (and not on a plate), prune!
        if (isBoxDeadlocked({ x: pushX, y: pushY }, width, height, grid, plates, fixedObstacles)) {
          continue;
        }

        const newBoxes = current.boxes.map((b, i) => (i === boxIdx ? { x: pushX, y: pushY } : { ...b }));
        const newPlayer = { x: nx, y: ny };
        const key = stateKey(newPlayer, newBoxes);

        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            player: newPlayer,
            boxes: newBoxes,
            path: [...current.path, dir],
            pushes: current.pushes + 1,
          });
        }
      } else {
        // Player walking onto empty tile
        const newPlayer = { x: nx, y: ny };
        const key = stateKey(newPlayer, current.boxes);

        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            player: newPlayer,
            boxes: current.boxes,
            path: [...current.path, dir],
            pushes: current.pushes,
          });
        }
      }
    }
  }

  return {
    solvable: false,
    minMoves: 0,
    pushes: 0,
    solutionMoves: [],
    solutionPushes: [],
  };
}

export function extractPushSteps(
  initialPlayer: Position,
  initialBoxes: Position[],
  moves: Direction[]
): SolutionPushStep[] {
  const pushes: SolutionPushStep[] = [];
  let p = { ...initialPlayer };
  let b = initialBoxes.map(box => ({ ...box }));
  const delta: Record<Direction, { dx: number; dy: number }> = {
    UP: { dx: 0, dy: -1 },
    DOWN: { dx: 0, dy: 1 },
    LEFT: { dx: -1, dy: 0 },
    RIGHT: { dx: 1, dy: 0 },
  };

  for (const dir of moves) {
    const d = delta[dir];
    const nextPlayer = { x: p.x + d.dx, y: p.y + d.dy };
    const boxIdx = b.findIndex(box => box.x === nextPlayer.x && box.y === nextPlayer.y);
    if (boxIdx !== -1) {
      const nextBox = { x: nextPlayer.x + d.dx, y: nextPlayer.y + d.dy };
      pushes.push({
        pushNumber: pushes.length + 1,
        boxIdx,
        from: { ...b[boxIdx] },
        to: nextBox,
        dir,
        playerApproachPos: { ...p },
      });
      b[boxIdx] = nextBox;
    }
    p = nextPlayer;
  }
  return pushes;
}


