import React, { useState, useEffect, useRef, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import { 
  Direction, 
  LevelData, 
  Position, 
  BoxItem, 
  UserProgress, 
  SoundSettings, 
  ScreenState,
  MoveStep 
} from './types/game';
import { generateLevel, CHAPTERS } from './utils/levelGenerator';
import { solvePuzzle, isBoxDeadlocked } from './utils/puzzleSolver';
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
  helpsRemaining: 3, // Starts with 3 free initial helps as requested
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
  const [laserActive, setLaserActive] = useState<boolean>(false);

  // Toast & Double-Back State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'warning' | 'success'>('info');
  const lastBackPressTimeRef = useRef<number>(0);
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

  // Check Laser barrier status (active if laser exists and no plate is occupied)
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
    const activeHardcore = hardcoreOverride !== undefined ? hardcoreOverride : isHardcore;
    const newLvl = generateLevel(chapter, level, activeHardcore);
    setLevelData(newLvl);
    setPlayerPos(newLvl.playerStart);
    setPlayerDir('DOWN');
    setBoxes(newLvl.initialBoxes);
    setMovesCount(0);
    setMoveHistory([]);
    setIsMoving(false);
    setIsVictorious(false);
    setHintSteps([]);

    // Save as current position for resume functionality
    setProgress(prev => ({
      ...prev,
      currentChapter: chapter,
      currentLevel: level,
    }));
  }, [isHardcore]);

  // Toggle Hardcore Pro Mode (سخت‌ترین حالت بازی)
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
        next ? '🔥 HARDCORE MODE: Maximum Complexity!' : '🌿 NORMAL MODE: Progressive Story',
        next ? 'warning' : 'info',
        2500
      );
      return next;
    });
  }, [levelData.chapter, levelData.level, loadChamber, showToast]);

  // Handle Back Navigation:
  // 1. In gameplay: goes to the previous level (without exiting), or to menu if at level 1-1
  // 2. In modals/screens: closes modal or returns to previous menu
  // Handle Back Navigation:
  // Strictly navigates to the parent screen:
  // Playing -> Level Select -> Chapter Select -> Main Menu -> (Double-tap) Exit
  const handleBackAction = useCallback(() => {
    // 1. If About Modal is open, close it
    if (isAboutOpen) {
      setIsAboutOpen(false);
      return;
    }

    // 2. If Victory Modal is open, dismiss it and return to level select
    if (isVictorious) {
      setIsVictorious(false);
      setSelectedChapterForLevels(levelData.chapter);
      setScreen('LEVEL_SELECT');
      return;
    }

    // 3. In Gameplay: return to parent screen (Level Select for this chapter)
    // "فقط از صفحه جاری برگرده به یک صفحه بالاتر و صفحه اصلی همین"
    if (screen === 'PLAYING') {
      setSelectedChapterForLevels(levelData.chapter);
      setScreen('LEVEL_SELECT');
      return;
    }

    // 4. From Level Select: return to Chapter Select
    if (screen === 'LEVEL_SELECT') {
      setScreen('CHAPTER_SELECT');
      return;
    }

    // 5. From Chapter Select / Settings / Shop: return to Main Menu
    if (screen === 'CHAPTER_SELECT' || screen === 'SETTINGS' || screen === 'SHOP') {
      setScreen('MAIN_MENU');
      return;
    }

    // 6. On Main Menu: 2 consecutive Back presses closes the app!
    // "با ۲ تا پشت سر هم در صفحه اصلی بازی رو ببنده"
    if (screen === 'MAIN_MENU') {
      const now = Date.now();
      const timeDiff = now - lastBackPressTimeRef.current;

      if (timeDiff < 2000) {
        // Double-tap on main screen -> Exit the app!
        setToastMessage(null);
        lastBackPressTimeRef.current = 0;
        try {
          CapApp.exitApp();
        } catch {
          // If in browser
        }
      } else {
        lastBackPressTimeRef.current = now;
        showToast('Press BACK again to exit', 'warning', 2000);
      }
    }
  }, [isAboutOpen, isVictorious, screen, levelData.chapter, showToast]);

  // Register Capacitor native backButton & browser popstate
  useEffect(() => {
    let backListenerHandle: { remove: () => void } | null = null;
    CapApp.addListener('backButton', () => {
      handleBackAction();
    }).then(handle => {
      backListenerHandle = handle;
    }).catch(() => {
      // Running on web
    });

    // Push dummy history entry so back button triggers popstate rather than exiting webpage
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

  // Execute Player Movement & Box Pushing
  const handleMove = useCallback((dir: Direction) => {
    if (isVictorious) return;

    // Remove hint indicator once user moves
    if (hintSteps.length > 0) setHintSteps([]);

    const delta = {
      UP: { dx: 0, dy: -1 },
      DOWN: { dx: 0, dy: 1 },
      LEFT: { dx: -1, dy: 0 },
      RIGHT: { dx: 1, dy: 0 },
    }[dir];

    setPlayerDir(dir);
    const targetX = playerPos.x + delta.dx;
    const targetY = playerPos.y + delta.dy;

    // 1. Grid boundary check
    if (targetX < 0 || targetX >= levelData.width || targetY < 0 || targetY >= levelData.height) {
      sound.playBump();
      return;
    }

    // 2. Wall check
    if (levelData.grid[targetY][targetX] === 'WALL') {
      sound.playBump();
      return;
    }

    // 3. Laser check
    if (laserActive && levelData.laserPos && targetX === levelData.laserPos.x && targetY === levelData.laserPos.y) {
      sound.playBump();
      showToast('Laser barrier active! Push a box onto the switch.', 'warning');
      return;
    }

    // 4. Exit portal lock check (Requires all power sockets / plates to be filled)
    const isExitTile = targetX === levelData.exitPos.x && targetY === levelData.exitPos.y;
    const allPlatesCovered = levelData.plates.length === 0 || levelData.plates.every(pl =>
      boxes.some(b => b.x === pl.x && b.y === pl.y)
    );

    if (isExitTile && !allPlatesCovered) {
      sound.playBump();
      const coveredCount = levelData.plates.filter(pl => boxes.some(b => b.x === pl.x && b.y === pl.y)).length;
      showToast(`🔒 خروجی قفل است! همه هسته‌های مکعبی باید روی جایگاه‌ها قرار گیرند (${coveredCount}/${levelData.plates.length})`, 'warning', 2000);
      return;
    }

    // 5. Box collision check
    const boxIndex = boxes.findIndex(b => b.x === targetX && b.y === targetY);

    if (boxIndex !== -1) {
      const targetBox = boxes[boxIndex];

      // Fixed steel barrier boxes cannot be moved!
      if (targetBox.type === 'FIXED') {
        sound.playBump();
        showToast('Fixed steel barrier! Cannot be moved.', 'warning', 1000);
        return;
      }

      // Droid is pushing a movable cubic box!
      const pushX = targetX + delta.dx;
      const pushY = targetY + delta.dy;

      // Check if space behind box is clear
      if (
        pushX < 0 ||
        pushX >= levelData.width ||
        pushY < 0 ||
        pushY >= levelData.height ||
        levelData.grid[pushY][pushX] === 'WALL' ||
        (pushX === levelData.exitPos.x && pushY === levelData.exitPos.y) || // Box cannot enter exit portal
        (laserActive && levelData.laserPos && pushX === levelData.laserPos.x && pushY === levelData.laserPos.y) ||
        boxes.some(b => b.x === pushX && b.y === pushY) // Box cannot push into another box
      ) {
        sound.playBump();
        return;
      }

      // Valid Box Push! Play the authentic "KNOCK" sound
      sound.playKnock();

      const pushedBox = boxes[boxIndex];
      const newBoxes = boxes.map((b, i) => (i === boxIndex ? { ...b, x: pushX, y: pushY } : b));

      // Record move step for undo
      const step: MoveStep = {
        playerFrom: { ...playerPos },
        playerTo: { x: targetX, y: targetY },
        boxMoved: {
          id: pushedBox.id,
          from: { x: targetX, y: targetY },
          to: { x: pushX, y: pushY },
        },
      };

      setMoveHistory(prev => [...prev, step]);
      setBoxes(newBoxes);
      setPlayerPos({ x: targetX, y: targetY });
      setMovesCount(m => m + 1);

      // Check if pushed box landed on a pressure plate
      if (levelData.plates.some(pl => pl.x === pushX && pl.y === pushY)) {
        sound.playPlateClick();
      }

      // Check if pushed box entered a corner deadlock
      if (isBoxDeadlocked({ x: pushX, y: pushY }, levelData.width, levelData.height, levelData.grid, levelData.plates)) {
        showToast('⚠️ بن‌بست! این هسته در گوشه قفل شد. دکمه بازگشت (Undo) را بزنید.', 'warning', 3000);
      }

      // Check if all plates just became energized
      const willAllCovered = levelData.plates.length > 0 && levelData.plates.every(pl =>
        newBoxes.some(b => b.x === pl.x && b.y === pl.y)
      );

      if (willAllCovered && !allPlatesCovered) {
        showToast('⚡ تمام هسته‌ها مستقر شدند! اتاق با موفقیت پاکسازی شد!', 'success', 3000);
        setTimeout(() => {
          handleChamberVictory(movesCount + 1);
        }, 500);
      }

      // Update total boxes pushed stats
      setProgress(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalBoxesMoved: prev.stats.totalBoxesMoved + 1,
          totalMovesTaken: prev.stats.totalMovesTaken + 1,
        },
      }));

      // Trigger visual step bounce
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 120);

      // Check Chamber Victory Condition: Droid steps onto Exit tile
      if (targetX === levelData.exitPos.x && targetY === levelData.exitPos.y) {
        handleChamberVictory(movesCount + 1);
      }
    } else {
      // 1 single precise step into target cell
      sound.playStep();

      const step: MoveStep = {
        playerFrom: { ...playerPos },
        playerTo: { x: targetX, y: targetY },
      };

      setMoveHistory(prev => [...prev, step]);
      setPlayerPos({ x: targetX, y: targetY });
      setMovesCount(m => m + 1);

      setProgress(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalMovesTaken: prev.stats.totalMovesTaken + 1,
        },
      }));

      // Trigger visual step bounce
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 100);

      // Check Chamber Victory Condition: Droid steps onto Exit tile
      if (targetX === levelData.exitPos.x && targetY === levelData.exitPos.y) {
        handleChamberVictory(movesCount + 1);
      }
    }
  }, [
    isVictorious,
    hintSteps,
    playerPos,
    levelData,
    laserActive,
    boxes,
    movesCount,
    showToast,
  ]);

  // Step intentionally towards a tapped square (adjacent step or directional nudge)
  const handleMoveToCell = useCallback((destX: number, destY: number) => {
    if (isVictorious) return;
    if (hintSteps.length > 0) setHintSteps([]);

    const dx = destX - playerPos.x;
    const dy = destY - playerPos.y;

    if (dx === 0 && dy === 0) return;

    // If directly adjacent: move 1 step directly into target (or push adjacent box)
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) handleMove('RIGHT');
      else if (dx === -1) handleMove('LEFT');
      else if (dy === 1) handleMove('DOWN');
      else if (dy === -1) handleMove('UP');
    }
  }, [isVictorious, hintSteps, playerPos, handleMove]);

  // Handle Chamber Victory
  const handleChamberVictory = (finalMoves: number) => {
    setIsVictorious(true);
    sound.playVictory();

    const currentKey = `${levelData.chapter}-${levelData.level}`;
    const stars = finalMoves <= levelData.parMoves ? 3 : finalMoves <= levelData.parMoves + 4 ? 2 : 1;

    // "با هر بار اتمام یک قسمت ۱ امتیاز برایش لحاظ گردد" -> Always award +1 point per level!
    setProgress(prev => {
      const alreadyCompleted = !!prev.levelsCompleted[currentKey];
      const newPoints = prev.points + 1; // +1 point on each level completion
      const newCompleted = {
        ...prev.levelsCompleted,
        [currentKey]: {
          stars: Math.max(stars, prev.levelsCompleted[currentKey]?.stars || 0),
          moves: finalMoves,
          completedAt: Date.now(),
        },
      };

      // If finished level 100, unlock next chapter
      let unlockedChapter = prev.unlockedChapter;
      if (levelData.level >= 100 && levelData.chapter >= unlockedChapter && unlockedChapter < CHAPTERS.length) {
        unlockedChapter = levelData.chapter + 1;
      }

      return {
        ...prev,
        points: newPoints,
        levelsCompleted: newCompleted,
        unlockedChapter,
        highestLevelCompleted: Math.max(prev.highestLevelCompleted, Object.keys(newCompleted).length),
      };
    });
  };

  // Undo Last Move
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || isVictorious) return;

    const lastStep = moveHistory[moveHistory.length - 1];
    setPlayerPos(lastStep.playerFrom);

    if (lastStep.boxMoved) {
      setBoxes(prev =>
        prev.map(b =>
          b.id === lastStep.boxMoved!.id
            ? { ...b, x: lastStep.boxMoved!.from.x, y: lastStep.boxMoved!.from.y }
            : b
        )
      );
    }

    setMoveHistory(prev => prev.slice(0, -1));
    setMovesCount(m => Math.max(0, m - 1));
    sound.playStep();
  }, [moveHistory, isVictorious]);

  // Reset Current Level
  const handleResetLevel = useCallback(() => {
    setPlayerPos(levelData.playerStart);
    setPlayerDir('DOWN');
    setBoxes(levelData.initialBoxes);
    setMovesCount(0);
    setMoveHistory([]);
    setIsMoving(false);
    setIsVictorious(false);
    setHintSteps([]);
    sound.playStep();
    showToast('Chamber Reset', 'info', 1000);
  }, [levelData, showToast]);

  // Use Hint (Help)
  // "بازی از ۳ پیشنهاد اولیه برای کمک اتمام قسمت بازی تشکیل شده باشد، و پس از استفاده از این سه گزینه ... با هر ۱۰ امتیاز امکان ، خرید یک help بازی را داشته باشد"
  const handleHint = useCallback(() => {
    if (progress.helpsRemaining <= 0) {
      showToast('No Helps remaining! Buy more in the Shop with 10 Points.', 'warning', 2500);
      setScreen('SHOP');
      return;
    }

    // Separate movable boxes and fixed steel barriers
    const movableBoxes = boxes.filter(b => b.type !== 'FIXED').map(b => ({ x: b.x, y: b.y }));
    const fixedBoxes = boxes.filter(b => b.type === 'FIXED').map(b => ({ x: b.x, y: b.y }));

    // Compute optimal solution from current game state
    const result = solvePuzzle(
      levelData.width,
      levelData.height,
      levelData.grid,
      playerPos,
      movableBoxes,
      levelData.exitPos,
      levelData.hasLaser,
      levelData.laserPos,
      levelData.plates,
      fixedBoxes,
      15000
    );

    if (result.solvable && result.solutionMoves.length > 0) {
      // Consume 1 Help
      setProgress(prev => ({
        ...prev,
        helpsRemaining: Math.max(0, prev.helpsRemaining - 1),
        stats: {
          ...prev.stats,
          hintsUsed: prev.stats.hintsUsed + 1,
        },
      }));

      // Generate sequence of visual hint arrows
      const steps: HintStep[] = [];
      let cur = { ...playerPos };
      const showCount = Math.min(result.solutionMoves.length, 5); // show up to 5 steps

      for (let i = 0; i < showCount; i++) {
        const moveDir = result.solutionMoves[i];
        const d = {
          UP: { dx: 0, dy: -1 },
          DOWN: { dx: 0, dy: 1 },
          LEFT: { dx: -1, dy: 0 },
          RIGHT: { dx: 1, dy: 0 },
        }[moveDir];

        cur = { x: cur.x + d.dx, y: cur.y + d.dy };
        steps.push({
          x: cur.x,
          y: cur.y,
          dir: moveDir,
          step: i + 1,
        });
      }

      setHintSteps(steps);
      sound.playHintSound();
      showToast(`Hint: Follow arrows 1 → ${showCount} (${result.minMoves} moves to exit)`, 'success', 3500);
    } else {
      sound.playBump();
      showToast('Deadlock detected! Press Undo (↩) or Reset (🔄) to recover.', 'warning', 3000);
    }
  }, [progress.helpsRemaining, levelData, playerPos, boxes, showToast]);

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

  // Master Developer Unlock: 5 clicks on "M-Tech" in About + Passcode 2450
  // "با ۵ بار کلیک روی این developer رمز درخواست کنه و با ورود عدد 2450 همه level های بازی قابل دسترسی بشه"
  const handleDeveloperUnlock = useCallback(() => {
    sound.playVictory();

    const allCompleted: Record<string, { stars: number; moves: number; completedAt: number }> = {};
    for (let ch = 1; ch <= 20; ch++) {
      for (let lvl = 1; lvl <= 100; lvl++) {
        const key = `${ch}-${lvl}`;
        allCompleted[key] = { stars: 3, moves: 8, completedAt: Date.now() };
      }
    }

    const updated: UserProgress = {
      currentChapter: 1,
      currentLevel: 1,
      unlockedChapter: 20,
      points: 9999,
      helpsRemaining: 999,
      levelsCompleted: allCompleted,
      highestLevelCompleted: 2000,
      stats: {
        totalBoxesMoved: 1200,
        totalMovesTaken: 4500,
        hintsUsed: 0,
      },
    };

    setProgress(updated);
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    showToast('Code 2450 Accepted: All 20 Chapters & 2,000 Levels Unlocked!', 'success', 4000);
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

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
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
          onOpenChapters={() => setScreen('CHAPTER_SELECT')}
          onOpenShop={() => setScreen('SHOP')}
          onOpenSettings={() => setScreen('SETTINGS')}
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
            onOpenShop={() => setScreen('SHOP')}
            onOpenSettings={() => setScreen('SETTINGS')}
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

          {/* Center Chamber GameBoard */}
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            <GameBoard
              level={levelData}
              playerPos={playerPos}
              playerDir={playerDir}
              boxes={boxes}
              isMoving={isMoving}
              isVictorious={isVictorious}
              hintSteps={hintSteps}
              onMove={handleMove}
              onMoveToCell={handleMoveToCell}
              laserActive={laserActive}
              isHardcore={isHardcore}
              isExitUnlocked={allPlatesCovered}
              coveredPlatesCount={coveredPlatesCount}
            />

            {/* Tactical Power Core Status Bar */}
            {levelData.plates.length > 0 && (
              <div className="w-full max-w-sm mx-auto mt-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono shadow-md select-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${allPlatesCovered ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-slate-300">
                    POWER CORES: <b className={allPlatesCovered ? 'text-emerald-300' : 'text-white'}>{coveredPlatesCount} / {levelData.plates.length}</b>
                  </span>
                </div>
                <div className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  allPlatesCovered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {allPlatesCovered ? '⚡ EXIT UNSEALED' : '🔒 EXIT LOCKED'}
                </div>
              </div>
            )}

            {/* Quick Helper Label */}
            <div className="text-center mt-1 text-[11px] text-slate-500 font-medium hidden sm:block">
              Swipe or tap adjacent cell to move · [Z] Undo · [R] Reset · [H] Hint
            </div>
          </div>

          {/* Minimal Bottom Action Bar (Undo, Reset, Hint, 4-Way D-Pad) */}
          <DPadControls
            onUndo={handleUndo}
            onReset={handleResetLevel}
            onHint={handleHint}
            onMove={handleMove}
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

      {/* Chapter Select Modal */}
      {screen === 'CHAPTER_SELECT' && (
        <ChapterSelectModal
          progress={progress}
          onSelectChapter={chId => {
            setSelectedChapterForLevels(chId);
            setScreen('LEVEL_SELECT');
          }}
          onClose={() => setScreen('MAIN_MENU')}
        />
      )}

      {/* Level Select Modal */}
      {screen === 'LEVEL_SELECT' && (
        <LevelSelectModal
          chapterId={selectedChapterForLevels}
          progress={progress}
          onSelectLevel={(ch, lvl) => {
            loadChamber(ch, lvl);
            setScreen('PLAYING');
            if (soundSettings.musicEnabled) sound.startMusic();
          }}
          onChangeChapter={delta => {
            const next = Math.max(1, Math.min(CHAPTERS.length, selectedChapterForLevels + delta));
            setSelectedChapterForLevels(next);
          }}
          onClose={() => setScreen('CHAPTER_SELECT')}
        />
      )}

      {/* Hint Shop Modal */}
      {screen === 'SHOP' && (
        <ShopModal
          progress={progress}
          onBuyHelp={handleBuyHelp}
          onClose={() => setScreen(levelData ? 'PLAYING' : 'MAIN_MENU')}
        />
      )}

      {/* Settings Modal */}
      {screen === 'SETTINGS' && (
        <SettingsModal
          settings={soundSettings}
          onUpdateSettings={setSoundSettings}
          onResetAllData={() => {
            if (window.confirm('Reset all progress, points, and level records?')) {
              setProgress(INITIAL_PROGRESS);
              loadChamber(1, 1);
              showToast('Progress reset successfully', 'info');
              setScreen('MAIN_MENU');
            }
          }}
          onClose={() => setScreen(levelData ? 'PLAYING' : 'MAIN_MENU')}
        />
      )}

      {/* About & Developer Info Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onUnlockAllLevels={handleDeveloperUnlock}
        currentVersion={CURRENT_APP_VERSION}
      />
    </div>
  );
}
