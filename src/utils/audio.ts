/**
 * Web Audio API synthesizer for Droid Escape:
 * - Authentic physical "Knock" sound on box movement
 * - Relaxing ambient background synth music
 * - Droid steps, victory fanfare, hint bell, and UI feedback
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicIntervalId: number | null = null;
  private currentChordIndex = 0;

  // Settings
  private sfxEnabled = true;
  private musicEnabled = true;
  private volume = 0.8;
  private hapticsEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxEnabled ? 1 : 0;
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicEnabled ? 0.35 : 0;
        this.musicGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateSettings(settings: { sfxEnabled: boolean; musicEnabled: boolean; volume: number; hapticsEnabled: boolean }) {
    this.sfxEnabled = settings.sfxEnabled;
    this.musicEnabled = settings.musicEnabled;
    this.volume = settings.volume;
    this.hapticsEnabled = settings.hapticsEnabled;

    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(settings.volume, this.ctx?.currentTime || 0, 0.05);
    }
    if (this.sfxGain) {
      this.sfxGain.gain.setTargetAtTime(settings.sfxEnabled ? 1 : 0, this.ctx?.currentTime || 0, 0.05);
    }
    if (this.musicGain) {
      this.musicGain.gain.setTargetAtTime(settings.musicEnabled ? 0.35 : 0, this.ctx?.currentTime || 0, 0.05);
    }

    if (settings.musicEnabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!settings.musicEnabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  /**
   * The signature physical "KNOCK" sound when a box is moved.
   * Uses a dual-layer acoustic simulation:
   * 1. A punchy low-frequency resonance body (160Hz dropping to 80Hz)
   * 2. A high transient wooden click (sharp bandpass noise impulse)
   */
  public playKnock() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // Layer 1: Body thump (Wood/Solid Cube resonance)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);

    oscGain.gain.setValueAtTime(0.9, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);

    // Layer 2: Transient impact click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    const clickFilter = this.ctx.createBiquadFilter();

    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(850, t);
    clickFilter.Q.setValueAtTime(3.5, t);

    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(320, t);
    clickOsc.frequency.exponentialRampToValueAtTime(90, t + 0.04);

    clickGain.gain.setValueAtTime(0.5, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.sfxGain);

    clickOsc.start(t);
    clickOsc.stop(t + 0.06);

    // Subtle tactile feedback if on supported mobile device
    if (this.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignore if blocked
      }
    }
  }

  /**
   * Droid footstep/motion servo tick
   */
  public playStep() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Pressure plate / switch activate
   */
  public playPlateClick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.1);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Victory Fanfare chime when completing a level
   */
  public playVictory() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      gain.gain.setValueAtTime(0, t + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.35, t + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.5);
    });

    if (this.hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40, 60, 100]);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Hint shimmer sound
   */
  public playHintSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t);
    osc.frequency.exponentialRampToValueAtTime(1318.5, t + 0.25);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  /**
   * Purchase hint or shop item sound
   */
  public playPurchaseSound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const freqs = [440, 554.37, 659.25, 880];

    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + idx * 0.06);

      gain.gain.setValueAtTime(0.25, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.22);
    });
  }

  /**
   * Wall bump / invalid move sound
   */
  public playBump() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Gentle, relaxing ambient synthesizer music loop
   * Calming chords (F#m9 - Dmaj7 - A - E progression) with soft pad filter
   */
  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    this.isMusicPlaying = true;

    // Polyphonic relaxing chords (MIDI frequencies in Hz)
    const chords = [
      [220.00, 277.18, 329.63, 440.00], // A
      [185.00, 220.00, 277.18, 370.00], // F#m
      [146.83, 220.00, 277.18, 329.63], // Dmaj7
      [164.81, 246.94, 329.63, 392.00], // E
    ];

    const playChord = () => {
      if (!this.isMusicPlaying || !this.musicEnabled || !this.ctx || !this.musicGain) return;

      const chord = chords[this.currentChordIndex];
      this.currentChordIndex = (this.currentChordIndex + 1) % chords.length;
      const t = this.ctx.currentTime;
      const duration = 4.2;

      // Play soft pad voice for each note in chord
      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        // Soft warmth filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, t);
        filter.frequency.exponentialRampToValueAtTime(950, t + 2);
        filter.frequency.exponentialRampToValueAtTime(650, t + duration);

        // Gentle envelope: slow attack, long sustain, soft release
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), t + 1.2);
        gain.gain.linearRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain!);

        osc.start(t);
        osc.stop(t + duration);
      });

      // Also schedule a delicate high sparkle note
      const arpeggioNote = chord[Math.floor(Math.random() * chord.length)] * 2;
      const arpOsc = this.ctx.createOscillator();
      const arpGain = this.ctx.createGain();
      arpOsc.type = 'sine';
      arpOsc.frequency.setValueAtTime(arpeggioNote, t + 1.5);
      arpGain.gain.setValueAtTime(0.001, t + 1.5);
      arpGain.gain.linearRampToValueAtTime(0.04, t + 1.7);
      arpGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

      arpOsc.connect(arpGain);
      arpGain.connect(this.musicGain);
      arpOsc.start(t + 1.5);
      arpOsc.stop(t + 3.3);
    };

    playChord();
    this.musicIntervalId = window.setInterval(() => {
      playChord();
    }, 4000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }
}

export const sound = new SoundEngine();
