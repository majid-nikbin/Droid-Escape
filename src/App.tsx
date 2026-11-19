import React, { useState, useEffect, useRef, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Play, Pause, X, StepForward, RotateCcw, Lightbulb, Zap, Lock, DoorOpen } from 'lucide-react';
import { 
  Direction, 
  LevelData, 
  Position, 
  BoxItem, 
  UserProgress, 
  SoundSettings, 
  ScreenState,
  MoveStep,
  SolutionPushStep 
} from './types/game';
import { generateLevel, CHAPTERS } from './utils/levelGenerator';
import { solvePuzzle, isBoxDeadlocked, findWalkPath } from './utils/puzzleSolver';
import { sound } from './utils/audio';
import { GameBoard, HintStep } from './components/GameBoard';
import { DPadControls } from './components/DPadControls';
import { TopBar } from './components/TopBar';
import { MainMenu } from './components/MainMenu';
import { ChapterSelectModal } from './components/ChapterSelectModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { AboutModal, CURRENT_APP_VERSION } from './components/AboutModal';
import { Toast } from './components/Toast';

const PROGRESS_STORAGE_KEY = 'droid_escape_progress_v1';
const SOUND_STORAGE_KEY = 'droid_escape_sound_v1';
const HARDCORE_STORAGE_KEY = 'droid_escape_hardcore_mode_v1';

const INITIAL_PROGRESS: UserProgress = {
  currentChapter: 1,
  currentLevel: 1,
  points: 0,
  helpsRemaining: 3, // Starts with 3 hints as requested
  levelsCompleted: {},
  unlockedChapter: 1,
  highestLevelCompleted: 0,
  stats: {
    totalBoxesMoved: 0,
    totalMovesTaken: 0,
    hintsUsed: 0,
  },
};

const INITIAL_SOUND: SoundSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  volume: 0.8,
  hapticsEnabled: true,
};

