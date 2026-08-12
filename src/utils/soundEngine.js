/**
 * Web Audio Ambient Synthesizer for Game of Life Events
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.volume = 0.15;
    
    // Pentatonic scale frequencies for harmonic ambient chimes (C4 to C6)
    this.scale = [
      261.63, 293.66, 329.63, 392.00, 440.00, // C4, D4, E4, G4, A4
      523.25, 587.33, 659.25, 783.99, 880.00, // C5, D5, E5, G5, A5
      1046.50                                  // C6
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
    }
    return this.enabled;
  }

  playBirthTone(populationRatio = 0.5) {
    if (!this.enabled || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pick note from pentatonic scale based on population ratio
      const noteIdx = Math.floor(populationRatio * (this.scale.length - 1));
      const freq = this.scale[Math.max(0, Math.min(this.scale.length - 1, noteIdx))];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      // Audio context auto-play prevention or buffer edge cases
    }
  }

  triggerHaptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  }
}

export const soundEngine = new SoundEngine();
