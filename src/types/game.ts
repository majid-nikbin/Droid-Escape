export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type CellType = 
  | 'EMPTY' 
  | 'WALL' 
  | 'EXIT' 
  | 'PLATE'        // Pressure plate / target socket
  | 'LASER_OFF'    // Inactive laser gate
  | 'LASER_ON'     // Active laser barrier (blocks movement unless plate is pressed)
  | 'PORTAL_A'     // Wormhole portal A
  | 'PORTAL_B';    // Wormhole portal B

export interface BoxItem {
  id: number;
  x: number;
  y: number;
  type?: 'STANDARD' | 'HEAVY' | 'ENERGY' | 'FIXED';
}

export interface LevelData {
  chapter: number;
  level: number;
  name: string;
  width: number;
  height: number;
  grid: CellType[][];
  playerStart: Position;
  exitPos: Position;
  initialBoxes: BoxItem[];
  plates: Position[];
  parMoves: number;
  description?: string;
  hasLaser?: boolean;
  laserPos?: Position;
  portalA?: Position;
  portalB?: Position;
}

export interface ChapterInfo {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  accentColor: string;
  theme: 'lab' | 'silicon' | 'cyber' | 'quantum' | 'neon' | 'core' | 'void';
}

export interface MoveStep {
  playerFrom: Position;
  playerTo: Position;
  boxMoved?: {
    id: number;
    from: Position;
    to: Position;
  };
}

export interface SolutionPushStep {
  pushNumber: number;
  boxIdx: number;
  from: Position;
  to: Position;
  dir: Direction;
  playerApproachPos: Position;
}


export interface UserProgress {
  currentChapter: number;
  currentLevel: number; // 1-100
  points: number;       // 1 point per completed level
  helpsRemaining: number; // starts with 3
  levelsCompleted: Record<string, { stars: number; moves: number; completedAt: number }>; // key: "ch-lvl"
  unlockedChapter: number;
  highestLevelCompleted: number; // total count across all chapters
  stats: {
    totalBoxesMoved: number;
    totalMovesTaken: number;
    hintsUsed: number;
  };
}

export interface SoundSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number; // 0 to 1
  hapticsEnabled: boolean;
}

export type ScreenState = 
  | 'MAIN_MENU'
  | 'PLAYING'
  | 'CHAPTER_SELECT'
  | 'LEVEL_SELECT'
  | 'SHOP'
  | 'SETTINGS';
