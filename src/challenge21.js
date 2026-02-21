// ══════════════════════════════════════════════════════════════════════════
// 21-DAY CHALLENGE SYSTEM
// ══════════════════════════════════════════════════════════════════════════

import { trackChallengeEnrolled, trackChallengeDay, trackMilestone, trackChallengeCompleted } from './firebase';

// ── Challenge Data Structure ──────────────────────────────────────────────
/*
{
  enrolled: true,
  startDate: "2026-02-20",
  currentDay: 12,
  sessionsCompleted: 10,
  daysCompleted: [1,2,3,5,6,7,8,9,10,11,12], // days with activity
  baselineScores: { stroop: 45, nback: 38, ... },
  milestones: {
    day_7: { unlocked: true, date: "2026-02-27" },
    day_14: { unlocked: false },
    day_21: { unlocked: false }
  },
  lastActivity: "2026-03-03"
}
*/

// ── Initialize Challenge ──────────────────────────────────────────────────
export function enrollInChallenge(type, archetype) {
  const key = `lqm_challenge_${type}`;
  const today = new Date().toISOString().split('T')[0];
  
  const challengeData = {
    enrolled: true,
    startDate: today,
    currentDay: 1,
    sessionsCompleted: 0,
    daysCompleted: [],
    baselineScores: {},
    milestones: {
      day_7: { unlocked: false },
      day_14: { unlocked: false },
      day_21: { unlocked: false }
    },
    lastActivity: today
  };
  
  localStorage.setItem(key, JSON.stringify(challengeData));
  trackChallengeEnrolled(type, archetype);
  
  return challengeData;
}

// ── Get Challenge Data ────────────────────────────────────────────────────
export function getChallengeData(type) {
  const key = `lqm_challenge_${type}`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// ── Update Challenge Progress ─────────────────────────────────────────────
export function updateChallengeProgress(type) {
  const data = getChallengeData(type);
  if (!data || !data.enrolled) return null;
  
  const today = new Date().toISOString().split('T')[0];
  const startDate = new Date(data.startDate);
  const todayDate = new Date(today);
  const daysSinceStart = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  // Update current day (capped at 21)
  data.currentDay = Math.min(daysSinceStart, 21);
  data.lastActivity = today;
  
  // Mark today as completed if not already
  if (!data.daysCompleted.includes(data.currentDay)) {
    data.daysCompleted.push(data.currentDay);
    data.daysCompleted.sort((a,b) => a - b);
  }
  
  // Increment sessions
  data.sessionsCompleted++;
  
  // Check for milestone unlocks
  checkAndUnlockMilestones(data, type);
  
  // Save
  const key = `lqm_challenge_${type}`;
  localStorage.setItem(key, JSON.stringify(data));
  
  // Track analytics
  trackChallengeDay(type, data.currentDay, data.sessionsCompleted);
  
  return data;
}

// ── Check Milestone Unlocks ───────────────────────────────────────────────
function checkAndUnlockMilestones(data, type) {
  const today = new Date().toISOString().split('T')[0];
  
  // Day 7 milestone
  if (data.currentDay >= 7 && !data.milestones.day_7.unlocked) {
    data.milestones.day_7 = { unlocked: true, date: today };
    trackMilestone(type, 'day_7', data.sessionsCompleted, getStreak(data));
  }
  
  // Day 14 milestone
  if (data.currentDay >= 14 && !data.milestones.day_14.unlocked) {
    data.milestones.day_14 = { unlocked: true, date: today };
    trackMilestone(type, 'day_14', data.sessionsCompleted, getStreak(data));
  }
  
  // Day 21 milestone (completion)
  if (data.currentDay >= 21 && !data.milestones.day_21.unlocked) {
    data.milestones.day_21 = { unlocked: true, date: today };
    const completionRate = (data.daysCompleted.length / 21) * 100;
    trackMilestone(type, 'day_21', data.sessionsCompleted, getStreak(data));
    trackChallengeCompleted(type, completionRate, 0); // avgImprovement calculated elsewhere
  }
}

// ── Get Current Streak ────────────────────────────────────────────────────
export function getStreak(data) {
  if (!data || !data.daysCompleted.length) return 0;
  
  const sorted = [...data.daysCompleted].sort((a,b) => b - a); // descending
  let streak = 1;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i+1] === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// ── Calculate Days Until Next Milestone ───────────────────────────────────
export function getDaysUntilNextMilestone(data) {
  if (!data) return null;
  
  if (!data.milestones.day_7.unlocked) return 7 - data.currentDay;
  if (!data.milestones.day_14.unlocked) return 14 - data.currentDay;
  if (!data.milestones.day_21.unlocked) return 21 - data.currentDay;
  
  return 0; // Challenge complete
}

// ── Get Milestone Status ──────────────────────────────────────────────────
export function getMilestoneStatus(data) {
  if (!data) return { current: 0, next: 7, total: 21 };
  
  let current = 0;
  let next = 7;
  
  if (data.milestones.day_21.unlocked) {
    current = 21;
    next = 21;
  } else if (data.milestones.day_14.unlocked) {
    current = 14;
    next = 21;
  } else if (data.milestones.day_7.unlocked) {
    current = 7;
    next = 14;
  }
  
  return { current, next, total: 21 };
}

// ── Store Baseline Scores ─────────────────────────────────────────────────
export function storeBaselineScores(type, scores) {
  const data = getChallengeData(type);
  if (!data) return;
  
  // Only store if we don't have baseline yet
  if (Object.keys(data.baselineScores).length === 0) {
    data.baselineScores = scores;
    const key = `lqm_challenge_${type}`;
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// ── Calculate Improvement ─────────────────────────────────────────────────
export function calculateImprovement(type, currentScores) {
  const data = getChallengeData(type);
  if (!data || !data.baselineScores || Object.keys(data.baselineScores).length === 0) {
    return null;
  }
  
  const improvements = {};
  let totalImprovement = 0;
  let count = 0;
  
  Object.keys(currentScores).forEach(key => {
    if (data.baselineScores[key]) {
      const baseline = data.baselineScores[key];
      const current = currentScores[key];
      const improvement = ((current - baseline) / baseline) * 100;
      improvements[key] = Math.round(improvement);
      totalImprovement += improvement;
      count++;
    }
  });
  
  const averageImprovement = count > 0 ? Math.round(totalImprovement / count) : 0;
  
  return {
    individual: improvements,
    average: averageImprovement
  };
}

// ── Check If At Risk (3+ days without activity) ───────────────────────────
export function isAtRisk(data) {
  if (!data || !data.enrolled) return false;
  
  const today = new Date();
  const lastActivity = new Date(data.lastActivity);
  const daysSinceActivity = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  return daysSinceActivity >= 3 && data.currentDay < 21;
}

// ── Get Completion Percentage ─────────────────────────────────────────────
export function getCompletionPercentage(data) {
  if (!data) return 0;
  return Math.min(100, Math.round((data.daysCompleted.length / 21) * 100));
}

// ── Get Days Active (for display) ─────────────────────────────────────────
export function getDaysActive(data) {
  if (!data) return 0;
  return data.daysCompleted.length;
}

// ── Check If Challenge Is Complete ────────────────────────────────────────
export function isChallengeComplete(data) {
  return data && data.milestones.day_21.unlocked;
}
