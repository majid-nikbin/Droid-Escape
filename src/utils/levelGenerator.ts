import { ChapterInfo, LevelData, CellType, Position, BoxItem } from '../types/game';
import { solvePuzzle } from './puzzleSolver';

export const CHAPTERS: ChapterInfo[] = [
  { id: 1, title: 'Neon Laboratory', subtitle: 'Twin Chamber Gateways', color: 'from-emerald-500 to-teal-700', accentColor: '#10B981', theme: 'lab' },
  { id: 2, title: 'Silicon Foundry', subtitle: 'Island Baffle Mazes', color: 'from-cyan-500 to-blue-700', accentColor: '#06B6D4', theme: 'silicon' },
  { id: 3, title: 'Magnetic Core', subtitle: 'Dual Corridor Bottlenecks', color: 'from-violet-500 to-purple-800', accentColor: '#8B5CF6', theme: 'cyber' },
  { id: 4, title: 'Cyber Matrix', subtitle: 'Tri-Chamber S-Labyrinth', color: 'from-amber-500 to-orange-700', accentColor: '#F59E0B', theme: 'neon' },
  { id: 5, title: 'Circuit Bastion', subtitle: 'Interior Wall Obstacles', color: 'from-blue-500 to-indigo-800', accentColor: '#3B82F6', theme: 'core' },
  { id: 6, title: 'Quantum Nexus', subtitle: 'Sequential Baffle Labyrinths', color: 'from-rose-500 to-red-800', accentColor: '#F43F5E', theme: 'quantum' },
  { id: 7, title: 'Crystal Cavern', subtitle: 'Tight Squeeze Chokepoints', color: 'from-fuchsia-500 to-pink-800', accentColor: '#D946EF', theme: 'lab' },
  { id: 8, title: 'Plasma Reactor', subtitle: 'Multi-Room Spatial Logic', color: 'from-yellow-500 to-amber-700', accentColor: '#EAB308', theme: 'core' },
  { id: 9, title: 'Sub-Zero Sector', subtitle: '4-Quadrant Serpentine Loop', color: 'from-sky-400 to-cyan-700', accentColor: '#38BDF8', theme: 'silicon' },
  { id: 10, title: 'Orbital Vault', subtitle: 'Perimeter Serpentine Mazes', color: 'from-indigo-400 to-violet-800', accentColor: '#6366F1', theme: 'void' },
  { id: 11, title: 'Nano Nexus', subtitle: 'Quadrant Trap Routing', color: 'from-emerald-400 to-teal-800', accentColor: '#34D399', theme: 'lab' },
  { id: 12, title: 'Graviton Loop', subtitle: 'Cross-Corridor Wall Baffles', color: 'from-purple-500 to-indigo-900', accentColor: '#A855F7', theme: 'quantum' },
  { id: 13, title: 'Solar Array', subtitle: 'Dense Gateway Sequences', color: 'from-amber-400 to-orange-800', accentColor: '#FB923C', theme: 'neon' },
  { id: 14, title: 'Flux Conduits', subtitle: 'Multi-Stage Corridor Chains', color: 'from-rose-400 to-red-900', accentColor: '#FB7185', theme: 'cyber' },
  { id: 15, title: 'Wormhole Matrix', subtitle: '6-Chamber Fortress Labyrinth', color: 'from-cyan-400 to-blue-900', accentColor: '#22D3EE', theme: 'quantum' },
  { id: 16, title: 'Dark Matter Lab', subtitle: 'Hexa-Room Wall Architecture', color: 'from-slate-400 to-slate-800', accentColor: '#94A3B8', theme: 'void' },
  { id: 17, title: 'Hyperdrive Core', subtitle: 'Grandmaster Winding Fortress', color: 'from-teal-400 to-emerald-900', accentColor: '#2DD4BF', theme: 'core' },
  { id: 18, title: 'Void Bastion', subtitle: 'Advanced Spatial Strategy', color: 'from-violet-600 to-slate-900', accentColor: '#7C3AED', theme: 'void' },
  { id: 19, title: 'Singularity Rift', subtitle: 'Extreme Multi-Chamber Logic', color: 'from-pink-500 to-purple-950', accentColor: '#EC4899', theme: 'quantum' },
  { id: 20, title: 'Master Mainframe', subtitle: 'Ultimate Android Brain Teaser', color: 'from-amber-300 via-rose-500 to-purple-900', accentColor: '#F43F5E', theme: 'core' },
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
 * Procedurally generates challenging labyrinth chamber puzzles with guaranteed progression & Hardcore Pro mode:
 * - NO artificial clutter, NO lasers, NO immovable fixed boxes
 * - All structural complexity is created by labyrinth walls (چینش دیوارهای مکعبی داخل بازی)
 * - Sequential room architecture:
 *   - Chapters 1-3 (7x7): 2-room chamber with interior wall islands
 *   - Chapters 4-8 (8x8/9x9): 3-room S-Labyrinth with interior baffles
 *   - Chapters 9-14 (10x10): 4-Quadrant Serpentine Loop with quadrant baffles
 *   - Chapters 15-20 (11x11, Level 2000): 6-Chamber Grandmaster Fortress with 8 interior wall baffles
 */
export function generateLevel(chapter: number, level: number, isHardcore = false): LevelData {
  const seed = chapter * 7919 + level * 997 + (isHardcore ? 8831 : 1337);
  const rng = createRng(seed);

  let width = 7;
  let height = 7;
  let grid: CellType[][];
  let playerStart: Position;
  let exitPos: Position;
  let boxCoords: Position[] = [];
  let description = '';

  if (chapter <= 3 && !isHardcore) {
    // TIER 1 STANDARD: 2-Room Gateway Chamber (7x7)
    width = 7;
    height = 7;
    grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1) ? 'WALL' : 'EMPTY')
    );
    const midY = 3;
    const doorX = 2 + (level % 2); // 2 or 3
    for (let x = 1; x < width - 1; x++) {
      if (x !== doorX && x !== doorX + 1) grid[midY][x] = 'WALL';
    }
    // Interior wall island
    const islandX = doorX === 2 ? 4 : 1;
    if (islandX > 1 && islandX < 5) {
      if (chapter >= 2 || level > 25) grid[5][islandX] = 'WALL';
      if (chapter >= 2 || level > 50) grid[1][islandX] = 'WALL';
    }

    playerStart = { x: 1, y: height - 2 };
    exitPos = { x: width - 2, y: 1 };
    grid[exitPos.y][exitPos.x] = 'EXIT';

    boxCoords = [{ x: doorX, y: midY }];
    if (chapter >= 2 || level > 40) {
      boxCoords.push({ x: width - 3, y: height - 3 });
    }
    description = 'Twin chamber gateway! Push the cube into the open area to unseal the doorway.';
  } else if (chapter <= 3 && isHardcore) {
    // TIER 1 HARDCORE: Sealed perimeter shortcuts + 2 mandatory push boxes
    width = 7;
    height = 7;
    grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1) ? 'WALL' : 'EMPTY')
    );
    const midY = 3;
    const doorX = 2;
    for (let x = 1; x < width - 1; x++) {
      if (x !== doorX && x !== doorX + 1) grid[midY][x] = 'WALL';
    }
    grid[5][4] = 'WALL';
    grid[1][4] = 'WALL';
    grid[4][1] = 'WALL'; // block left shortcut

    playerStart = { x: 1, y: height - 2 };
    exitPos = { x: width - 2, y: 1 };
    grid[exitPos.y][exitPos.x] = 'EXIT';

    boxCoords = [
      { x: doorX, y: midY },
      { x: width - 3, y: height - 3 },
    ];
    description = 'HARDCORE TIER: Perimeter sealed! Maneuver both cubes methodically through the corridor choke.';
  } else if (chapter <= 8) {
    // TIER 2: 3-Room S-Labyrinth (8x8 / 9x9)
    width = (chapter <= 5 && !isHardcore) ? 8 : 9;
    height = width;
    grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1) ? 'WALL' : 'EMPTY')
    );
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);

    for (let y = midY + 1; y < height - 1; y++) grid[y][midX] = 'WALL';
    for (let x = 1; x < width - 1; x++) grid[midY][x] = 'WALL';

    const d1Y = height - 2;
    grid[d1Y][midX] = 'EMPTY';
    const d2X = width - 2;
    grid[midY][d2X] = 'EMPTY';

    // Interior baffles
    if (chapter >= 6 || level > 30 || isHardcore) {
      grid[height - 3][2] = 'WALL';
      grid[2][width - 3] = 'WALL';
    }
    if (isHardcore) {
      grid[height - 3][1] = 'WALL'; // seal left perimeter
      grid[1][width - 3] = 'WALL';  // seal top perimeter
    }

    playerStart = { x: 1, y: height - 2 };
    exitPos = { x: 1, y: 1 };
    grid[exitPos.y][exitPos.x] = 'EXIT';

    boxCoords = [
      { x: midX, y: d1Y },
      { x: d2X, y: midY },
    ];
    if (chapter >= 7 || level > 50 || isHardcore) {
      boxCoords.push({ x: width - 2, y: height - 3 });
    }
    description = isHardcore
      ? 'HARDCORE S-LABYRINTH: Tight squeeze corridors with zero perimeter escape!'
      : 'S-Curve labyrinth! Clear Room 1 and Room 2 sequentially to navigate toward the upper exit.';
  } else if (chapter <= 14) {
    // TIER 3: 4-Quadrant Serpentine Loop (10x10)
    width = 10;
    height = 10;
    grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1) ? 'WALL' : 'EMPTY')
    );
    const midX = 5;
    const midY = 5;

    for (let x = 1; x < width - 1; x++) grid[midY][x] = 'WALL';
    for (let y = 1; y < height - 1; y++) grid[y][midX] = 'WALL';

    const d1Y = height - 2;
    grid[d1Y][midX] = 'EMPTY';

    const d2X = width - 2;
    grid[midY][d2X] = 'EMPTY';

    const d3Y = 2;
    grid[d3Y][midX] = 'EMPTY';

    // Interior wall baffles in quadrants
    grid[7][2] = 'WALL';
    grid[7][7] = 'WALL';
    grid[3][7] = 'WALL';
    grid[3][2] = 'WALL';

    if (isHardcore) {
      grid[5][1] = 'WALL';
      grid[1][5] = 'WALL';
    }

    playerStart = { x: 2, y: height - 2 };
    exitPos = { x: 2, y: 2 };
    grid[exitPos.y][exitPos.x] = 'EXIT';

    boxCoords = [
      { x: midX, y: d1Y },
      { x: d2X, y: midY },
      { x: midX, y: d3Y },
    ];
    description = isHardcore
      ? 'HARDCORE 4-QUADRANT LOOP: Severe maze bottlenecks requiring deep forward planning.'
      : '4-Quadrant Serpentine Loop! Navigate through all 4 quadrants in sequence to reach the exit portal.';
  } else {
    // TIER 4: 6-Room Grandmaster Labyrinth (11x11, Level 2000!)
    width = 11;
    height = 11;
    grid = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => (x === 0 || x === width - 1 || y === 0 || y === height - 1) ? 'WALL' : 'EMPTY')
    );
    const midY = 5;
    const v1 = 3;
    const v2 = 7;

    for (let x = 1; x < width - 1; x++) grid[midY][x] = 'WALL';
    for (let y = 1; y < height - 1; y++) {
      grid[y][v1] = 'WALL';
      grid[y][v2] = 'WALL';
    }

    // Door 1: Ch 1 -> Ch 2 at (3, 8)
    grid[8][v1] = 'EMPTY';
    // Door 2: Ch 2 -> Ch 3 at (7, 8)
    grid[8][v2] = 'EMPTY';
    // Door 3: Ch 3 -> Ch 4 at (9, 5)
    grid[midY][9] = 'EMPTY';
    // Door 4: Ch 4 -> Ch 5 at (7, 2)
    grid[2][v2] = 'EMPTY';
    // Door 5: Ch 5 -> Ch 6 at (3, 2)
    grid[2][v1] = 'EMPTY';

    // 8 Interior Cubic Wall Baffles inside each chamber (چینش دیوارهای مکعبی)!
    grid[7][2] = 'WALL';
    grid[9][5] = 'WALL';
    grid[7][5] = 'WALL';
    grid[9][8] = 'WALL';
    grid[3][8] = 'WALL';
    grid[1][5] = 'WALL';
    grid[3][5] = 'WALL';
    grid[3][2] = 'WALL';

    if (isHardcore) {
      grid[5][1] = 'WALL';
      grid[1][9] = 'WALL';
    }

    playerStart = { x: 1, y: height - 2 };
    exitPos = { x: 1, y: 1 };
    grid[exitPos.y][exitPos.x] = 'EXIT';

    boxCoords = [
      { x: v1, y: 8 },
      { x: v2, y: 8 },
      { x: 9, y: midY },
      { x: v2, y: 2 },
      { x: v1, y: 2 },
    ];
    description = isHardcore
      ? 'ULTIMATE HARDCORE MAINFRAME: Maximum complexity 6-chamber fortress with 8 interlocking wall baffles.'
      : '6-Room Grandmaster Labyrinth! Traverse all 6 sequential chambers and methodically maneuver cubes through the wall corridors to reach the mainframe.';
  }

  // Pre-calculate par moves with verified solver
  const sol = solvePuzzle(width, height, grid, playerStart, boxCoords, exitPos, false, undefined, [], [], 100000);
  const parMoves = sol.solvable ? sol.minMoves + 4 : 14 + Math.floor(chapter * 1.6);

  const allBoxes: BoxItem[] = boxCoords.map((p, i) => ({
    id: i + 1,
    x: p.x,
    y: p.y,
    type: (i === 0 ? 'ENERGY' : 'STANDARD') as 'ENERGY' | 'STANDARD',
  }));

  const chapterInfo = CHAPTERS[chapter - 1] || CHAPTERS[0];

  return {
    chapter,
    level,
    name: `${chapterInfo.title} · Chamber ${level}${isHardcore ? ' (PRO)' : ''}`,
    width,
    height,
    grid,
    playerStart,
    exitPos,
    initialBoxes: allBoxes,
    plates: [],
    parMoves,
    description,
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
