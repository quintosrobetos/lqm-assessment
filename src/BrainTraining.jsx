// ════════════════════════════════════════════════════════════════════════════
// LQM BRAIN TRAINING — 5 Science-Backed Cognitive Challenges
// ════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { 
  getChallengeData, 
  enrollInChallenge, 
  updateChallengeProgress,
  storeBaselineScores,
  calculateImprovement,
  getStreak,
  getDaysUntilNextMilestone,
  getMilestoneStatus,
  getCompletionPercentage,
  getDaysActive,
  isChallengeComplete
} from "./challenge21";
import { 
  trackBrainTrainingStart, 
  trackChallengeResult,
  trackSessionComplete,
  trackLevelUp
} from "./firebase";
import {
  playSuccessSound,
  playCelebrationSound,
  playLevelUpSound,
  playMilestoneSound
} from "./sounds";

// ── Gameplay sound effects ──
// Shared audio context - created once to prevent browser blocking
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

function playShootSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}

function playHitSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

function playMissSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

// ── Brand palette ─────────────────────────────────────────────────────────
const BG      = "#070F1E";
const DARK    = "#0D1830";
const DARK2   = "#111E38";
const PANEL   = "rgba(255,255,255,0.045)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.08)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.75)";  // Improved contrast
const DIMMED  = "rgba(255,255,255,0.40)";  // Improved contrast
const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const GREEN   = "#34D399";
const AMBER   = "#FBBF24";
const RED     = "#F87171";
const VIOLET  = "#A78BFA";
const PURPLE  = "#8B5CF6";

// ── Difficulty settings ───────────────────────────────────────────────────
const DIFFICULTY = {
  beginner: {
    name: "Beginner",
    desc: "Gentler pace, more time to respond. Perfect for getting started.",
    color: "#34D399",
    stroop: { time: 60, rounds: 15 },
    nback: { n: 1, length: 10, display: 2000, isi: 700 },
    matrix: { hints: 2, puzzles: 3 },
    reaction: { reps: 6, minDelay: 1500, maxDelay: 3500 },
    switch: { items: 8 },
    defense: { waveDuration: 30, spawnWave1: 1400, spawnWave2: 1100, spawnWave3: 850, fallWave1: 2.0, fallWave2: 2.8, fallWave3: 3.8 },
  },
  standard: {
    name: "Standard",
    desc: "The original experience. Balanced challenge for most people.",
    color: "#00C8FF",
    stroop: { time: 45, rounds: 18 },
    nback: { n: 2, length: 14, display: 1700, isi: 500 },
    matrix: { hints: 1, puzzles: 4 },
    reaction: { reps: 8, minDelay: 1000, maxDelay: 2500 },
    switch: { items: 12 },
    defense: { waveDuration: 30, spawnWave1: 1200, spawnWave2: 900, spawnWave3: 650, fallWave1: 2.5, fallWave2: 3.5, fallWave3: 4.8 },
  },
  advanced: {
    name: "Advanced",
    desc: "Faster pace, tighter timing. For experienced users seeking maximum challenge.",
    color: "#A78BFA",
    stroop: { time: 35, rounds: 20 },
    nback: { n: 3, length: 16, display: 1400, isi: 400 },
    matrix: { hints: 0, puzzles: 4 },
    reaction: { reps: 10, minDelay: 800, maxDelay: 2000 },
    switch: { items: 15 },
    defense: { waveDuration: 30, spawnWave1: 1000, spawnWave2: 700, spawnWave3: 500, fallWave1: 3.0, fallWave2: 4.2, fallWave3: 5.8 },
  },
};

// ── Neural levels ─────────────────────────────────────────────────────────
const LEVELS = [
  { name:"Initiate",     min:0,    color:"#64748B" },
  { name:"Analyst",      min:300,  color:"#38BDF8" },
  { name:"Strategist",   min:700,  color:"#34D399" },
  { name:"Architect",    min:1400, color:"#FBBF24" },
  { name:"Quantum Mind", min:2500, color:"#A78BFA" },
];
function getLevel(xp){ return [...LEVELS].reverse().find(l=>xp>=l.min)||LEVELS[0]; }

// ── Daily actions ─────────────────────────────────────────────────────────
const DAILY_ACTIONS = [
  { title:"The Intentional Start", action:"Before touching your phone, write one sentence: the single outcome that would make today a success. Not a list — one sentence.", science:"Primes your prefrontal cortex for goal-directed behaviour before reactive digital inputs can hijack your attentional system." },
  { title:"The Cognitive Pattern Interrupt", action:"At 3pm, stop for 90 seconds. Name 5 things you can see, 4 you can hear, 3 you can physically feel. Then resume.", science:"Activates the parasympathetic nervous system and clears accumulated cognitive load, preventing the afternoon attention decline from becoming a full drift." },
  { title:"The Reframe Protocol", action:"Identify one problem you've been avoiding. Rewrite it beginning with 'How might I...' rather than 'The problem is...'", science:"Question framing activates exploratory neural pathways in the prefrontal cortex instead of the threat-response amygdala circuits." },
  { title:"The Feynman Compression", action:"Choose one thing you've learned this week. Explain it out loud as if to a curious 12-year-old. Notice where your explanation breaks down.", science:"Teaching forces neural compression of knowledge — the act of simplification identifies gaps and deepens encoding by up to 90% compared to passive re-reading." },
  { title:"The Energy Ledger", action:"At the day's end, score each major activity: energy given vs energy received (-3 to +3). Identify your highest drain and highest gain.", science:"Energy awareness is the prerequisite to intentional design. Most people run on autopilot until depletion. This practice builds metacognitive regulation." },
  { title:"The Minimum Viable Habit", action:"Choose one behaviour you've postponed. Make it so small it embarrasses you. Do it for exactly 2 minutes today.", science:"Tiny actions bypass the brain's implementation intention resistance. The goal is not the 2 minutes — it is the identity signal of having started." },
  { title:"The Contrast Method", action:"Spend 90 seconds imagining your ideal day tomorrow. Then 60 seconds identifying the one most likely obstacle. Plan specifically for that obstacle.", science:"Mental contrasting — positive vision followed by obstacle planning — is shown to triple follow-through rates compared to positive visualisation alone." },
];

// ── Stroop data ───────────────────────────────────────────────────────────
const STROOP_COLORS = [
  { name:"RED",   hex:"#EF4444" },
  { name:"BLUE",  hex:"#3B82F6" },
  { name:"GREEN", hex:"#22C55E" },
  { name:"AMBER", hex:"#F59E0B" },
];
function genStroopRound(){
  const ink  = STROOP_COLORS[Math.floor(Math.random()*STROOP_COLORS.length)];
  let word   = STROOP_COLORS[Math.floor(Math.random()*STROOP_COLORS.length)];
  if(Math.random()<0.75){ while(word.name===ink.name) word=STROOP_COLORS[Math.floor(Math.random()*STROOP_COLORS.length)]; }
  return { word:word.name, inkColor:ink.hex, inkName:ink.name };
}

// ── N-Back data ───────────────────────────────────────────────────────────
const NBACK_COLORS = ["#EF4444","#3B82F6","#22C55E","#F59E0B","#A78BFA","#F472B6"];
function genNBackSequence(length=14,n=2){
  const seq=[];
  for(let i=0;i<length;i++){
    if(i>=n&&Math.random()<0.35){
      seq.push({...seq[i-n],isMatch:true});
    } else {
      let item;
      do { item={color:NBACK_COLORS[Math.floor(Math.random()*NBACK_COLORS.length)],pos:Math.floor(Math.random()*9)}; }
      while(i>=n&&item.pos===seq[i-n].pos&&item.color===seq[i-n].color);
      seq.push({...item,isMatch:false});
    }
  }
  return seq;
}

