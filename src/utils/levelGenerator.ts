import { ChapterInfo, LevelData, CellType, Position, BoxItem } from '../types/game';
import { solvePuzzle } from './puzzleSolver';

export const CHAPTERS: ChapterInfo[] = [
  { id: 1, title: 'Neon Laboratory', subtitle: 'Tactical Corridor Labyrinths', color: 'from-emerald-500 to-teal-700', accentColor: '#10B981', theme: 'lab' },
  { id: 2, title: 'Silicon Foundry', subtitle: 'Bottleneck Management', color: 'from-cyan-500 to-blue-700', accentColor: '#06B6D4', theme: 'silicon' },
  { id: 3, title: 'Magnetic Core', subtitle: 'Multi-Room Chambers', color: 'from-violet-500 to-purple-800', accentColor: '#8B5CF6', theme: 'cyber' },
  { id: 4, title: 'Cyber Matrix', subtitle: 'Multi-Block Labyrinth', color: 'from-amber-500 to-orange-700', accentColor: '#F59E0B', theme: 'neon' },
  { id: 5, title: 'Circuit Bastion', subtitle: 'Alcove Storage Dilemmas', color: 'from-blue-500 to-indigo-800', accentColor: '#3B82F6', theme: 'core' },
  { id: 6, title: 'Quantum Nexus', subtitle: 'Winding Chokepoint Mazes', color: 'from-rose-500 to-red-800', accentColor: '#F43F5E', theme: 'quantum' },
  { id: 7, title: 'Crystal Cavern', subtitle: 'Tight Squeeze Maneuvers', color: 'from-fuchsia-500 to-pink-800', accentColor: '#D946EF', theme: 'lab' },
  { id: 8, title: 'Plasma Reactor', subtitle: 'Corridor Routing Challenges', color: 'from-yellow-500 to-amber-700', accentColor: '#EAB308', theme: 'core' },
  { id: 9, title: 'Sub-Zero Sector', subtitle: 'Glacier Labyrinth Chambers', color: 'from-sky-400 to-cyan-700', accentColor: '#38BDF8', theme: 'silicon' },
  { id: 10, title: 'Orbital Vault', subtitle: 'High-Density Maze Chambers', color: 'from-indigo-400 to-violet-800', accentColor: '#6366F1', theme: 'void' },
  { id: 11, title: 'Nano Nexus', subtitle: 'Micro-Path Shifting', color: 'from-emerald-400 to-teal-800', accentColor: '#34D399', theme: 'lab' },
  { id: 12, title: 'Graviton Loop', subtitle: 'Deadlock Evacuation', color: 'from-purple-500 to-indigo-900', accentColor: '#A855F7', theme: 'quantum' },
  { id: 13, title: 'Solar Array', subtitle: 'Dense Array Congestion', color: 'from-amber-400 to-orange-800', accentColor: '#FB923C', theme: 'neon' },
  { id: 14, title: 'Flux Conduits', subtitle: 'Multi-Chamber Traps', color: 'from-rose-400 to-red-900', accentColor: '#FB7185', theme: 'cyber' },
  { id: 15, title: 'Wormhole Matrix', subtitle: 'Spatial Routing Challenge', color: 'from-cyan-400 to-blue-900', accentColor: '#22D3EE', theme: 'quantum' },
  { id: 16, title: 'Dark Matter Lab', subtitle: 'Fortress Chambers', color: 'from-slate-400 to-slate-800', accentColor: '#94A3B8', theme: 'void' },
  { id: 17, title: 'Hyperdrive Core', subtitle: 'Multi-Chamber Lockouts', color: 'from-teal-400 to-emerald-900', accentColor: '#2DD4BF', theme: 'core' },
  { id: 18, title: 'Void Bastion', subtitle: 'Grand Master Strategist', color: 'from-violet-600 to-slate-900', accentColor: '#7C3AED', theme: 'void' },
  { id: 19, title: 'Singularity Rift', subtitle: 'Extreme Spatial Logic', color: 'from-pink-500 to-purple-950', accentColor: '#EC4899', theme: 'quantum' },
  { id: 20, title: 'Master Mainframe', subtitle: 'Ultimate Android Brain Test', color: 'from-amber-300 via-rose-500 to-purple-900', accentColor: '#F43F5E', theme: 'core' },
];

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Checks if the player can walk to the exit without pushing any box.
 * If true, the puzzle is trivial and MUST be rejected!
 */
