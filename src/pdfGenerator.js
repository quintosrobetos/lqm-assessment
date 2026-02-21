// ══════════════════════════════════════════════════════════════════════════
// PDF GENERATION FOR PROGRESS REPORTS
// ══════════════════════════════════════════════════════════════════════════

/*
INSTALLATION REQUIRED:
npm install jspdf

This module generates downloadable PDF reports for:
- 21-Day Transformation Report (Brain Training)
- Wellness Journey Report (Quantum Living)
- Transformation Certificates
*/

import { jsPDF } from 'jspdf';
import { trackPDFDownload } from './firebase';

// ── Generate 21-Day Brain Training Report ────────────────────────────────
export function generateBrainTrainingReport(userData, challengeData, archetype) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFillColor(7, 15, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(0, 200, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('LQM BRAIN TRAINING', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('21-Day Transformation Report', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated: ${today}`, pageWidth / 2, 50, { align: 'center' });
  
  // Challenge Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Challenge Summary', 20, 70);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const daysCompleted = challengeData?.daysCompleted?.length || 0;
  const sessions = challengeData?.sessionsCompleted || 0;
  const totalXP = userData?.totalXP || 0;
  const level = totalXP >= 500 ? "Advanced" : totalXP >= 250 ? "Proficient" : totalXP >= 100 ? "Developing" : "Initiate";
  
  doc.text(`Days Active: ${daysCompleted} of 21`, 20, 85);
  doc.text(`Total Sessions: ${sessions}`, 20, 95);
  doc.text(`Neural Level: ${level}`, 20, 105);
  doc.text(`Total XP: ${totalXP}`, 20, 115);
  
  // Completion Rate
  const completion = Math.round((daysCompleted / 21) * 100);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Completion Rate: ${completion}%`, 20, 130);
  
  // Milestones
  doc.setFontSize(16);
  doc.text('Milestones Achieved', 20, 150);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  let yPos = 165;
  
  if(challengeData?.milestones?.day_7?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 7: First Week Complete', 20, yPos);
    yPos += 10;
  }
  
  if(challengeData?.milestones?.day_14?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 14: Midpoint Reached', 20, yPos);
    yPos += 10;
  }
  
  if(challengeData?.milestones?.day_21?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 21: Transformation Complete', 20, yPos);
    yPos += 15;
  }
  
  // Archetype Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Your Profile', 20, yPos + 10);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const archetypeNames = {A: "Systems Architect", B: "Deep Learner", C: "Relational Catalyst", D: "Visionary Pioneer"};
  const archetypeName = archetypeNames[archetype] || "Unknown";
  doc.text(`Archetype: ${archetypeName}`, 20, yPos + 25);
  
  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Learning Quantum Method • lqmmethod.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('This report is for personal use only', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save
  const filename = `LQM_Brain_Training_Report_${today.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
  
  // Track analytics
  trackPDFDownload('brain_training_report');
}

// ── Generate Quantum Living Report ───────────────────────────────────────
export function generateQuantumLivingReport(challengeData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFillColor(7, 15, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('QUANTUM LIVING', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('21-Day Wellness Journey Report', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated: ${today}`, pageWidth / 2, 50, { align: 'center' });
  
  // Challenge Summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Wellness Journey Summary', 20, 70);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const daysCompleted = challengeData?.daysCompleted?.length || 0;
  const completion = Math.round((daysCompleted / 21) * 100);
  
  doc.text(`Days Active: ${daysCompleted} of 21`, 20, 85);
  doc.text(`Completion Rate: ${completion}%`, 20, 95);
  
  // Laws
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('The 5 Quantum Laws', 20, 115);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const laws = [
    '🌙 Law I: Quantum Rest',
    '🌿 Law II: Fresh Air',
    '⚖️ Law III: Temperance',
    '⚡ Law IV: Exercise',
    '🌱 Law V: Simple Nourishment'
  ];
  
  let yPos = 130;
  laws.forEach(law => {
    doc.text(law, 20, yPos);
    yPos += 10;
  });
  
  // Milestones
  yPos += 10;
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Milestones Achieved', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  
  if(challengeData?.milestones?.day_7?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 7: First Week Complete', 20, yPos);
    yPos += 10;
  }
  
  if(challengeData?.milestones?.day_14?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 14: Two Weeks Strong', 20, yPos);
    yPos += 10;
  }
  
  if(challengeData?.milestones?.day_21?.unlocked){
    doc.setTextColor(52, 211, 153);
    doc.text('✓ Day 21: Wellness Transformation Complete', 20, yPos);
  }
  
  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text('Learning Quantum Method • lqmmethod.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('This report is for personal use only', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save
  const filename = `LQM_Quantum_Living_Report_${today.replace(/\//g, '-')}.pdf`;
  doc.save(filename);
  
  // Track analytics
  trackPDFDownload('quantum_living_report');
}

// ── Generate Transformation Certificate ──────────────────────────────────
export function generateTransformationCertificate(type, name, challengeData) {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Background
  doc.setFillColor(7, 15, 30);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Border
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Title
  doc.setTextColor(0, 200, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 40, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const title = type === 'brain' ? '21-Day Brain Training Transformation' : '21-Day Quantum Living Journey';
  doc.text(title, pageWidth / 2, 55, { align: 'center' });
  
  // Presented to
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text('This certifies that', pageWidth / 2, 80, { align: 'center' });
  
  // Name
  doc.setFontSize(28);
  doc.setTextColor(52, 211, 153);
  doc.setFont(undefined, 'bolditalic');
  const displayName = name || 'Quantum Achiever';
  doc.text(displayName, pageWidth / 2, 100, { align: 'center' });
  
  // Achievement
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.setFont(undefined, 'normal');
  doc.text('has successfully completed the', pageWidth / 2, 120, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('Learning Quantum Method', pageWidth / 2, 133, { align: 'center' });
  doc.text(title, pageWidth / 2, 145, { align: 'center' });
  
  // Stats
  const completion = challengeData?.daysCompleted?.length || 0;
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180);
  doc.setFont(undefined, 'normal');
  doc.text(`${completion} days completed • ${new Date().toLocaleDateString()}`, pageWidth / 2, 165, { align: 'center' });
  
  // Footer
  doc.setFontSize(10);
  doc.text('Learning Quantum Method', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.text('lqmmethod.com', pageWidth / 2, pageHeight - 13, { align: 'center' });
  
  // Save
  const today = new Date().toLocaleDateString().replace(/\//g, '-');
  const filename = `LQM_Transformation_Certificate_${today}.pdf`;
  doc.save(filename);
  
  // Track analytics
  trackPDFDownload('transformation_certificate');
}