// ── Shape helper ──────────────────────────────────────────────────────────
function ShapeEl({shape,color,size=36}){
  const s={width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center"};
  if(shape==="circle")   return <div style={s}><div style={{width:size*.82,height:size*.82,borderRadius:"50%",background:color,boxShadow:`0 0 ${size*.3}px ${color}66`}}/></div>;
  if(shape==="square")   return <div style={s}><div style={{width:size*.76,height:size*.76,background:color,borderRadius:4,boxShadow:`0 0 ${size*.3}px ${color}66`}}/></div>;
  if(shape==="triangle") return <div style={s}><svg width={size*.86} height={size*.86} viewBox="0 0 40 40"><polygon points="20,3 37,37 3,37" fill={color}/><polygon points="20,3 37,37 3,37" fill="none" stroke={color} strokeWidth="1" opacity=".4"/></svg></div>;
  if(shape==="diamond")  return <div style={s}><svg width={size*.86} height={size*.86} viewBox="0 0 40 40"><polygon points="20,2 38,20 20,38 2,20" fill={color}/></svg></div>;
  return null;
}

// ── Pattern Matrix puzzles ────────────────────────────────────────────────
const PATTERN_PUZZLES = [
  { grid:[{sh:"circle",co:"#EF4444"},{sh:"square",co:"#EF4444"},{sh:"triangle",co:"#EF4444"},{sh:"circle",co:"#3B82F6"},{sh:"square",co:"#3B82F6"},{sh:"triangle",co:"#3B82F6"},{sh:"circle",co:"#22C55E"},{sh:"square",co:"#22C55E"},null], answer:{sh:"triangle",co:"#22C55E"}, options:[{sh:"triangle",co:"#22C55E"},{sh:"diamond",co:"#22C55E"},{sh:"triangle",co:"#F59E0B"},{sh:"circle",co:"#22C55E"}], rule:"Each row cycles through three shapes. Each row has its own colour." },
  { grid:[{sh:"diamond",co:"#F59E0B"},{sh:"diamond",co:"#EF4444"},{sh:"diamond",co:"#3B82F6"},{sh:"circle",co:"#F59E0B"},{sh:"circle",co:"#EF4444"},{sh:"circle",co:"#3B82F6"},{sh:"square",co:"#F59E0B"},{sh:"square",co:"#EF4444"},null], answer:{sh:"square",co:"#3B82F6"}, options:[{sh:"square",co:"#3B82F6"},{sh:"square",co:"#22C55E"},{sh:"circle",co:"#3B82F6"},{sh:"diamond",co:"#3B82F6"}], rule:"Each column has a unique colour. Each row uses the same shape." },
  { grid:[{sh:"circle",co:"#EF4444"},{sh:"square",co:"#3B82F6"},{sh:"triangle",co:"#22C55E"},{sh:"square",co:"#22C55E"},{sh:"triangle",co:"#EF4444"},{sh:"circle",co:"#3B82F6"},{sh:"triangle",co:"#3B82F6"},{sh:"circle",co:"#22C55E"},null], answer:{sh:"square",co:"#EF4444"}, options:[{sh:"square",co:"#EF4444"},{sh:"square",co:"#22C55E"},{sh:"triangle",co:"#EF4444"},{sh:"circle",co:"#EF4444"}], rule:"Each shape and each colour appears exactly once per row and column." },
  { grid:[{sh:"circle",co:"#A78BFA"},{sh:"circle",co:"#A78BFA"},{sh:"square",co:"#A78BFA"},{sh:"circle",co:"#F472B6"},{sh:"square",co:"#F472B6"},{sh:"square",co:"#F472B6"},{sh:"square",co:"#22C55E"},{sh:"square",co:"#22C55E"},null], answer:{sh:"circle",co:"#22C55E"}, options:[{sh:"circle",co:"#22C55E"},{sh:"square",co:"#22C55E"},{sh:"circle",co:"#F472B6"},{sh:"triangle",co:"#22C55E"}], rule:"Count shapes per row — each colour follows a 2-1 or 1-2 distribution pattern." },
];

// ── Reaction shapes/colors ────────────────────────────────────────────────
const REACTION_SHAPES = ["circle","square","diamond","triangle"];
const REACTION_COLORS = ["#EF4444","#3B82F6","#22C55E","#F59E0B","#A78BFA"];

// ── Cognitive Switch items ────────────────────────────────────────────────
const SWITCH_ITEMS = [
  {shape:"circle",color:"#EF4444",colorName:"Red"},{shape:"square",color:"#3B82F6",colorName:"Blue"},
  {shape:"circle",color:"#22C55E",colorName:"Green"},{shape:"diamond",color:"#EF4444",colorName:"Red"},
  {shape:"square",color:"#F59E0B",colorName:"Amber"},{shape:"triangle",color:"#3B82F6",colorName:"Blue"},
  {shape:"diamond",color:"#22C55E",colorName:"Green"},{shape:"triangle",color:"#EF4444",colorName:"Red"},
  {shape:"circle",color:"#F59E0B",colorName:"Amber"},{shape:"square",color:"#22C55E",colorName:"Green"},
  {shape:"triangle",color:"#F59E0B",colorName:"Amber"},{shape:"diamond",color:"#3B82F6",colorName:"Blue"},
];

// ── Archetype personalisation ─────────────────────────────────────────────
const ARCHETYPE_DATA = {
  A: { name:"Systems Architect", color:"#00C8FF",
    neuralProfile:"Systems Architects excel at pattern recognition and logical sequencing — your Matrix and Stroop scores reflect this natural precision.",
    strengths:{"Stroop Challenge":"Your executive control is strong — you can override automatic responses. This is the same mental muscle that lets you stay systematic under pressure.","2-Back Test":"Working memory is your architecture. The ability to hold and update multiple information streams simultaneously underpins your systems thinking.","Pattern Matrix":"Visual logic is where your mind is most at home. Abstract rule-finding mirrors how you instinctively approach complex problems.","Reaction Velocity":"Systems types can overthink reactive decisions. If your reaction time was slower here, that's the same pattern showing up in real decisions.","Cognitive Switch":"Rule-switching is your edge — or your gap. Systems Architects who resist switching rules in real life miss adaptive opportunities.","Neural Defense":"Sustained attention under pressure is trainable. Systems minds that treat every wave as a distinct system perform better than those trying to 'win' the whole game."},
    dailyEdge:"Your quantum edge today: build one system that eliminates a decision you currently make by willpower alone." },
  B: { name:"Deep Learner", color:"#38BDF8",
    neuralProfile:"Deep Learners show strong working memory and pattern depth — but may sacrifice speed for accuracy. Your 2-Back and Matrix scores are your cognitive signature.",
    strengths:{"Stroop Challenge":"Deep Learners often outperform here — your capacity to process conflicting information without rushing is a genuine edge.","2-Back Test":"This is your natural domain. Holding multiple layers of information, updating and comparing — this is how your mind works when it's reading, researching, analysing.","Pattern Matrix":"Abstract reasoning at depth is your strongest cognitive instrument. You don't just find patterns — you understand the logic beneath them.","Reaction Velocity":"This may be your lowest score — and that's the data. Deep Learners can over-process before acting. Speed of first instinct is a trainable skill.","Cognitive Switch":"Switching rules requires releasing the current frame of reference. Deep Learners who struggle here may also resist pivoting on research they've invested in.","Neural Defense":"The game-like format may feel trivial compared to 'serious' challenges. That resistance is the data. Flow under pressure without intellectual validation is a muscle worth building."},
    dailyEdge:"Your quantum edge today: take the first action on something you've been researching. 70% of information is enough. The rest is field data." },
  C: { name:"Relational Catalyst", color:"#34D399",
    neuralProfile:"Relational Catalysts bring high emotional processing capacity — your Focus Filter and Cognitive Switch scores reflect your sensitivity to contextual shifts.",
    strengths:{"Stroop Challenge":"Social reading requires the same conflict resolution as the Stroop — you process emotional cues and spoken words simultaneously every day. That's this skill applied.","2-Back Test":"Relational working memory — tracking who said what, who needs what — is a unique form of N-Back. Your score reflects this capacity.","Pattern Matrix":"Pattern Matrix is a solo, emotionally neutral task — notice if your score dips here. The absence of social context can reduce Relational motivation.","Reaction Velocity":"Your interpersonal sensitivity makes you fast at reading emotional tone shifts. Does this translate to visual reaction speed? Compare your results.","Cognitive Switch":"Switching between contexts — professional to personal, supportive to assertive — is something you do naturally. Your score here should reflect that strength.","Neural Defense":"Sustained solo performance without external validation is harder for Relational types. If this felt draining, that's meaningful data about your motivational architecture."},
    dailyEdge:"Your quantum edge today: tell one person specifically what you're working to improve. Verbal commitment is your highest-leverage accountability tool." },
  D: { name:"Visionary Pioneer", color:"#A78BFA",
    neuralProfile:"Visionary Pioneers show high creative reasoning — your Conceptual and Pattern scores reflect divergent thinking. Speed and consistency are the areas to develop.",
    strengths:{"Stroop Challenge":"Visionaries who resist convention do well here — the ability to ignore the obvious answer and trust a different response mirrors creative thinking.","2-Back Test":"If this was your lowest score, that's meaningful data. Sustained, repetitive tracking without novelty is the opposite of what drives Visionaries. That's the gap to train.","Pattern Matrix":"Abstract visual reasoning is a Visionary strength — you think in concepts and futures. This task speaks your language.","Reaction Velocity":"Visionaries have fast instinct but can second-guess it. Your first response is often right. Your score here measures whether you trusted it.","Cognitive Switch":"Switching rules is natural for Visionaries — you reframe constantly. The challenge is switching when mid-flow on a creative idea. That's the real-world version of this test.","Neural Defense":"This is the most game-like challenge. Visionaries often excel here because the novelty and flow are motivating. Use this as evidence that sustained performance doesn't require 'important' stakes."},
    dailyEdge:"Your quantum edge today: identify the one open project closest to completion. Give it 90 uninterrupted minutes before starting anything new." },
};

// ── Storage ───────────────────────────────────────────────────────────────
function loadBrain(){ try{return JSON.parse(localStorage.getItem("lqm_brain")||"{}");}catch{return{};} }
function saveBrain(d){ localStorage.setItem("lqm_brain",JSON.stringify(d)); }

// ── Global styles ─────────────────────────────────────────────────────────
function GlobalStyles(){
  useEffect(()=>{
    const id="brain-training-styles";
    if(document.getElementById(id)) return;
    const s=document.createElement("style");
    s.id=id;
    s.textContent=`
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
      @keyframes popIn{0%{transform:scale(0.8);opacity:0;}100%{transform:scale(1);opacity:1;}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.35;}}
      @keyframes scaleIn{from{transform:scale(1.15);opacity:0;}to{transform:scale(1);opacity:1;}}
      .fu{animation:fadeUp .5s ease both;}
      .fu1{animation:fadeUp .5s .08s ease both;}
      .fu2{animation:fadeUp .5s .18s ease both;}
      .fu3{animation:fadeUp .5s .3s ease both;}
      .pop{animation:popIn .28s cubic-bezier(.34,1.56,.64,1) both;}
      .pulse{animation:pulse 1.1s ease-in-out infinite;}
      .scaleIn{animation:scaleIn .2s ease both;}
    `;
    document.head.appendChild(s);
    return()=>{ const el=document.getElementById(id); if(el) el.remove(); };
  },[]);
  return null;
}

// ── Science card content ──────────────────────────────────────────────────
const SCIENCE_CARDS = [
  { round:1, icon:"🎨", name:"Stroop Challenge", tag:"Executive Function", color:E_BLUE,
    headline:"Your brain reads automatically — and that's the challenge.",
    science:"The Stroop Effect, documented by John Ridley Stroop in 1935, is one of the most replicated findings in cognitive psychology. When you see the word RED written in blue ink, your brain's reading process (fast and automatic) conflicts with colour-naming (slower and deliberate). Resolving this conflict directly exercises the anterior cingulate cortex — the brain's conflict-detection and executive control centre.",
    task:"You will see a colour word written in a different ink colour. Tap the colour of the INK — not what the word says. You are scored on speed and accuracy. The faster the correct answer, the higher your score.",
    metric:"Brain region trained: Prefrontal cortex · Anterior cingulate cortex · Executive function" },
  { round:2, icon:"🧠", name:"2-Back Test", tag:"Working Memory", color:VIOLET,
    headline:"The gold standard of working memory training in modern neuroscience.",
    science:"The N-Back task, developed by Kirchner (1958) and studied extensively by Jaeggi et al. (2008), is the most researched cognitive training exercise available. In a 2-Back, you must decide whether each new stimulus matches what appeared two steps earlier — forcing the brain to simultaneously hold, update, and compare information. Regular training is associated with measurable improvements in fluid intelligence.",
    task:"SIMPLE RULE: A coloured square appears in the grid. If its POSITION matches where a square appeared TWO items ago, press MATCH. Ignore the colour — only position matters. Example: Square appears top-left, then bottom-right, then top-left again → MATCH (same position as 2 steps back). The first two items are just for memorising — matching starts from item 3 onwards.",
    metric:"Brain region trained: Dorsolateral prefrontal cortex · Working memory · Fluid intelligence" },
  { round:3, icon:"🔷", name:"Pattern Matrix", tag:"Spatial Reasoning", color:GREEN,
    headline:"Abstract visual reasoning — the purest measure of fluid intelligence.",
    science:"Visual matrix reasoning, similar to Raven's Progressive Matrices (1936), is one of the most reliable measures of fluid intelligence — the capacity to reason through novel problems without relying on stored knowledge. It activates the parietal cortex and is strongly associated with creative problem-solving, academic performance, and strategic thinking. It is considered culturally and linguistically neutral.",
    task:"A 3×3 grid of coloured shapes is shown with one piece missing. Study the pattern — the rule governs both shape and colour. Select the correct missing piece. A hint is available if needed.",
    metric:"Brain region trained: Parietal cortex · Fluid intelligence · Abstract pattern recognition" },
  { round:4, icon:"⚡", name:"Reaction Velocity", tag:"Processing Speed", color:AMBER,
    headline:"How fast your brain detects, decides, and acts — a core cognitive marker.",
    science:"Reaction time has been measured since Francis Galton's work in the 1880s and consistently correlates with overall cognitive performance, executive function, and long-term cognitive health. Processing speed — how fast the brain encodes and responds to stimuli — is one of the first metrics to improve with regular cognitive training. Elite performers across high-stakes professions show measurably faster reaction times.",
    task:"A coloured shape will appear after a random delay. Tap it as fast as possible. Do not tap during the waiting period — false starts are penalised. Your millisecond reaction time is measured and scored.",
    metric:"Brain region trained: Motor cortex · Visual cortex · Perceptual processing speed" },
  { round:5, icon:"🔄", name:"Cognitive Switch", tag:"Mental Flexibility", color:RED,
    headline:"Switching mental gears without losing accuracy — a rare and trainable skill.",
    science:"Task-switching ability, researched extensively by Monsell (2003), is a core component of executive function. Switching between active rules creates a measurable 'switch cost' — a brief delay and increased error rate as the brain reconfigures. People with high cognitive flexibility show significantly smaller switch costs. This skill directly predicts performance in dynamic, ambiguous, high-stakes environments.",
    task:"A shape in a colour will be shown. The active rule changes mid-task. When the rule is SHAPE — tap the button matching the shape. When the rule is COLOUR — tap the button matching the colour. The rule switches without warning.",
    metric:"Brain region trained: Anterior cingulate cortex · Prefrontal cortex · Cognitive flexibility" },
  { round:6, icon:"🛡️", name:"Neural Defense", tag:"Sustained Attention", color:"#8B5CF6",
    headline:"Real-time visual tracking and reaction under sustained pressure.",
    science:"Action video game research by Bavelier et al. (2003, 2012) demonstrates significant improvements in visual attention, multiple object tracking, and reaction time. Unlike isolated reaction tests, sustained gameplay requires continuous vigilance, spatial prediction, and rapid target acquisition — training the brain's attentional networks under dynamic conditions. This transfers to real-world performance in high-stakes, fast-moving environments.",
    task:"Shapes fall from above. Move your shield left and right, then tap to block them before they reach the bottom. Three waves with increasing speed. Your reaction time, accuracy, and sustained attention are measured throughout.",
    metric:"Brain region trained: Visual cortex · Parietal cortex · Sustained attention networks" },
];

// ── Difficulty Selection Component ───────────────────────────────────────
function DifficultySelection({onSelect}){
  return(
    <div style={{animation:"fadeUp .6s ease both",maxWidth:520,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <p style={{fontSize:14,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>⚡ Choose Your Challenge Level</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,7vw,48px)",letterSpacing:2,color:WHITE,marginBottom:12}}>Brain Training</h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:18,color:MUTED,lineHeight:1.75}}>Select the difficulty that feels right for you. You can always change this later.</p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {Object.entries(DIFFICULTY).map(([key,diff])=>(
          <button key={key} onClick={()=>onSelect(key)} 
            style={{background:`linear-gradient(135deg,${diff.color}08,${diff.color}03)`,
              border:`2px solid ${diff.color}44`,borderRadius:16,padding:"24px 26px",textAlign:"left",cursor:"pointer",
              transition:"all .25s ease",display:"flex",flexDirection:"column",gap:10}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=diff.color;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px ${diff.color}33`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=`${diff.color}44`;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:diff.color}}>{diff.name}</span>
              <span style={{fontSize:24}}>→</span>
            </div>
            <p style={{fontSize:16,color:MUTED,lineHeight:1.65,margin:0}}>{diff.desc}</p>
          </button>
        ))}
      </div>

      <div style={{marginTop:32,padding:"18px 20px",background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:12}}>
        <p style={{fontSize:14,color:DIMMED,lineHeight:1.7,margin:0,textAlign:"center"}}>
          <strong style={{color:MUTED}}>Not sure?</strong> Start with <span style={{color:E_BLUE,fontWeight:600}}>Standard</span>. You'll know within a few rounds if you want more challenge or a gentler pace.
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function BrainTraining({ onBack, archetype }){
  const [screen,  setScreen]  = useState("difficulty");
  const [difficulty, setDifficulty] = useState(null);
  const [round,   setRound]   = useState(0);
  const [scores,  setScores]  = useState([]);
  const [userData,setUserData]= useState(loadBrain);
  const [dailyAction]         = useState(()=>DAILY_ACTIONS[new Date().getDay()]);
  const [challengeData, setChallengeData] = useState(null);
  // const [showMilestone, setShowMilestone] = useState(null); // Disabled for now
  const arch = archetype && ARCHETYPE_DATA[archetype] ? ARCHETYPE_DATA[archetype] : null;

  // Initialize 21-day challenge on mount
  useEffect(() => {
    let data = getChallengeData("brain");
    if (!data) {
      data = enrollInChallenge("brain", archetype || "unknown");
    }
    setChallengeData(data);
  }, [archetype]);

  const totalXP = userData.totalXP||0;
  const streak  = userData.streak||0;
  const level   = getLevel(totalXP);

  function handleRoundComplete(score,label,reactionMs,accuracy){
    const newScores=[...scores,{label,score,reactionMs,accuracy}];
    setScores(newScores);
    
    // Track individual challenge completion
    trackChallengeResult(label, score, reactionMs, accuracy, difficulty);
    
    // Play success sound for completing a challenge
    playSuccessSound();
    
    if(round<5){ 
      setRound(round+1); 
      setScreen("science"); 
    }
    else {
      // Full session complete (all 6 challenges done)
      const total=newScores.reduce((a,s)=>a+s.score,0);
      const today=new Date().toISOString().split("T")[0];
      const yesterday=new Date(Date.now()-86400000).toISOString().split("T")[0];
      const newStreak=userData.lastDay===yesterday?streak+1:userData.lastDay===today?streak:1;
      const bonus=Math.floor(total*(newStreak*0.05));
      const final=total+bonus;
      const updated={totalXP:totalXP+final,streak:newStreak,lastDay:today,bestScore:Math.max(final,userData.bestScore||0)};
      
      // Check for level up
      const oldLevel = getLevel(totalXP);
      const newLevel = getLevel(updated.totalXP);
      if(newLevel.name !== oldLevel.name){
        trackLevelUp(newLevel.name, updated.totalXP);
        playLevelUpSound(); // Level up sound!
      }
      
      setUserData(updated); 
      saveBrain(updated);
      
      // Track session completion
      const avgScore = Math.round(total / 6);
      trackSessionComplete(total, avgScore, difficulty);
      
      // Play celebration sound for completing all 6 challenges
      playCelebrationSound();
      
      // Update 21-day challenge progress
      const updatedChallenge = updateChallengeProgress("brain");
      if(updatedChallenge){
        setChallengeData(updatedChallenge);
        
        // Store baseline scores if this is first session
        if(updatedChallenge.sessionsCompleted === 1){
          const baselineScores = {
            stroop: newScores[0]?.score || 0,
            nback: newScores[1]?.score || 0,
            matrix: newScores[2]?.score || 0,
            reaction: newScores[3]?.reactionMs || 0,
            switch: newScores[4]?.score || 0,
            defense: newScores[5]?.score || 0
          };
          storeBaselineScores("brain", baselineScores);
        }
        
        // Milestone tracking (popups disabled for now - will add back later)
        // Track milestone achievements in background
        if(updatedChallenge.currentDay >= 7 && !updatedChallenge.milestones.day_7.unlocked){
          playMilestoneSound();
          // setShowMilestone("day7"); // Disabled - component not ready
        } else if(updatedChallenge.currentDay >= 14 && !updatedChallenge.milestones.day_14.unlocked){
          playMilestoneSound();
          // setShowMilestone("day14"); // Disabled
        } else if(updatedChallenge.currentDay >= 21 && !updatedChallenge.milestones.day_21.unlocked){
          playMilestoneSound();
          // setShowMilestone("day21"); // Disabled
        }
      }
      
      setScreen("results");
    }
  }

  function startProtocol(){ setRound(0); setScores([]); setScreen("science"); }

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 70% 35% at 50% 0%,rgba(0,200,255,0.07) 0%,transparent 55%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 0 60px"}}>
      <GlobalStyles/>
      {/* Header */}
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"11px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.92)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${BORDER2}`,borderRadius:100,padding:"7px 15px",color:MUTED,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color=WHITE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:2,color:WHITE}}>LQM</span>
          <span style={{fontSize:14,color:E_BLUE,fontWeight:700,letterSpacing:".12em"}}>BRAIN TRAINING</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {streak>0&&<span style={{fontSize:15,color:AMBER,fontWeight:700}}>🔥{streak}</span>}
          <span style={{fontSize:14,color:level.color,fontWeight:700}}>{totalXP} XP</span>
        </div>
      </div>

      <div style={{width:"100%",maxWidth:560,padding:"32px 20px 0"}}>
        {screen==="difficulty" && <DifficultySelection onSelect={(d)=>{setDifficulty(d);setScreen("intro");}}/>}
        {screen==="intro"     && <Intro onStart={startProtocol} onQuickPlay={()=>{setRound(5);setScores([]);setScreen("challenge");}} xp={totalXP} streak={streak} level={level} userData={userData} difficulty={difficulty} challengeData={challengeData}/>}
        {screen==="science"   && <ScienceCard card={SCIENCE_CARDS[round]} round={round} onBegin={()=>setScreen("challenge")}/>}
        {screen==="challenge" && round===0 && <StroopChallenge   key="s" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="challenge" && round===1 && <NBackChallenge    key="n" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="challenge" && round===2 && <MatrixChallenge   key="m" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="challenge" && round===3 && <ReactionChallenge key="r" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="challenge" && round===4 && <SwitchChallenge   key="sw" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="challenge" && round===5 && <NeuralDefense     key="nd" difficulty={DIFFICULTY[difficulty]} onComplete={handleRoundComplete}/>}
        {screen==="results"   && <Results scores={scores} level={level} newLevel={getLevel(totalXP)} streak={streak} dailyAction={dailyAction} arch={arch} challengeData={challengeData} onBack={onBack} onRetry={()=>{setRound(0);setScores([]);setScreen("science");}}/>}
      </div>
    </div>
  );
}

// ── Intro ─────────────────────────────────────────────────────────────────
function Intro({onStart,onQuickPlay,xp,streak,level,userData,challengeData}){
  const nextLevel=LEVELS.find(l=>l.min>xp);
  const pct=nextLevel?Math.min(100,((xp-level.min)/(nextLevel.min-level.min))*100):100;
  
  // 21-day challenge progress
  const currentDay = challengeData?.currentDay || 0;
  const daysCompleted = challengeData?.daysCompleted?.length || 0;
  const completionPct = currentDay > 0 ? Math.round((daysCompleted / currentDay) * 100) : 0;
  const isEnrolled = challengeData && challengeData.enrolled;
  
  const rounds=[
    {icon:"🎨",name:"Stroop Challenge",tag:"Executive Function",brain:"Prefrontal cortex"},
    {icon:"🧠",name:"2-Back Test",tag:"Working Memory",brain:"Dorsolateral prefrontal"},
    {icon:"🔷",name:"Pattern Matrix",tag:"Spatial Reasoning",brain:"Parietal cortex"},
    {icon:"⚡",name:"Reaction Velocity",tag:"Processing Speed",brain:"Motor cortex"},
    {icon:"🔄",name:"Cognitive Switch",tag:"Mental Flexibility",brain:"Anterior cingulate"},
    {icon:"🛡️",name:"Neural Defense",tag:"Sustained Attention",brain:"Visual & parietal cortex"},
  ];
  return(
    <div>
      <div className="fu" style={{textAlign:"center",marginBottom:24}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:12}}>⚡ Daily Neural Protocol</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,7vw,52px)",letterSpacing:2,color:WHITE,lineHeight:1.05,marginBottom:8}}>Train Your<br/><span style={{color:E_BLUE}}>Quantum Mind</span></h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.7}}>"The exercised brain builds new neural pathways throughout life. Consistency compounds."</p>
      </div>

      {/* 21-DAY CHALLENGE DASHBOARD */}
      {isEnrolled && (
        <div className="fu0" style={{background:`linear-gradient(135deg,rgba(0,200,255,0.08),rgba(0,200,255,0.03))`,border:`1px solid ${E_BLUE}33`,borderRadius:16,padding:"16px 20px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:2}}>📅 21-Day Transformation</p>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:WHITE}}>Day {currentDay} of 21</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:14,color:DIMMED,marginBottom:2}}>Completion</p>
              <p style={{fontSize:20,fontWeight:700,color:GREEN}}>{completionPct}%</p>
            </div>
          </div>
          <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(currentDay/21)*100}%`,background:`linear-gradient(90deg,${E_BLUE},${GREEN})`,borderRadius:100}}/>
          </div>
          {currentDay >= 7 && (
            <p style={{fontSize:13,color:GREEN,marginTop:8,fontWeight:600}}>✓ Week 1 milestone reached!</p>
          )}
          {currentDay >= 14 && (
            <p style={{fontSize:13,color:GREEN,marginTop:4,fontWeight:600}}>✓ Week 2 milestone reached!</p>
          )}
          {currentDay >= 21 && (
            <p style={{fontSize:13,color:AMBER,marginTop:4,fontWeight:700}}>🏆 21-Day Transformation Complete!</p>
          )}
        </div>
      )}

      <div className="fu1" style={{background:`linear-gradient(135deg,${DARK2},${DARK})`,border:`1px solid ${level.color}33`,borderRadius:16,padding:"18px 22px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:4}}>Neural Level</p>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:level.color}}>{level.name}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:4}}>Total XP</p>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE}}>{xp}</p>
          </div>
        </div>
        <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden",marginBottom:6}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${level.color}66,${level.color})`,borderRadius:100}}/>
        </div>
        {nextLevel&&<p style={{fontSize:14,color:DIMMED}}>{nextLevel.min-xp} XP to <span style={{color:nextLevel.color}}>{nextLevel.name}</span></p>}
        {streak>0&&<div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:10}}>
          <span>🔥</span><span style={{fontSize:16,color:AMBER,fontWeight:600}}>{streak}-day streak</span><span style={{fontSize:14,color:DIMMED,marginLeft:"auto"}}>+{streak*5}% XP bonus</span>
        </div>}
      </div>

      <div className="fu2" style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"18px 20px",marginBottom:18}}>
        <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:14}}>6 Science-Backed Challenges · ~6-7 minutes</p>
        {rounds.map((r,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"11px 0",borderBottom:i<rounds.length-1?`1px solid ${BORDER2}`:"none"}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(0,200,255,0.07)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                <p style={{fontSize:16,fontWeight:600,color:WHITE}}>{r.name}</p>
                <span style={{fontSize:15,fontWeight:700,color:E_BLUE,letterSpacing:".08em",textTransform:"uppercase",background:"rgba(0,200,255,0.08)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"2px 8px"}}>{r.tag}</span>
              </div>
              <p style={{fontSize:14,color:DIMMED,fontStyle:"italic"}}>Brain region: {r.brain}</p>
            </div>
            <span style={{fontSize:14,color:DIMMED,marginTop:2}}>{i+1}</span>
          </div>
        ))}
      </div>

      <button className="fu3" onClick={onStart} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,boxShadow:`0 6px 28px rgba(0,200,255,0.2)`,transition:"all .2s",marginBottom:10}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 36px rgba(0,200,255,0.32)`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 6px 28px rgba(0,200,255,0.2)`;}}>
        ⚡ Begin Full Protocol →
      </button>
      
      {/* QUICK PLAY NEURAL DEFENSE BUTTON */}
      <button className="fu4" onClick={onQuickPlay} style={{width:"100%",border:`1.5px solid ${PURPLE}66`,borderRadius:100,padding:"14px",fontSize:15,fontWeight:600,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",background:"transparent",color:PURPLE,transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.background=`${PURPLE}11`;e.currentTarget.style.borderColor=PURPLE;}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=`${PURPLE}66`;}}>
        🛡️ Quick Play: Neural Defense Only
      </button>
    </div>
  );
}