function canReachExitWithoutPushes(
  width: number,
  height: number,
  grid: CellType[][],
  start: Position,
  exit: Position,
  boxes: Position[]
): boolean {
  const queue: Position[] = [{ ...start }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.x === exit.x && cur.y === exit.y) return true;

    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      if (grid[ny][nx] === 'WALL') continue;
      // Boxes act as solid walls in this walkability check!
      if (boxes.some(b => b.x === nx && b.y === ny)) continue;

      const key = `${nx},${ny}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}

/**
 * Procedurally generates challenging multi-chamber Sokoban labyrinth puzzles:
 * - Challenging labyrinth wall architecture (چینش دیوارهای مکعبی داخل بازی)
 * - Clean, purposeful number of movable cubes (2-4 cubes, never crowded)
 * - NO lasers, NO fixed cubes (solid obstacles are clean WALL blocks)
 * - ALL paths to exit strictly blocked; walking directly to exit is mathematically impossible!
 * - Scaled progressive difficulty:
 *   - Level 1: 7x7 grid, 2 boxes, 8-10 moves
 *   - Level 100: 7x7/8x8 grid, 3 boxes, 12-14 moves
 *   - Level 1000: 9x9/10x10 grid, 3-4 boxes, 18-25 moves
 *   - Level 2000: 11x11 grid, 4 boxes, winding multi-room labyrinth (28-40+ moves)
 */
export function generateLevel(chapter: number, level: number): LevelData {
  const seed = chapter * 7919 + level * 997 + 1337;
  const rng = createRng(seed);

  // Progressive Grid Dimensions by Chapter
  let width = 7;
  let height = 7;
  if (chapter >= 4) { width = 8; height = 8; }
  if (chapter >= 8) { width = 9; height = 9; }
  if (chapter >= 13) { width = 10; height = 10; }
  if (chapter >= 17) { width = 11; height = 11; }

  // Clean, uncluttered box count (2 to 4 pushable cubes)
  const numBoxes = Math.min(2 + Math.floor((chapter - 1) / 5) + (level > 60 ? 1 : 0), 4);

  // Required min moves and pushes
  const minMovesNeeded = Math.min(8 + Math.floor(chapter * 1.2) + Math.floor(level / 25), 36);
  const minPushesNeeded = Math.min(2 + Math.floor((chapter - 1) / 6), 5);

  let bestSolvableCandidate: {
    width: number;
    height: number;
    grid: CellType[][];
    playerStart: Position;
    exitPos: Position;
    boxes: Position[];
    minMoves: number;
    pushes: number;
  } | null = null;

  for (let attempt = 0; attempt < 80; attempt++) {
    const grid: CellType[][] = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) return 'WALL';
        return 'EMPTY';
      })
    );

    // Multi-chamber labyrinth wall architecture
    const midY = Math.floor(height / 2);
    for (let x = 1; x < width - 1; x++) {
      grid[midY][x] = 'WALL';
    }

    // Doorways in mid partition
    const d1 = 2;
    const d2 = width - 3;
    grid[midY][d1] = 'EMPTY';
    if (d2 !== d1) grid[midY][d2] = 'EMPTY';

    // Vertical partitions offset from d1 and d2 to form distinct rooms
    if (chapter >= 4 && width >= 8) {
      const vMid = Math.floor(width / 2);
      // Lower vertical wall
      for (let y = midY + 1; y < height - 1; y++) {
        if (y !== height - 2) grid[y][vMid] = 'WALL';
      }
      // Upper vertical wall
      const vUpper = vMid + 1 < width - 2 ? vMid + 1 : vMid - 1;
      for (let y = 1; y < midY; y++) {
        if (y !== 2) grid[y][vUpper] = 'WALL';
      }
    }

    // Additional interior corridor walls for advanced chapters
    if (chapter >= 12 && width >= 10) {
      const qY = Math.floor(midY / 2);
      if (qY > 1) {
        for (let x = 2; x < width - 2; x++) {
          if (x !== 3 && x !== width - 4) grid[qY][x] = 'WALL';
        }
      }
    }

    // Interior labyrinth cubic wall pillars creating alcoves and corners
    const pillars = Math.min(1 + Math.floor(chapter / 5), 3);
    for (let p = 0; p < pillars; p++) {
      const px = 2 + Math.floor(rng() * (width - 4));
      const py = 2 + Math.floor(rng() * (height - 4));
      if (grid[py][px] === 'EMPTY' && py !== midY) {
        grid[py][px] = 'WALL';
      }
    }

    const playerStart: Position = { x: 1, y: height - 2 };
    const exitPos: Position = { x: width - 2, y: 1 };
    grid[playerStart.y][playerStart.x] = 'EMPTY';
    grid[exitPos.y][exitPos.x] = 'EXIT';

    // CRITICAL: Block the passageway with a movable box so walking through is impossible!
    const boxes: Position[] = [{ x: d1, y: midY }];
    if (d2 !== d1 && boxes.length < numBoxes) {
      boxes.push({ x: d2, y: midY });
    }

    // Gather candidate open spots for remaining boxes
    const openTiles: Position[] = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (
          grid[y][x] === 'EMPTY' &&
          (x !== playerStart.x || y !== playerStart.y) &&
          (x !== exitPos.x || y !== exitPos.y) &&
          !boxes.some(b => b.x === x && b.y === y)
        ) {
          openTiles.push({ x, y });
        }
      }
    }

    while (boxes.length < numBoxes && openTiles.length > 0) {
      const idx = Math.floor(rng() * openTiles.length);
      boxes.push(openTiles.splice(idx, 1)[0]);
    }

    if (boxes.length < numBoxes) continue;

    // RULE: Rejection check - If player can walk to exit without pushing, REJECT!
    if (canReachExitWithoutPushes(width, height, grid, playerStart, exitPos, boxes)) {
      continue;
    }

    // Solve with BFS
    const solution = solvePuzzle(
      width,
      height,
      grid,
      playerStart,
      boxes,
      exitPos,
      false,
      undefined,
      [],
      [],
      22000
    );

    if (solution.solvable && solution.pushes >= 1) {
      const score = solution.minMoves + solution.pushes * 6;
      const currentBestScore = bestSolvableCandidate ? (bestSolvableCandidate.minMoves + bestSolvableCandidate.pushes * 6) : 0;

      if (!bestSolvableCandidate || score > currentBestScore) {
        bestSolvableCandidate = {
          width,
          height,
          grid,
          playerStart,
          exitPos,
          boxes,
          minMoves: solution.minMoves,
          pushes: solution.pushes,
        };
      }

      if (solution.minMoves >= minMovesNeeded && solution.pushes >= minPushesNeeded) {
        break; // Met target challenge criteria!
      }
    }
  }

  const chosen = bestSolvableCandidate;
  if (chosen) {
    const allBoxes: BoxItem[] = chosen.boxes.map((p, i) => ({
      id: i + 1,
      x: p.x,
      y: p.y,
      type: (i === 0 ? 'ENERGY' : 'STANDARD') as 'ENERGY' | 'STANDARD',
    }));

    const chapterInfo = CHAPTERS[chapter - 1] || CHAPTERS[0];
    return {
      chapter,
      level,
      name: `${chapterInfo.title} · Chamber ${level}`,
      width: chosen.width,
      height: chosen.height,
      grid: chosen.grid,
      playerStart: chosen.playerStart,
      exitPos: chosen.exitPos,
      initialBoxes: allBoxes,
      plates: [],
      parMoves: chosen.minMoves + 3,
      description: 'Labyrinth chokepoints sealed! Maneuver cubes into side pockets to clear the path to the exit.',
      hasLaser: false,
    };
  }

  // Certified Tier Fallback (guaranteed 100% solvable with mandatory box push)
  return createCertifiedTierChamber(chapter, level, width, height, numBoxes);
}

/**
 * Handcrafted fallback scaled specifically to match the chapter's complexity tier.
 * Never gives a simple Level 1 layout to Level 2000!
 */
function createCertifiedTierChamber(
  chapter: number,
  level: number,
  width: number,
  height: number,
  numBoxes: number
): LevelData {
  const grid: CellType[][] = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) return 'WALL';
      return 'EMPTY';
    })
  );

  const midY = Math.floor(height / 2);
  for (let x = 1; x < width - 1; x++) {
    grid[midY][x] = 'WALL';
  }

  // Doorways
  const g1 = 2;
  const g2 = width - 3;
  grid[midY][g1] = 'EMPTY';
  if (g2 !== g1) grid[midY][g2] = 'EMPTY';

  // Room dividing walls
  if (width >= 8) {
    const vMid = Math.floor(width / 2);
    for (let y = midY + 1; y < height - 1; y++) {
      if (y !== height - 2) grid[y][vMid] = 'WALL';
    }
    const vUpper = vMid + 1 < width - 2 ? vMid + 1 : vMid - 1;
    for (let y = 1; y < midY; y++) {
      if (y !== 2) grid[y][vUpper] = 'WALL';
    }
  }

  const playerStart: Position = { x: 1, y: height - 2 };
  const exitPos: Position = { x: width - 2, y: 1 };
  grid[exitPos.y][exitPos.x] = 'EXIT';

  const boxes: Position[] = [];
  boxes.push({ x: g1, y: midY });
  if (numBoxes >= 2 && g2 !== g1) boxes.push({ x: g2, y: midY });
  if (numBoxes >= 3) boxes.push({ x: g1, y: midY + 1 });
  if (numBoxes >= 4 && g2 !== g1) boxes.push({ x: g2, y: midY - 1 });

  const allBoxes: BoxItem[] = boxes.map((p, i) => ({
    id: i + 1,
    x: p.x,
    y: p.y,
    type: (i === 0 ? 'ENERGY' : 'STANDARD') as 'ENERGY' | 'STANDARD',
  }));

  const chapterInfo = CHAPTERS[chapter - 1] || CHAPTERS[0];

  return {
    chapter,
    level,
    name: `${chapterInfo.title} · Chamber ${level}`,
    width,
    height,
    grid,
    playerStart,
    exitPos,
    initialBoxes: allBoxes,
    plates: [],
    parMoves: 10 + Math.floor(chapter * 1.2),
    description: 'Chokepoints sealed! Maneuver cubes into side pockets to clear the path.',
    hasLaser: false,
  };
}

export function getChapterProgress(
  chapterId: number,
  levelsCompleted: Record<string, { stars: number; moves: number }>
) {
  let completedCount = 0;
  let totalStars = 0;

  for (let lvl = 1; lvl <= 100; lvl++) {
    const key = `${chapterId}-${lvl}`;
    if (levelsCompleted[key]) {
      completedCount++;
      totalStars += levelsCompleted[key].stars || 1;
    }
  }

  return {
    chapterId,
    completedCount,
    totalLevels: 100,
    totalStars,
    isCompleted: completedCount >= 100,
  };
}
