// ── snippet_6_firebase_analytics.js ────────────────────────────────────────
// UPDATED src/firebase.js
//
// Adds 3 analytics signals recommended by the product audit:
//   Signal 1 — Archetype distribution   (which archetype users get)
//   Signal 2 — Pattern distribution     (tension key + confidence + dominance)
//   Signal 3 — Return visit tracking    (restores = archetype stability over time)
//
// These three signals, once you have 50+ completions, will tell you:
//   - Whether archetype distribution is healthy (no single type dominating)
//   - What the most common behavioural tension combinations are
//   - Whether archetypes are stable on return visits
//
// HOW TO USE:
//   Replace the entire contents of src/firebase.js with this file.
//   No other files need changing — the function signatures are compatible
//   with any existing firebase.js calls.
//
// VIEW THE DATA:
//   Firebase Console → Analytics → Events
//   Wait 24 hours after first events fire before data appears.
//   To see parameter values: Events → click event name → View in DebugView
// ───────────────────────────────────────────────────────────────────────────

import { initializeApp }     from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

// Firebase config — measurement ID confirmed: G-F438QZ7LP9
const firebaseConfig = {
  apiKey:            "AIzaSyD-placeholder-key",
  authDomain:        "lqm-assessment.firebaseapp.com",
  projectId:         "lqm-assessment",
  storageBucket:     "lqm-assessment.appspot.com",
  messagingSenderId: "placeholder",
  appId:             "placeholder",
  measurementId:     "G-F438QZ7LP9",
};

// Initialise safely — analytics only works in supported browsers
const app = initializeApp(firebaseConfig);
let analytics = null;

isSupported().then(supported => {
  if (supported) analytics = getAnalytics(app);
}).catch(() => {});

// ── Helper: fire event only if analytics is available ────────────────────
function fire(name, params = {}) {
  if (analytics) {
    try { logEvent(analytics, name, params); } catch {}
  }
}


// ── Signal 1: Archetype result ────────────────────────────────────────────
// Fire when quiz completes and archetype is calculated.
// Reveals: which archetypes are most common in your user base.
//
// CALL FROM App.jsx: in handleNext, after setPatterns(calcPatterns(a)):
//   trackArchetypeResult(calcPatterns(a));
//
// Firebase event: "lqm_archetype_result"
// Parameters:
//   primary        — "A" | "B" | "C" | "D"
//   secondary      — "A" | "B" | "C" | "D"
//   confidence     — 0–100 (% of answers pointing to primary)
//   dominance      — "blended" | "balanced" | "dominant"
//   tension_key    — e.g. "A+B", "D+C" (12 possible combinations)
export function trackArchetypeResult(patterns) {
  if (!patterns) return;
  fire("lqm_archetype_result", {
    primary:    patterns.primary,
    secondary:  patterns.secondary,
    confidence: patterns.confidence,
    dominance:  patterns.dominance,
    tension_key:patterns.tensionKey,
  });
}


// ── Signal 2: Pattern distribution ───────────────────────────────────────
// Fire when quiz completes — records the full answer spread.
// Reveals: whether questions have biases, and the real behavioural mix.
//
// CALL FROM App.jsx: alongside trackArchetypeResult:
//   trackPatternDistribution(calcPatterns(a));
//
// Firebase event: "lqm_pattern_distribution"
// Parameters:
//   count_a — number of Structure-orientation answers (A)
//   count_b — number of Analysis-orientation answers (B)
//   count_c — number of Relational-orientation answers (C)
//   count_d — number of Creative-orientation answers (D)
export function trackPatternDistribution(patterns) {
  if (!patterns || !patterns.counts) return;
  fire("lqm_pattern_distribution", {
    count_a: patterns.counts.A || 0,
    count_b: patterns.counts.B || 0,
    count_c: patterns.counts.C || 0,
    count_d: patterns.counts.D || 0,
  });
}


// ── Signal 3: Return visit ────────────────────────────────────────────────
// Fire when a user restores their session (Scenario A1 or C in the
// useEffect URL handler). This is the archetype stability signal.
// Over time, compare primary from this event vs original completion event
// for the same user session to measure consistency.
//
// CALL FROM App.jsx: in the restore scenarios, after setPatterns():
//   trackReturnVisit(calcPatterns(saved.answers));
//   trackReturnVisit(calcPatterns(restoreAnswers));
//
// Firebase event: "lqm_return_visit"
// Parameters:
//   primary     — archetype on this return visit
//   confidence  — how strong the archetype is on return
//   dominance   — blended | balanced | dominant
export function trackReturnVisit(patterns) {
  if (!patterns) return;
  fire("lqm_return_visit", {
    primary:    patterns.primary,
    confidence: patterns.confidence,
    dominance:  patterns.dominance,
  });
}


// ── Existing helper: page/screen tracking ────────────────────────────────
export function trackScreen(screenName) {
  fire("screen_view", { screen_name: screenName });
}

// ── Existing helper: purchase tracking ───────────────────────────────────
export function trackPurchase(product, price) {
  fire("purchase", { product, value: price, currency: "GBP" });
}

// ── Challenge tracking (required by challenge21.js) ───────────────────────
export function trackChallengeEnrolled(challengeType) {
  fire("lqm_challenge_enrolled", { challenge_type: challengeType });
}

export function trackChallengeDay(challengeType, day) {
  fire("lqm_challenge_day", { challenge_type: challengeType, day });
}

export function trackMilestone(challengeType, milestone) {
  fire("lqm_milestone", { challenge_type: challengeType, milestone });
}

export function trackChallengeCompleted(challengeType) {
  fire("lqm_challenge_completed", { challenge_type: challengeType });
}

// ── BrainTraining tracking (required by BrainTraining.jsx) ───────────────
export function trackBrainTrainingStart(archetype) {
  fire("lqm_brain_training_start", { archetype });
}

export function trackChallengeResult(challengeName, score, archetype) {
  fire("lqm_challenge_result", { challenge_name: challengeName, score, archetype });
}

export function trackSessionComplete(xpEarned, totalXP, streak) {
  fire("lqm_session_complete", { xp_earned: xpEarned, total_xp: totalXP, streak });
}

export function trackLevelUp(newLevel, totalXP) {
  fire("lqm_level_up", { new_level: newLevel, total_xp: totalXP });
}

// ── QuantumLiving tracking (required by QuantumLiving.jsx) ───────────────
export function trackQuantumLivingStart(archetype) {
  fire("lqm_quantum_living_start", { archetype });
}

export function trackLawComplete(lawIndex, lawName) {
  fire("lqm_law_complete", { law_index: lawIndex, law_name: lawName });
}

export function trackDayComplete(day, streak) {
  fire("lqm_day_complete", { day, streak });
}

export function trackStreakMilestone(streak) {
  fire("lqm_streak_milestone", { streak });
}