// ── Science Card ──────────────────────────────────────────────────────────
function ScienceCard({card:c,round,onBegin}){
  return(
    <div style={{animation:"fadeUp .5s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:2,color:DIMMED}}>ROUND {round+1} OF 5</span>
        <span style={{fontSize:16,fontWeight:700,color:c.color,letterSpacing:".1em",textTransform:"uppercase",background:`${c.color}18`,border:`1px solid ${c.color}44`,borderRadius:100,padding:"4px 12px"}}>{c.tag}</span>
      </div>
      <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${c.color}33`,borderTop:`2px solid ${c.color}`,borderRadius:18,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"28px 24px 20px",textAlign:"center",borderBottom:`1px solid ${BORDER2}`}}>
          <div style={{fontSize:44,marginBottom:12}}>{c.icon}</div>
          <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE,marginBottom:6}}>{c.name}</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:c.color,lineHeight:1.65}}>{c.headline}</p>
        </div>
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${BORDER2}`}}>
          <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>The Neuroscience</p>
          <p style={{fontSize:16,lineHeight:1.85,color:MUTED,fontWeight:300}}>{c.science}</p>
        </div>
        <div style={{padding:"16px 22px",background:`${c.color}08`,borderBottom:`1px solid ${BORDER2}`}}>
          <p style={{fontSize:15,fontWeight:700,color:c.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>Your Task</p>
          <p style={{fontSize:14,lineHeight:1.8,color:WHITE,fontWeight:400}}>{c.task}</p>
        </div>
        <div style={{padding:"12px 22px",display:"flex",gap:8,alignItems:"flex-start"}}>
          <span style={{fontSize:15,color:DIMMED,flexShrink:0}}>📊</span>
          <p style={{fontSize:14,color:DIMMED,lineHeight:1.5,fontStyle:"italic"}}>{c.metric}</p>
        </div>
      </div>
      <button onClick={onBegin} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",background:`linear-gradient(135deg,${c.color}bb,${c.color})`,color:BG,boxShadow:`0 6px 24px ${c.color}33`,transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
        Begin Round {round+1} →
      </button>
    </div>
  );
}

// ── Round progress bar ────────────────────────────────────────────────────
function RoundProgress({round}){
  return(
    <div style={{display:"flex",gap:6,marginBottom:20}}>
      {[0,1,2,3,4].map(i=>(
        <div key={i} style={{flex:1,height:3,borderRadius:100,background:i<round?E_BLUE:i===round?"rgba(0,200,255,0.35)":"rgba(255,255,255,0.06)",transition:"background .3s"}}/>
      ))}
    </div>
  );
}

// ── Timer ring ────────────────────────────────────────────────────────────
function TimerRing({timeLeft,total,color=E_BLUE}){
  const r=26,circ=2*Math.PI*r,offset=circ*(1-timeLeft/total),urgent=timeLeft<=7;
  return(
    <svg width={64} height={64}>
      <circle cx={32} cy={32} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4}/>
      <circle cx={32} cy={32} r={r} fill="none" stroke={urgent?RED:color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 32 32)" style={{transition:"stroke-dashoffset .9s linear,stroke .3s"}}/>
      <text x={32} y={37} textAnchor="middle" fill={urgent?RED:WHITE} fontSize={13} fontWeight="700" fontFamily="Space Grotesk">{timeLeft}</text>
    </svg>
  );
}

// ── Feedback popup ────────────────────────────────────────────────────────
function FeedbackPop({show,correct,pts}){
  if(!show) return null;
  return(
    <div className="pop" style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:correct?"rgba(52,211,153,0.15)":"rgba(248,113,113,0.12)",border:`2px solid ${correct?GREEN:RED}`,borderRadius:18,padding:"14px 28px",textAlign:"center",zIndex:999,pointerEvents:"none",backdropFilter:"blur(8px)"}}>
      <p style={{fontSize:24,fontWeight:800,color:correct?GREEN:RED}}>{correct?"✓":"✗"}</p>
      {pts!==undefined&&<p style={{fontSize:15,fontWeight:700,color:correct?GREEN:RED}}>{correct?`+${pts} pts`:"No points"}</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 1 — STROOP
// ══════════════════════════════════════════════════════════════════════════
function StroopChallenge({onComplete, difficulty}){
  const TIME = difficulty?.stroop?.time || 45;
  const NUM_ROUNDS = difficulty?.stroop?.rounds || 18;
  const [items]   = useState(()=>Array.from({length:NUM_ROUNDS},genStroopRound));
  const [idx,     setIdx]    = useState(0);
  const [score,   setScore]  = useState(0);
  const [correct, setCor]    = useState(0);
  const [total,   setTotal]  = useState(0);
  const [tLeft,   setTLeft]  = useState(TIME);
  const [fb,      setFb]     = useState(null);
  const [started, setSt]     = useState(false);
  const startRef  = useRef(null);
  const rtimes    = useRef([]);
  const scoreRef  = useRef(0); // ref to avoid stale closure in finish()

  useEffect(()=>{
    if(!started) return;
    if(tLeft<=0){ finish(); return; }
    const t=setInterval(()=>setTLeft(s=>s-1),1000);
    return()=>clearInterval(t);
  },[tLeft,started]);

  function finish(){ const avg=rtimes.current.length?Math.round(rtimes.current.reduce((a,b)=>a+b,0)/rtimes.current.length):0; onComplete(scoreRef.current,"Stroop Challenge",avg); }

  function handleAnswer(colorName){
    if(fb||!started) return;
    const rt=Date.now()-startRef.current; rtimes.current.push(rt);
    const ok=colorName===items[idx].inkName;
    const pts=ok?Math.max(5,Math.floor(28-(rt/110))):0;
    scoreRef.current += pts; setScore(scoreRef.current); setTotal(t=>t+1); if(ok)setCor(c=>c+1);
    setFb({ok,pts});
    setTimeout(()=>{ setFb(null); const next=idx+1; if(next>=items.length||tLeft<=1){finish();}else{setIdx(next);startRef.current=Date.now();} },400);
  }

  const item=items[idx];
  return(
    <div>
      <RoundProgress round={1}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Stroop Challenge</p><p style={{fontSize:15,color:MUTED}}>{correct}/{total} · {score} pts</p></div>
        {started&&<TimerRing timeLeft={tLeft} total={TIME}/>}
      </div>
      {!started?(
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"36px 24px",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:14}}>🎨</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:WHITE,marginBottom:10}}>Tap the Ink Colour</h2>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,marginBottom:20}}>The word says one thing. The ink shows another.<br/>Tap the colour of the <strong style={{color:WHITE}}>INK</strong> — ignore the word.</p>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginBottom:24}}>
            <div style={{padding:"12px 20px",background:"rgba(59,130,246,0.1)",border:"2px solid #3B82F6",borderRadius:12,fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2,color:"#EF4444"}}>BLUE</div>
            <span style={{color:DIMMED,fontSize:12}}>→ tap Red</span>
          </div>
          <button onClick={()=>{setSt(true);startRef.current=Date.now();}} style={{border:"none",borderRadius:100,padding:"14px 40px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,letterSpacing:".05em"}}>Start →</button>
        </div>
      ):(
        <div>
          <div className="scaleIn" key={idx} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"36px 24px",textAlign:"center",marginBottom:14,minHeight:140,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(54px,13vw,84px)",letterSpacing:4,color:item.inkColor,lineHeight:1,userSelect:"none"}}>{item.word}</p>
          </div>
          <p style={{textAlign:"center",fontSize:16,color:DIMMED,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>Tap the ink colour</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {STROOP_COLORS.map(c=>(
              <button key={c.name} onClick={()=>handleAnswer(c.name)} style={{border:`2px solid ${c.hex}44`,borderRadius:14,padding:"16px 0",background:`${c.hex}0c`,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .12s",fontFamily:"'Space Grotesk',sans-serif"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${c.hex}22`}
                onMouseLeave={e=>e.currentTarget.style.background=`${c.hex}0c`}>
                <div style={{width:28,height:28,borderRadius:"50%",background:c.hex,boxShadow:`0 0 14px ${c.hex}88`}}/>
                <span style={{fontSize:15,fontWeight:700,color:WHITE,letterSpacing:".06em"}}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <FeedbackPop show={!!fb} correct={fb?.ok} pts={fb?.pts}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 2 — N-BACK
// ══════════════════════════════════════════════════════════════════════════
function NBackChallenge({onComplete, difficulty}){
  const N = difficulty?.nback?.n || 2;
  const DISP = difficulty?.nback?.display || 1700;
  const ISI = difficulty?.nback?.isi || 500;
  const LEN = difficulty?.nback?.length || 14;
  const [seq]     = useState(()=>genNBackSequence(LEN,N));
  const [cur,     setCur]    = useState(-1);
  const [score,   setScore]  = useState(0);
  const [hits,    setHits]   = useState(0);
  const [fb,      setFb]     = useState(null);
  const [phase,   setPhase]  = useState("ready");
  const [responded,setResp]  = useState(false);
  const scoreRef = useRef(0);
  const idxRef = useRef(0); const respRef = useRef(false);

  function runSequence(){
    setPhase("running"); idxRef.current=0; setCur(0); respRef.current=false; setResp(false);
    function step(){
      const i=idxRef.current;
      if(i>=seq.length){ setTimeout(()=>onComplete(scoreRef.current,"2-Back Test",null),500); return; }
      setCur(i); setPhase("show"); respRef.current=false; setResp(false);
      setTimeout(()=>{
        setPhase("isi"); idxRef.current=i+1;
        setTimeout(()=>step(), ISI);
      }, DISP);
    }
    step();
  }

  function handleMatch(){
    if(phase!=="show"||cur<N||respRef.current) return;
    respRef.current=true; setResp(true);
    const isMatch=seq[cur].isMatch;
    const pts=isMatch?30:-5;
    scoreRef.current = Math.max(0, scoreRef.current + pts); setScore(scoreRef.current); if(isMatch)setHits(h=>h+1);
    setFb({ok:isMatch,pts:Math.abs(pts)});
    setTimeout(()=>setFb(null),500);
  }

  const item=cur>=0&&cur<seq.length?seq[cur]:null;
  const canMatch=phase==="show"&&cur>=N;

  return(
    <div>
      <RoundProgress round={2}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>2-Back Test</p><p style={{fontSize:15,color:MUTED}}>{hits} matches · {score} pts</p></div>
        {cur>=0&&cur<seq.length&&<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,color:DIMMED}}>{cur+1}/{seq.length}</div>}
      </div>
      {phase==="ready"?(
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"32px 24px",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:14}}>🧠</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE,marginBottom:10}}>2-Back Memory Test</h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.85,marginBottom:16}}>
            <strong style={{color:WHITE}}>THE RULE:</strong><br/>
            A coloured square flashes in the grid.<br/>
            Press <strong style={{color:VIOLET}}>MATCH</strong> if its position is the same<br/>
            as the square from <strong style={{color:WHITE}}>2 items ago.</strong><br/>
            <span style={{fontSize:14,color:DIMMED}}>(Ignore colour — only position matters)</span>
          </p>
          <div style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:12,padding:"16px 18px",marginBottom:22}}>
            <p style={{fontSize:16,fontWeight:700,color:VIOLET,marginBottom:8,letterSpacing:".06em"}}>EXAMPLE WALKTHROUGH:</p>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.75,textAlign:"left"}}>
              <strong style={{color:WHITE}}>Item 1:</strong> Top-left → <span style={{color:DIMMED}}>(just remember it)</span><br/>
              <strong style={{color:WHITE}}>Item 2:</strong> Centre → <span style={{color:DIMMED}}>(just remember it)</span><br/>
              <strong style={{color:WHITE}}>Item 3:</strong> Top-left → <span style={{color:VIOLET}}>MATCH!</span> <span style={{color:DIMMED}}>(same as item 1)</span><br/>
              <strong style={{color:WHITE}}>Item 4:</strong> Bottom-right → <span style={{color:DIMMED}}>No match</span><br/>
              <strong style={{color:WHITE}}>Item 5:</strong> Bottom-right → <span style={{color:VIOLET}}>MATCH!</span> <span style={{color:DIMMED}}>(same as item 4)</span>
            </p>
          </div>
          <button onClick={runSequence} style={{border:"none",borderRadius:100,padding:"14px 40px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${VIOLET}cc,${VIOLET})`,color:BG,letterSpacing:".05em"}}>Start →</button>
        </div>
      ):(
        <div>
          <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"20px",marginBottom:14}}>
            {cur<N&&<p style={{textAlign:"center",fontSize:15,color:DIMMED,marginBottom:10}}>Memorising first {N} items — matching starts soon...</p>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:240,margin:"0 auto"}}>
              {Array.from({length:9}).map((_,i)=>{
                const active=phase==="show"&&item&&item.pos===i;
                return(
                  <div key={i} style={{aspectRatio:"1",borderRadius:12,background:active?item.color:"rgba(255,255,255,0.04)",border:`1.5px solid ${active?item.color+"88":BORDER2}`,boxShadow:active?`0 0 20px ${item.color}55`:"none",transition:"all .15s"}}/>
                );
              })}
            </div>
          </div>
          <button onClick={handleMatch} disabled={!canMatch} style={{width:"100%",border:`2px solid ${canMatch?VIOLET:"rgba(255,255,255,0.08)"}`,borderRadius:100,padding:"18px",fontSize:15,fontWeight:700,background:canMatch?"rgba(167,139,250,0.1)":"rgba(255,255,255,0.02)",color:canMatch?VIOLET:DIMMED,cursor:canMatch?"pointer":"default",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em",transition:"all .2s"}}>
            {responded?"✓ Matched":canMatch?"⚡ MATCH — Same position as 2 ago":"Watching..."}
          </button>
        </div>
      )}
      <FeedbackPop show={!!fb} correct={fb?.ok} pts={fb?.pts}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 3 — PATTERN MATRIX
