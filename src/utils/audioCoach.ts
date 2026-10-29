/**
 * Web Audio and Voice Coach utility for Treadmill workouts
 */

class AudioCoach {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play crisp athlete tone
  public playTone(freq = 440, type: OscillatorType = 'sine', duration = 0.15, gainVal = 0.2): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay or permissions restriction safe catch
    }
  }

  // Countdown beep (3, 2, 1)
  public playCountdownBeep(isGo = false): void {
    if (isGo) {
      this.playTone(880, 'triangle', 0.4, 0.3);
    } else {
      this.playTone(440, 'sine', 0.18, 0.2);
    }
  }

  // Interval speed shift chime
  public playSpeedChangeChime(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  // Workout finished fanfare
  public playVictoryChime(): void {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.35, 0.25);
        }, idx * 140);
      });
    } catch {
      // Ignore
    }
  }

  // Speak Arabic voice cue
  public speakArabic(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // cancel pending
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Try to find an Arabic voice if installed
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.lang.includes('ar_'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fail gracefully
    }
  }

  // Device vibration pattern for mobile
  public vibrate(pattern: number | number[] = 150): void {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe catch
      }
    }
  }
}

export const audioCoach = new AudioCoach();
