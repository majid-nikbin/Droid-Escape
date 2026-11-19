import { Direction, Position, CellType, SolutionPushStep } from '../types/game';

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

/**
 * Checks whether a single box (not currently on a plate) is permanently deadlocked:
 * 1. Corner deadlock: blocked on at least one horizontal axis AND one vertical axis by wall/fixed/exit.
 * 2. Outer-rail deadlock: pressed against an unbroken outer boundary wall where no reachable plate exists along that edge segment.
 */
export function isBoxDeadlocked(
  box: Position,
  width: number,
  height: number,
  grid: CellType[][],
  plates: Position[],
  fixedObstacles: Position[] = [],
  exitPos?: Position
): boolean {
  // If box is on a target plate, it is productive and not deadlocked
  if (plates.some(p => p.x === box.x && p.y === box.y)) return false;

  const isWallOrSolid = (x: number, y: number) =>
    x < 0 ||
    x >= width ||
    y < 0 ||
    y >= height ||
    grid[y][x] === 'WALL' ||
    (exitPos !== undefined && exitPos.x === x && exitPos.y === y) ||
    fixedObstacles.some(f => f.x === x && f.y === y);

  const blockedH = isWallOrSolid(box.x - 1, box.y) || isWallOrSolid(box.x + 1, box.y);
  const blockedV = isWallOrSolid(box.x, box.y - 1) || isWallOrSolid(box.x, box.y + 1);

  if (blockedH && blockedV) return true;

  // Outer-wall rail deadlock check:
  // If touching an unbroken top/bottom/left/right outer wall, box can never move perpendicular to that wall.
  const checkHorizontalRail = (y: number, wallY: number) => {
    for (let x = 0; x < width; x++) {
      if (grid[wallY][x] !== 'WALL') return false;
    }
    let hasPlateOnSegment = false;
    for (let x = box.x; x >= 0 && !isWallOrSolid(x, y); x--) {
      if (plates.some(p => p.x === x && p.y === y)) {
        hasPlateOnSegment = true;
        break;
      }
    }
    if (!hasPlateOnSegment) {
      for (let x = box.x; x < width && !isWallOrSolid(x, y); x++) {
        if (plates.some(p => p.x === x && p.y === y)) {
          hasPlateOnSegment = true;
          break;
        }
      }
    }
    return !hasPlateOnSegment;
  };

  const checkVerticalRail = (x: number, wallX: number) => {
    for (let y = 0; y < height; y++) {
      if (grid[y][wallX] !== 'WALL') return false;
    }
    let hasPlateOnSegment = false;
    for (let y = box.y; y >= 0 && !isWallOrSolid(x, y); y--) {
      if (plates.some(p => p.x === x && p.y === y)) {
        hasPlateOnSegment = true;
        break;
      }
    }
    if (!hasPlateOnSegment) {
      for (let y = box.y; y < height && !isWallOrSolid(x, y); y++) {
        if (plates.some(p => p.x === x && p.y === y)) {
          hasPlateOnSegment = true;
          break;
        }
      }
    }
    return !hasPlateOnSegment;
  };

  if (box.y === 1 && checkHorizontalRail(1, 0)) return true;
  if (box.y === height - 2 && checkHorizontalRail(height - 2, height - 1)) return true;
  if (box.x === 1 && checkVerticalRail(1, 0)) return true;
  if (box.x === width - 2 && checkVerticalRail(width - 2, width - 1)) return true;

  return false;
}

/**
 * Computes shortest walking path for the droid from `start` to `goal` avoiding walls, boxes, exit, fixed obstacles, and active lasers.
 */