// ══════════════════════════════════════════════════════════════════════════
function MatrixChallenge({onComplete, difficulty}){
  const MAX_HINTS = difficulty?.matrix?.hints !== undefined ? difficulty.matrix.hints : 1;
  const NUM_PUZZLES = difficulty?.matrix?.puzzles || 4;
  const [pidx, setPidx]= useState(()=>Math.floor(Math.random()*PATTERN_PUZZLES.length));
  const [score,setScore]= useState(0);
  const [done, setDone] = useState(0);
  const [fb,   setFb]  = useState(null);
  const [hint, setHint]= useState(false);
  const [usedHint,setUH]=useState(false);
  const p=PATTERN_PUZZLES[pidx];

  function handleAnswer(opt){
    if(fb) return;
    const ok=opt.sh===p.answer.sh&&opt.co===p.answer.co;
    const pts=ok?(usedHint?20:35):0;
    setScore(s=>s+pts); setDone(d=>d+1);
    setFb({ok,pts});
    setTimeout(()=>{
      setFb(null); setHint(false); setUH(false);
      const next=pidx+1;
      if(next>=PATTERN_PUZZLES.length){onComplete(score+pts,"Pattern Matrix",null);}
      else{setPidx(next);}
    },700);
  }

  return(
    <div>
      <RoundProgress round={3}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Pattern Matrix</p><p style={{fontSize:15,color:MUTED}}>Puzzle {done+1} of {PATTERN_PUZZLES.length} · {score} pts</p></div>
        <span style={{fontSize:16,color:GREEN,fontWeight:700,background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:100,padding:"4px 12px"}}>Spatial Reasoning</span>
      </div>
      <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"24px",marginBottom:12}}>
        <p style={{fontSize:16,color:DIMMED,textAlign:"center",marginBottom:16,letterSpacing:".08em",textTransform:"uppercase"}}>Find the missing piece</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,maxWidth:240,margin:"0 auto"}}>
          {p.grid.map((cell,i)=>(
            <div key={i} style={{aspectRatio:"1",borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1.5px solid ${cell?BORDER2:"rgba(0,200,255,0.45)"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:!cell?`0 0 18px rgba(0,200,255,0.12)`:"none"}}>
              {cell?<ShapeEl shape={cell.sh} color={cell.co} size={44}/>:<span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:E_BLUE,opacity:.65}}>?</span>}
            </div>
          ))}
        </div>
      </div>
      {hint&&<div style={{background:"rgba(52,211,153,0.05)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"10px 16px",marginBottom:12,fontSize:16,color:"rgba(52,211,153,0.85)",fontStyle:"italic"}}>💡 {p.rule}</div>}
      {!hint&&!fb&&<button onClick={()=>{setHint(true);setUH(true);}} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif",marginBottom:12,display:"block",margin:"0 auto 12px"}}>Hint? (−15 pts)</button>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {p.options.map((opt,i)=>{
          const correct=fb&&opt.sh===p.answer.sh&&opt.co===p.answer.co;
          return(
            <button key={i} onClick={()=>!fb&&handleAnswer(opt)} style={{border:`1.5px solid ${correct?GREEN:BORDER2}`,borderRadius:14,padding:"18px",background:correct?"rgba(52,211,153,0.1)":"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",minHeight:74}}
              onMouseEnter={e=>!fb&&(e.currentTarget.style.borderColor=GREEN)}
              onMouseLeave={e=>!fb&&(e.currentTarget.style.borderColor=BORDER2)}>
              <ShapeEl shape={opt.sh} color={opt.co} size={46}/>
            </button>
          );
        })}
      </div>
      <FeedbackPop show={!!fb} correct={fb?.ok} pts={fb?.pts}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 4 — REACTION VELOCITY
// ══════════════════════════════════════════════════════════════════════════
function ReactionChallenge({onComplete, difficulty}){
  const REPS = difficulty?.reaction?.reps || 8;
  const MIN_DELAY = difficulty?.reaction?.minDelay || 1000;
  const MAX_DELAY = difficulty?.reaction?.maxDelay || 2500;
  const [phase,  setPhase]= useState("ready");
  const [rep,    setRep]  = useState(0);
  const [times,  setTimes]= useState([]);
  const [score,  setScore]= useState(0);
  const [target, setTarget]=useState(null);
  const [msg,    setMsg]  = useState("");
  const goRef = useRef(null); const tStart = useRef(null);

  function nextRep(currentRep=rep){
    setPhase("waiting"); setMsg("");
    goRef.current=setTimeout(()=>{
      setTarget({shape:REACTION_SHAPES[Math.floor(Math.random()*REACTION_SHAPES.length)],color:REACTION_COLORS[Math.floor(Math.random()*REACTION_COLORS.length)]});
      tStart.current=Date.now(); setPhase("go");
    },MIN_DELAY+Math.random()*(MAX_DELAY-MIN_DELAY));
  }

  function handleTap(){
    if(phase==="waiting"){
      clearTimeout(goRef.current);
      setPhase("miss"); setMsg("Too early! Wait for the shape.");
      setTimeout(()=>{ const next=rep+1; if(next<REPS){setRep(next);nextRep(next);}else finish(times,score); },1100);
    } else if(phase==="go"){
      const rt=Date.now()-tStart.current;
      const newTimes=[...times,rt];
      setTimes(newTimes);
      const pts=Math.max(0,Math.floor(120-(rt/7)));
      const newScore=score+pts; setScore(newScore);
      setMsg(`${rt}ms${rt<240?"  ⚡ Elite":rt<340?"  ✓ Sharp":rt<480?"  Good":""}`);
      setPhase("hit");
      setTimeout(()=>{ const next=rep+1; if(next<REPS){setRep(next);nextRep(next);}else finish(newTimes,newScore); },800);
    }
  }

  function finish(t=times,s=score){
    const avg=t.length?Math.round(t.reduce((a,b)=>a+b,0)/t.length):0;
    onComplete(s,"Reaction Velocity",avg);
  }

  const avgMs=times.length?Math.round(times.reduce((a,b)=>a+b,0)/times.length):null;

  return(
    <div>
      <RoundProgress round={4}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Reaction Velocity</p><p style={{fontSize:15,color:MUTED}}>{rep}/{REPS}{avgMs?` · avg ${avgMs}ms`:""} · {score} pts</p></div>
        <span style={{fontSize:16,color:AMBER,fontWeight:700,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:100,padding:"4px 12px"}}>Processing Speed</span>
      </div>
      <div onClick={["waiting","go"].includes(phase)?handleTap:undefined} style={{background:phase==="go"?`${target?.color}12`:"rgba(255,255,255,0.03)",border:`2px solid ${phase==="go"?target?.color:phase==="hit"?GREEN:phase==="miss"?RED:BORDER2}`,borderRadius:22,minHeight:260,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:["waiting","go"].includes(phase)?"pointer":"default",transition:"all .2s",marginBottom:14,gap:14}}>
        {phase==="ready"&&<><div style={{fontSize:42}}>⚡</div><h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,color:WHITE,textAlign:"center"}}>Tap when the shape appears</h2><p style={{fontSize:16,color:MUTED,textAlign:"center",maxWidth:260,lineHeight:1.6}}>Random delay before each target. Do not tap early.</p></>}
        {phase==="waiting"&&<><div className="pulse" style={{width:16,height:16,borderRadius:"50%",background:E_BLUE,boxShadow:`0 0 18px ${E_BLUE}`}}/><p style={{fontSize:16,color:DIMMED,letterSpacing:".08em"}}>Waiting... don't tap yet</p></>}
        {phase==="go"&&target&&<><div className="pop"><ShapeEl shape={target.shape} color={target.color} size={110}/></div><p style={{fontSize:14,fontWeight:700,color:target.color,letterSpacing:".12em"}}>TAP NOW!</p></>}
        {phase==="hit"&&<><p style={{fontSize:38}}>✓</p><p style={{fontSize:15,fontWeight:700,color:GREEN}}>{msg}</p></>}
        {phase==="miss"&&<><p style={{fontSize:38}}>✗</p><p style={{fontSize:16,color:RED,textAlign:"center"}}>{msg}</p></>}
      </div>
      {phase==="ready"&&<button onClick={()=>nextRep(0)} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${AMBER}cc,${AMBER})`,color:BG,letterSpacing:".05em"}}>Start →</button>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 5 — COGNITIVE SWITCH
// ══════════════════════════════════════════════════════════════════════════
function SwitchChallenge({onComplete, difficulty}){
  const NUM_ITEMS = difficulty?.switch?.items || 12;
  const SHAPE_BTNS=["circle","square","triangle","diamond"];
  const COLOR_BTNS=[{n:"Red",c:"#EF4444"},{n:"Blue",c:"#3B82F6"},{n:"Green",c:"#22C55E"},{n:"Amber",c:"#F59E0B"}];
  const [items]   = useState(()=>[...SWITCH_ITEMS].sort(()=>Math.random()-.5).slice(0,NUM_ITEMS).map((it,i)=>({...it,rule:i<NUM_ITEMS/3?"shape":i<NUM_ITEMS*2/3?"color":"shape"})));
  const [idx,     setIdx]  = useState(0);
  const [rule,    setRule] = useState("shape");
  const [score,   setScore]= useState(0);
  const [correct, setCor]  = useState(0);
  const [fb,      setFb]   = useState(null);
  const [started, setSt]   = useState(false);
  const [switched,setSw]   = useState(false);

  function handleAnswer(answer){
    if(fb||!started) return;
    const item=items[idx];
    const ok=rule==="shape"?answer===item.shape:answer===item.colorName;
    const pts=ok?25:0;
    setScore(s=>s+pts); if(ok)setCor(c=>c+1);
    setFb({ok,pts});
    setTimeout(()=>{
      setFb(null);
      const next=idx+1;
      if(next>=items.length){onComplete(score+pts,"Cognitive Switch",null);return;}
      const nr=items[next].rule;
      if(nr!==rule){setRule(nr);setSw(true);setTimeout(()=>setSw(false),1100);}
      setIdx(next);
    },480);
  }

  const item=items[idx];

  return(
    <div>
      <RoundProgress round={5}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Cognitive Switch</p><p style={{fontSize:15,color:MUTED}}>{correct}/{idx} · {score} pts</p></div>
        <span style={{fontSize:16,color:RED,fontWeight:700,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",borderRadius:100,padding:"4px 12px"}}>Flexibility</span>
      </div>
      {!started?(
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"32px 24px",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:14}}>🔄</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE,marginBottom:14}}>Cognitive Switch</h2>
          <div style={{display:"flex",gap:12,marginBottom:18}}>
            <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"14px"}}>
              <p style={{fontSize:16,fontWeight:700,color:E_BLUE,marginBottom:6,letterSpacing:".1em"}}>SHAPE RULE</p>
              <p style={{fontSize:16,color:MUTED}}>Tap the button matching the <strong style={{color:WHITE}}>shape</strong></p>
            </div>
            <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"14px"}}>
              <p style={{fontSize:16,fontWeight:700,color:RED,marginBottom:6,letterSpacing:".1em"}}>COLOUR RULE</p>
              <p style={{fontSize:16,color:MUTED}}>Tap the button matching the <strong style={{color:WHITE}}>colour</strong></p>
            </div>
          </div>
          <p style={{fontSize:16,color:AMBER,marginBottom:22}}>⚠ The rule switches mid-task without warning.</p>
          <button onClick={()=>setSt(true)} style={{border:"none",borderRadius:100,padding:"14px 40px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${RED}cc,${RED})`,color:WHITE,letterSpacing:".05em"}}>Start →</button>
        </div>
      ):(
        <div>
          <div style={{background:switched?"rgba(251,191,36,0.09)":"rgba(0,200,255,0.04)",border:`1.5px solid ${switched?AMBER:BORDER}`,borderRadius:12,padding:"10px 16px",marginBottom:12,textAlign:"center",transition:"all .3s"}}>
            {switched&&<p className="pulse" style={{fontSize:15,fontWeight:700,color:AMBER,letterSpacing:".12em",textTransform:"uppercase",marginBottom:2}}>⚠ RULE SWITCH!</p>}
            <p style={{fontSize:16,fontWeight:700,color:switched?AMBER:E_BLUE}}>Active rule: <strong>{rule==="shape"?"SORT BY SHAPE":"SORT BY COLOUR"}</strong></p>
          </div>
          <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"24px",textAlign:"center",marginBottom:12,minHeight:120,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
            <ShapeEl shape={item.shape} color={item.color} size={82}/>
            <p style={{fontSize:16,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginTop:4}}>Item {idx+1} of {items.length}</p>
          </div>
          {rule==="shape"?(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {SHAPE_BTNS.map(sh=>(
                <button key={sh} onClick={()=>handleAnswer(sh)} style={{border:`1.5px solid ${BORDER2}`,borderRadius:14,padding:"14px",background:"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transition:"all .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=E_BLUE}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER2}>
                  <ShapeEl shape={sh} color={WHITE} size={32}/>
                  <span style={{fontSize:14,fontWeight:700,color:MUTED,textTransform:"capitalize",letterSpacing:".06em",fontFamily:"'Space Grotesk',sans-serif"}}>{sh}</span>
                </button>
              ))}
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {COLOR_BTNS.map(cb=>(
                <button key={cb.n} onClick={()=>handleAnswer(cb.n)} style={{border:`1.5px solid ${cb.c}44`,borderRadius:14,padding:"15px 14px",background:`${cb.c}0e`,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=`${cb.c}22`}
                  onMouseLeave={e=>e.currentTarget.style.background=`${cb.c}0e`}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:cb.c,boxShadow:`0 0 10px ${cb.c}77`,flexShrink:0}}/>
                  <span style={{fontSize:16,fontWeight:700,color:WHITE,fontFamily:"'Space Grotesk',sans-serif"}}>{cb.n}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <FeedbackPop show={!!fb} correct={fb?.ok} pts={fb?.pts}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROUND 6 — NEURAL DEFENSE
// ══════════════════════════════════════════════════════════════════════════
function NeuralDefense({onComplete, difficulty}){
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;
  const SHIELD_WIDTH = 60;
  const SHAPE_SIZE = 36;
  
  // Difficulty settings
  const WAVE_DURATION = difficulty?.defense?.waveDuration || 30; // seconds per wave
  const SPAWN_RATE_WAVE1 = difficulty?.defense?.spawnWave1 || 1200; // ms
  const SPAWN_RATE_WAVE2 = difficulty?.defense?.spawnWave2 || 900;
  const SPAWN_RATE_WAVE3 = difficulty?.defense?.spawnWave3 || 650;
  const FALL_SPEED_WAVE1 = difficulty?.defense?.fallWave1 || 2.5; // px per frame
  const FALL_SPEED_WAVE2 = difficulty?.defense?.fallWave2 || 3.5;
  const FALL_SPEED_WAVE3 = difficulty?.defense?.fallWave3 || 4.8;
  
  const [phase, setPhase] = useState("ready"); // ready, playing, between, complete
  const [betweenWave, setBetweenWave] = useState(0); // wave just completed
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [shieldX, setShieldX] = useState(GAME_WIDTH/2 - SHIELD_WIDTH/2);
  const [shapes, setShapes] = useState([]);
  const [particles, setParticles] = useState([]);
  const [waveTime, setWaveTime] = useState(WAVE_DURATION);
  const [lightningBolts, setLightningBolts] = useState([]); // Visual effect when shooting
  const [scorePopups, setScorePopups] = useState([]); // Floating score numbers
  const [screenFlash, setScreenFlash] = useState(null); // Red flash on miss
  const [shieldActive, setShieldActive] = useState(false); // Shield glow effect
  
  const gameLoopRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const waveTimerRef = useRef(null);
  const reactionTimes = useRef([]);
  const nextId = useRef(0);
  const nextPopupId = useRef(0);
  
  const SHAPES_POOL = [
    {type:"circle", color:E_BLUE, pts:10},
    {type:"square", color:GREEN, pts:10},
    {type:"triangle", color:AMBER, pts:10},
    {type:"diamond", color:VIOLET, pts:15},
  ];

  function startGame(){
    setPhase("playing");
    setWave(1);
    setScore(0);
    setHits(0);
    setMisses(0);
    setWaveTime(WAVE_DURATION);
    setShapes([]);
    setParticles([]);
    reactionTimes.current = [];
    startWave(1);
  }

  function startWave(w){
    setWave(w);
    setWaveTime(WAVE_DURATION);
    
    const spawnRate = w===1 ? SPAWN_RATE_WAVE1 : w===2 ? SPAWN_RATE_WAVE2 : SPAWN_RATE_WAVE3;
    const fallSpeed = w===1 ? FALL_SPEED_WAVE1 : w===2 ? FALL_SPEED_WAVE2 : FALL_SPEED_WAVE3;
    
    // Spawn shapes periodically
    spawnTimerRef.current = setInterval(()=>{
      const shape = SHAPES_POOL[Math.floor(Math.random()*SHAPES_POOL.length)];
      const id = nextId.current++;
      setShapes(prev => [...prev, {
        id,
        ...shape,
        x: Math.random() * (GAME_WIDTH - SHAPE_SIZE),
        y: -SHAPE_SIZE,
        speed: fallSpeed,
        spawnTime: Date.now(),
      }]);
    }, spawnRate);
    
    // Wave countdown timer
    let timeLeft = WAVE_DURATION;
    waveTimerRef.current = setInterval(()=>{
      timeLeft--;
      setWaveTime(timeLeft);
      if(timeLeft <= 0){
        clearInterval(spawnTimerRef.current);
        clearInterval(waveTimerRef.current);
        if(w < 3){
          setTimeout(()=> startWave(w+1), 2000);
        } else {
          finishGame();
        }
      }
    }, 1000);
  }

  function finishGame(){
    clearInterval(spawnTimerRef.current);
    clearInterval(waveTimerRef.current);
    if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    
    const accuracy = hitsRef.current+misses > 0 ? Math.round((hitsRef.current/(hitsRef.current+misses))*100) : 0;
    const avgReaction = reactionTimes.current.length > 0 
      ? Math.round(reactionTimes.current.reduce((a,b)=>a+b,0) / reactionTimes.current.length) 
      : 0;
    
    onComplete(scoreRef.current, "Neural Defense", avgReaction, accuracy);
  }

  // Game loop - move shapes and check collisions
  useEffect(()=>{
    if(phase !== "playing") return;
    
    function gameLoop(){
      setShapes(prev => {
        const updated = prev.map(s => ({...s, y: s.y + s.speed}));
        // Remove shapes that reached bottom (missed)
        const missed = updated.filter(s => s.y > GAME_HEIGHT);
        if(missed.length > 0){
          setMisses(m => m + missed.length);
          // 🔊 MISS SOUND
          playMissSound();
          // ❌ SCREEN FLASH on miss
          setScreenFlash('red');
          setTimeout(() => setScreenFlash(null), 200);
        }
        return updated.filter(s => s.y <= GAME_HEIGHT);
      });
      
      // Decay particles
      setParticles(prev => prev.map(p => ({...p, life: p.life - 1})).filter(p => p.life > 0));
      
      // Decay lightning bolts
      setLightningBolts(prev => prev.map(l => ({...l, life: l.life - 1, targetY: l.targetY - 20})).filter(l => l.life > 0));
      
      // Decay score popups
      setScorePopups(prev => prev.map(p => ({...p, life: p.life - 1, y: p.y - 2})).filter(p => p.life > 0));
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [phase]);

  // Cleanup on unmount
  useEffect(()=>{
    return ()=>{
      clearInterval(spawnTimerRef.current);
      clearInterval(waveTimerRef.current);
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  function handleShoot(){
    if(phase !== "playing") return;
    
    // 🔊 SHOOT SOUND
    playShootSound();
    
    // 🎆 LIGHTNING BOLT EFFECT - Create dramatic shooting visual
    const shieldCenter = shieldX + SHIELD_WIDTH/2;
    setLightningBolts(prev => [...prev, {
      id: Math.random(),
      x: shieldCenter,
      y: GAME_HEIGHT - 50,
      targetY: -50,
      life: 15,
    }]);
    
    // Activate shield glow
    setShieldActive(true);
    setTimeout(() => setShieldActive(false), 200);
    
    // Check if shield hits any shape - hit the closest shape to shield
    const shieldTop = GAME_HEIGHT - 60;
    
    let hitCount = 0;
    let totalPoints = 0;
    setShapes(prev => {
      const remaining = [];
      // Find the best target: prioritise shapes near shield horizontally, lowest on screen
      let bestTarget = null;
      let bestScore = -1;
      prev.forEach(s => {
        const shapeCenter = s.x + SHAPE_SIZE/2;
        const horizDist = Math.abs(shapeCenter - shieldCenter);
        const vertScore = s.y; // lower = better (closer to shield)
        if(horizDist < 100) {
          const score = vertScore - horizDist * 0.5;
          if(score > bestScore) { bestScore = score; bestTarget = s; }
        }
      });
      prev.forEach(s => {
        const shapeCenter = s.x + SHAPE_SIZE/2;
        const shapeBottom = s.y + SHAPE_SIZE;
        const isTarget = bestTarget && s.id === bestTarget.id;
        
        // Hit if it's our best target
        if(isTarget){
          // 💥 HIT!
          hitCount++;
          totalPoints += s.pts;
          scoreRef.current += s.pts;
          setScore(scoreRef.current);
          hitsRef.current += 1;
          setHits(hitsRef.current);
          
          // 🔊 HIT SOUND
          playHitSound();
          
          // Track reaction time
          const rt = Date.now() - s.spawnTime;
          reactionTimes.current.push(rt);
          
          // 🎯 SCORE POPUP - Floating number
          setScorePopups(p => [...p, {
            id: nextPopupId.current++,
            x: s.x + SHAPE_SIZE/2,
            y: s.y,
            value: `+${s.pts}`,
            color: s.color,
            life: 30,
          }]);
          
          // 💥 EXPLOSION PARTICLES - More dramatic
          for(let i=0; i<12; i++){
            setParticles(p => [...p, {
              id: Math.random(),
              x: s.x + SHAPE_SIZE/2,
              y: s.y + SHAPE_SIZE/2,
              vx: (Math.random()-0.5)*6,
              vy: (Math.random()-0.5)*6,
              color: s.color,
              life: 25,
            }]);
          }
          
          // 🧠 NEURAL PULSE RINGS - Emanate from hit point
          for(let i=0; i<3; i++){
            setTimeout(() => {
              setParticles(p => [...p, {
                id: Math.random(),
                x: s.x + SHAPE_SIZE/2,
                y: s.y + SHAPE_SIZE/2,
                vx: 0,
                vy: 0,
                color: s.color,
                life: 20,
                isPulse: true,
                pulseSize: i * 10,
              }]);
            }, i * 100);
          }
        } else {
          remaining.push(s);
        }
      });
      return remaining;
    });
  }

  function handleMouseMove(e){
    if(phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - SHIELD_WIDTH/2;
    setShieldX(Math.max(0, Math.min(GAME_WIDTH - SHIELD_WIDTH, x)));
  }

  function handleTouchMove(e){
    if(phase !== "playing") return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left - SHIELD_WIDTH/2;
    setShieldX(Math.max(0, Math.min(GAME_WIDTH - SHIELD_WIDTH, x)));
  }

  function handleTouchEnd(e){
    if(phase !== "playing") return;
    // Fire shoot on tap (touchend = tap on mobile)
    handleShoot();
  }

  // Render shape SVG
  function renderShape(type, color, size){
    if(type==="circle") return <div style={{width:size,height:size,borderRadius:"50%",background:color,boxShadow:`0 0 12px ${color}88`}}/>;
    if(type==="square") return <div style={{width:size,height:size,background:color,borderRadius:4,boxShadow:`0 0 12px ${color}88`}}/>;
    if(type==="triangle") return <div style={{width:0,height:0,borderLeft:`${size/2}px solid transparent`,borderRight:`${size/2}px solid transparent`,borderBottom:`${size}px solid ${color}`,filter:`drop-shadow(0 0 8px ${color}88)`}}/>;
    if(type==="diamond") return <div style={{width:size,height:size,background:color,transform:"rotate(45deg)",borderRadius:4,boxShadow:`0 0 12px ${color}88`}}/>;
  }

  if(phase === "ready"){
    return(
      <div>
        <RoundProgress round={6}/>
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"32px 24px",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:14}}>🛡️</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE,marginBottom:10}}>Neural Defense</h2>
          <p style={{fontSize:16,color:MUTED,lineHeight:1.85,marginBottom:20}}>
            <strong style={{color:WHITE}}>THE OBJECTIVE:</strong><br/>
            Shapes fall from above.<br/>
            <strong style={{color:PURPLE}}>Move your shield</strong> left and right,<br/>
            then <strong style={{color:PURPLE}}>tap to block</strong> before they hit bottom.<br/>
            <span style={{fontSize:14,color:DIMMED}}>3 waves · Increasing speed · Every hit counts</span>
          </p>
          <div style={{background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
            <p style={{fontSize:14,color:AMBER,fontWeight:700,marginBottom:4}}>🛡️ Shield Tip:</p>
            <p style={{fontSize:14,color:MUTED,lineHeight:1.6}}>
              Click/tap anywhere to shoot. Position your shield under falling shapes - when they're close, they'll be destroyed!
            </p>
          </div>
          <div style={{background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.25)",borderRadius:12,padding:"16px 18px",marginBottom:22}}>
            <p style={{fontSize:14,color:MUTED,lineHeight:1.75}}>
              This trains sustained visual attention and reaction time under continuous pressure — the same skills measured in action game research.
            </p>
          </div>
          <button onClick={startGame} style={{border:"none",borderRadius:100,padding:"14px 40px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${PURPLE}cc,${PURPLE})`,color:WHITE,letterSpacing:".05em",boxShadow:`0 6px 28px ${PURPLE}44`,animation:"pulse 2s infinite"}}>
            ⚡ Launch Defense →
          </button>
        </div>
      </div>
    );
  }

  // Between-wave celebration screen
  if(phase === "between"){
    return(
      <div style={{textAlign:"center",padding:"40px 20px",animation:"fadeUp .3s ease both"}}>
        <RoundProgress round={6}/>
        <div style={{background:`linear-gradient(135deg,${PURPLE}18,rgba(0,200,255,0.08))`,border:`2px solid ${PURPLE}66`,borderRadius:20,padding:"36px 28px",marginTop:16}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,letterSpacing:3,color:PURPLE,marginBottom:4}}>WAVE {betweenWave}</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:GREEN,marginBottom:20}}>COMPLETE ✓</div>
          <div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:24}}>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:WHITE}}>{hits}</p>
              <p style={{fontSize:12,color:DIMMED,letterSpacing:".1em"}}>HITS</p>
            </div>
            <div style={{width:1,background:BORDER2}}/>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:WHITE}}>{score}</p>
              <p style={{fontSize:12,color:DIMMED,letterSpacing:".1em"}}>POINTS</p>
            </div>
            <div style={{width:1,background:BORDER2}}/>
            <div style={{textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:RED}}>{misses}</p>
              <p style={{fontSize:12,color:DIMMED,letterSpacing:".1em"}}>MISSED</p>
            </div>
          </div>
          <p style={{fontSize:15,color:AMBER,fontWeight:700,letterSpacing:".08em"}}>⚡ WAVE {betweenWave+1} INCOMING — GET READY</p>
          <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden",marginTop:16}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${PURPLE},${E_BLUE})`,animation:"waveLoad 2.5s linear forwards",borderRadius:100}}/>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div>
      <RoundProgress round={6}/>
      
      {/* 🎮 DRAMATIC GAME HUD */}
      <div style={{background:"rgba(7,15,30,0.95)",border:`2px solid ${waveTime<=5?"rgba(239,68,68,0.6)":waveTime<=10?"rgba(251,191,36,0.4)":"rgba(139,92,246,0.3)"}`,borderRadius:14,padding:"12px 16px",marginBottom:10,boxShadow:waveTime<=5?`0 0 20px rgba(239,68,68,0.3)`:waveTime<=10?`0 0 15px rgba(251,191,36,0.2)`:"none",transition:"all .3s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          {/* Left: Wave + Hits */}
          <div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
              {[1,2,3].map(w=>(
                <div key={w} style={{width:28,height:6,borderRadius:3,background:w<=wave?`linear-gradient(90deg,${PURPLE},${E_BLUE})`:BORDER2,transition:"all .3s"}}/>
              ))}
              <span style={{fontSize:12,color:DIMMED,fontWeight:700,marginLeft:4}}>WAVE {wave}/3</span>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:13,color:MUTED}}>🎯 <strong style={{color:GREEN}}>{hits}</strong> hits</span>
              <span style={{fontSize:13,color:MUTED}}>❌ <strong style={{color:RED}}>{misses}</strong> missed</span>
            </div>
          </div>
          {/* Centre: Score */}
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2,color:WHITE,lineHeight:1}}>{score}</p>
            <p style={{fontSize:11,color:DIMMED,letterSpacing:".1em"}}>POINTS</p>
          </div>
          {/* Right: Countdown clock */}
          <div style={{textAlign:"right"}}>
            <div style={{background:waveTime<=5?"rgba(239,68,68,0.15)":waveTime<=10?"rgba(251,191,36,0.1)":"rgba(139,92,246,0.1)",border:`2px solid ${waveTime<=5?"rgba(239,68,68,0.7)":waveTime<=10?AMBER:PURPLE}`,borderRadius:10,padding:"6px 12px",minWidth:58,textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:1,color:waveTime<=5?RED:waveTime<=10?AMBER:PURPLE,lineHeight:1,animation:waveTime<=5?"screen-shake .2s infinite":"none"}}>{waveTime}</p>
              <p style={{fontSize:10,color:DIMMED,letterSpacing:".1em"}}>SECS</p>
            </div>
          </div>
        </div>
        {/* Wave progress bar */}
        <div style={{marginTop:8,height:4,background:"rgba(255,255,255,0.05)",borderRadius:100,overflow:"hidden"}}>
          <div style={{height:"100%",background:waveTime<=5?`linear-gradient(90deg,${RED},#FF6B6B)`:waveTime<=10?`linear-gradient(90deg,${AMBER},#FDE68A)`:`linear-gradient(90deg,${PURPLE},${E_BLUE})`,width:`${(waveTime/WAVE_DURATION)*100}%`,transition:"width 1s linear",borderRadius:100}}/>
        </div>
      </div>

      {/* Game area */}
      <div 
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleShoot}
        style={{
          position:"relative",
          width:GAME_WIDTH,
          maxWidth:"100%",
          height:GAME_HEIGHT,
          margin:"0 auto",
          background:"linear-gradient(180deg, rgba(13,24,48,0.4), rgba(7,15,30,0.95))",
          border:`2px solid ${BORDER}`,
          borderRadius:16,
          overflow:"hidden",
          cursor:"crosshair",
          touchAction:"none"
        }}
      >
        {/* Falling shapes */}
        {shapes.map(s => (
          <div key={s.id} style={{position:"absolute",left:s.x,top:s.y,pointerEvents:"none"}}>
            {renderShape(s.type, s.color, SHAPE_SIZE)}
          </div>
        ))}
        
        {/* ⚡ LIGHTNING BOLTS - Dramatic shooting effect */}
        {lightningBolts.map(bolt => (
          <div key={bolt.id} style={{
            position:"absolute",
            left:bolt.x - 2,
            top:bolt.targetY,
            bottom:GAME_HEIGHT - bolt.y,
            width:4,
            background:`linear-gradient(180deg, ${PURPLE}00, ${PURPLE}FF, ${PURPLE}88)`,
            boxShadow:`0 0 20px ${PURPLE}, 0 0 40px ${PURPLE}88`,
            opacity:bolt.life / 15,
            pointerEvents:"none",
            animation:"lightning-flicker 0.1s infinite"
          }}/>
        ))}
        
        {/* 🎯 SCORE POPUPS - Floating numbers */}
        {scorePopups.map(popup => (
          <div key={popup.id} style={{
            position:"absolute",
            left:popup.x - 20,
            top:popup.y,
            fontSize:20,
            fontWeight:800,
            color:popup.color,
            opacity:popup.life / 30,
            pointerEvents:"none",
            textShadow:`0 0 10px ${popup.color}, 0 0 20px ${popup.color}`,
            transform:`scale(${1 + (30 - popup.life) / 30 * 0.5})`
          }}>{popup.value}</div>
        ))}
        
        {/* Particles */}
        {particles.map(p => {
          if(p.isPulse) {
            // 🧠 NEURAL PULSE RINGS
            const size = 40 + (20 - p.life) * 3 + p.pulseSize;
            return (
              <div key={p.id} style={{
                position:"absolute",
                left:p.x - size/2,
                top:p.y - size/2,
                width:size,
                height:size,
                borderRadius:"50%",
                border:`2px solid ${p.color}`,
                opacity:p.life / 20,
                pointerEvents:"none"
              }}/>
            );
          }
          return (
            <div key={p.id} style={{
              position:"absolute",
              left:p.x + (p.vx * (25-p.life)),
              top:p.y + (p.vy * (25-p.life)),
              width:5,
              height:5,
              borderRadius:"50%",
              background:p.color,
              boxShadow:`0 0 8px ${p.color}`,
              opacity:p.life/25,
              pointerEvents:"none"
            }}/>
          );
        })}
        
        {/* ❌ SCREEN FLASH on miss */}
        {screenFlash && (
          <div style={{
            position:"absolute",
            top:0,
            left:0,
            right:0,
            bottom:0,
            background:"rgba(239,68,68,0.3)",
            pointerEvents:"none",
            animation:"screen-shake 0.2s"
          }}/>
        )}
        
        {/* Shield with glow effect */}
        <div style={{
          position:"absolute",
          left:shieldX,
          bottom:20,
          width:SHIELD_WIDTH,
          height:12,
          background:`linear-gradient(90deg,${PURPLE}44,${PURPLE},${PURPLE}44)`,
          borderRadius:6,
          boxShadow:shieldActive ? `0 0 30px ${PURPLE}, 0 0 60px ${PURPLE}88` : `0 0 16px ${PURPLE}88`,
          pointerEvents:"none",
          transition:"all 0.08s",
          transform:shieldActive ? "scale(1.1)" : "scale(1)"
        }}/>
        
        {/* Tap instruction with shield tooltip */}
        <div style={{position:"absolute",bottom:50,left:"50%",transform:"translateX(-50%)",fontSize:13,color:DIMMED,pointerEvents:"none",textAlign:"center"}}>
          <div style={{marginBottom:4}}>Tap anywhere to shoot</div>
          <div style={{fontSize:11,color:PURPLE,background:"rgba(139,92,246,0.1)",padding:"4px 8px",borderRadius:6}}>
            🛡️ Shield blocks incoming shapes
          </div>
        </div>
      </div>
      
      {/* Add CSS keyframes for lightning flicker and screen shake */}
      <style>{`
        @keyframes lightning-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 2px); }
          50% { transform: translate(5px, -2px); }
          75% { transform: translate(-3px, -2px); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// RESULTS
// ══════════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════════
function Results({scores,level,newLevel,streak,dailyAction,arch,challengeData,onBack,onRetry}){
  const total=scores.reduce((a,s)=>a+s.score,0);
  const levelUp=newLevel.name!==level.name;
  const grade=total>=540?"Quantum Elite":total>=420?"Elite":total>=300?"Sharp":total>=180?"Developing":"Initiate";
  const gradeColor=total>=540?VIOLET:total>=420?E_BLUE:total>=300?GREEN:total>=180?AMBER:DIMMED;
  const rtimes=scores.filter(s=>s.reactionMs).map(s=>s.reactionMs);
  const avgMs=rtimes.length?Math.round(rtimes.reduce((a,b)=>a+b,0)/rtimes.length):null;
  const roundMeta=[
    {icon:"🎨",label:"Stroop",tag:"Exec. Function",max:140},
    {icon:"🧠",label:"2-Back",tag:"Working Memory",max:140},
    {icon:"🔷",label:"Matrix",tag:"Spatial",max:140},
    {icon:"⚡",label:"Reaction",tag:"Proc. Speed",max:130},
    {icon:"🔄",label:"Switch",tag:"Flexibility",max:120},
    {icon:"🛡️",label:"Defense",tag:"Sustained Attn",max:150},
  ];
  return(
    <div style={{animation:"fadeUp .55s ease both"}}>
      {levelUp&&<div style={{background:`linear-gradient(135deg,${newLevel.color}22,transparent)`,border:`2px solid ${newLevel.color}`,borderRadius:16,padding:"18px 22px",textAlign:"center",marginBottom:14}}>
        <p style={{fontSize:16,fontWeight:700,color:newLevel.color,letterSpacing:".16em",textTransform:"uppercase",marginBottom:6}}>⚡ Level Up!</p>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:WHITE}}>You are now a <span style={{color:newLevel.color}}>{newLevel.name}</span></p>
      </div>}

      <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${gradeColor}22`,borderRadius:20,padding:"30px 24px",textAlign:"center",marginBottom:14}}>
        <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>Brain Training Complete</p>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:72,letterSpacing:2,color:gradeColor,lineHeight:1,marginBottom:4}}>{total}</div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:4,color:gradeColor,marginBottom:8}}>{grade}</p>
        {avgMs&&<p style={{fontSize:16,color:MUTED,marginBottom:10}}>Avg reaction time: <strong style={{color:WHITE}}>{avgMs}ms</strong>{avgMs<270?"  ⚡":avgMs<370?"  ✓":""}</p>}
        {streak>0&&<div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.16)",borderRadius:100,padding:"6px 14px",fontSize:14,color:AMBER,fontWeight:600}}>🔥 {streak}-day streak · +{streak*5}% bonus</div>}
      </div>

      {/* Breakdown */}
      <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"20px",marginBottom:14}}>
        <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:14}}>Round Breakdown</p>
        {scores.map((s,i)=>{
          const m=roundMeta[i]; const pct=Math.min(100,(s.score/m.max)*100);
          const col=pct>65?GREEN:pct>35?AMBER:RED;
          return(
            <div key={i} style={{marginBottom:i<scores.length-1?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:16}}>{m.icon}</span>
                  <div><p style={{fontSize:15,fontWeight:600,color:WHITE}}>{m.label}</p><p style={{fontSize:16,color:DIMMED}}>{m.tag}</p></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  {s.reactionMs&&<p style={{fontSize:16,color:DIMMED}}>{s.reactionMs}ms</p>}
                  <p style={{fontSize:14,fontWeight:700,color:col}}>{s.score}</p>
                </div>
              </div>
              <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:100,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col}88,${col})`,borderRadius:100,transition:"width 1.2s ease"}}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archetype neural intelligence */}
      {arch && <div style={{background:`linear-gradient(135deg,${arch.color}0a,transparent)`,border:`1px solid ${arch.color}33`,borderLeft:`3px solid ${arch.color}`,borderRadius:"0 14px 14px 0",padding:"20px",marginBottom:14}}>
        <p style={{fontSize:15,fontWeight:700,color:arch.color,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>⚛ {arch.name} — Neural Intelligence Profile</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED,lineHeight:1.75,marginBottom:14}}>{arch.neuralProfile}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {scores.map((s,i)=>{
            const roundNames=["Stroop Challenge","2-Back Test","Pattern Matrix","Reaction Velocity","Cognitive Switch"];
            const insight=arch.strengths[roundNames[i]];
            if(!insight) return null;
            const roundIcons=["🎨","🧠","🔷","⚡","🔄"];
            return(
              <div key={i} style={{background:"rgba(255,255,255,0.025)",border:`1px solid rgba(255,255,255,0.06)`,borderRadius:10,padding:"12px 14px"}}>
                <p style={{fontSize:16,fontWeight:700,color:arch.color,letterSpacing:".08em",marginBottom:5}}>{roundIcons[i]} {roundNames[i]}</p>
                <p style={{fontSize:15,color:MUTED,lineHeight:1.65,fontWeight:300}}>{insight}</p>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:12,padding:"10px 14px",background:`${arch.color}0c`,border:`1px solid ${arch.color}22`,borderRadius:10}}>
          <p style={{fontSize:14,fontWeight:700,color:arch.color,marginBottom:4}}>⚡ Your Quantum Edge Today</p>
          <p style={{fontSize:15,color:MUTED,lineHeight:1.55}}>{arch.dailyEdge}</p>
        </div>
      </div>}

      {/* Daily action */}
      <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderLeft:`3px solid ${E_BLUE}`,borderRadius:"0 14px 14px 0",padding:"20px",marginBottom:14}}>
        <p style={{fontSize:15,fontWeight:700,color:E_BLUE,letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>⚡ Today's Neural Action</p>
        <p style={{fontSize:15,fontWeight:700,color:WHITE,marginBottom:8}}>{dailyAction.title}</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:15,color:MUTED,lineHeight:1.75,marginBottom:12}}>{dailyAction.action}</p>
        <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:10,padding:"11px 14px"}}>
          <p style={{fontSize:15,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>The Neuroscience</p>
          <p style={{fontSize:15,color:MUTED,lineHeight:1.6}}>{dailyAction.science}</p>
        </div>
      </div>

      {/* 21-Day Challenge Progress */}
      {challengeData && (
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:16,padding:"18px 20px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:15,fontWeight:700,color:E_BLUE,letterSpacing:".1em",textTransform:"uppercase"}}>🧠 21-Day Neural Challenge</p>
            <span style={{fontSize:13,color:AMBER,fontWeight:700}}>Day {challengeData.currentDay || 1} of 21</span>
          </div>
          {/* Progress bar */}
          <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",width:`${((challengeData.currentDay||1)/21)*100}%`,background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`,borderRadius:100,transition:"width .6s ease"}}/>
          </div>
          {/* Milestones */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            {[{day:7,label:"Week 1",icon:"⭐"},{day:14,label:"Week 2",icon:"🌟"},{day:21,label:"Complete",icon:"🏆"}].map(m=>(
              <div key={m.day} style={{textAlign:"center",flex:1}}>
                <div style={{fontSize:20,marginBottom:3,opacity:(challengeData.currentDay||0)>=m.day?1:0.3}}>{m.icon}</div>
                <p style={{fontSize:11,color:(challengeData.currentDay||0)>=m.day?E_BLUE:DIMMED,fontWeight:700}}>{m.label}</p>
                <p style={{fontSize:10,color:DIMMED}}>Day {m.day}</p>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>🔥</span>
            <div>
              <p style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:2}}>Streak: {streak} day{streak!==1?"s":""}</p>
              <p style={{fontSize:13,color:DIMMED,lineHeight:1.4}}>Return tomorrow to keep building. Each session rewires your neural pathways — consistency is where transformation happens.</p>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:10}}>
        <button onClick={onRetry} style={{flex:1,border:`1px solid ${BORDER}`,borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,background:"rgba(255,255,255,0.03)",color:MUTED,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.color=WHITE;e.currentTarget.style.borderColor=E_BLUE;}}
          onMouseLeave={e=>{e.currentTarget.style.color=MUTED;e.currentTarget.style.borderColor=BORDER;}}>↺ Retry</button>
        <button onClick={onBack} style={{flex:2,border:"none",borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".05em",transition:"all .2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>← Back to LQM</button>
      </div>
    </div>
  );
}
