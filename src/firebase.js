// ══════════════════════════════════════════════════════════════════════════
// FIREBASE SETUP INSTRUCTIONS - READ THIS FIRST
// ══════════════════════════════════════════════════════════════════════════
/*
TOTAL TIME: 20 minutes

STEP 1: CREATE FIREBASE PROJECT (5 mins)
1. Go to: https://firebase.google.com
2. Click "Get Started" → "Add Project"
3. Name: "lqm-brain-training"
4. Enable Google Analytics: YES
5. Click through to create

STEP 2: ADD WEB APP (5 mins)
1. In Firebase Console, click Web icon (</>)
2. App nickname: "LQM Assessment"
3. Copy the firebaseConfig values
4. Paste them below (replace PASTE_YOUR_XXX placeholders)

STEP 3: INSTALL FIREBASE (2 mins)
In your terminal:
  cd Desktop/lqm-assessment
  npm install firebase

STEP 4: DEPLOY (1 min)
  git add .
  git commit -m "Add Firebase analytics"
  git push

STEP 5: VERIFY (24 hours later)
Go to Firebase Console → Analytics → Events
You should see events like "challenge_enrolled", "milestone_reached"

*/

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyATiBirqslu5YU1pXP_VKqqD3wKhRL9EwY",
  authDomain: "lqm-brain-training.firebaseapp.com",
  projectId: "lqm-brain-training",
  storageBucket: "lqm-brain-training.firebasestorage.app",
  messagingSenderId: "109302555239B",
  appId: "1:109302555239B:web:ef9c8650758dcb16e7c45f",
  measurementId: "G-F438QZ7LP9"
};

let app;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  console.log('✅ Firebase initialized');
} catch (error) {
  console.error('Firebase error:', error);
}

// ══════════════════════════════════════════════════════════════════════════
// 21-DAY CHALLENGE TRACKING
// ══════════════════════════════════════════════════════════════════════════

export function trackChallengeEnrolled(type, archetype) {
  if (!analytics) return;
  logEvent(analytics, 'challenge_enrolled', { 
    challenge_type: type,
    archetype: archetype 
  });
}

export function trackChallengeDay(type, day, sessionsCompleted) {
  if (!analytics) return;
  logEvent(analytics, 'challenge_day_completed', { 
    challenge_type: type,
    day: day,
    total_sessions: sessionsCompleted
  });
}

export function trackMilestone(type, milestone, totalSessions, streak) {
  if (!analytics) return;
  logEvent(analytics, 'milestone_reached', { 
    challenge_type: type,
    milestone: milestone,
    total_sessions: totalSessions,
    streak: streak
  });
}

export function trackChallengeCompleted(type, completionRate, avgImprovement) {
  if (!analytics) return;
  logEvent(analytics, 'challenge_completed', { 
    challenge_type: type,
    completion_rate: completionRate,
    avg_improvement: avgImprovement
  });
}

export function trackBrainTrainingStart(difficulty) {
  if (!analytics) return;
  logEvent(analytics, 'brain_training_started', { difficulty });
}

export function trackChallengeResult(challenge, score, reactionMs, accuracy, difficulty) {
  if (!analytics) return;
  logEvent(analytics, 'challenge_result', { 
    challenge_name: challenge,
    score,
    reaction_ms: reactionMs,
    accuracy,
    difficulty
  });
}

export function trackSessionComplete(totalScore, avgScore, difficulty) {
  if (!analytics) return;
  logEvent(analytics, 'brain_session_complete', { 
    total_score: totalScore,
    avg_score: avgScore,
    difficulty
  });
}

export function trackLevelUp(newLevel, totalXP) {
  if (!analytics) return;
  logEvent(analytics, 'level_up', { new_level: newLevel, total_xp: totalXP });
}

export function trackQuantumDay(lawsCompleted, totalDays) {
  if (!analytics) return;
  logEvent(analytics, 'quantum_living_day', { 
    laws_completed_today: lawsCompleted,
    total_days_completed: totalDays
  });
}

export function trackAddonUnlocked(addon, price) {
  if (!analytics) return;
  logEvent(analytics, 'addon_unlocked', { addon_type: addon, price });
}

export function trackPDFDownload(type) {
  if (!analytics) return;
  logEvent(analytics, 'pdf_downloaded', { download_type: type });
}

export function trackNudgeShown(nudgeType, day) {
  if (!analytics) return;
  logEvent(analytics, 'nudge_shown', { nudge_type: nudgeType, day });
}

export { analytics };