export function findWalkPath(
  width: number,
  height: number,
  grid: CellType[][],
  start: Position,
  goal: Position,
  boxes: Position[],
  exitPos: Position,
  hasLaser = false,
  laserPos?: Position,
  plates: Position[] = [],
  fixedObstacles: Position[] = []
): Direction[] | null {
  if (start.x === goal.x && start.y === goal.y) return [];

  const size = width * height;
  const parent = new Int16Array(size).fill(-1);
  const parentDir = new Int8Array(size).fill(-1);
  const startIdx = start.y * width + start.x;
  const goalIdx = goal.y * width + goal.x;

  const blocked = new Uint8Array(size);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'WALL') blocked[y * width + x] = 1;
    }
  }
  for (const b of boxes) blocked[b.y * width + b.x] = 1;
  for (const f of fixedObstacles) blocked[f.y * width + f.x] = 1;

  if (plates.length > 0) {
    blocked[exitPos.y * width + exitPos.x] = 1;
  }

  if (hasLaser && laserPos && plates.length > 0) {
    const anyBoxOnPlate = plates.some(pl => boxes.some(b => b.x === pl.x && b.y === pl.y));
    if (!anyBoxOnPlate && !(plates.some(pl => pl.x === start.x && pl.y === start.y))) {
      blocked[laserPos.y * width + laserPos.x] = 1;
    }
  }

  if (blocked[goalIdx]) return null;

  const q = new Int16Array(size);
  let head = 0;
  let tail = 0;
  q[tail++] = startIdx;
  parent[startIdx] = startIdx;

  while (head < tail) {
    const cur = q[head++];
    if (cur === goalIdx) {
      const path: Direction[] = [];
      let trace = goalIdx;
      while (trace !== startIdx) {
        path.push(DIRS[parentDir[trace]].dir);
        trace = parent[trace];
      }
      path.reverse();
      return path;
    }
    const cx = cur % width;
    const cy = (cur / width) | 0;

    for (let di = 0; di < 4; di++) {
      const nx = cx + DIRS[di].dx;
      const ny = cy + DIRS[di].dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (blocked[ni] || parent[ni] !== -1) continue;
      parent[ni] = cur;
      parentDir[ni] = di;
      q[tail++] = ni;
    }
  }

  return null;
}

interface MacroNode {
  player: Position;
  boxes: Position[];
  parentNode: number;
  boxIdx: number;
  dirIdx: number;
  pushes: number;
}

