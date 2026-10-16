# Droid Escape: 2,000 Puzzle Chambers 🤖📦

A tactical brain and puzzle escape game featuring an iconic green Android droid navigating through 20 unique sci-fi chapters and 2,000 algorithmic chambers by maneuvering tactile cubic blocks.

---

## 🌟 Game Highlights

- **20 Chapters & 2,000 Levels:**
  - Progress from the *Neon Laboratory* to *Silicon Foundry*, *Magnetic Core*, *Laser Nexus*, and *Master Mainframe*.
  - Every single chamber is generated deterministically and verified with a built-in BFS puzzle solver to guarantee 100% solvability with progressive brain-teasing difficulty.
- **Android Droid Mascot:**
  - High-fidelity vector droid with animated antennas, glowing eyes, directional turning, and victory jump.
- **Tactile Audio & Knock Physics:**
  - Authentic acoustic **Knock** sound generated via Web Audio API whenever a cubic block is pushed.
  - Relaxing, polyphonic ambient synthesizer music for deep focus.
  - Quick mute controls for music and SFX right on the HUD and in Settings.
- **Help / Hint & Economy System:**
  - Starts with **3 Free Initial Helps**.
  - Completing any level awards **+1 Point**.
  - Exchange **10 Points for 1 Help** in the Hint Shop.
  - Dynamic solver computes the next optimal move and highlights it with a holographic guide arrow.
- **Double-Back Navigation & Auto-Resume:**
  - Pressing the hardware/browser Back button (or on-screen Back) once displays a warning toast.
  - Pressing Back a second time within 2 seconds safely exits to the Main Menu.
  - Tapping **Resume Chamber** immediately continues right from the exact chapter and level where you left off.
- **Multi-Platform Controls:**
  - Desktop: Keyboard Arrow keys / WASD, `Z` to Undo, `R` to Reset, `H` for Hint.
  - Mobile: On-screen responsive D-Pad, touch swipe gestures, and direct tap-to-move on adjacent cells.
  - Haptic vibration feedback on supported mobile devices.

---

## 🚀 Quick Start & Local Testing

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd <REPO_FOLDER>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to play the game!

4. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

---

## 📱 Testing on Android / Packaging as APK

### Option A: Mobile Browser (Instant Test)
1. Run `npm run dev -- --host` on your local network.
2. Open the displayed local IP address on your Android phone's Chrome browser.
3. Tap **"Add to Home Screen"** to install as a full-screen app.

### Option B: Build Android APK with Capacitor
You can turn this web app into a native Android APK in minutes:
```bash
# 1. Build the web app
npm run build

# 2. Install Capacitor CLI & Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android

# 3. Initialize Capacitor
npx cap init "Droid Escape" "com.droidescape.puzzle" --web-dir dist

# 4. Add Android platform
npx cap add android

# 5. Open in Android Studio to build APK
npx cap open android
```

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Audio:** Web Audio API (Synthesized knock sounds and ambient pads)
- **Icons:** Lucide React
- **Animations:** Motion & Canvas Confetti

---

## 📄 License
Apache-2.0
