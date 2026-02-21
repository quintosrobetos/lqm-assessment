// ══════════════════════════════════════════════════════════════════════════
// SOUND EFFECTS - Web Audio API
// ══════════════════════════════════════════════════════════════════════════

/*
Simple browser-based sounds - no files needed!
Uses Web Audio API to generate tones programmatically.
*/

// Create audio context (lazy initialization)
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// ── Challenge Complete Sound ─────────────────────────────────────────────
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Pleasant "ding" sound
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Silently fail if audio not supported
  }
}

// ── All Challenges Complete (Celebration) ────────────────────────────────
export function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    
    // Triple ascending notes
    const notes = [523.25, 659.25, 783.99]; // C, E, G (major chord)
    
    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4);
      
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {
    // Silently fail
  }
}

// ── Level Up Sound ────────────────────────────────────────────────────────
export function playLevelUpSound() {
  try {
    const ctx = getAudioContext();
    
    // Ascending arpeggio
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  } catch (e) {
    // Silently fail
  }
}

// ── Milestone Unlock (Day 7, 14, 21) ──────────────────────────────────────
export function playMilestoneSound() {
  try {
    const ctx = getAudioContext();
    
    // Triumphant fanfare
    const melody = [
      { freq: 523.25, time: 0 },    // C
      { freq: 659.25, time: 0.15 }, // E
      { freq: 783.99, time: 0.3 },  // G
      { freq: 1046.5, time: 0.45 }, // C (high)
    ];
    
    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      
      gainNode.gain.setValueAtTime(0.25, ctx.currentTime + note.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.5);
      
      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + 0.5);
    });
  } catch (e) {
    // Silently fail
  }
}

// ── Quantum Living Law Complete ───────────────────────────────────────────
export function playQuantumSound() {
  try {
    const ctx = getAudioContext();
    
    // Gentle ascending chime
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Silently fail
  }
}

// ── Streak Achievement ────────────────────────────────────────────────────
export function playStreakSound() {
  try {
    const ctx = getAudioContext();
    
    // Quick double beep
    [0, 0.15].forEach(delay => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(1000, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);
      
      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + 0.1);
    });
  } catch (e) {
    // Silently fail
  }
}
