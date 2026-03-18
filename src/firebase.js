// ============================================================
// firebase.js — LQM Assessment · Firebase Analytics
// ============================================================
//
// BEFORE UPLOADING: paste your Firebase config values below.
// Find them at: https://console.firebase.google.com
//   → Project Settings → General → Your apps → Web app → Config
//
// Upload via GitHub drag-and-drop:
//   github.com/quintosrobetos/lqm-assessment/tree/main/src
//   → "Add file" → "Upload files" → drag this file → commit
//
// DO NOT use the pencil/edit icon — it silently fails on large files.
// ============================================================

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

// ── Firebase Config ──────────────────────────────────────────
// Replace the placeholder strings with your actual values.
// measurementId is already correct.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "lqm-assessment.firebaseapp.com",
  projectId: "lqm-assessment",
  storageBucket: "lqm-assessment.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
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

/** Safe wrapper — silently no-ops if analytics is unavailable */
function safeLog(eventName, params = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch (err) {
    console.warn(`[LQM] Analytics event "${eventName}" failed:`, err.message);
  }
}

// ============================================================
// EXPORTS — every function imported by App.jsx, BrainTraining.jsx,
// QuantumLiving.jsx, challenge21.js, and NaturalRemedySearch.jsx
// ============================================================

// ── Core quiz & archetype (App.jsx) ──────────────────────────

export function trackScreen(screenName) {
  safeLog("screen_view", { screen_name: screenName });
}

export function trackQuizStart() {
  safeLog("lqm_quiz_start");
}

export function trackQuizComplete(answers) {
  safeLog("lqm_quiz_complete", {
    answer_count: answers ? answers.length : 0,
  });
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

// ── Session & return visits (App.jsx) ────────────────────────

export function trackReturnVisit(scenario) {
  safeLog("lqm_return_visit", {
    scenario: scenario || "unknown",
  });
}

export function trackSessionRestore(method) {
  safeLog("lqm_session_restore", {
    method: method || "unknown",
  });
}

// ── Payments (App.jsx) ───────────────────────────────────────

export function trackPurchase(product, price) {
  safeLog("lqm_purchase", {
    product: product || "unknown",
    price: price ?? 0,
    currency: "GBP",
  });
}

export function trackPaymentClick(product) {
  safeLog("lqm_payment_click", {
    product: product || "unknown",
  });
}

export function trackAddOnPurchase(addon) {
  safeLog("lqm_addon_purchase", {
    addon: addon || "unknown",
  });
}

// ── Delivery & email (App.jsx) ───────────────────────────────

export function trackDeliveryConfirmed(ref) {
  safeLog("lqm_delivery_confirmed", {
    ref: ref || "unknown",
  });
}

export function trackEmailCapture(context) {
  safeLog("lqm_email_capture", {
    context: context || "unknown",
  });
}

// ── Sharing (App.jsx) ────────────────────────────────────────

export function trackShareClick(method) {
  safeLog("lqm_share_click", {
    method: method || "unknown",
  });
}

// ── Restore codes (App.jsx) ─────────────────────────────────

export function trackRestoreCode(success) {
  safeLog("lqm_restore_code", {
    success: !!success,
  });
}

// ── Brain Training (BrainTraining.jsx) ───────────────────────

export function trackChallengeResult(challenge, result) {
  safeLog("lqm_challenge_result", {
    challenge: challenge || "unknown",
    result: result ?? "unknown",
  });
}

export function trackBrainSession(sessionData) {
  safeLog("lqm_brain_session", {
    xp: sessionData?.xp ?? 0,
    streak: sessionData?.streak ?? 0,
    exercise: sessionData?.exercise ?? "unknown",
  });
}

export function trackXPGain(amount, source) {
  safeLog("lqm_xp_gain", {
    amount: amount ?? 0,
    source: source || "unknown",
  });
}

// ── Quantum Living (QuantumLiving.jsx) ───────────────────────

export function trackLivingSession(sessionData) {
  safeLog("lqm_living_session", {
    activity: sessionData?.activity ?? "unknown",
    streak: sessionData?.streak ?? 0,
  });
}

export function trackLivingStreak(streak) {
  safeLog("lqm_living_streak", {
    streak: streak ?? 0,
  });
}

// ── 21-Day Challenge (challenge21.js) ────────────────────────

export function trackChallengeStart(challengeType) {
  safeLog("lqm_challenge_start", {
    type: challengeType || "unknown",
  });
}

export function trackChallengeProgress(day, challengeType) {
  safeLog("lqm_challenge_progress", {
    day: day ?? 0,
    type: challengeType || "unknown",
  });
}

export function trackChallengeComplete(challengeType) {
  safeLog("lqm_challenge_complete", {
    type: challengeType || "unknown",
  });
}

// ── Natural Remedy (NaturalRemedySearch.jsx) ─────────────────

export function trackRemedySearch(query) {
  safeLog("lqm_remedy_search", {
    query: query || "",
  });
}

// ── Generic / catch-all ──────────────────────────────────────

export function trackEvent(eventName, params) {
  safeLog(eventName, params || {});
}
