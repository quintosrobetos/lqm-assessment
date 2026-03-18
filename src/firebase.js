// ============================================================
// firebase.js — LQM Assessment · Firebase Analytics
// ============================================================
// Exports every function imported by:
//   App.jsx, BrainTraining.jsx, QuantumLiving.jsx,
//   challenge21.js, NaturalRemedySearch.jsx
//
// Upload via: GitHub → src → "Add file" → "Upload files" → drag → commit
// DO NOT use the pencil editor — it silently fails on large files.
// ============================================================

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

// ── Firebase Config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyATiBirqslu5YU1pXP_VKqqD3wKhRL9EwY",
  authDomain: "lqm-brain-training.firebaseapp.com",
  projectId: "lqm-brain-training",
  storageBucket: "lqm-brain-training.firebasestorage.app",
  messagingSenderId: "1093025552398",
  appId: "1:1093025552398:web:ef9c8650758dcb16e7c45f",
  measurementId: "G-F438QZ7LP9",
};

// ── Initialisation (safe — never crashes the app) ────────────
let analytics = null;

try {
  const app = initializeApp(firebaseConfig);
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
} catch (err) {
  console.warn("[LQM] Firebase init skipped:", err.message);
}

function safeLog(eventName, params = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (err) {
    console.warn(`[LQM] Analytics event "${eventName}" failed:`, err.message);
  }
}

// ════════════════════════════════════════════════════════════════
// App.jsx imports
// ════════════════════════════════════════════════════════════════

export function trackScreen(screenName) {
  safeLog("screen_view", { screen_name: screenName });
}

export function trackArchetypeResult(archetype, counts) {
  safeLog("lqm_archetype_result", {
    archetype: archetype || "unknown",
    count_A: counts?.A ?? 0,
    count_B: counts?.B ?? 0,
    count_C: counts?.C ?? 0,
    count_D: counts?.D ?? 0,
  });
}

export function trackPatternDistribution(patterns) {
  safeLog("lqm_pattern_distribution", {
    primary: patterns?.primary ?? "unknown",
    secondary: patterns?.secondary ?? "unknown",
    confidence: patterns?.confidence ?? 0,
    dominance: patterns?.dominance ?? 0,
    tension_key: patterns?.tensionKey ?? "none",
  });
}

export function trackReturnVisit(scenario) {
  safeLog("lqm_return_visit", { scenario: scenario || "unknown" });
}

export function trackPurchase(product, price) {
  safeLog("lqm_purchase", {
    product: product || "unknown",
    price: price ?? 0,
    currency: "GBP",
  });
}

// ════════════════════════════════════════════════════════════════
// BrainTraining.jsx imports
// ════════════════════════════════════════════════════════════════

export function trackBrainTrainingStart(difficulty) {
  safeLog("lqm_brain_training_start", { difficulty: difficulty || "standard" });
}

export function trackChallengeResult(challenge, score, reactionMs, accuracy, difficulty) {
  safeLog("lqm_challenge_result", {
    challenge: challenge || "unknown",
    score: score ?? 0,
    reaction_ms: reactionMs ?? 0,
    accuracy: accuracy ?? 0,
    difficulty: difficulty || "standard",
  });
}

export function trackSessionComplete(totalScore, avgScore, difficulty) {
  safeLog("lqm_session_complete", {
    total_score: totalScore ?? 0,
    avg_score: avgScore ?? 0,
    difficulty: difficulty || "standard",
  });
}

export function trackLevelUp(levelName, totalXP) {
  safeLog("lqm_level_up", {
    level: levelName || "unknown",
    total_xp: totalXP ?? 0,
  });
}

// ════════════════════════════════════════════════════════════════
// QuantumLiving.jsx imports
// ════════════════════════════════════════════════════════════════

export function trackQuantumDay(lawsCompleted, totalDays) {
  safeLog("lqm_quantum_day", {
    laws_completed: lawsCompleted ?? 0,
    total_days: totalDays ?? 0,
  });
}

// ════════════════════════════════════════════════════════════════
// challenge21.js imports
// ════════════════════════════════════════════════════════════════

export function trackChallengeEnrolled(type, archetype) {
  safeLog("lqm_challenge_enrolled", {
    type: type || "unknown",
    archetype: archetype || "unknown",
  });
}

export function trackChallengeDay(type, day, sessionsCompleted) {
  safeLog("lqm_challenge_day", {
    type: type || "unknown",
    day: day ?? 0,
    sessions: sessionsCompleted ?? 0,
  });
}

export function trackMilestone(type, milestone, sessions, streak) {
  safeLog("lqm_milestone", {
    type: type || "unknown",
    milestone: milestone || "unknown",
    sessions: sessions ?? 0,
    streak: streak ?? 0,
  });
}

export function trackChallengeCompleted(type, completionRate, avgImprovement) {
  safeLog("lqm_challenge_completed", {
    type: type || "unknown",
    completion_rate: completionRate ?? 0,
    avg_improvement: avgImprovement ?? 0,
  });
}

// ════════════════════════════════════════════════════════════════
// Generic
// ════════════════════════════════════════════════════════════════

export function trackEvent(eventName, params) {
  safeLog(eventName, params || {});
}
