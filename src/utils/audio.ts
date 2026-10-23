/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural sound synthesizer using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = false;
  private bgmInterval: number | null = null;
  private currentNoteIndex: number = 0;

  constructor() {
    // Read persisted preferences
    try {
      const savedSfx = localStorage.getItem('blockblast_sfx');
      if (savedSfx !== null) {
        this.soundEnabled = savedSfx === 'true';
      }
      const savedMusic = localStorage.getItem('blockblast_music');
      if (savedMusic !== null) {
        this.musicEnabled = savedMusic === 'true';
      }
    } catch {
      // Safe fallback if localStorage is disabled
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public get isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public get isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('blockblast_sfx', String(this.soundEnabled));
    } catch {}
    if (this.soundEnabled) {
      this.playButtonClick();
    }
    return this.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    try {
      localStorage.setItem('blockblast_music', String(this.musicEnabled));
    } catch {}

    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  public playButtonClick() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playPickup() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.09);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  public playDrop() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Body punch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    // Subtle click transient
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'sine';
    oscClick.frequency.setValueAtTime(650, now);
    oscClick.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gainClick.gain.setValueAtTime(0.2, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
    oscClick.start(now);
    oscClick.stop(now + 0.04);
  }

  public playInvalid() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  public playLineClear(lineCount: number, comboStreak: number = 0) {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Base pitch offset based on combo streak
    const baseFreq = 330 * Math.pow(1.05946, Math.min(comboStreak * 2, 12));

    // Arpeggio notes scale with line count
    // Single line: 3 notes; multi lines: up to 6 notes with ringing harmonics
    const noteIntervals = lineCount >= 3 
      ? [0, 4, 7, 12, 16, 19] // Major chord extension
      : lineCount === 2 
        ? [0, 4, 7, 12] 
        : [0, 4, 7];

    noteIntervals.forEach((semitones, idx) => {
      const noteTime = now + idx * 0.06;
      const freq = baseFreq * Math.pow(1.05946, semitones);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = lineCount >= 2 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const dur = 0.28 + (idx * 0.03);
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + dur + 0.02);
    });

    // Deep sub boom for simultaneous multi-lines
    if (lineCount >= 2) {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      sub.start(now);
      sub.stop(now + 0.4);
    }
  }

  public playCombo(combo: number) {
    if (!this.soundEnabled || combo <= 1) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime + 0.15; // Slightly delayed after the line clear
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = 523.25 * Math.pow(1.05946, Math.min(combo * 3, 18));
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.2);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.27);
  }

  public playGameOver() {
    if (!this.soundEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [440, 415.3, 392, 349.2, 293.66]; // Descending melancholy motif

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.2, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.24);
    });
  }

  public startMusic() {
    if (!this.musicEnabled) return;
    if (this.bgmInterval !== null) return;

    const ctx = this.initContext();
    if (!ctx) return;

    // Soothing ambient pentatonic progression: C4, E4, G4, A4, B4, C5, D5, G4
    const pentatonicScale = [261.63, 329.63, 392.00, 440.00, 493.88, 523.25, 587.33, 392.00];

    this.bgmInterval = window.setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const freq = pentatonicScale[this.currentNoteIndex % pentatonicScale.length];
      this.currentNoteIndex++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Very soft, relaxing bell-like ambient notes
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    }, 1100);
  }

  public stopMusic() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
