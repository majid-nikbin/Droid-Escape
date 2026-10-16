import { Direction, Position, CellType } from '../types/game';

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
  nextMove?: Direction;
}

/**
 * Fast Breadth-First Search solver for Droid Escape chamber puzzles.
 * Finds shortest sequence of moves for the droid to reach the Exit,
 * taking into account fixed immovable steel barriers and movable boxes.
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
  maxSearchStates = 8000
): SolverResult {
  // If player is already on exit
  if (initialPlayer.x === exitPos.x && initialPlayer.y === exitPos.y) {
    return { solvable: true, minMoves: 0, pushes: 0, solutionMoves: [] };
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

    // Check win condition: droid reached exit AND if laser exists, laser must be deactivated
    if (current.player.x === exitPos.x && current.player.y === exitPos.y) {
      let laserSatisfied = true;
      if (hasLaser && plates.length > 0) {
        // At least one plate covered by a box
        laserSatisfied = plates.some(pl => current.boxes.some(b => b.x === pl.x && b.y === pl.y));
      }
      if (laserSatisfied) {
        return {
          solvable: true,
          minMoves: current.path.length,
          pushes: current.pushes,
          solutionMoves: current.path,
          nextMove: current.path[0],
        };
      }
    }

    // Determine if laser is currently blocking
    let laserActive = false;
    if (hasLaser && laserPos && plates.length > 0) {
      const isAnyPlateCovered = plates.some(pl => 
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

      // Fixed immovable box check (acts like a solid barrier)
      if (fixedObstacles.some(f => f.x === nx && f.y === ny)) continue;

      // Laser check
      if (laserActive && laserPos && nx === laserPos.x && ny === laserPos.y) {
        continue;
      }

      // Check if moving into a movable box
      const boxIdx = current.boxes.findIndex(b => b.x === nx && b.y === ny);

      if (boxIdx !== -1) {
        // Trying to push movable box
        const pushX = nx + dx;
        const pushY = ny + dy;

        // Can box go there?
        if (pushX < 0 || pushX >= width || pushY < 0 || pushY >= height) continue;
        if (grid[pushY][pushX] === 'WALL') continue;
        // Cannot push into fixed box
        if (fixedObstacles.some(f => f.x === pushX && f.y === pushY)) continue;
        // Box cannot be pushed onto the exit tile
        if (pushX === exitPos.x && pushY === exitPos.y) continue;
        // Box cannot be pushed onto active laser
        if (laserActive && laserPos && pushX === laserPos.x && pushY === laserPos.y) continue;
        // Box cannot be pushed into another movable box
        if (current.boxes.some(b => b.x === pushX && b.y === pushY)) continue;

        // Valid box push!
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
        // Simple player move into empty space
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
  };
}