/**
 * Fast Push-Macro Breadth-First Search Solver for Droid Escape puzzles.
 * Canonicalizes the player's reachable floor component so states only branch on box pushes,
 * solving 2-core, 3-core, and 4-core puzzles in milliseconds while preserving 100% exact move sequences.
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
  maxSearchStates = 25000
): SolverResult {
  // Handle plate-covered initial state
  if (plates.length > 0) {
    const allCovered = plates.every(pl => initialMovableBoxes.some(b => b.x === pl.x && b.y === pl.y));
    if (allCovered) {
      return { solvable: true, minMoves: 0, pushes: 0, solutionMoves: [], solutionPushes: [] };
    }
    if (initialMovableBoxes.some(b => isBoxDeadlocked(b, width, height, grid, plates, fixedObstacles, exitPos))) {
      return { solvable: false, minMoves: 0, pushes: 0, solutionMoves: [], solutionPushes: [] };
    }
  } else {
    // No plates: simply walk to exit
    const walk = findWalkPath(width, height, grid, initialPlayer, exitPos, initialMovableBoxes, exitPos, false, undefined, [], fixedObstacles);
    if (walk) {
      return {
        solvable: true,
        minMoves: walk.length,
        pushes: 0,
        solutionMoves: walk,
        solutionPushes: [],
        nextMove: walk[0],
      };
    }
    return { solvable: false, minMoves: 0, pushes: 0, solutionMoves: [], solutionPushes: [] };
  }

  const size = width * height;
  const staticBlocked = new Uint8Array(size);
  const plateMask = new Uint8Array(size);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'WALL') staticBlocked[y * width + x] = 1;
    }
  }
  for (const f of fixedObstacles) staticBlocked[f.y * width + f.x] = 1;
  staticBlocked[exitPos.y * width + exitPos.x] = 1;
  for (const pl of plates) plateMask[pl.y * width + pl.x] = 1;

  // Precompute deadlocked floor tiles for a single box (corners + static outer rails)
  const staticDeadCell = new Uint8Array(size);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (staticBlocked[idx] || plateMask[idx]) continue;
      if (isBoxDeadlocked({ x, y }, width, height, grid, plates, fixedObstacles, exitPos)) {
        staticDeadCell[idx] = 1;
      }
    }
  }

  const curBoxGrid = new Uint8Array(size);
  const curReachVisited = new Uint8Array(size);
  const tmpBoxGrid = new Uint8Array(size);
  const tmpReachVisited = new Uint8Array(size);
  const reachQueue = new Int16Array(size);

  // Computes reachable cells from `player` and canonical min cell index of that zone
  const computeReach = (
    player: Position,
    boxes: Position[],
    outBoxGrid: Uint8Array,
    outReachVisited: Uint8Array
  ): { minCell: number } => {
    outBoxGrid.fill(0);
    for (const b of boxes) outBoxGrid[b.y * width + b.x] = 1;

    let laserBlockedIdx = -1;
    if (hasLaser && laserPos) {
      const anyBoxOnPlate = boxes.some(b => plateMask[b.y * width + b.x] === 1);
      if (!anyBoxOnPlate && plateMask[player.y * width + player.x] === 0) {
        laserBlockedIdx = laserPos.y * width + laserPos.x;
      }
    }

    outReachVisited.fill(0);
    let head = 0;
    let tail = 0;
    const startIdx = player.y * width + player.x;
    reachQueue[tail++] = startIdx;
    outReachVisited[startIdx] = 1;
    let minCell = startIdx;

    while (head < tail) {
      const cur = reachQueue[head++];
      if (cur < minCell) minCell = cur;
      const cx = cur % width;
      const cy = (cur / width) | 0;

      for (let di = 0; di < 4; di++) {
        const nx = cx + DIRS[di].dx;
        const ny = cy + DIRS[di].dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const ni = ny * width + nx;
        if (outReachVisited[ni] || staticBlocked[ni] || outBoxGrid[ni] || ni === laserBlockedIdx) continue;
        outReachVisited[ni] = 1;
        reachQueue[tail++] = ni;
      }
    }

    return { minCell };
  };

  // Dynamic 2x2 freeze check: detects 2x2 solid blocks containing at least one off-plate box
  const formsFreezeSquare = (px: number, py: number, boxes: Position[]): boolean => {
    const offsets = [
      [0, 0],
      [-1, 0],
      [0, -1],
      [-1, -1],
    ];
    for (const [ox, oy] of offsets) {
      const sx = px + ox;
      const sy = py + oy;
      if (sx < 0 || sx + 1 >= width || sy < 0 || sy + 1 >= height) continue;
      let allSolid = true;
      let hasOffPlateBox = false;
      for (let dy = 0; dy <= 1; dy++) {
        for (let dx = 0; dx <= 1; dx++) {
          const cx = sx + dx;
          const cy = sy + dy;
          const ci = cy * width + cx;
          const isStatic = staticBlocked[ci] === 1;
          const isBox = boxes.some(b => b.x === cx && b.y === cy);
          if (!isStatic && !isBox) {
            allSolid = false;
            break;
          }
          if (isBox && plateMask[ci] === 0) {
            hasOffPlateBox = true;
          }
        }
        if (!allSolid) break;
      }
      if (allSolid && hasOffPlateBox) return true;
    }
    return false;
  };

  const makeKey = (minCell: number, boxes: Position[]): string => {
    const sorted = boxes.map(b => b.y * width + b.x).sort((a, b) => a - b);
    return `${minCell}|${sorted.join(',')}`;
  };

  const nodes: MacroNode[] = [
    {
      player: { ...initialPlayer },
      boxes: initialMovableBoxes.map(b => ({ ...b })),
      parentNode: -1,
      boxIdx: -1,
      dirIdx: -1,
      pushes: 0,
    },
  ];

  const initReach = computeReach(initialPlayer, initialMovableBoxes, curBoxGrid, curReachVisited);
  const visited = new Set<string>();
  visited.add(makeKey(initReach.minCell, initialMovableBoxes));

  let head = 0;
  let goalNodeIdx = -1;

  while (head < nodes.length && nodes.length < maxSearchStates) {
    const curIdx = head++;
    const cur = nodes[curIdx];

    // Check win
    if (cur.boxes.every(b => plateMask[b.y * width + b.x] === 1)) {
      goalNodeIdx = curIdx;
      break;
    }

    computeReach(cur.player, cur.boxes, curBoxGrid, curReachVisited);

    // Check laser blocked index under current state
    let laserBlockedIdx = -1;
    if (hasLaser && laserPos) {
      const anyBoxOnPlate = cur.boxes.some(b => plateMask[b.y * width + b.x] === 1);
      if (!anyBoxOnPlate) {
        laserBlockedIdx = laserPos.y * width + laserPos.x;
      }
    }

    // Try pushing each box in each direction
    for (let bi = 0; bi < cur.boxes.length; bi++) {
      const box = cur.boxes[bi];
      for (let di = 0; di < 4; di++) {
        const { dx, dy } = DIRS[di];
        const approachX = box.x - dx;
        const approachY = box.y - dy;
        if (approachX < 0 || approachX >= width || approachY < 0 || approachY >= height) continue;
        const approachIdx = approachY * width + approachX;
        if (curReachVisited[approachIdx] === 0) continue;

        const pushX = box.x + dx;
        const pushY = box.y + dy;
        if (pushX < 0 || pushX >= width || pushY < 0 || pushY >= height) continue;
        const pushIdx = pushY * width + pushX;

        if (staticBlocked[pushIdx] || curBoxGrid[pushIdx] || pushIdx === laserBlockedIdx) continue;
        if (staticDeadCell[pushIdx]) continue;

        const newBoxes = cur.boxes.map((b, i) => (i === bi ? { x: pushX, y: pushY } : { ...b }));
        if (formsFreezeSquare(pushX, pushY, newBoxes)) continue;

        const newPlayer = { x: box.x, y: box.y };
        const nextReach = computeReach(newPlayer, newBoxes, tmpBoxGrid, tmpReachVisited);
        const key = makeKey(nextReach.minCell, newBoxes);

        if (!visited.has(key)) {
          visited.add(key);
          nodes.push({
            player: newPlayer,
            boxes: newBoxes,
            parentNode: curIdx,
            boxIdx: bi,
            dirIdx: di,
            pushes: cur.pushes + 1,
          });
        }
      }
    }
  }

  if (goalNodeIdx === -1) {
    return {
      solvable: false,
      minMoves: 0,
      pushes: 0,
      solutionMoves: [],
      solutionPushes: [],
    };
  }

  // Reconstruct macro push sequence from start to goal
  const chain: MacroNode[] = [];
  let trace = goalNodeIdx;
  while (trace > 0) {
    chain.push(nodes[trace]);
    trace = nodes[trace].parentNode;
  }
  chain.reverse();

  const solutionMoves: Direction[] = [];
  let simPlayer = { ...initialPlayer };
  let simBoxes = initialMovableBoxes.map(b => ({ ...b }));

  for (const step of chain) {
    const dir = DIRS[step.dirIdx];
    const targetBox = simBoxes[step.boxIdx];
    const approachPos = { x: targetBox.x - dir.dx, y: targetBox.y - dir.dy };

    const walk = findWalkPath(
      width,
      height,
      grid,
      simPlayer,
      approachPos,
      simBoxes,
      exitPos,
      hasLaser,
      laserPos,
      plates,
      fixedObstacles
    );
    if (!walk) {
      // Safety fallback if laser timing diverged
      return {
        solvable: false,
        minMoves: 0,
        pushes: 0,
        solutionMoves: [],
        solutionPushes: [],
      };
    }

    solutionMoves.push(...walk, dir.dir);
    simPlayer = { x: targetBox.x, y: targetBox.y };
    simBoxes = simBoxes.map((b, i) =>
      i === step.boxIdx ? { x: targetBox.x + dir.dx, y: targetBox.y + dir.dy } : b
    );
  }

  const solutionPushes = extractPushSteps(initialPlayer, initialMovableBoxes, solutionMoves);

  return {
    solvable: true,
    minMoves: solutionMoves.length,
    pushes: solutionPushes.length,
    solutionMoves,
    solutionPushes,
    nextMove: solutionMoves[0],
  };
}

export function extractPushSteps(
  initialPlayer: Position,
  initialBoxes: Position[],
  moves: Direction[]
): SolutionPushStep[] {
  const pushes: SolutionPushStep[] = [];
  let p = { ...initialPlayer };
  const b = initialBoxes.map(box => ({ ...box }));
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