export default function App() {
  // Screen routing state
  const [screen, setScreen] = useState<ScreenState>('MAIN_MENU');
  const [returnScreen, setReturnScreen] = useState<'MAIN_MENU' | 'PLAYING'>('MAIN_MENU');
  const [selectedChapterForLevels, setSelectedChapterForLevels] = useState<number>(1);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Persistent Player Progress & Settings
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_PROGRESS;
  });

  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    try {
      const saved = localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_SOUND;
  });

  const [isHardcore, setIsHardcore] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HARDCORE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Current Level Gameplay State
  const [levelData, setLevelData] = useState<LevelData>(() =>
    generateLevel(progress.currentChapter, progress.currentLevel, localStorage.getItem(HARDCORE_STORAGE_KEY) === 'true')
  );
  const [playerPos, setPlayerPos] = useState<Position>(levelData.playerStart);
  const [playerDir, setPlayerDir] = useState<Direction>('DOWN');
  const [boxes, setBoxes] = useState<BoxItem[]>(levelData.initialBoxes);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<MoveStep[]>([]);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isVictorious, setIsVictorious] = useState<boolean>(false);
  const [hintSteps, setHintSteps] = useState<HintStep[]>([]);
  const [solutionPushes, setSolutionPushes] = useState<SolutionPushStep[]>([]);
  const [activePushIndex, setActivePushIndex] = useState<number>(0);
  const [autoWalkTarget, setAutoWalkTarget] = useState<Position | null>(null);
  const [laserActive, setLaserActive] = useState<boolean>(false);

  // Solution Auto-Play State
  const [fullSolutionMoves, setFullSolutionMoves] = useState<Direction[]>([]);
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(0);
  const [isSolutionAutoPlaying, setIsSolutionAutoPlaying] = useState<boolean>(false);
  const solutionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoWalkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronous refs to prevent React closure staleness during timers
  const playerPosRef = useRef<Position>(playerPos);
  const boxesRef = useRef<BoxItem[]>(boxes);
  const movesCountRef = useRef<number>(movesCount);
  const isVictoriousRef = useRef<boolean>(isVictorious);
  const fullSolutionMovesRef = useRef<Direction[]>([]);
  const solutionPushesRef = useRef<SolutionPushStep[]>([]);
  const activePushIndexRef = useRef<number>(0);
  const solutionStepIdxRef = useRef<number>(0);
  const unlockedHintKeyRef = useRef<string | null>(null);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    boxesRef.current = boxes;
  }, [boxes]);

  useEffect(() => {
    movesCountRef.current = movesCount;
  }, [movesCount]);

  useEffect(() => {
    isVictoriousRef.current = isVictorious;
  }, [isVictorious]);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'warning' | 'success'>('info');
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string, type: 'info' | 'warning' | 'success' = 'info', duration = 2200) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    setToastType(type);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, duration);
  }, []);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  // Sync sound settings with audio engine
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundSettings));
      sound.updateSettings(soundSettings);
    } catch {
      // Ignore
    }
  }, [soundSettings]);

  // Check Laser barrier status
  useEffect(() => {
    if (levelData.hasLaser && levelData.plates.length > 0) {
      const isAnyPlateCovered = levelData.plates.some(pl =>
        boxes.some(b => b.x === pl.x && b.y === pl.y) ||
        (playerPos.x === pl.x && playerPos.y === pl.y)
      );
      setLaserActive(!isAnyPlateCovered);
    } else {
      setLaserActive(false);
    }
  }, [levelData, boxes, playerPos]);

  // Load level helper
  const loadChamber = useCallback((chapter: number, level: number, hardcoreOverride?: boolean) => {
    if (solutionTimerRef.current) {
      clearInterval(solutionTimerRef.current);
      solutionTimerRef.current = null;
    }
    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
    }
    fullSolutionMovesRef.current = [];
    solutionPushesRef.current = [];
    activePushIndexRef.current = 0;
    solutionStepIdxRef.current = 0;
    unlockedHintKeyRef.current = null;
    setFullSolutionMoves([]);
    setSolutionPushes([]);
    setActivePushIndex(0);
    setSolutionStepIndex(0);
    setIsSolutionAutoPlaying(false);
    setAutoWalkTarget(null);

    const activeHardcore = hardcoreOverride !== undefined ? hardcoreOverride : isHardcore;
    const newLvl = generateLevel(chapter, level, activeHardcore);
    setLevelData(newLvl);
    setPlayerPos(newLvl.playerStart);
    playerPosRef.current = newLvl.playerStart;
    setPlayerDir('DOWN');
    setBoxes(newLvl.initialBoxes);
    boxesRef.current = newLvl.initialBoxes;
    setMovesCount(0);
    movesCountRef.current = 0;
    setMoveHistory([]);
    setIsMoving(false);
    setIsVictorious(false);
    isVictoriousRef.current = false;
    setHintSteps([]);

    // Save as current position for resume functionality
    setProgress(prev => ({
      ...prev,
      currentChapter: chapter,
      currentLevel: level,
    }));
  }, [isHardcore]);

  // Toggle Pro Hardcore Mode
  const toggleHardcore = useCallback(() => {
    setIsHardcore(prev => {
      const next = !prev;
      try {
        localStorage.setItem(HARDCORE_STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      loadChamber(levelData.chapter, levelData.level, next);
      showToast(
        next ? 'PRO MODE: Maximum Complexity' : 'NORMAL MODE: Standard Challenge',
        next ? 'warning' : 'info',
        2000
      );
      return next;
    });
  }, [levelData.chapter, levelData.level, loadChamber, showToast]);

  // Handle Android Hardware Back Button
  const lastBackPressTimeRef = useRef<number>(0);
  const handleBackAction = useCallback(() => {
    if (isAboutOpen) {
      setIsAboutOpen(false);
      return;
    }

    if (screen === 'LEVEL_SELECT') {
      setScreen('CHAPTER_SELECT');
      return;
    }

    if (screen === 'CHAPTER_SELECT') {
      setScreen(returnScreen);
      return;
    }

    if (screen === 'SHOP' || screen === 'SETTINGS') {
      setScreen(returnScreen);
      return;
    }

    if (screen === 'PLAYING') {
      if (solutionTimerRef.current) {
        clearInterval(solutionTimerRef.current);
        solutionTimerRef.current = null;
        setIsSolutionAutoPlaying(false);
      }
      if (autoWalkTimerRef.current) {
        clearInterval(autoWalkTimerRef.current);
        autoWalkTimerRef.current = null;
        setAutoWalkTarget(null);
      }
      setScreen('MAIN_MENU');
      return;
    }

    if (screen === 'MAIN_MENU') {
      const now = Date.now();
      if (now - lastBackPressTimeRef.current < 2000) {
        try {
          CapApp.exitApp();
        } catch {
          // Fallback
        }
      } else {
        lastBackPressTimeRef.current = now;
        showToast('Press Back once more to exit', 'info', 2000);
      }
    }
  }, [isAboutOpen, screen, returnScreen, showToast]);

  useEffect(() => {
    let backListenerHandle: { remove: () => void } | null = null;
    try {
      CapApp.addListener('backButton', () => {
        handleBackAction();
      }).then(handle => {
        backListenerHandle = handle;
      });
    } catch {
      // Web browser fallback
    }

    window.history.pushState({ page: 'game' }, '');
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState({ page: 'game' }, '');
      handleBackAction();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      if (backListenerHandle) backListenerHandle.remove();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBackAction]);

  // Check whether all target power sockets/plates have cores docked on them
  const allPlatesCovered = levelData.plates.length === 0 || levelData.plates.every(pl =>
    boxes.some(b => b.x === pl.x && b.y === pl.y)
  );
  const coveredPlatesCount = levelData.plates.filter(pl =>
    boxes.some(b => b.x === pl.x && b.y === pl.y)
  ).length;

  // Handle Chamber Victory
  const handleChamberVictory = useCallback((finalMoves: number) => {
    if (isVictoriousRef.current) return;
    setIsVictorious(true);
    isVictoriousRef.current = true;
    sound.playVictory();

    const currentKey = `${levelData.chapter}-${levelData.level}`;
    const stars = finalMoves <= levelData.parMoves ? 3 : finalMoves <= levelData.parMoves + 4 ? 2 : 1;

    // Award +1 point per completed level
    setProgress(prev => {
      const newPoints = prev.points + 1;
      const newCompleted = {
        ...prev.levelsCompleted,
        [currentKey]: {
          stars: Math.max(stars, prev.levelsCompleted[currentKey]?.stars || 0),
          moves: finalMoves,
          completedAt: Date.now(),
        },
      };

      const highestCount = Object.keys(newCompleted).length;
      const nextUnlocked = Math.min(20, Math.floor(highestCount / 5) + 1);

      return {
        ...prev,
        points: newPoints,
        levelsCompleted: newCompleted,
        unlockedChapter: Math.max(prev.unlockedChapter, nextUnlocked),
        highestLevelCompleted: Math.max(prev.highestLevelCompleted, highestCount),
      };
    });
  }, [levelData]);

  // Build droid approach path arrows toward the current active solution push
  const buildApproachHintSteps = useCallback((
    startP: Position,
    pushStep: SolutionPushStep | undefined,
    currentBoxes: BoxItem[]
  ): HintStep[] => {
    if (!pushStep) return [];
    const movable = currentBoxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const fixed = currentBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const walk = findWalkPath(
      levelData.width,
      levelData.height,
      levelData.grid,
      startP,
      pushStep.playerApproachPos,
      movable,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixed
    );
    if (!walk || walk.length === 0) return [];
    const deltaMap: Record<Direction, { dx: number; dy: number }> = {
      UP: { dx: 0, dy: -1 },
      DOWN: { dx: 0, dy: 1 },
      LEFT: { dx: -1, dy: 0 },
      RIGHT: { dx: 1, dy: 0 },
    };
    const steps: HintStep[] = [];
    let cur = { ...startP };
    for (let i = 0; i < walk.length; i++) {
      const d = deltaMap[walk[i]];
      cur = { x: cur.x + d.dx, y: cur.y + d.dy };
      steps.push({ x: cur.x, y: cur.y, dir: walk[i], step: i + 1 });
    }
    return steps;
  }, [levelData]);

  // Execute Player Movement & Box Pushing
  const handleMove = useCallback((dir: Direction): boolean => {
    if (isVictoriousRef.current) return false;

    const currentP = playerPosRef.current;
    const currentBoxes = boxesRef.current;

    const currentLaserActive =
      levelData.hasLaser &&
      levelData.plates.length > 0 &&
      !levelData.plates.some(
        pl =>
          currentBoxes.some(b => b.x === pl.x && b.y === pl.y) ||
          (currentP.x === pl.x && currentP.y === pl.y)
      );

    const delta = {
      UP: { dx: 0, dy: -1 },
      DOWN: { dx: 0, dy: 1 },
      LEFT: { dx: -1, dy: 0 },
      RIGHT: { dx: 1, dy: 0 },
    }[dir];

    setPlayerDir(dir);
    const targetX = currentP.x + delta.dx;
    const targetY = currentP.y + delta.dy;

    // 1. Grid boundary check
    if (targetX < 0 || targetX >= levelData.width || targetY < 0 || targetY >= levelData.height) {
      sound.playBump();
      return false;
    }

    // 2. Wall check
    if (levelData.grid[targetY][targetX] === 'WALL') {
      sound.playBump();
      return false;
    }

    // 3. Laser check
    if (currentLaserActive && levelData.laserPos && targetX === levelData.laserPos.x && targetY === levelData.laserPos.y) {
      sound.playBump();
      showToast('Laser barrier active! Push a core onto the switch.', 'warning');
      return false;
    }

    // 4. Exit portal lock check
    const isExitTile = targetX === levelData.exitPos.x && targetY === levelData.exitPos.y;
    const currentAllCovered = levelData.plates.length === 0 || levelData.plates.every(pl =>
      currentBoxes.some(b => b.x === pl.x && b.y === pl.y)
    );

    if (isExitTile && !currentAllCovered) {
      sound.playBump();
      const covered = levelData.plates.filter(pl => currentBoxes.some(b => b.x === pl.x && b.y === pl.y)).length;
      showToast(`Exit locked! Dock all cores on target sockets (${covered}/${levelData.plates.length})`, 'warning', 2500);
      return false;
    }

    // 5. Box collision check
    const boxIndex = currentBoxes.findIndex(b => b.x === targetX && b.y === targetY);

    if (boxIndex !== -1) {
      const targetBox = currentBoxes[boxIndex];

      if (targetBox.type === 'FIXED') {
        sound.playBump();
        showToast('Fixed barrier! Cannot be moved.', 'warning', 1000);
        return false;
      }

      // Droid is pushing a movable cubic core
      const pushX = targetX + delta.dx;
      const pushY = targetY + delta.dy;

      // Check if space behind box is clear
      if (
        pushX < 0 ||
        pushX >= levelData.width ||
        pushY < 0 ||
        pushY >= levelData.height ||
        levelData.grid[pushY][pushX] === 'WALL' ||
        (pushX === levelData.exitPos.x && pushY === levelData.exitPos.y) ||
        (currentLaserActive && levelData.laserPos && pushX === levelData.laserPos.x && pushY === levelData.laserPos.y) ||
        currentBoxes.some(b => b.x === pushX && b.y === pushY)
      ) {
        sound.playBump();
        return false;
      }

      // Valid Box Push: Play the authentic KNOCK sound
      sound.playKnock();

      const pushedBox = currentBoxes[boxIndex];
      const newBoxes = currentBoxes.map((b, i) => (i === boxIndex ? { ...b, x: pushX, y: pushY } : b));
      const newPlayerPos = { x: targetX, y: targetY };

      const step: MoveStep = {
        playerFrom: { ...currentP },
        playerTo: newPlayerPos,
        boxMoved: {
          id: pushedBox.id,
          from: { x: targetX, y: targetY },
          to: { x: pushX, y: pushY },
        },
      };

      setMoveHistory(prev => [...prev, step]);
      setBoxes(newBoxes);
      boxesRef.current = newBoxes;
      setPlayerPos(newPlayerPos);
      playerPosRef.current = newPlayerPos;
      setMovesCount(m => m + 1);
      movesCountRef.current += 1;

      // Check if pushed box landed on a pressure plate
      if (levelData.plates.some(pl => pl.x === pushX && pl.y === pushY)) {
        sound.playPlateClick();
      }

      // Corner / rail deadlock check
      const fixedObs = newBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));
      if (isBoxDeadlocked({ x: pushX, y: pushY }, levelData.width, levelData.height, levelData.grid, levelData.plates, fixedObs, levelData.exitPos)) {
        showToast('Deadlock! Core trapped. Press Undo.', 'warning', 2500);
      }

      // Check if all plates just became energized
      const willAllCovered = levelData.plates.length > 0 && levelData.plates.every(pl =>
        newBoxes.some(b => b.x === pl.x && b.y === pl.y)
      );

      if (willAllCovered) {
        setHintSteps([]);
        showToast('All power cores docked! Chamber cleared!', 'success', 2500);
        setTimeout(() => {
          handleChamberVictory(movesCountRef.current);
        }, 400);
      } else if (solutionPushesRef.current.length > 0) {
        // Advance active push if matched, or refresh approach trail
        const idx = activePushIndexRef.current;
        const curPush = solutionPushesRef.current[idx];
        let nextIdx = idx;
        if (curPush && curPush.from.x === targetX && curPush.from.y === targetY && curPush.to.x === pushX && curPush.to.y === pushY) {
          nextIdx = Math.min(solutionPushesRef.current.length - 1, idx + 1);
          activePushIndexRef.current = nextIdx;
          setActivePushIndex(nextIdx);
        }
        setHintSteps(buildApproachHintSteps(newPlayerPos, solutionPushesRef.current[nextIdx], newBoxes));
      }

      setProgress(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalBoxesMoved: prev.stats.totalBoxesMoved + 1,
          totalMovesTaken: prev.stats.totalMovesTaken + 1,
        },
      }));

      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 120);

      return true;
    } else {
      // Step into empty cell
      sound.playStep();
      const newPlayerPos = { x: targetX, y: targetY };

      const step: MoveStep = {
        playerFrom: { ...currentP },
        playerTo: newPlayerPos,
      };

      setMoveHistory(prev => [...prev, step]);
      setPlayerPos(newPlayerPos);
      playerPosRef.current = newPlayerPos;
      setMovesCount(m => m + 1);
      movesCountRef.current += 1;

      if (solutionPushesRef.current.length > 0) {
        const curPush = solutionPushesRef.current[activePushIndexRef.current];
        setHintSteps(buildApproachHintSteps(newPlayerPos, curPush, currentBoxes));
      }

      setProgress(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalMovesTaken: prev.stats.totalMovesTaken + 1,
        },
      }));

      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 100);

      if (targetX === levelData.exitPos.x && targetY === levelData.exitPos.y) {
        handleChamberVictory(movesCountRef.current);
      }

      return true;
    }
  }, [levelData, showToast, handleChamberVictory, buildApproachHintSteps]);

  // Step intentionally towards a tapped square (adjacent step or directional push)
  const handleMoveToCell = useCallback((destX: number, destY: number) => {
    if (isVictoriousRef.current) return;

    const curP = playerPosRef.current;
    const dx = destX - curP.x;
    const dy = destY - curP.y;

    if (dx === 0 && dy === 0) return;

    // If directly adjacent: move 1 step directly into target (or push adjacent box)
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) handleMove('RIGHT');
      else if (dx === -1) handleMove('LEFT');
      else if (dy === 1) handleMove('DOWN');
      else if (dy === -1) handleMove('UP');
    }
  }, [handleMove]);

  // DOUBLE-CLICK / DOUBLE-TAP AUTO-WALK:
  // Paths the droid directly to any reachable cell with BFS so player doesn't have to step square-by-square!
  const handleAutoWalk = useCallback((destX: number, destY: number) => {
    if (isVictoriousRef.current) return;
    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
    }

    let targetX = destX;
    let targetY = destY;

    if (destX < 0 || destX >= levelData.width || destY < 0 || destY >= levelData.height) return;
    if (levelData.grid[destY]?.[destX] === 'WALL') return;

    // If tapped on a box: find the best adjacent walkable space around it
    const isTargetBox = boxesRef.current.some(b => b.x === destX && b.y === destY);
    const candidateTargets: Position[] = [];

    if (isTargetBox) {
      const adj = [
        { x: destX, y: destY - 1 },
        { x: destX, y: destY + 1 },
        { x: destX - 1, y: destY },
        { x: destX + 1, y: destY },
      ];
      for (const p of adj) {
        if (
          p.x >= 0 && p.x < levelData.width &&
          p.y >= 0 && p.y < levelData.height &&
          levelData.grid[p.y][p.x] !== 'WALL' &&
          !boxesRef.current.some(b => b.x === p.x && b.y === p.y) &&
          !(laserActive && levelData.laserPos && p.x === levelData.laserPos.x && p.y === levelData.laserPos.y)
        ) {
          candidateTargets.push(p);
        }
      }

      if (candidateTargets.length === 0) {
        sound.playBump();
        showToast('No accessible position beside this core.', 'warning', 1500);
        return;
      }
    } else {
      if (laserActive && levelData.laserPos && destX === levelData.laserPos.x && destY === levelData.laserPos.y) return;
      candidateTargets.push({ x: destX, y: destY });
    }

    const startPos = playerPosRef.current;
    if (!isTargetBox && startPos.x === destX && startPos.y === destY) return;

    // BFS to find shortest path through walkable tiles
    const DIRS_MAP: { dir: Direction; dx: number; dy: number }[] = [
      { dir: 'UP', dx: 0, dy: -1 },
      { dir: 'DOWN', dx: 0, dy: 1 },
      { dir: 'LEFT', dx: -1, dy: 0 },
      { dir: 'RIGHT', dx: 1, dy: 0 },
    ];

    const queue: { pos: Position; path: Direction[] }[] = [
      { pos: { ...startPos }, path: [] },
    ];
    const visited = new Set<string>();
    visited.add(`${startPos.x},${startPos.y}`);

    let foundPath: Direction[] | null = null;
    let finalDest: Position | null = null;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      if (candidateTargets.some(t => t.x === cur.pos.x && t.y === cur.pos.y)) {
        foundPath = cur.path;
        finalDest = cur.pos;
        break;
      }

      for (const { dir, dx, dy } of DIRS_MAP) {
        const nx = cur.pos.x + dx;
        const ny = cur.pos.y + dy;
        if (nx < 0 || nx >= levelData.width || ny < 0 || ny >= levelData.height) continue;
        if (levelData.grid[ny][nx] === 'WALL') continue;
        if (boxesRef.current.some(b => b.x === nx && b.y === ny)) continue;
        if (laserActive && levelData.laserPos && nx === levelData.laserPos.x && ny === levelData.laserPos.y) continue;

        const key = `${nx},${ny}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ pos: { x: nx, y: ny }, path: [...cur.path, dir] });
        }
      }
    }

    if (!foundPath || foundPath.length === 0) {
      sound.playBump();
      showToast('Path is blocked.', 'warning', 1200);
      return;
    }

    setAutoWalkTarget(finalDest);

    // Step smoothly and briskly along the path
    let stepIndex = 0;
    autoWalkTimerRef.current = setInterval(() => {
      if (stepIndex >= foundPath!.length || isVictoriousRef.current) {
        if (autoWalkTimerRef.current) {
          clearInterval(autoWalkTimerRef.current);
          autoWalkTimerRef.current = null;
        }
        setAutoWalkTarget(null);
        return;
      }

      const dir = foundPath![stepIndex];
      handleMove(dir);
      stepIndex++;
    }, 60);
  }, [levelData, laserActive, handleMove, showToast]);

  // Undo Last Move
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isVictorious) return;

    if (solutionTimerRef.current) {
      clearInterval(solutionTimerRef.current);
      solutionTimerRef.current = null;
      setIsSolutionAutoPlaying(false);
    }
    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
      setAutoWalkTarget(null);
    }

    const lastStep = moveHistory[moveHistory.length - 1];
    setPlayerPos(lastStep.playerFrom);
    playerPosRef.current = lastStep.playerFrom;

    let restoredBoxes = boxesRef.current;
    if (lastStep.boxMoved) {
      restoredBoxes = boxesRef.current.map(b =>
        b.id === lastStep.boxMoved!.id
          ? { ...b, x: lastStep.boxMoved!.from.x, y: lastStep.boxMoved!.from.y }
          : b
      );
      setBoxes(restoredBoxes);
      boxesRef.current = restoredBoxes;
    }

    // Re-sync solution guide if active for this chamber
    if (solutionPushesRef.current.length > 0) {
      const movable = restoredBoxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const fixed = restoredBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const sol = solvePuzzle(
        levelData.width,
        levelData.height,
        levelData.grid,
        lastStep.playerFrom,
        movable,
        levelData.exitPos,
        levelData.hasLaser,
        levelData.laserPos,
        levelData.plates,
        fixed,
        25000
      );
      if (sol.solvable) {
        fullSolutionMovesRef.current = sol.solutionMoves;
        solutionPushesRef.current = sol.solutionPushes;
        activePushIndexRef.current = 0;
        solutionStepIdxRef.current = 0;
        setFullSolutionMoves(sol.solutionMoves);
        setSolutionPushes(sol.solutionPushes);
        setActivePushIndex(0);
        setSolutionStepIndex(0);
        setHintSteps(buildApproachHintSteps(lastStep.playerFrom, sol.solutionPushes[0], restoredBoxes));
      }
    }

    setMoveHistory(prev => prev.slice(0, -1));
    setMovesCount(m => Math.max(0, m - 1));
    movesCountRef.current = Math.max(0, movesCountRef.current - 1);
    sound.playStep();
  }, [moveHistory, isVictorious, levelData, buildApproachHintSteps]);

  // Reset Current Chamber
  const handleResetLevel = useCallback(() => {
    if (solutionTimerRef.current) {
      clearInterval(solutionTimerRef.current);
      solutionTimerRef.current = null;
    }
    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
    }
    setIsSolutionAutoPlaying(false);
    setAutoWalkTarget(null);

    setPlayerPos(levelData.playerStart);
    playerPosRef.current = levelData.playerStart;
    setPlayerDir('DOWN');
    setBoxes(levelData.initialBoxes);
    boxesRef.current = levelData.initialBoxes;
    setMovesCount(0);
    movesCountRef.current = 0;
    setMoveHistory([]);
    setIsMoving(false);
    setIsVictorious(false);
    isVictoriousRef.current = false;

    // If solution guide is unlocked for this chamber, re-align it from start
    const chamberKey = `${levelData.chapter}-${levelData.level}-${isHardcore ? 'P' : 'N'}`;
    if (unlockedHintKeyRef.current === chamberKey) {
      const initMovable = levelData.initialBoxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const initFixed = levelData.initialBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const sol = solvePuzzle(
        levelData.width,
        levelData.height,
        levelData.grid,
        levelData.playerStart,
        initMovable,
        levelData.exitPos,
        levelData.hasLaser,
        levelData.laserPos,
        levelData.plates,
        initFixed,
        35000
      );
      if (sol.solvable) {
        fullSolutionMovesRef.current = sol.solutionMoves;
        solutionPushesRef.current = sol.solutionPushes;
        activePushIndexRef.current = 0;
        solutionStepIdxRef.current = 0;
        setFullSolutionMoves(sol.solutionMoves);
        setSolutionPushes(sol.solutionPushes);
        setActivePushIndex(0);
        setSolutionStepIndex(0);
        setHintSteps(buildApproachHintSteps(levelData.playerStart, sol.solutionPushes[0], levelData.initialBoxes));
      }
    } else {
      setHintSteps([]);
    }

    sound.playStep();
    showToast('Chamber Reset', 'info', 1000);
  }, [levelData, isHardcore, buildApproachHintSteps, showToast]);

  // USE HINT (HELP):
  // Unlocks complete cube-push solution for this chamber (without charging twice on the same level)
  // and lets the gamer watch Auto-Solve or step 1 push at a time!
  const handleHint = useCallback(() => {
    if (isVictoriousRef.current) return;

    if (solutionTimerRef.current) {
      clearInterval(solutionTimerRef.current);
      solutionTimerRef.current = null;
      setIsSolutionAutoPlaying(false);
    }
    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
      setAutoWalkTarget(null);
    }

    const chamberKey = `${levelData.chapter}-${levelData.level}-${isHardcore ? 'P' : 'N'}`;
    const alreadyUnlocked = unlockedHintKeyRef.current === chamberKey;

    if (!alreadyUnlocked && progress.helpsRemaining <= 0) {
      showToast('No hints remaining! Buy more in the Shop with 10 Points.', 'warning', 2500);
      setReturnScreen('PLAYING');
      setScreen('SHOP');
      return;
    }

    const movableBoxes = boxesRef.current.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const fixedBoxes = boxesRef.current.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));

    let result = solvePuzzle(
      levelData.width,
      levelData.height,
      levelData.grid,
      playerPosRef.current,
      movableBoxes,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixedBoxes,
      35000
    );

    let usingReset = false;
    let activeStartP = playerPosRef.current;
    let activeBoxesList = boxesRef.current;

    // If current board state is deadlocked/unsolvable, cleanly reset board and solve from start!
    if (!result.solvable || result.solutionMoves.length === 0) {
      usingReset = true;
      setPlayerPos(levelData.playerStart);
      playerPosRef.current = levelData.playerStart;
      setPlayerDir('DOWN');
      setBoxes(levelData.initialBoxes);
      boxesRef.current = levelData.initialBoxes;
      setMovesCount(0);
      movesCountRef.current = 0;
      setMoveHistory([]);
      setIsMoving(false);
      setIsVictorious(false);
      isVictoriousRef.current = false;

      activeStartP = levelData.playerStart;
      activeBoxesList = levelData.initialBoxes;

      const initialMovable = levelData.initialBoxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const initialFixed = levelData.initialBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));

      result = solvePuzzle(
        levelData.width,
        levelData.height,
        levelData.grid,
        levelData.playerStart,
        initialMovable,
        levelData.exitPos,
        levelData.hasLaser,
        levelData.laserPos,
        levelData.plates,
        initialFixed,
        45000
      );
    }

    if (result.solvable && result.solutionMoves.length > 0) {
      if (!alreadyUnlocked) {
        unlockedHintKeyRef.current = chamberKey;
        setProgress(prev => ({
          ...prev,
          helpsRemaining: Math.max(0, prev.helpsRemaining - 1),
          stats: {
            ...prev.stats,
            hintsUsed: prev.stats.hintsUsed + 1,
          },
        }));
      }

      fullSolutionMovesRef.current = result.solutionMoves;
      solutionPushesRef.current = result.solutionPushes;
      activePushIndexRef.current = 0;
      solutionStepIdxRef.current = 0;

      setFullSolutionMoves(result.solutionMoves);
      setSolutionPushes(result.solutionPushes);
      setActivePushIndex(0);
      setSolutionStepIndex(0);

      setHintSteps(buildApproachHintSteps(activeStartP, result.solutionPushes[0], activeBoxesList));
      sound.playHintSound();
      showToast(
        usingReset
          ? `Reset to start · Solution ready (${result.solutionPushes.length} pushes). Tap Auto-Solve to watch!`
          : `Solution ready (${result.solutionPushes.length} pushes). Follow arrows or tap Auto-Solve!`,
        'success',
        3200
      );
    } else {
      sound.playBump();
      showToast('Deadlock detected! Press Reset to restart chamber.', 'warning', 3000);
    }
  }, [progress.helpsRemaining, levelData, isHardcore, buildApproachHintSteps, showToast]);

  // Execute full verified solution cleanly using synchronous refs (never calls handleMove inside a setState updater!)
  const handleToggleAutoPlaySolution = useCallback(() => {
    if (isSolutionAutoPlaying) {
      if (solutionTimerRef.current) {
        clearInterval(solutionTimerRef.current);
        solutionTimerRef.current = null;
      }
      setIsSolutionAutoPlaying(false);
      showToast('Auto-solve paused.', 'info', 1500);
      return;
    }

    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
      setAutoWalkTarget(null);
    }

    // Re-verify from current board state so Auto-Solve ALWAYS completes 100% accurately!
    const movableBoxes = boxesRef.current.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const fixedBoxes = boxesRef.current.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));

    let fresh = solvePuzzle(
      levelData.width,
      levelData.height,
      levelData.grid,
      playerPosRef.current,
      movableBoxes,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixedBoxes,
      35000
    );

    if (!fresh.solvable || fresh.solutionMoves.length === 0) {
      // Current board is deadlocked; reset to start and solve cleanly
      setPlayerPos(levelData.playerStart);
      playerPosRef.current = levelData.playerStart;
      setPlayerDir('DOWN');
      setBoxes(levelData.initialBoxes);
      boxesRef.current = levelData.initialBoxes;
      setMovesCount(0);
      movesCountRef.current = 0;
      setMoveHistory([]);
      setIsMoving(false);
      setIsVictorious(false);
      isVictoriousRef.current = false;

      const initMovable = levelData.initialBoxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
      const initFixed = levelData.initialBoxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));
      fresh = solvePuzzle(
        levelData.width,
        levelData.height,
        levelData.grid,
        levelData.playerStart,
        initMovable,
        levelData.exitPos,
        levelData.hasLaser,
        levelData.laserPos,
        levelData.plates,
        initFixed,
        45000
      );
    }

    if (!fresh.solvable || fresh.solutionMoves.length === 0) {
      showToast('Unable to auto-solve this state.', 'warning', 2000);
      return;
    }

    fullSolutionMovesRef.current = fresh.solutionMoves;
    solutionPushesRef.current = fresh.solutionPushes;
    activePushIndexRef.current = 0;
    solutionStepIdxRef.current = 0;

    setFullSolutionMoves(fresh.solutionMoves);
    setSolutionPushes(fresh.solutionPushes);
    setActivePushIndex(0);
    setSolutionStepIndex(0);
    setHintSteps(buildApproachHintSteps(playerPosRef.current, fresh.solutionPushes[0], boxesRef.current));

    setIsSolutionAutoPlaying(true);
    showToast('Auto-solving chamber step by step...', 'success', 2000);

    solutionTimerRef.current = setInterval(() => {
      const idx = solutionStepIdxRef.current;
      const moves = fullSolutionMovesRef.current;

      if (idx >= moves.length || isVictoriousRef.current) {
        if (solutionTimerRef.current) {
          clearInterval(solutionTimerRef.current);
          solutionTimerRef.current = null;
        }
        setIsSolutionAutoPlaying(false);
        return;
      }

      const nextDir = moves[idx];
      solutionStepIdxRef.current = idx + 1;
      setSolutionStepIndex(idx + 1);
      handleMove(nextDir);
    }, 170);
  }, [isSolutionAutoPlaying, levelData, handleMove, buildApproachHintSteps, showToast]);

  // Interactive "Step 1 Push": auto-walks droid behind the next core and performs that 1 cube push
  const handleStepNextPush = useCallback(() => {
    if (isVictoriousRef.current || isSolutionAutoPlaying) return;

    if (autoWalkTimerRef.current) {
      clearInterval(autoWalkTimerRef.current);
      autoWalkTimerRef.current = null;
      setAutoWalkTarget(null);
    }

    const movableBoxes = boxesRef.current.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const fixedBoxes = boxesRef.current.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));

    const fresh = solvePuzzle(
      levelData.width,
      levelData.height,
      levelData.grid,
      playerPosRef.current,
      movableBoxes,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixedBoxes,
      35000
    );

    if (!fresh.solvable || fresh.solutionPushes.length === 0) {
      showToast('Current position is deadlocked — tap Auto-Solve or Reset.', 'warning', 2200);
      return;
    }

    fullSolutionMovesRef.current = fresh.solutionMoves;
    solutionPushesRef.current = fresh.solutionPushes;
    activePushIndexRef.current = 0;
    solutionStepIdxRef.current = 0;

    setFullSolutionMoves(fresh.solutionMoves);
    setSolutionPushes(fresh.solutionPushes);
    setActivePushIndex(0);
    setSolutionStepIndex(0);

    const firstPush = fresh.solutionPushes[0];
    const walk = findWalkPath(
      levelData.width,
      levelData.height,
      levelData.grid,
      playerPosRef.current,
      firstPush.playerApproachPos,
      movableBoxes,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixedBoxes
    );

    if (!walk) return;
    const sequence: Direction[] = [...walk, firstPush.dir];
    let stepIdx = 0;

    autoWalkTimerRef.current = setInterval(() => {
      if (stepIdx >= sequence.length || isVictoriousRef.current) {
        if (autoWalkTimerRef.current) {
          clearInterval(autoWalkTimerRef.current);
          autoWalkTimerRef.current = null;
        }
        return;
      }
      const d = sequence[stepIdx++];
      handleMove(d);
    }, 95);
  }, [isSolutionAutoPlaying, levelData, handleMove, showToast]);

  // Shop purchase handler: 10 points = 1 help
  const handleBuyHelp = useCallback((amount: number, cost: number): boolean => {
    if (progress.points < cost) return false;
    setProgress(prev => ({
      ...prev,
      points: prev.points - cost,
      helpsRemaining: prev.helpsRemaining + amount,
    }));
    return true;
  }, [progress.points]);

  // Master Developer Unlock: 5 clicks on "Developer" in About unlocks all 2000 levels
  const handleDeveloperUnlock = useCallback(() => {
    sound.playVictory();

    const allCompleted: Record<string, { stars: number; moves: number; completedAt: number }> = {};
    for (let ch = 1; ch <= 20; ch++) {
      for (let lvl = 1; lvl <= 100; lvl++) {
        const key = `${ch}-${lvl}`;
        allCompleted[key] = { stars: 3, moves: 8, completedAt: Date.now() };
      }
    }

    setProgress(prev => {
      const updated: UserProgress = {
        ...prev,
        unlockedChapter: 20,
        points: Math.max(prev.points, 9999),
        helpsRemaining: Math.max(prev.helpsRemaining, 999),
        levelsCompleted: allCompleted,
        highestLevelCompleted: 2000,
      };
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    showToast('Developer Mode: All 20 Chapters & 2,000 Levels Unlocked!', 'success', 4000);
  }, [showToast]);

  // Next level navigation
  const handleNextLevel = () => {
    let nextLvl = levelData.level + 1;
    let nextCh = levelData.chapter;

    if (nextLvl > 100) {
      nextLvl = 1;
      nextCh = Math.min(CHAPTERS.length, nextCh + 1);
    }

    loadChamber(nextCh, nextLvl);
    setIsVictorious(false);
  };

  // Keyboard navigation support (Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'PLAYING') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleMove('UP');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleMove('DOWN');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleMove('LEFT');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleMove('RIGHT');
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetLevel();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleHint();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleBackAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleMove, handleUndo, handleResetLevel, handleHint, handleBackAction]);

  const activePush = solutionPushes[activePushIndex] || solutionPushes[0];

  return (
    <div className="w-full min-h-screen stone-canvas-bg text-[#1f242c] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Floating Toast Notification */}
      <Toast message={toastMessage} type={toastType} />

      {/* Screen Router */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          progress={progress}
          onContinue={() => {
            loadChamber(progress.currentChapter, progress.currentLevel);
            setScreen('PLAYING');
            if (soundSettings.musicEnabled) sound.startMusic();
          }}
          onOpenChapters={() => {
            setReturnScreen('MAIN_MENU');
            setScreen('CHAPTER_SELECT');
          }}
          onOpenShop={() => {
            setReturnScreen('MAIN_MENU');
            setScreen('SHOP');
          }}
          onOpenSettings={() => {
            setReturnScreen('MAIN_MENU');
            setScreen('SETTINGS');
          }}
          onOpenAbout={() => setIsAboutOpen(true)}
          onStartNewGame={() => {
            loadChamber(1, 1);
            setScreen('PLAYING');
            if (soundSettings.musicEnabled) sound.startMusic();
          }}
        />
      )}

      {screen === 'PLAYING' && (
        <main className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-between py-1">
          {/* TopBar HUD */}
          <TopBar
            chapter={levelData.chapter}
            level={levelData.level}
            moves={movesCount}
            parMoves={levelData.parMoves}
            points={progress.points}
            helps={progress.helpsRemaining}
            soundSettings={soundSettings}
            isHardcore={isHardcore}
            onToggleHardcore={toggleHardcore}
            onBack={handleBackAction}
            onOpenShop={() => {
              setReturnScreen('PLAYING');
              setScreen('SHOP');
            }}
            onOpenSettings={() => {
              setReturnScreen('PLAYING');
              setScreen('SETTINGS');
            }}
            onToggleMusic={() => {
              setSoundSettings(s => {
                const next = !s.musicEnabled;
                if (next) sound.startMusic();
                else sound.stopMusic();
                return { ...s, musicEnabled: next };
              });
            }}
            onToggleSfx={() => {
              setSoundSettings(s => ({ ...s, sfxEnabled: !s.sfxEnabled }));
            }}
          />

          {/* Center Chamber GameBoard Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            {/* Interactive Solution Guide Bar */}
            {fullSolutionMoves.length > 0 && !isVictorious && (
              <div className="w-full max-w-md mx-auto mb-2 p-2.5 rounded-2xl bg-[#f7f4ed] border-2 border-[#d97706] shadow-md flex flex-col gap-2 text-xs">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lightbulb className="w-4 h-4 text-[#d97706] shrink-0" />
                    <span className="font-extrabold text-[#1f242c] truncate tabular-nums">
                      Solution · {solutionPushes.length} Pushes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleToggleAutoPlaySolution}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer ${
                        isSolutionAutoPlaying
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : 'bg-[#0f766e] text-white hover:bg-[#115e59]'
                      }`}
                    >
                      {isSolutionAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isSolutionAutoPlaying ? 'Pause' : 'Auto-Solve'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (solutionTimerRef.current) {
                          clearInterval(solutionTimerRef.current);
                          solutionTimerRef.current = null;
                        }
                        fullSolutionMovesRef.current = [];
                        solutionPushesRef.current = [];
                        activePushIndexRef.current = 0;
                        solutionStepIdxRef.current = 0;
                        setFullSolutionMoves([]);
                        setSolutionPushes([]);
                        setHintSteps([]);
                        setIsSolutionAutoPlaying(false);
                      }}
                      className="p-1.5 rounded-xl bg-[#eae4d7] text-[#5c5549] hover:text-[#1f242c] cursor-pointer"
                      title="Hide Solution Guide"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* All Cube Push Sequence Chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  {solutionPushes.map((p, idx) => {
                    const arrowChar = p.dir === 'UP' ? '↑' : p.dir === 'DOWN' ? '↓' : p.dir === 'LEFT' ? '←' : '→';
                    const isActive = idx === activePushIndex;
                    return (
                      <button
                        key={`push-chip-${p.pushNumber}-${idx}`}
                        onClick={() => {
                          activePushIndexRef.current = idx;
                          setActivePushIndex(idx);
                          setHintSteps(buildApproachHintSteps(playerPosRef.current, p, boxesRef.current));
                        }}
                        className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold shrink-0 border transition-all cursor-pointer tabular-nums ${
                          isActive
                            ? 'bg-[#d97706] text-white border-[#b45309] shadow-xs'
                            : 'bg-[#eae4d7] text-[#4e483e] border-[#d4cbb9] hover:bg-[#f5ebd6]'
                        }`}
                      >
                        #{p.pushNumber} {arrowChar}
                      </button>
                    );
                  })}
                </div>

                {/* Push Step Details & Action Controls */}
                {activePush && (
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#e4ddd0] text-[11px] text-[#5c5549] font-medium gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-[#fef3c7] border border-[#f59e0b]/40 text-[#92400e] font-bold font-mono tabular-nums">
                        Push {activePush.pushNumber}/{solutionPushes.length}
                      </span>
                      <span className="truncate">
                        Move core <b className="text-[#1f242c]">{activePush.dir}</b> ({activePush.from.x},{activePush.from.y})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handleStepNextPush}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fef3c7] hover:bg-[#fde68a] border border-[#f59e0b]/40 text-[#92400e] font-bold cursor-pointer"
                        title="Demonstrate the next single cube push"
                      >
                        <StepForward className="w-3 h-3" />
                        <span>Step Push</span>
                      </button>

                      <button
                        onClick={handleResetLevel}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#eae4d7] hover:bg-[#dfd8c8] border border-[#ccc3b3] text-[#3f3a32] font-semibold cursor-pointer"
                        title="Reset board to try moves yourself"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <GameBoard
              level={levelData}
              playerPos={playerPos}
              playerDir={playerDir}
              boxes={boxes}
              isMoving={isMoving}
              isVictorious={isVictorious}
              hintSteps={hintSteps}
              solutionPushes={solutionPushes}
              activePushIndex={activePushIndex}
              autoWalkTarget={autoWalkTarget}
              onMove={handleMove}
              onMoveToCell={handleMoveToCell}
              onAutoWalk={handleAutoWalk}
              laserActive={laserActive}
              isHardcore={isHardcore}
              isExitUnlocked={allPlatesCovered}
              coveredPlatesCount={coveredPlatesCount}
            />

            {/* Tactical Power Core Status Bar */}
            {levelData.plates.length > 0 && (
              <div className="w-full max-w-sm mx-auto mt-2 flex items-center justify-between px-3 py-2 rounded-2xl bg-[#f7f4ed] border border-[#d5cdc0] text-xs font-mono shadow-xs select-none">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 shrink-0 ${allPlatesCovered ? 'text-[#0f766e]' : 'text-[#d97706]'}`} />
                  <span className="text-[#5c5549] font-bold tabular-nums">
                    POWER CORES:{' '}
                    <b className={allPlatesCovered ? 'text-[#0f766e] font-black' : 'text-[#b45309] font-black'}>
                      {coveredPlatesCount} / {levelData.plates.length}
                    </b>
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                    allPlatesCovered
                      ? 'bg-[#e6f4f1] text-[#0f766e] border-[#99d6cb]'
                      : 'bg-[#eae4d7] text-[#4e483e] border-[#ccc3b3]'
                  }`}
                >
                  {allPlatesCovered ? (
                    <>
                      <DoorOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>EXIT UNSEALED</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                      <span>EXIT LOCKED</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Minimal Bottom Action Bar (Undo, Reset, Hint - No movement arrows) */}
          <DPadControls
            onUndo={handleUndo}
            onReset={handleResetLevel}
            onHint={handleHint}
            canUndo={moveHistory.length > 0 && !isVictorious}
            hintsRemaining={progress.helpsRemaining}
          />

          {/* Victory Modal Overlay */}
          {isVictorious && (
            <LevelCompleteModal
              chapter={levelData.chapter}
              level={levelData.level}
              moves={movesCount}
              parMoves={levelData.parMoves}
              pointsEarned={1}
              totalPoints={progress.points}
              onNextLevel={handleNextLevel}
              onReplay={handleResetLevel}
              onMainMenu={() => {
                setIsVictorious(false);
                setScreen('MAIN_MENU');
              }}
            />
          )}
        </main>
      )}

      {/* Chapter Select Screen */}
      {screen === 'CHAPTER_SELECT' && (
        <ChapterSelectModal
          progress={progress}
          onSelectChapter={chId => {
            setSelectedChapterForLevels(chId);
            setScreen('LEVEL_SELECT');
          }}
          onClose={() => setScreen(returnScreen)}
        />
      )}

      {/* Level Select Screen */}
      {screen === 'LEVEL_SELECT' && (
        <LevelSelectModal
          chapterId={selectedChapterForLevels}
          progress={progress}
          onSelectLevel={(chId, lvlId) => {
            loadChamber(chId, lvlId);
            setScreen('PLAYING');
          }}
          onChangeChapter={delta => {
            setSelectedChapterForLevels(prev =>
              Math.max(1, Math.min(CHAPTERS.length, prev + delta))
            );
          }}
          onClose={() => setScreen('CHAPTER_SELECT')}
        />
      )}

      {/* Shop Modal */}
      {screen === 'SHOP' && (
        <ShopModal
          progress={progress}
          onBuyHelp={handleBuyHelp}
          onClose={() => setScreen(returnScreen)}
        />
      )}

      {/* Settings Modal */}
      {screen === 'SETTINGS' && (
        <SettingsModal
          settings={soundSettings}
          onUpdateSettings={setSoundSettings}
          onResetAllData={() => {
            localStorage.removeItem(PROGRESS_STORAGE_KEY);
            setProgress(INITIAL_PROGRESS);
            loadChamber(1, 1);
            showToast('Progress Reset', 'info');
          }}
          onClose={() => setScreen(returnScreen)}
        />
      )}


      {/* About Modal (Accessible from Main Menu) */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onUnlockAllLevels={handleDeveloperUnlock}
      />
    </div>
  );
}
