import { useState, useEffect, useRef } from "react";
import BrainTraining from "./BrainTraining.jsx";
import QuantumLiving from "./QuantumLiving.jsx";

import {
  trackArchetypeResult,
  trackPatternDistribution,
  trackReturnVisit,
  trackScreen,
  trackPurchase,
} from "./firebase";

const STRIPE_MAIN  = "https://buy.stripe.com/00w8wR50Xber8VZfkka3u00";
const STRIPE_MAIN_FULL = "https://buy.stripe.com/4gMfZjeBxdmzc8b0pqa3u04";
const STRIPE_BRAIN = "https://buy.stripe.com/8x2eVfgJF4Q37RVb44a3u02";
const STRIPE_VITAL = "https://buy.stripe.com/eVq5kF651gyLgorc88a3u03";
const STRIPE_BUNDLE = "https://buy.stripe.com/dRm8wR3WT4Q30pt5JKa3u05";

function getUnlocks() { try { return JSON.parse(localStorage.getItem("lqm_unlocks")||"{}"); } catch { return {}; } }
function setUnlock(key) { const u=getUnlocks(); u[key]=true; localStorage.setItem("lqm_unlocks",JSON.stringify(u)); }

const LQM_SECRET = 0xA3F72B;

function lqmValidateCode(rawInput) {
  const clean = rawInput.replace(/[-\s]/g,"").toUpperCase();
  if (!clean.startsWith("LQM") || clean.length !== 12)
    return { valid:false, reason:"Format should be LQM-XXXX-XXXXX" };
  const data   = clean.slice(3);
  const b36str = data.slice(0, 7);
  const chkIn  = data.slice(7, 9);
  const chkExpected = [...b36str].reduce((a,c,i) => (a + c.charCodeAt(0)*(i+1)) % 1296, 0);
  if (parseInt(chkIn, 36) !== chkExpected)
    return { valid:false, reason:"Invalid code — please check for typos" };
  const raw   = parseInt(b36str, 36) ^ LQM_SECRET;
  const perms = raw & 0xF;
  const expDay = raw >> 4;
  const today = Math.trunc(Date.now() / 86400000);
  if (today > expDay)
    return { valid: false, reason:"This code has expired — please contact lqm@lqmmethod.com" };
  const used = JSON.parse(localStorage.getItem("lqm_used_codes")||"[]");
  if (used.includes(clean))
    return { valid: false, reason:"This code has already been used on this device" };
  return {
      valid: true,
    report: (perms & 1) === 1,
    neural: (perms & 2) === 2,
    vital:  (perms & 4) === 4,
    codeKey: clean,
  };
}

const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;
const E_BLUE="#00C8FF",E_BLUE2="#0EA5E9",E_GLOW="rgba(0,200,255,0.15)";
const BG="#070F1E",DARK="#0D1830",DARK2="#111E38",PANEL="rgba(255,255,255,0.055)";
const BORDER="rgba(0,200,255,0.18)",BORDER2="rgba(255,255,255,0.09)";
const WHITE="#FFFFFF",MUTED="rgba(255,255,255,0.78)",DIMMED="rgba(255,255,255,0.50)";
const AMBER="#FBBF24",GREEN="#22C55E",PURPLE="#A855F7";
const SYMS=["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];
const RED="#EF4444";

function ArchetypeIllustration({ type: t }) {
  const ARCH_COLORS = {A:"#00C8FF",B:"#38BDF8",C:"#34D399",D:"#A78BFA"};
  const c = ARCH_COLORS[t] || "#00C8FF";
  const uid = `lqm_${t}`;
  const css = `
    #${uid}_r1 { transform-box:fill-box; transform-origin:center; animation:${uid}_s1 9s linear infinite; }
    #${uid}_r2 { transform-box:fill-box; transform-origin:center; animation:${uid}_s2 15s linear infinite; }
    #${uid}_r3 { transform-box:fill-box; transform-origin:center; animation:${uid}_s3 5s linear infinite; }
    @keyframes ${uid}_s1 { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
    @keyframes ${uid}_s2 { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
    @keyframes ${uid}_s3 { from{transform:rotate(45deg);} to{transform:rotate(405deg);} }
  `;
  return (
    <svg viewBox="0 0 200 140" style={{width:"100%",maxWidth:340,display:"block",margin:"0 auto"}}>
      <style>{css}</style>
      <defs><radialGradient id={`${uid}_g`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={c} stopOpacity="0.3"/><stop offset="100%" stopColor={c} stopOpacity="0"/></radialGradient></defs>
      <ellipse cx="100" cy="70" rx="55" ry="45" fill={`url(#${uid}_g)`} opacity="0.8"/>
      {[35,65,100,135,165].map(x=><line key={`v${x}`} x1={x} y1="15" x2={x} y2="125" stroke={c} strokeWidth="0.3" opacity="0.15"/>)}
      {[25,50,70,90,115].map(y=><line key={`h${y}`} x1="15" y1={y} x2="185" y2={y} stroke={c} strokeWidth="0.3" opacity="0.15"/>)}
      {[[18,18],[182,18],[18,122],[182,122]].map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="2.5" fill={c} opacity="0.5"/>))}
      <circle cx="100" cy="70" r="50" fill="none" stroke={c} strokeWidth="0.4" opacity="0.2"/>
      <g id={`${uid}_r1`}><circle cx="100" cy="70" r="40" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="42 22" opacity="0.5"/><circle cx="100" cy="30" r="4.5" fill="white" opacity="0.9"/><circle cx="140" cy="70" r="3" fill="white" opacity="0.65"/></g>
      <g id={`${uid}_r2`}><circle cx="100" cy="70" r="28" fill="none" stroke="white" strokeWidth="1.2" strokeDasharray="30 16" opacity="0.55"/><circle cx="100" cy="42" r="4" fill="white" opacity="0.95"/><circle cx="72" cy="70" r="3" fill={c} opacity="1"/></g>
      <g id={`${uid}_r3`}><circle cx="100" cy="70" r="16" fill="none" stroke="white" strokeWidth="1.8" strokeDasharray="18 10" opacity="0.65"/><circle cx="100" cy="54" r="3.5" fill={c} opacity="1"/></g>
      <line x1="100" y1="22" x2="100" y2="118" stroke={c} strokeWidth="0.6" opacity="0.2"/>
      <line x1="52" y1="70" x2="148" y2="70" stroke={c} strokeWidth="0.6" opacity="0.2"/>
      <circle cx="100" cy="70" r="9" fill={c} opacity="0.2"/>
      <circle cx="100" cy="70" r="5.5" fill={c} opacity="0.6"/>
      <circle cx="100" cy="70" r="2.5" fill="white" opacity="1"/>
    </svg>
  );
}

function FlameIcon({size=16}) {
  const w = Math.round(size * 0.75);
  return (
    <svg width={w} height={size} viewBox="0 0 15 20" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0,transformOrigin:"center bottom",animation:"flamePulse 1.9s ease-in-out infinite"}}>
      <path d="M7.5 1C7.5 1 4.5 4.5 4.5 8C4.5 8 3 6 3.5 3.5C1 5.5 1 9.5 3 11.5C2 13 2 15 3 16.5C4.2 18.5 5.8 19.5 7.5 19.5C9.2 19.5 10.8 18.5 12 16.5C13 15 13 13 12 11.5C14 9.5 14 5.5 11.5 3.5C12 6 10.5 8 10.5 8C10.5 4.5 7.5 1 7.5 1Z" fill="#7DD3FC" opacity="0.92"/>
      <path d="M7.5 8C7.5 8 6 10 6 12C6 12 5 11 5.5 9.5C4 11 4.5 13.5 6 15C6.5 16 7 17 7.5 17C8 17 8.5 16 9 15C10.5 13.5 11 11 9.5 9.5C10 11 9 12 9 12C9 10 7.5 8 7.5 8Z" fill="#FFFFFF" opacity="0.96"/>
    </svg>
  );
}

function StrengthBars({strengths,color}){
  const widths=[95,88,82,76];
  return <div style={{marginTop:8}}>{strengths.map((s,i)=>(<div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color:WHITE}}>{s}</span><span style={{fontSize:12,color,fontWeight:700}}>{widths[i]}%</span></div><div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",width:`${widths[i]}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:100,boxShadow:`0 0 8px ${color}66`}}/></div></div>))}</div>;
}

function BlindSpotCard({text,index,color}){
  const icons=["⚠","◎","△"];
  return <div style={{display:"flex",gap:16,alignItems:"flex-start",padding:"16px 18px",background:"rgba(255,160,40,0.06)",border:"1px solid rgba(255,160,40,0.2)",borderRadius:12,marginBottom:10,borderLeft:"3px solid rgba(255,160,40,0.5)"}}><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,160,40,0.12)",border:"1px solid rgba(255,160,40,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>{icons[index]}</div><div><p style={{fontSize:16,fontWeight:700,color:"rgba(255,200,80,0.97)",lineHeight:1.5,marginBottom:2}}>{text}</p><p style={{fontSize:13,color:"rgba(255,200,80,0.78)",fontWeight:400}}>Awareness is the first step to navigation</p></div></div>;
}

const questions = [
  {id:1,sym:"⚛",text:"When you set a major goal, what's your first instinct?",opts:[{t:"Design a precise system and track every step",ty:"A"},{t:"Research deeply until I truly understand it",ty:"B"},{t:"Find someone who's done it and learn from them",ty:"C"},{t:"Visualise the person I'll become when I achieve it",ty:"D"}]},
  {id:2,sym:"◎",text:"Your honest definition of success:",opts:[{t:"Consistent, measurable results — proof in the numbers",ty:"A"},{t:"Genuine mastery — understanding something at its deepest level",ty:"B"},{t:"Making a meaningful difference to people I care about",ty:"C"},{t:"Creating something original that only I could have made",ty:"D"}]},
  {id:3,sym:"△",text:"You've been stuck for three days. What actually breaks the deadlock?",opts:[{t:"I reset my system — break it into smaller daily actions",ty:"A"},{t:"I reframe it as a problem to be solved with better information",ty:"B"},{t:"Someone I respect holds me accountable",ty:"C"},{t:"I change the environment entirely and start fresh",ty:"D"}]},
  {id:4,sym:"⬡",text:"Which condition produces your best work?",opts:[{t:"Clear structure, defined metrics, known expectations",ty:"A"},{t:"Freedom to explore, question, and go deep",ty:"B"},{t:"A strong team with shared purpose and mutual trust",ty:"C"},{t:"Full creative autonomy over the vision and execution",ty:"D"}]},
  {id:5,sym:"⊕",text:"What depletes your motivation fastest?",opts:[{t:"Effort with no visible progress or measurable result",ty:"A"},{t:"Repetition with no growth or learning",ty:"B"},{t:"Isolation — working without human connection",ty:"C"},{t:"Being handed a script and told to follow it",ty:"D"}]},
  {id:6,sym:"⟁",text:"Someone critiques your work sharply. Your real first reaction:",opts:[{t:"I measure it against the objective — is it accurate?",ty:"A"},{t:"I ask questions to understand their reasoning",ty:"B"},{t:"I notice how it affects my relationship with them",ty:"C"},{t:"I feel it intensely — then use the friction as fuel",ty:"D"}]},
  {id:7,sym:"◈",text:"When learning something genuinely difficult, you naturally:",opts:[{t:"Follow a proven system or structured curriculum",ty:"A"},{t:"Go straight to source material and build your own understanding",ty:"B"},{t:"Learn by doing it with others or teaching it",ty:"C"},{t:"Experiment, fail, iterate — trial is the teacher",ty:"D"}]},
  {id:8,sym:"⬢",text:"Your relationship with long-term goals:",opts:[{t:"I thrive on them — the system is the goal",ty:"A"},{t:"I like goals that evolve as my understanding deepens",ty:"B"},{t:"Goals feel most alive when shared with others",ty:"C"},{t:"My north star is fixed — how I get there is flexible",ty:"D"}]},
  {id:9,sym:"⚛",text:"At the end of a high-performance day, you feel:",opts:[{t:"Accomplished — the system ran perfectly",ty:"A"},{t:"Expanded — I understand something I didn't this morning",ty:"B"},{t:"Connected — I contributed to something beyond myself",ty:"C"},{t:"Alive — I made something that didn't exist before",ty:"D"}]},
  {id:10,sym:"△",text:"The sentence that wires deepest into your brain:",opts:[{t:'"You do not rise to the level of your goals. You fall to the level of your systems."',ty:"A"},{t:'"The more I learn, the more I realise how much I don\'t know."',ty:"B"},{t:'"Alone we can do so little. Together we can do so much."',ty:"C"},{t:'"The people crazy enough to think they can change the world are the ones who do."',ty:"D"}]},
  {id:11,sym:"🎨",text:"BONUS: Quick Visual Insight",subtitle:"Look at the image below. What stands out to you first?",isVisual:true,imageUrl:"tree-woman-illusion.jpg",opts:[{t:"The tree structure",ty:"A",visual:"tree"},{t:"The woman's face",ty:"C",visual:"woman"},{t:"Both equally",ty:"neutral",visual:"both"}]},
];
const TYPES = {
  A:{sym:"◈",name:"The Systems Architect",arch:"Identity: The Builder",tag:"You don't chase motivation. You engineer it.",hook:"Most people try to motivate themselves. You build systems that make motivation irrelevant.",desc:"Your psychology is wired for precision and process. While others rely on willpower — a depleting resource — you intuitively understand that sustainable performance follows systems, not intentions. This is a genuine edge. But there is a cost that high-performing Systems Architects rarely name openly: the system can become the hiding place. The moment the structure feels incomplete is often the exact moment action is required. The question is not whether your system is good. It almost certainly is. The question is whether you are currently building systems for the right outputs — or optimising beautifully in the wrong direction.",identity:"I am someone who builds systems that work even when I don't feel like it.",atomic:"Your quantum stack needs auditing, not expanding. You likely have good systems — but they may be optimised for the wrong outputs. Identify the ONE behaviour that, if repeated daily, would make everything else easier or unnecessary.",strengths:["Systems Design","Execution Consistency","Long-Horizon Thinking","Process Optimisation"],blindspots:["Can mistake motion for progress — busyness masquerading as output","Perfectionism delays launch — the system must be perfect before it begins","May optimise the wrong thing efficiently — precision without direction"],strategies:[{area:"The Quantum Increment",scenario:"I delay starting when the outcome feels uncertain or the project feels too large.",solution:"Shrink the action until it feels almost embarrassingly small. The goal isn't to write a chapter — it's to open the document. Identity is built by showing up, not by performing. Every small act of showing up is a vote for the person you're becoming."},{area:"Motivation Architecture",scenario:"My drive fluctuates week to week, making long-term projects unreliable.",solution:"Design your environment before you design your schedule. Make the desired behaviour the path of least resistance. Remove friction from what you want to do. Add friction to what you want to stop. Motivation follows the path you've already cleared."},{area:"The Identity Shift",scenario:"I feel frustrated when results don't match effort — I'm doing everything right but it's not working.",solution:"Ask not 'what do I want to achieve?' but 'who do I need to become?' Rewrite your daily actions as identity statements: 'I am someone who reviews progress every Friday.' Outcomes are lagging measures of identity. Build the identity first."}],blue:"#00C8FF",glow:"rgba(0,200,255,0.1)"},
  B:{sym:"◉",name:"The Deep Learner",arch:"Identity: The Scholar",tag:"Your curiosity is a compounding asset.",hook:"Shallow knowledge is everywhere. What you build goes three levels deeper than anyone else in the room.",desc:"You are driven by a rare and powerful force: the need to genuinely understand. Not surface knowledge — real comprehension. This is the foundation of expertise, and expertise is the foundation of irreplaceable value. But there is a cost that Deep Learners rarely admit. The research is sometimes a sophisticated form of delay. 'Not ready yet' can be true — or it can be the most convincing avoidance strategy available to an intelligent person. The insight you are chasing at midnight is usually available at 6am — rested, with 70% of the information you want, and ready to act on it.",identity:"I am someone who turns deep understanding into decisive, courageous action.",atomic:"Knowledge without deployment is stored potential. Your quantum stack needs a 'publish' step — a regular moment where you translate internal understanding into external output, however imperfect.",strengths:["Intellectual Depth","Pattern Recognition","Mastery Orientation","Analytical Precision"],blindspots:["Analysis paralysis — research becomes a substitute for action","'Not ready yet' as avoidance — readiness is a feeling, not a fact","Over-invests in understanding, under-invests in the doing"],strategies:[{area:"The 70% Threshold",scenario:"I over-research and delay acting until I feel truly ready — which rarely comes.",solution:"Set a decision threshold: when you have 70% of the information you want, act. Treat the remaining 30% as field research — data you can only gather by doing. Action is the most advanced form of learning available to you."},{area:"Complexity as Motivation",scenario:"Repetitive or routine tasks drain me rapidly — I lose interest and disengage.",solution:"Find the hidden variable. In every routine task, there is one dimension you could optimise. Make the question 'how could I do this 10% more intelligently?' your daily prompt. Turn execution into experimentation."},{area:"The Output Practice",scenario:"I accumulate knowledge but struggle to show my work or share my thinking.",solution:"Build a weekly 'output ritual' — one piece of thinking made visible. A note, a voice memo, a conversation where you teach what you've learned. The act of explaining is the act of understanding at depth."}],blue:"#38BDF8",glow:"rgba(56,189,248,0.1)"},
  C:{sym:"◎",name:"The Relational Catalyst",arch:"Identity: The Connector",tag:"You make everything — and everyone — better.",hook:"While others optimise for outputs, you understand the lever that moves everything: people.",desc:"Your motivation is relational at its core. You are energised by shared purpose, activated by belonging, and sustained by the knowledge that your effort matters to real people. This is a genuine superpower — social commitment is one of the most powerful forces in behaviour change, and you harness it naturally. But Relational Catalysts carry a shadow that is rarely discussed: without your own anchor, you become the person who holds everyone else's vision together while quietly losing track of your own. Other people's goals become your goals. Their urgency becomes your urgency. Their stagnation becomes your stagnation.",identity:"I am someone who builds relationships that hold me accountable to my own growth.",atomic:"Your quantum stack needs a social architecture layer. Every major goal should have one human being attached to it — someone who benefits from your success, or to whom you've made a commitment. Accountability is your performance-enhancing mechanism.",strengths:["Emotional Intelligence","Trust-Building","Authentic Leadership","Sustained Effort Under Commitment"],blindspots:["Loses personal direction without external anchors — others' goals become your own","Avoids necessary conflict — keeps the peace at the cost of progress","Absorbs others' energy — their demotivation can become yours"],strategies:[{area:"The Relational Goal Stack",scenario:"I lose motivation when working in isolation — the drive evaporates without connection.",solution:"Attach every personal goal to a specific person. Write: 'Achieving this allows me to show up better for [name] because [reason].' Share it with them. You have just created the most powerful motivational force in your psychology."},{area:"The Morning Anchor",scenario:"I absorb the emotional weather of those around me — their demotivation becomes mine.",solution:"Create a 10-minute pre-contact ritual each morning before interacting with anyone. Write three intentions. This builds an internal foundation that external moods cannot destabilise. Your identity precedes their influence."},{area:"The Accountability Architecture",scenario:"I need external commitment to sustain effort — and feel this is a weakness.",solution:"It isn't a weakness — it's a feature. Formalise it. Identify one person for a weekly check-in: one win, one struggle, one commitment. You're not removing the need for connection. You're building it intelligently into your growth system."}],blue:"#34D399",glow:"rgba(52,211,153,0.1)"},
  D:{sym:"◇",name:"The Visionary Pioneer",arch:"Identity: The Creator",tag:"You don't follow the map. You draw it.",hook:"Every framework, every system, every method you've ever used — someone like you invented it first.",desc:"You are driven by possibility. You think in futures that don't exist yet. Your motivation comes from creative autonomy, the thrill of the blank canvas, and the deep satisfaction of making something that carries your fingerprint. But Visionary Pioneers carry a specific burden that is rarely discussed openly: the gap between the vision and the reality of building it. The idea is alive. The execution is work. That gap — between what you can see and what currently exists — is where most Visionary Pioneers quietly stall. The project you are working on right now almost certainly needs a completion mechanism as strong as your starting mechanism.",identity:"I am someone who brings bold visions into the world with enough structure to complete them.",atomic:"Your quantum stack needs a completion mechanism. You likely have strong starting rituals. Build equally strong finishing rituals — a defined moment where you declare a project 'shipped' and begin the next creative act.",strengths:["Original Thinking","Intrinsic Drive","Bold Risk Tolerance","Inspiring Through Vision"],blindspots:["Motivation drops after the initial spark — the build phase feels less alive","Too many projects open, too few completed — beginnings are exciting, endings are work","Structure feels like a cage — but without it, the vision never fully lands"],strategies:[{area:"The Evolution Frame",scenario:"My motivation collapses once the exciting creation phase ends and execution begins.",solution:"Reframe completion as the beginning of the next creative act, not the death of this one. Keep an 'Evolution Log' — a live document tracking how your project is changing and improving. The project is never finished. It is always becoming."},{area:"The One Brilliant Thing",scenario:"I scatter energy across multiple ideas simultaneously and make shallow progress on all of them.",solution:"Each week, identify the single most important creative act. Protect 90 uninterrupted minutes for it — first, before anything else. Everything else is secondary until that window is honoured. Constraint creates the conditions for your best work."},{area:"The Separation Protocol",scenario:"My output never matches my internal vision and this gap demotivates me deeply.",solution:"Separate creation from evaluation entirely. During making: no judgement allowed. Schedule a 'critical review' 24 hours after completion with fresh eyes. The inner critic and the inner creator cannot occupy the same creative moment."}],blue:"#A78BFA",glow:"rgba(167,139,250,0.1)"},
};

// CHANGE 1: Pattern engine
const PATTERN_DATA = {
  A: {
    label: "Structure orientation",
    summary: "You prioritise frameworks and clarity before committing to action.",
    tendency: "You often wait until the system feels fully complete before starting — and sometimes that delay costs you.",
    strength: "You build solutions that are durable and scalable where others build things that break.",
  },
  B: {
    label: "Analysis orientation",
    summary: "You seek deep understanding before committing to a direction.",
    tendency: "You may continue researching past the point where action would serve you better.",
    strength: "You arrive at insights others miss by going three levels deeper than anyone else in the room.",
  },
  C: {
    label: "Relational orientation",
    summary: "You orient toward people and connection as your primary resource.",
    tendency: "Your motivation can drop sharply when working without meaningful human connection.",
    strength: "You create trust and alignment in ways that outlast any single project or initiative.",
  },
  D: {
    label: "Creative orientation",
    summary: "You naturally generate possibilities and envision futures that don't yet exist.",
    tendency: "Your energy consistently peaks at the beginning of something new and dips during the execution phase.",
    strength: "You see what could exist before others have even noticed the gap.",
  },
};

// ── Behavioural tension narratives ────────────────────────────────────────
// One narrative per primary+secondary combination (12 total).
// These describe the INTERACTION between the two tendencies — not just
// a restatement of each one. The tension IS the insight.
const TENSION_NARRATIVES = {
  "A+B": {
    balance: "You combine structural thinking with deep analytical capability.",
    tension: "You may experience friction between building the perfect system and understanding every variable within it. Both tendencies demand completeness before action.",
    edge: "When you allow imperfect systems to generate data, your analytical layer sharpens them rapidly. The two tendencies compound when you let them sequence — structure first, then analysis — rather than running them simultaneously.",
  },
  "A+C": {
    balance: "You combine structured thinking with strong relational awareness.",
    tension: "You may feel friction between the clarity of a well-defined system and the messiness of human dynamics. People rarely fit neatly into architectures.",
    edge: "Your structural approach gives teams the clarity they need to perform, and your relational awareness ensures the system actually gets adopted. This combination builds things that last.",
  },
  "A+D": {
    balance: "You combine structured thinking with a drive to create and explore new possibilities.",
    tension: "You often feel the pull between building the right system and starting something entirely new. The existing structure can feel like a constraint when a new idea is alive.",
    edge: "You are capable of both envisioning and engineering — one of the rarest combinations. The challenge is deciding when to iterate on what exists and when to build something new entirely.",
  },
  "B+A": {
    balance: "You combine deep analytical capability with a strong desire for structural clarity.",
    tension: "Both tendencies pull toward completeness before action. Analysis informs the structure. The structure demands more analysis. This loop can delay execution significantly.",
    edge: "Set a decision threshold: when you have reached 70% of the understanding you want, act. The remaining 30% is available as field data — which your analytical tendency is well-equipped to process.",
  },
  "B+C": {
    balance: "You combine deep analytical capability with strong relational intelligence.",
    tension: "You may feel friction between the solitary nature of deep work and the relational energy that sustains you. Long periods of research can leave you feeling disconnected.",
    edge: "Teaching what you understand to others serves both tendencies simultaneously. Your depth becomes useful. Your relational need is met. The output sharpens the thinking.",
  },
  "B+D": {
    balance: "You combine deep analytical capability with strong creative and visionary thinking.",
    tension: "You can see both the depth of how something works and the breadth of what it could become. This is powerful — and it can also create paralysis when neither analysis nor vision produces a clear starting point.",
    edge: "Use your analytical layer to evaluate the creative ideas your visionary tendency generates. One produces the raw material. The other determines which ones are worth pursuing.",
  },
  "C+A": {
    balance: "You combine relational intelligence with a strong desire for structural clarity.",
    tension: "You care deeply about people and also want clear frameworks. When the human dynamics of a situation resist structure, you may feel pulled between maintaining harmony and imposing order.",
    edge: "You are unusually good at creating systems that people actually want to follow — because you understand both how systems work and how people respond to them.",
  },
  "C+B": {
    balance: "You combine relational intelligence with strong analytical depth.",
    tension: "Your relational orientation drives you toward people, but your analytical tendency sometimes pulls you inward for extended reflection. Moving between the two can feel disorienting.",
    edge: "Your analytical depth makes your relational insights unusually accurate. You do not just read people — you understand the patterns behind how they behave.",
  },
  "C+D": {
    balance: "You combine relational intelligence with strong creative and visionary energy.",
    tension: "You may feel friction between the vision you can see and the relational reality of bringing others with you. Visionary ideas require buy-in, and buy-in requires patience.",
    edge: "You are unusually capable of inspiring others toward futures they could not yet see themselves. Your relational intelligence means people trust the vision because they trust you.",
  },
  "D+A": {
    balance: "You combine visionary and creative energy with a strong desire for structural clarity.",
    tension: "You generate ambitious ideas and simultaneously want the architecture to support them. The vision often outpaces the structure — and the structure often constrains the vision.",
    edge: "When you allow yourself to vision freely first, then apply structural thinking to the most promising ideas, you create something rare: bold concepts that are actually buildable.",
  },
  "D+B": {
    balance: "You combine visionary and creative energy with deep analytical capability.",
    tension: "You can simultaneously see what could exist and understand deeply why things are the way they are. This creates a tension between disruption and comprehension — between building new and understanding existing.",
    edge: "Your analytical layer prevents you from being a dreamer who never lands. Your visionary layer prevents you from being an analyst who never moves. The two tendencies, properly sequenced, produce original and rigorous thinking.",
  },
  "D+C": {
    balance: "You combine visionary and creative energy with strong relational intelligence.",
    tension: "You have a clear picture of where things could go and you care deeply about the people involved in getting there. The tension appears when the speed of the vision outpaces the readiness of the people around you.",
    edge: "You are capable of building movements, not just products. Your vision gives direction. Your relational intelligence brings people into it. Together they create genuine momentum.",
  },
};

// ── Pattern calculator ────────────────────────────────────────────────────
// Returns: primary, secondary, counts, tension, confidence, dominance.
// All values derived from the 10 answers. No backend. Pure client logic.
function calcPatterns(answers) {
  const counts = {A:0, B:0, C:0, D:0};
  answers.forEach(a => { if (counts.hasOwnProperty(a)) counts[a]++; });
  const sorted = Object.entries(counts).sort((x,y) => y[1]-x[1]);

  const primaryKey   = sorted[0][0];
  const secondaryKey = sorted[1][0];
  const primaryScore = sorted[0][1];
  const secondaryScore = sorted[1][1];

  // Tension: difference between primary and secondary score
  const tension = primaryScore - secondaryScore;

  // Dominance level: how strongly primary dominates
  const dominance = tension <= 1 ? "blended"
                  : tension <= 3 ? "balanced"
                  : "dominant";

  // Confidence: expressed as percentage of answers pointing to primary
  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  const confidence = total > 0 ? Math.round((primaryScore / total) * 100) : 0;

  return {
    primary:       primaryKey,
    secondary:     secondaryKey,
    counts,
    tension,
    dominance,
    confidence,
    tensionKey:    `${primaryKey}+${secondaryKey}`,
  };
}

const ORIGINAL = 27, DISCOUNTED = 9, TIMER_SECS = 5 * 60;
const TEST_MODE = false;

function Particles() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {Array.from({length:14}).map((_,i) => {
        const sym=SYMS[i%SYMS.length],left=5+(i*6.8)%88,dur=18+(i*2.9)%16,delay=-((i*3.1)%22),size=9+(i*1.9)%13,opacity=0.03+(i*0.004)%0.055;
        return <div key={i} style={{position:"absolute",left:`${left}%`,bottom:-50,fontSize:size,color:E_BLUE,opacity,animation:`floatUp ${dur}s ${delay}s linear infinite`}}>{sym}</div>;
      })}
    </div>
  );
}

export default function App() {
  const [phase,setPhase]=useState("landing");
  const [qIdx,setQIdx]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [sel,setSel]=useState(null);
  const [charType,setCharType]=useState(null);
  const [timeLeft,setTimeLeft]=useState(TIMER_SECS);
  const [timerOn,setTimerOn]=useState(false);
  const [procStep,setProcStep]=useState(0);
  const [showLegal,setShowLegal]=useState(null);
  const [activeAddon,setActiveAddon]=useState(null);
  const [showRestore,setShowRestore]=useState(false);
  const [customerEmail,setCustomerEmail]=useState(()=>localStorage.getItem("lqm_customer_email")||"");
  // CHANGE 3: patterns state
  const [patterns, setPatterns] = useState(null);

  async function sendReport(email, typeKey) {
    const t = TYPES[typeKey];
    if (!t || !email) return { ok: false };
    try {
      const delivery = JSON.parse(localStorage.getItem("lqm_delivery")||"{}");
      const r = await fetch("/api/send-report", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email,typeKey,name:t.name,arch:t.arch,tag:t.tag,hook:t.hook,desc:t.desc,identity:t.identity,atomic:t.atomic,strengths:t.strengths,blindspots:t.blindspots,strategies:t.strategies,blue:t.blue,deliveryRef:delivery.ref||"",deliveryTs:delivery.ts||""}),
      });
      return { ok: r.ok };
    } catch { return { ok: false }; }
  }

  const [activeView,setActiveView]=useState("hub");
  const [unlocks,setUnlocks]=useState(getUnlocks);
  const [showDeliveryGate,setShowDeliveryGate]=useState(false);
  const [deliveryRef,setDeliveryRef]=useState(null);
  const [deliveryTs,setDeliveryTs]=useState(null);
  const timerRef=useRef(null);

  function generateDeliveryRef(){
    localStorage.setItem("lqm_pending_session",JSON.stringify({answers, charType}));
  }

  // CHANGE 14: confirmDelivery routes to "reveal" not "report"
  function confirmDelivery(email){
    const stored=JSON.parse(localStorage.getItem("lqm_delivery")||"{}");
    localStorage.setItem("lqm_delivery",JSON.stringify({...stored,confirmed:true}));
    if(email){
      localStorage.setItem("lqm_customer_email", email);
      setCustomerEmail(email);
      sendReport(email, charType);
    }
    setShowDeliveryGate(false);
    setActiveView("reveal");
  }

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const paid=params.get("paid");
    const cancelled=params.get("cancelled");

    if(paid==="main"){
      const saved=JSON.parse(localStorage.getItem("lqm_pending_session")||"null");
      if(saved&&saved.answers){
        const ref="LQM-"+new Date().getFullYear()+"-"+Math.random().toString(36).substring(2,10).toUpperCase();
        const ts=new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
        localStorage.setItem("lqm_answers",JSON.stringify(saved.answers));
        localStorage.setItem("lqm_delivery",JSON.stringify({ref,ts,confirmed:false}));
        localStorage.removeItem("lqm_pending_session");
        setAnswers(saved.answers);
        setCharType(saved.charType||calcType(saved.answers));
        // CHANGE 5: patterns on Scenario A1
        setPatterns(calcPatterns(saved.answers));
        trackReturnVisit(calcPatterns(saved.answers));
        setDeliveryRef(ref);
        setDeliveryTs(ts);
        setPhase("paid");
        setShowDeliveryGate(true);
      }
      window.history.replaceState({},"",window.location.pathname);
      return;
    }

    if(paid==="neural"||paid==="vital"||paid==="both"){
      if(paid==="both"){ setUnlock("neural"); setUnlock("vital"); }
      else { setUnlock(paid); }
      const saved=JSON.parse(localStorage.getItem("lqm_session_state")||"null");
      if(saved&&saved.answers){
        setAnswers(saved.answers);
        setCharType(saved.charType||calcType(saved.answers));
        setUnlocks(getUnlocks());
        setPhase("paid");
        setActiveView("hub");
        localStorage.removeItem("lqm_session_state");
      }
      window.history.replaceState({},"",window.location.pathname);
      return;
    }

    if(cancelled){
      const saved=JSON.parse(localStorage.getItem("lqm_session_state")||"null");
      if(saved&&saved.answers){
        setAnswers(saved.answers);
        setCharType(saved.charType||calcType(saved.answers));
        setUnlocks(getUnlocks());
        setPhase("paid");
        setActiveView("hub");
        localStorage.removeItem("lqm_session_state");
      }
      window.history.replaceState({},"",window.location.pathname);
      return;
    }

    // Scenario C: page refresh restore — goes straight to report (already seen reveal)
    const delivery=localStorage.getItem("lqm_delivery");
    if(delivery&&phase==="landing"){
      const deliveryData=JSON.parse(delivery);
      if(deliveryData.confirmed){
        const savedAnswers=JSON.parse(localStorage.getItem("lqm_answers")||"null");
        const restoreAnswers=(savedAnswers&&savedAnswers.length>=10)
          ? savedAnswers
          : ["A","B","A","C","D","A","B","C","D","A"];
        setAnswers(restoreAnswers);
        setCharType(calcType(restoreAnswers));
        // CHANGE 6: patterns on Scenario C
        setPatterns(calcPatterns(restoreAnswers));
        trackReturnVisit(calcPatterns(restoreAnswers));
        setUnlocks(getUnlocks());
        setPhase("paid");
        setDeliveryRef(deliveryData.ref);
        setDeliveryTs(deliveryData.ts);
        setActiveView("report");
      }
    }
  },[]);

  function handleUnlockAddon(key) {
    setUnlock(key);
    setUnlocks(getUnlocks());
    setActiveAddon(key);
  }

  function handleAddonRedirect(stripeUrl){
    localStorage.setItem("lqm_session_state",JSON.stringify({answers, charType, activeView:"hub"}));
    window.location.href=stripeUrl;
  }

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if(params.get('test')==='true'){
      if(!localStorage.getItem('lqm_delivery')){
        localStorage.setItem('lqm_delivery',JSON.stringify({ref:'LQM-2026-TEST'+Math.random().toString(36).substring(2,8).toUpperCase(),ts:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),confirmed:true}));
      }
      localStorage.setItem('lqm_unlocks',JSON.stringify({neural:true,vital:true}));
      if(charType && phase==='teaser'){ setPhase('paid'); }
    }
  },[charType,phase]);

  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=FONTS+`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html,body{background:${BG};}
      @keyframes floatUp{from{transform:translateY(0) rotate(0deg);}to{transform:translateY(-110vh) rotate(360deg);opacity:0;}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
      @keyframes glow{0%,100%{text-shadow:0 0 18px #00C8FF88;}50%{text-shadow:0 0 35px #00C8FF;}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.45;}}
      @keyframes spin{to{transform:rotate(360deg);}}
      @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
      @keyframes blurIn{from{filter:blur(8px);opacity:0;}to{filter:blur(0);opacity:1;}}
      @keyframes barGrow{from{width:0;}to{width:var(--w);}}
      @keyframes eureka{0%,100%{filter:drop-shadow(0 0 3px rgba(0,200,255,0.4));opacity:0.78;}45%{filter:drop-shadow(0 0 22px rgba(0,200,255,1)) drop-shadow(0 0 50px rgba(0,200,255,0.55)) drop-shadow(0 0 90px rgba(0,200,255,0.2));opacity:1;}}
      @keyframes ctaGlow{0%,100%{filter:brightness(1);}50%{filter:brightness(1.55);}}
      @keyframes flamePulse{0%,100%{filter:drop-shadow(0 0 2px #00C8FF) drop-shadow(0 0 5px rgba(0,200,255,0.35));transform:scaleY(1);}40%{filter:drop-shadow(0 0 5px #00C8FF) drop-shadow(0 0 14px rgba(0,200,255,0.65)) drop-shadow(0 0 26px rgba(0,200,255,0.25));transform:scaleY(1.06);}70%{filter:drop-shadow(0 0 3px #00C8FF) drop-shadow(0 0 8px rgba(0,200,255,0.45));transform:scaleY(0.97);}}
      @keyframes atomGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(0,200,255,0.6)) drop-shadow(0 0 1px #fff);}50%{filter:drop-shadow(0 0 8px rgba(0,200,255,1)) drop-shadow(0 0 18px rgba(0,200,255,0.45)) drop-shadow(0 0 2px #fff);}}
      @keyframes rocketFloat{0%,100%{filter:drop-shadow(0 0 3px rgba(0,200,255,0.55));transform:translateY(0);}50%{filter:drop-shadow(0 0 7px rgba(0,200,255,0.9)) drop-shadow(0 0 18px rgba(0,200,255,0.3));transform:translateY(-2px);}}
      .fu{animation:fadeUp .6s ease both;}.fu1{animation:fadeUp .6s .1s ease both;}.fu2{animation:fadeUp .6s .22s ease both;}.fu3{animation:fadeUp .6s .36s ease both;}.fu4{animation:fadeUp .6s .5s ease both;}.fu5{animation:fadeUp .6s .65s ease both;}
      .elec{background:linear-gradient(90deg,${E_BLUE} 0%,#fff 40%,${E_BLUE} 60%,${E_BLUE2} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;}
      .urgent{animation:pulse 1s infinite;}
      .blur-lock{filter:blur(5px);user-select:none;pointer-events:none;}
    `;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  useEffect(()=>{
    if(timerOn&&timeLeft>0){timerRef.current=setInterval(()=>setTimeLeft(t=>t-1),1000);return()=>clearInterval(timerRef.current);}
  },[timerOn,timeLeft]);

  const fmt=s=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const calcType=ans=>{const c={A:0,B:0,C:0,D:0};ans.forEach(a=>c[a]++);return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];};

  // CHANGE 4: handleNext with pattern analytics
  const handleNext=()=>{
    if(!sel)return;
    const a=[...answers,sel];setAnswers(a);setSel(null);
    if(qIdx<questions.length-1){setQIdx(qIdx+1);}
    else{
      setCharType(calcType(a));
      setPhase("processing");
      let st=0;
      const iv=setInterval(()=>{
        st++;setProcStep(st);
        if(st>=5){
          clearInterval(iv);
          setTimeout(()=>{
            setPatterns(calcPatterns(a));
            trackArchetypeResult(calcPatterns(a));
            trackPatternDistribution(calcPatterns(a));
            setTimerOn(true);
            setPhase("teaser");
          },600);
        }
      },850);
    }
  };

  function handleRestoreSuccess(result) {
    const used = JSON.parse(localStorage.getItem("lqm_used_codes")||"[]");
    used.push(result.codeKey);
    localStorage.setItem("lqm_used_codes", JSON.stringify(used));
    if (result.neural) setUnlock("neural");
    if (result.vital)  setUnlock("vital");
    if (result.report) {
      const existing = JSON.parse(localStorage.getItem("lqm_delivery")||"{}");
      if (!existing.confirmed) {
        localStorage.setItem("lqm_delivery", JSON.stringify({ref:"LQM-RST-"+Date.now().toString(36).toUpperCase(),ts:new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),confirmed:true}));
      }
    }
    setUnlocks(getUnlocks());
    setShowRestore(false);
    if (result.report) {
      const savedAnswers = JSON.parse(localStorage.getItem("lqm_answers")||"[]");
      if (savedAnswers.length >= 10) {
        setAnswers(savedAnswers);
        setCharType(calcType(savedAnswers));
        setPhase("paid");
      } else {
        setPhase("quiz"); setQIdx(0); setSel(null);
      }
    }
  }

  if(showRestore) return <RestoreAccess onBack={()=>setShowRestore(false)} onSuccess={handleRestoreSuccess}/>;
  if(activeAddon==="neural" && unlocks.neural) return <BrainTraining archetype={charType} onBack={()=>setActiveAddon(null)}/>;
  if(activeAddon==="vital"  && unlocks.vital)  return <QuantumLiving  archetype={charType} onBack={()=>setActiveAddon(null)}/>;

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 90% 45% at 50% -5%,rgba(0,200,255,0.06) 0%,transparent 65%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 80px",position:"relative",overflow:"hidden"}}>
      <Particles/>
      {!activeAddon && <>
        <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"13px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.88)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
          <Logo size="sm"/>
          {phase==="paid" && activeView!=="hub" && (
            <button onClick={()=>{setActiveAddon(null);setActiveView("hub");}} style={{background:"rgba(0,200,255,0.08)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"6px 14px",color:E_BLUE,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".06em"}}>⌂ My Hub</button>
          )}
          {phase==="paid" && activeView==="hub" && activeAddon===null && (
            <div style={{fontSize:13,color:DIMMED,fontWeight:600,letterSpacing:".08em"}}>LQM HUB</div>
          )}
        </div>
        <div style={{width:"100%",maxWidth:680,position:"relative",zIndex:1,paddingTop:40}}>
          {showLegal==="privacy" && <LegalPage type="privacy" onClose={()=>setShowLegal(null)}/>}
          {showLegal==="terms"   && <LegalPage type="terms"   onClose={()=>setShowLegal(null)}/>}
          {!showLegal && phase==="landing"    && <Landing onStart={()=>setPhase("quiz")}/>}
          {!showLegal && phase==="quiz"       && <Quiz q={questions[qIdx]} idx={qIdx} sel={sel} onSel={setSel} onNext={handleNext}/>}
          {!showLegal && phase==="processing" && <Processing step={procStep}/>}
          {!showLegal && phase==="teaser"     && <Teaser type={TYPES[charType]} t={timeLeft} fmt={fmt} onUnlockOffer={()=>{ generateDeliveryRef(); window.open(STRIPE_MAIN,"_blank"); }} onUnlockFull={()=>{ generateDeliveryRef(); window.open(STRIPE_MAIN_FULL,"_blank"); }}/>}
          {!showLegal && phase==="paid" && <>
            {showDeliveryGate && <DeliveryGate ref_={deliveryRef} ts={deliveryTs} type={TYPES[charType]} onConfirm={confirmDelivery}/>}
            {!showDeliveryGate && <>
              {activeView==="hub" && <Hub type={TYPES[charType]} unlocks={unlocks} onOpenNeural={()=>setActiveAddon("neural")} onOpenVital={()=>setActiveAddon("vital")} onViewReport={()=>setActiveView("report")} onUnlockNeural={()=>handleAddonRedirect(STRIPE_BRAIN)} onUnlockVital={()=>handleAddonRedirect(STRIPE_VITAL)} onUnlockBundle={()=>handleAddonRedirect(STRIPE_BUNDLE)} onSimulateNeural={()=>handleUnlockAddon("neural")} onSimulateVital={()=>handleUnlockAddon("vital")} customerEmail={customerEmail} onSendReport={(email)=>{ localStorage.setItem("lqm_customer_email",email); setCustomerEmail(email); return sendReport(email,charType); }}/>}
              {/* CHANGE 15: Result Reveal screen */}
              {activeView==="reveal" && (
                <ResultReveal
                  type={TYPES[charType]}
                  patterns={patterns}
                  onExplore={() => setActiveView("report")}
                />
              )}
              {/* CHANGE 7: patterns prop passed to Report */}
              {activeView==="report" && <><Report type={TYPES[charType]} patterns={patterns} deliveryRef={deliveryRef} deliveryTs={deliveryTs} visualAnswer={answers[10]}/><button onClick={()=>setActiveView("hub")} style={{width:"100%",marginTop:16,border:"1px solid rgba(0,200,255,0.32)",borderRadius:100,padding:"13px",fontSize:14,fontWeight:700,background:"rgba(0,200,255,0.07)",color:E_BLUE,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".05em",transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,200,255,0.16)";e.currentTarget.style.borderColor="rgba(0,200,255,0.65)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,200,255,0.07)";e.currentTarget.style.borderColor="rgba(0,200,255,0.32)";}}>⌂ Back to My Hub</button></>}
            </>}
          </>}
        </div>
        {!showLegal && <Footer onShowLegal={setShowLegal} onRestore={()=>setShowRestore(true)}/>}
      </>}
    </div>
  );
}

function Logo({size="md"}){
  const sc=size==="sm"?.58:size==="lg"?1.25:1;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <div style={{position:"relative",display:"inline-block",paddingBottom:4*sc}}>
        <span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-52%) rotate(-5deg)",fontFamily:"'Bebas Neue',sans-serif",fontSize:90*sc,letterSpacing:6*sc,background:"linear-gradient(160deg,rgba(0,200,255,0.12),rgba(0,200,255,0.03))",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",whiteSpace:"nowrap",pointerEvents:"none",zIndex:0,lineHeight:1}}>LQM</span>
        <svg style={{position:"absolute",top:`${-36*sc}px`,left:`${-22*sc}px`,width:`calc(100% + ${44*sc}px)`,height:`calc(100% + ${58*sc}px)`,zIndex:1,pointerEvents:"none",animation:"eureka 3s ease-in-out infinite",overflow:"visible"}} viewBox="0 0 300 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lqmBolt" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ffffff" stopOpacity="1"/><stop offset="15%" stopColor="#a8f0ff" stopOpacity="1"/><stop offset="32%" stopColor="#00C8FF" stopOpacity="0.95"/><stop offset="58%" stopColor="#00C8FF" stopOpacity="0.45"/><stop offset="78%" stopColor="#00C8FF" stopOpacity="0.08"/><stop offset="100%" stopColor="#00C8FF" stopOpacity="0"/></linearGradient>
            <linearGradient id="lqmCore" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/><stop offset="25%" stopColor="#ffffff" stopOpacity="0.5"/><stop offset="50%" stopColor="#ffffff" stopOpacity="0.1"/><stop offset="100%" stopColor="#ffffff" stopOpacity="0"/></linearGradient>
          </defs>
          <path d="M 52 0 L 18 52 L 42 52 L 6 110 L 14 110 L 52 60 L 28 60 L 64 0 Z" transform="skewX(-8)" fill="url(#lqmBolt)"/>
          <path d="M 55 2 L 24 50 L 44 50 L 10 106 L 50 58 L 32 58 L 62 2 Z" transform="skewX(-8)" fill="url(#lqmCore)" opacity="0.55"/>
        </svg>
        <span style={{position:"relative",zIndex:2,fontFamily:"'Bebas Neue',sans-serif",fontSize:52*sc,letterSpacing:3*sc,color:WHITE,lineHeight:1,textShadow:`0 0 28px ${E_BLUE}22`,display:"block"}}>LQM</span>
        <svg style={{position:"absolute",bottom:0,left:0,width:"100%",zIndex:3,pointerEvents:"none"}} height={5*sc} viewBox="0 0 160 5"><path d="M18 4 Q80 1 142 4" stroke={E_BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/></svg>
      </div>
    </div>
  );
}
function TimerBadge({t,fmt}){
  const urgent=t<180;
  return(<div className={urgent?"urgent":""} style={{display:"inline-flex",alignItems:"center",gap:8,background:urgent?"rgba(255,60,60,0.08)":"rgba(0,200,255,0.06)",border:`1px solid ${urgent?"rgba(255,60,60,0.35)":BORDER}`,borderRadius:100,padding:"6px 16px",fontSize:15,fontWeight:600,letterSpacing:".06em",color:urgent?"#FF6B6B":E_BLUE}}><span>⚡</span>{t>0?`Offer expires ${fmt(t)}`:"Offer expired"}</div>);
}
function Panel({children,style={},glow=false}){
  return(<div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"26px",boxShadow:glow?`0 0 40px ${E_GLOW}`:"none",...style}}>{children}</div>);
}
function SLabel({children,color=E_BLUE}){
  return(<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color,whiteSpace:"nowrap"}}>{children}</p><div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}44,transparent)`}}/></div>);
}
function PrimaryBtn({onClick,children}){
  return(<button onClick={onClick} style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",transition:"all .2s ease",display:"block",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,boxShadow:`0 6px 24px rgba(0,200,255,0.22)`}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 36px rgba(0,200,255,0.38)`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,200,255,0.22)`;}}>
    {children}
  </button>);
}

function RestoreAccess({ onBack, onSuccess }) {
  const [code, setCode]     = useState("");
  const [error, setError]   = useState(null);
  const [status, setStatus] = useState("idle");
  function formatInput(raw) {
    const clean = raw.replace(/[^A-Za-z0-9]/g,"").toUpperCase().slice(0,12);
    if (clean.length <= 3)  return clean;
    if (clean.length <= 7)  return clean.slice(0,3)+"-"+clean.slice(3);
    return clean.slice(0,3)+"-"+clean.slice(3,7)+"-"+clean.slice(7);
  }
  function handleChange(e) { setError(null); setCode(formatInput(e.target.value)); }
  function handleSubmit() {
    const result = lqmValidateCode(code);
    if (!result.valid) { setError(result.reason); return; }
    setStatus("success");
    setTimeout(() => onSuccess(result), 1200);
  }
  const unlockLabel = (() => {
    const clean = code.replace(/[-\s]/g,"").toUpperCase();
    if (clean.length !== 12) return "your content";
    try {
      const data=clean.slice(3),b36=data.slice(0,7),raw=parseInt(b36,36)^LQM_SECRET,p=raw&0xF;
      const parts=[];
      if(p&1)parts.push("LQM Report");if(p&2)parts.push("Brain Training");if(p&4)parts.push("Quantum Living");
      return parts.join(" + ")||"your content";
    } catch { return "your content"; }
  })();
  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,200,255,0.07),${BG})`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 80px"}}>
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"13px 24px",display:"flex",alignItems:"center",background:"rgba(7,15,30,0.9)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"rgba(0,200,255,0.07)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"6px 16px",color:E_BLUE,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".06em"}}>← Back</button>
      </div>
      <div style={{width:"100%",maxWidth:480,paddingTop:56,animation:"fadeUp .5s ease both"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:40,marginBottom:16}}>🔑</div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:2,color:WHITE,marginBottom:8}}>Restore Access</h1>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.7,maxWidth:360,margin:"0 auto"}}>Already purchased LQM? Enter your restore code below to unlock your content on this device. If you don't have a code, email <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE,textDecoration:"none"}}>lqm@lqmmethod.com</a> with your Stripe reference.</p>
        </div>
        {status === "success" ? (
          <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:16,padding:"32px 24px",textAlign:"center",animation:"fadeUp .3s ease both"}}>
            <div style={{fontSize:40,marginBottom:12}}>✓</div>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:1.5,color:"#34D399",marginBottom:8}}>Access Restored</p>
            <p style={{fontSize:14,color:MUTED}}>{unlockLabel} unlocked — loading now…</p>
          </div>
        ) : (
          <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"28px 24px"}}>
            <p style={{fontSize:12,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>Your Restore Code</p>
            <input value={code} onChange={handleChange} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} placeholder="LQM-XXXX-XXXXX" spellCheck={false} autoComplete="off" style={{width:"100%",background:"rgba(0,200,255,0.04)",border:`1.5px solid ${error?"#EF4444":code.length===15?"rgba(0,200,255,0.55)":BORDER2}`,borderRadius:10,padding:"14px 16px",fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:700,letterSpacing:".12em",color:error?"#EF4444":E_BLUE,outline:"none",transition:"border-color .2s",textAlign:"center"}}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6,marginBottom:16}}>
              <p style={{fontSize:14,color:error?"#EF4444":MUTED}}>{error||"Format: LQM-XXXX-XXXXX"}</p>
              <p style={{fontSize:13,color:code.replace(/-/g,"").length===12?"rgba(52,211,153,0.7)":DIMMED,fontWeight:700}}>{code.replace(/-/g,"").length}/12</p>
            </div>
            <button onClick={handleSubmit} disabled={code.replace(/-/g,"").length!==12} style={{width:"100%",padding:"14px",borderRadius:100,background:code.replace(/-/g,"").length===12?E_BLUE:"rgba(0,200,255,0.12)",border:"none",cursor:code.replace(/-/g,"").length===12?"pointer":"default",color:code.replace(/-/g,"").length===12?BG:"rgba(0,200,255,0.3)",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:15,letterSpacing:".08em",transition:"all .2s"}}>Unlock My Content</button>
            <p style={{fontSize:14,color:MUTED,textAlign:"center",marginTop:16,lineHeight:1.7}}>Codes are single-use and expire after 30 days.<br/>They are linked to your purchase record and cannot be shared.</p>
          </div>
        )}
        <div style={{marginTop:24,background:"rgba(255,255,255,0.02)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"16px 18px"}}>
          <p style={{fontSize:13,fontWeight:700,color:MUTED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Don't have a code?</p>
          <p style={{fontSize:13,color:MUTED,lineHeight:1.7}}>Email <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE,textDecoration:"none",fontWeight:700}}>lqm@lqmmethod.com</a> and include your Stripe payment reference number. We'll generate a restore code and send it back within 48 hours.</p>
        </div>
      </div>
    </div>
  );
}

function Footer({onShowLegal, onRestore}){
  function activateTestMode(){
    localStorage.setItem('lqm_delivery',JSON.stringify({ref:'LQM-2026-TEST'+Math.random().toString(36).substring(2,8).toUpperCase(),ts:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),confirmed:true}));
    localStorage.setItem('lqm_unlocks',JSON.stringify({neural:true,vital:true}));
    alert('\u2713 TEST MODE ACTIVATED\n\nAll features unlocked!\n\nClick OK then refresh the page (F5) to see everything.');
  }
  function resetAll(){ localStorage.clear(); alert('\u2713 All data cleared. Refreshing now...'); window.location.reload(); }
  return(
    <div style={{width:"100%",maxWidth:680,marginTop:60,paddingTop:24,borderTop:`1px solid ${BORDER2}`,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>onShowLegal("privacy")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Privacy Policy</button>
        <button onClick={()=>onShowLegal("terms")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Terms & Conditions</button>
        <button onClick={onRestore} style={{background:"none",border:"none",color:"rgba(0,200,255,0.35)",fontSize:13,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color="rgba(0,200,255,0.35)"}>\uD83D\uDD11 Restore Access</button>
      </div>
      <p style={{fontSize:14,color:DIMMED,textAlign:"center"}}>&copy; 2026 Learning Quantum Method. All rights reserved.</p>
      <p style={{fontSize:16,color:DIMMED,textAlign:"center",maxWidth:500,lineHeight:1.5}}>For questions or support: <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE,textDecoration:"none"}}>lqm@lqmmethod.com</a></p>
      {TEST_MODE && (
        <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={activateTestMode} style={{background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:8,padding:'10px 20px',color:'#FBBF24',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif"}}>{String.fromCharCode(0x1F527)} Unlock All (Test)</button>
          <button onClick={resetAll} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 20px',color:'#EF4444',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif"}}>{String.fromCharCode(0x1F5D1, 0xFE0F)} Reset All Data</button>
        </div>
      )}
      {TEST_MODE && (<p style={{fontSize:12,color:'rgba(251,191,36,0.5)',fontWeight:700,letterSpacing:'.1em'}}>{String.fromCharCode(0x26A0, 0xFE0F)} TEST MODE IS ON — set TEST_MODE = false before going live</p>)}
    </div>
  );
}

function LegalPage({type,onClose}){
  const content = type==="privacy" ? PRIVACY_TEXT : TERMS_TEXT;
  return(
    <div style={{animation:"fadeUp .5s ease both"}}>
      <button onClick={onClose} style={{marginBottom:20,background:"rgba(0,200,255,0.07)",border:"1px solid rgba(0,200,255,0.32)",borderRadius:100,padding:"9px 20px",color:E_BLUE,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em",transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,200,255,0.16)";e.currentTarget.style.borderColor="rgba(0,200,255,0.65)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,200,255,0.07)";e.currentTarget.style.borderColor="rgba(0,200,255,0.32)";}}>← Back</button>
      <Panel style={{maxWidth:680}}><div style={{fontFamily:"'Crimson Pro',serif",fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.85)"}} dangerouslySetInnerHTML={{__html:content}}/></Panel>
    </div>
  );
}

const PRIVACY_TEXT=`<h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#00C8FF;margin-bottom:8px;letter-spacing:2px">Privacy Policy</h1><p style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:32px">Last updated: 21 February 2026</p><p style="margin-bottom:20px"><strong>Learning Quantum Method (LQM)</strong> is committed to protecting your privacy.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">1. Who We Are</h2><p style="margin-bottom:12px"><strong>Business name:</strong> Learning Quantum Method (LQM)<br/><strong>Contact email:</strong> lqm@lqmmethod.com<br/><strong>Website:</strong> https://lqmmethod.com</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">2. What Information We Collect</h2><p style="margin-bottom:12px"><strong>Information you provide:</strong> Email address when you purchase<br/><strong>Payment information:</strong> Processed securely by Stripe (we never see card details)<br/><strong>Quiz responses:</strong> Stored temporarily in your browser to generate your report<br/><strong>We do NOT collect:</strong> Sensitive data, children's data, or marketing preferences without consent</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">3. How We Use Your Information</h2><p style="margin-bottom:12px">We use your information to deliver your purchased report, process payments via Stripe, and provide customer support.<br/><strong>Legal basis (UK GDPR):</strong> Contract performance and legitimate interests</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">4. How We Share Your Information</h2><p style="margin-bottom:12px">We share your data ONLY with <strong>Stripe</strong> to process payments. <strong>We do NOT</strong> sell your data, use it for advertising, or share quiz responses.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">5. How Long We Keep Your Data</h2><p style="margin-bottom:12px">&bull; Purchase records: 7 years (UK tax law)<br/>&bull; Quiz responses: Deleted after report generation<br/>&bull; Browser session: Cleared when you close browser</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">6. Your Rights Under UK GDPR</h2><p style="margin-bottom:12px">Access, Rectify, Erase, Restrict, Portability, Object. Email <strong>lqm@lqmmethod.com</strong> to exercise these rights. We respond within 30 days.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">7. How We Protect Your Data</h2><p style="margin-bottom:12px">All payments encrypted by Stripe. HTTPS on our website. We never store card details.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">8. Cookies</h2><p style="margin-bottom:12px">We use only essential session cookies for the quiz to function. No tracking cookies.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">9. Complaints</h2><p style="margin-bottom:12px">You can complain to the UK ICO: <a href="https://ico.org.uk/make-a-complaint/" style="color:#00C8FF">ico.org.uk/make-a-complaint</a> &mdash; Phone: 0303 123 1113</p>`;

const TERMS_TEXT=`<h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#00C8FF;margin-bottom:8px;letter-spacing:2px">Terms &amp; Conditions</h1><p style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:32px">Last updated: 21 February 2026</p><p style="margin-bottom:20px">By using our website and purchasing our report, you agree to these terms.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">1. The Service</h2><p style="margin-bottom:12px"><strong>What you receive:</strong> An 11-question behavioural quiz and personalised LQM report with your archetype, identity statement, strengths, blind spots, and 3 strategy cards. Optional add-ons: Brain Training and Quantum Living, each &pound;5.00. <strong>What this is NOT:</strong> Professional counselling, medical advice, or employment screening.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">2. Pricing &amp; Payment</h2><p style="margin-bottom:12px">Main report: &pound;9.00 &bull; Brain Training add-on: &pound;5.00 &bull; Quantum Living add-on: &pound;5.00 &bull; Payment via Stripe &bull; One-time payments (no subscriptions)</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">3. Delivery &amp; Confirmation</h2><p style="margin-bottom:12px">Your report is delivered <strong>instantly on screen</strong> after payment. You must confirm receipt by clicking "I Confirm Receipt" to access your report. An optional email copy may be sent to the address you provide. Where a customer opts to receive their report by email, delivery of that email constitutes additional confirmation of receipt and does not alter the refund policy or create any additional rights.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">4. Refund Policy</h2><p style="margin-bottom:12px"><strong>7-day money-back guarantee.</strong> Email <strong>lqm@lqmmethod.com</strong> within 7 days. No refunds if you confirmed receipt and then claim you "never received" the report, or if 7 days have passed since purchase.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">5. Intellectual Property</h2><p style="margin-bottom:12px">All LQM content is copyrighted by Learning Quantum Method. You CAN use your report personally. You CANNOT republish commercially or resell.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">6. Disclaimer</h2><p style="margin-bottom:12px">For <strong>educational and informational purposes only</strong>. We do not guarantee specific results.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">7. Age Restriction</h2><p style="margin-bottom:12px">You must be 18 years or older to purchase.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">8. Digital Product Nature</h2><p style="margin-bottom:12px">By confirming receipt, the standard 14-day cooling-off period does not apply. Your delivery confirmation serves as proof of delivery.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">9. Governing Law</h2><p style="margin-bottom:12px">Governed by the laws of England and Wales. Contact: <strong>lqm@lqmmethod.com</strong></p>`;

function RotatingTestimonial({quotes, accentColor}) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if(quotes.length <= 1) return;
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i+1) % quotes.length); setVisible(true); }, 500);
    }, 5000);
    return () => clearInterval(t);
  }, [quotes.length]);
  return (
    <div style={{transition:"opacity .5s", opacity:visible?1:0, padding:"10px 14px", background:"rgba(255,255,255,0.03)", border:`1px solid ${accentColor}22`, borderLeft:`3px solid ${accentColor}`, borderRadius:"0 10px 10px 0", marginBottom:14}}>
      <p style={{fontFamily:"'Crimson Pro',serif", fontStyle:"italic", fontSize:14, color:"rgba(255,255,255,0.72)", lineHeight:1.55, marginBottom:4}}>"{quotes[idx].text}"</p>
      <p style={{fontSize:13, color:"rgba(255,255,255,0.55)", fontWeight:700, letterSpacing:".06em"}}>— {quotes[idx].author}</p>
    </div>
  );
}

function AtomIcon({size=24}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0,animation:"atomGlow 2.4s ease-in-out infinite"}}>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.8" fill="none" stroke="#00C8FF" strokeWidth="1.1" opacity="0.85"/>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.8" fill="none" stroke="#7DD3FC" strokeWidth="0.9" opacity="0.65" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.8" fill="none" stroke="#BAE6FD" strokeWidth="0.8" opacity="0.50" transform="rotate(120 12 12)"/>
      <circle cx="22.5" cy="12" r="1.6" fill="#00C8FF" opacity="0.9"/>
      <circle cx="7.25" cy="5.05" r="1.4" fill="#7DD3FC" opacity="0.78"/>
      <circle cx="7.25" cy="18.95" r="1.3" fill="#BAE6FD" opacity="0.65"/>
      <circle cx="12" cy="12" r="2.6" fill="#FFFFFF" opacity="0.98"/>
      <circle cx="12" cy="12" r="1.4" fill="#00C8FF" opacity="0.5"/>
    </svg>
  );
}

function Hub({type, unlocks, onOpenNeural, onOpenVital, onViewReport, onUnlockNeural, onUnlockVital, onUnlockBundle, onSimulateNeural, onSimulateVital, customerEmail, onSendReport}) {
  const [emailOpen,   setEmailOpen]   = useState(false);
  const [emailInput,  setEmailInput]  = useState(customerEmail||"");
  const [emailStatus, setEmailStatus] = useState("idle");
  const brainData = (() => { try { return JSON.parse(localStorage.getItem("lqm_brain")||"{}"); } catch { return {}; } })();
  const livingData = (() => { try { return JSON.parse(localStorage.getItem("lqm_living")||"{}"); } catch { return {}; } })();
  const challengeBrain = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_brain")||"{}"); } catch { return {}; } })();
  const challengeQuantum = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_quantum")||"{}"); } catch { return {}; } })();
  const brainDay = challengeBrain.currentDay || 0;
  const quantumDay = challengeQuantum.currentDay || 0;
  const brainStreak = brainData.streak || 0;
  const quantumStreak = livingData.streak || 0;
  const brainXP = brainData.totalXP || 0;

  async function handleEmailSend() {
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) return;
    setEmailStatus("sending");
    const result = await onSendReport(emailInput);
    setEmailStatus(result.ok ? "sent" : "error");
  }

  return (
    <div style={{animation:"fadeUp .5s ease both", paddingBottom:20}}>
      <div style={{textAlign:"center", marginBottom:28}}>
        <div style={{display:"inline-block", background:`${type.blue}15`, border:`1px solid ${type.blue}44`, borderRadius:100, padding:"6px 18px", marginBottom:14}}>
          <span style={{fontSize:13, fontWeight:700, color:type.blue, letterSpacing:".14em", textTransform:"uppercase"}}>Welcome to Your LQM Hub</span>
        </div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(28px,6vw,44px)", letterSpacing:2, color:WHITE, lineHeight:1.1, marginBottom:8}}>{type.name}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif", fontStyle:"italic", fontSize:16, color:MUTED, maxWidth:400, margin:"0 auto", lineHeight:1.65}}>"{type.identity}"</p>
      </div>
      <div style={{display:"flex", gap:8, marginBottom:24, justifyContent:"center", flexWrap:"wrap"}}>
        {brainStreak > 0 && <div style={{background:"rgba(0,200,255,0.08)", border:`1px solid ${BORDER}`, borderRadius:100, padding:"6px 14px", fontSize:13, color:E_BLUE, fontWeight:700}}>⚡ {brainStreak} day brain streak</div>}
        {quantumStreak > 0 && <div style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:100, padding:"6px 14px", fontSize:13, color:"#34D399", fontWeight:700}}>🌿 {quantumStreak} day living streak</div>}
        {brainXP > 0 && <div style={{background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:100, padding:"6px 14px", fontSize:13, color:AMBER, fontWeight:700}}>⭐ {brainXP} XP</div>}
      </div>
      <div onClick={onViewReport} style={{background:`linear-gradient(135deg,${type.blue}12,${DARK2})`, border:`1px solid ${type.blue}44`, borderTop:`2px solid ${type.blue}`, borderRadius:18, padding:"20px 22px", marginBottom:12, cursor:"pointer", transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 30px ${type.blue}18`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <div style={{width:46, height:46, borderRadius:14, background:`${type.blue}18`, border:`1px solid ${type.blue}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22}}>📊</div>
            <div>
              <p style={{fontSize:13, fontWeight:700, color:type.blue, letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>My Profile Report</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE}}>Full Archetype Analysis</p>
              <p style={{fontSize:15, color:MUTED, marginTop:2}}>Strengths · Blind spots · 3 strategy cards · Visual insight</p>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.22)", borderRadius:100, padding:"6px 14px", fontSize:13, color:WHITE, fontWeight:700, flexShrink:0, animation:"ctaGlow 2s ease-in-out infinite"}}>View →</div>
        </div>
      </div>
      <div style={{background:unlocks.neural?`linear-gradient(135deg,rgba(0,200,255,0.07),${DARK2})`:DARK, border:`1px solid ${unlocks.neural?"rgba(0,200,255,0.35)":BORDER2}`, borderTop:`2px solid ${unlocks.neural?E_BLUE:"rgba(0,200,255,0.2)"}`, borderRadius:18, padding:"20px 22px", marginBottom:12, cursor:unlocks.neural?"pointer":"default", transition:"all .2s"}} onClick={unlocks.neural?onOpenNeural:undefined} onMouseEnter={e=>{if(unlocks.neural){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,200,255,0.1)";}}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"flex-start", gap:14, flex:1}}>
            <div style={{width:46, height:46, borderRadius:14, background:"rgba(0,200,255,0.1)", border:"1px solid rgba(0,200,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}><AtomIcon size={28}/></div>
            <div style={{flex:1}}>
              <p style={{fontSize:13, fontWeight:700, color:E_BLUE, letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>Brain Training</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE, marginBottom:4}}>Neural Protocol</p>
              {unlocks.neural?(<><p style={{fontSize:15, color:MUTED, marginBottom:10}}>6 cognitive challenges · XP system · 21-day journey</p><div style={{marginBottom:6}}><div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}><span style={{fontSize:13, color:MUTED}}>21-Day Challenge</span><span style={{fontSize:13, color:E_BLUE, fontWeight:700}}>Day {brainDay} of 21</span></div><div style={{height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden"}}><div style={{height:"100%", width:`${(brainDay/21)*100}%`, background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`, borderRadius:100}}/></div></div><div style={{display:"flex", gap:12}}>{[{d:7,icon:"⭐"},{d:14,icon:"🌟"},{d:21,icon:"🏆"}].map(m=>(<span key={m.d} style={{fontSize:16, opacity:brainDay>=m.d?1:0.2}}>{m.icon}</span>))}{brainStreak>0&&<span style={{fontSize:13, color:AMBER, fontWeight:700, marginLeft:"auto"}}><FlameIcon size={13}/> {brainStreak} day streak</span>}</div></>):(<><p style={{fontSize:14, color:"rgba(255,255,255,0.82)", fontWeight:500, lineHeight:1.5, marginBottom:4}}>Most people never train the muscle between their ears.</p><p style={{fontSize:15, color:MUTED, marginBottom:12}}>6 challenges · 6 minutes a day · 21 days to a measurably sharper mind.</p><RotatingTestimonial accentColor={E_BLUE} quotes={[{text:"By week two I was noticeably faster at decisions.",author:"Jamie, 34"},{text:"The streak system kept me honest. 21 days straight — my focus is unrecognisable.",author:"Marcus, 29"},{text:"I thought brain training was gimmicky. This changed my mind completely.",author:"Sophie, 43"}]}/></>)}
            </div>
          </div>
          <div style={{flexShrink:0}}>{unlocks.neural?<div style={{background:"rgba(0,200,255,0.1)", border:"1px solid rgba(0,200,255,0.3)", borderRadius:100, padding:"6px 14px", fontSize:13, color:E_BLUE, fontWeight:700, animation:"ctaGlow 2s ease-in-out infinite"}}>Open →</div>:<button onClick={e=>{e.stopPropagation();onUnlockNeural();}} style={{border:"none", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`, color:BG, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap"}}>🔒 £5</button>}</div>
        </div>
      </div>
      <div style={{background:unlocks.vital?"linear-gradient(135deg,rgba(52,211,153,0.07),#0D1830)":DARK, border:`1px solid ${unlocks.vital?"rgba(52,211,153,0.35)":BORDER2}`, borderTop:`2px solid ${unlocks.vital?"#34D399":"rgba(52,211,153,0.2)"}`, borderRadius:18, padding:"20px 22px", marginBottom:20, cursor:unlocks.vital?"pointer":"default", transition:"all .2s"}} onClick={unlocks.vital?onOpenVital:undefined} onMouseEnter={e=>{if(unlocks.vital){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(52,211,153,0.08)";}}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"flex-start", gap:14, flex:1}}>
            <div style={{width:46, height:46, borderRadius:14, background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0}}>🌿</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13, fontWeight:700, color:"#34D399", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>Quantum Living</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE, marginBottom:4}}>5 Laws of Living</p>
              {unlocks.vital?(<><p style={{fontSize:15, color:MUTED, marginBottom:10}}>Daily checklist · 5 quantum laws · 21-day journey</p><div style={{marginBottom:6}}><div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}><span style={{fontSize:13, color:MUTED}}>21-Day Challenge</span><span style={{fontSize:13, color:"#34D399", fontWeight:700}}>Day {quantumDay} of 21</span></div><div style={{height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden"}}><div style={{height:"100%", width:`${(quantumDay/21)*100}%`, background:"linear-gradient(90deg,#059669,#34D399)", borderRadius:100}}/></div></div><div style={{display:"flex", gap:12}}>{[{d:7,icon:"🌱"},{d:14,icon:"🌿"},{d:21,icon:"🌳"}].map(m=>(<span key={m.d} style={{fontSize:16, opacity:quantumDay>=m.d?1:0.2}}>{m.icon}</span>))}{quantumStreak>0&&<span style={{fontSize:13, color:AMBER, fontWeight:700, marginLeft:"auto"}}><FlameIcon size={13}/> {quantumStreak} day streak</span>}</div></>):(<><p style={{fontSize:14, color:"rgba(255,255,255,0.82)", fontWeight:500, lineHeight:1.5, marginBottom:4}}>Your biology is either working for you or against you.</p><p style={{fontSize:15, color:MUTED, marginBottom:12}}>5 quantum laws · sleep, breath, movement, temperance, nourishment · built around your archetype.</p><RotatingTestimonial accentColor="#34D399" quotes={[{text:"I've read every wellness book going. This is the first thing that actually stuck.",author:"Rachel, 41"},{text:"Simple enough to do daily, powerful enough to actually change things.",author:"Priya, 37"},{text:"By week three I hadn't needed my usual 3pm coffee in days.",author:"Tom, 45"}]}/></>)}
            </div>
          </div>
          <div style={{flexShrink:0}}>{unlocks.vital?<div style={{background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:100, padding:"6px 14px", fontSize:13, color:"#34D399", fontWeight:700, animation:"ctaGlow 2s ease-in-out infinite"}}>Open →</div>:<button onClick={e=>{e.stopPropagation();onUnlockVital();}} style={{border:"none", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, background:"linear-gradient(135deg,#059669,#34D399)", color:BG, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap"}}>🔒 £5</button>}</div>
        </div>
      </div>
      {!(unlocks.neural && unlocks.vital) && (
        <div style={{background:"linear-gradient(135deg,rgba(251,191,36,0.06),rgba(0,200,255,0.04))", border:"1px solid rgba(251,191,36,0.28)", borderRadius:16, padding:"18px 20px", marginBottom:16, position:"relative", overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,rgba(251,191,36,0.6),rgba(0,200,255,0.5),rgba(52,211,153,0.5))"}}/>
          {(!unlocks.neural && !unlocks.vital)?(<><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12}}><div style={{flex:1}}><p style={{fontSize:12,fontWeight:700,color:AMBER,letterSpacing:".14em",textTransform:"uppercase",marginBottom:5}}>⭐ Complete Your LQM System</p><p style={{fontSize:16,fontWeight:700,color:WHITE,marginBottom:4}}>Both Add-Ons · <span style={{color:AMBER}}>£8 today</span></p><p style={{fontSize:15,color:MUTED,lineHeight:1.6}}>Brain Training + Quantum Living. 21 days of cognitive training and daily wellness practice. Purchased separately: £10.</p></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:1,color:AMBER}}>£8</div><div style={{fontSize:13,color:MUTED,textDecoration:"line-through"}}>£10</div></div></div><button onClick={e=>{e.stopPropagation();onUnlockBundle();}} style={{width:"100%",border:"none",borderRadius:100,padding:"11px",fontSize:14,fontWeight:700,background:"linear-gradient(135deg,rgba(251,191,36,0.85),rgba(251,191,36,0.65))",color:"#070F1E",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em",transition:"all .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Get the Complete System → £8</button></>):(<div><p style={{fontSize:12,fontWeight:700,color:AMBER,letterSpacing:".14em",textTransform:"uppercase",marginBottom:5}}>⭐ You're Halfway There</p><p style={{fontSize:15,fontWeight:700,color:WHITE,marginBottom:4}}>Add {unlocks.neural?"Quantum Living":"Brain Training"} for just <span style={{color:AMBER}}>£5</span></p><button onClick={e=>{e.stopPropagation(); unlocks.neural?onUnlockVital():onUnlockNeural();}} style={{width:"100%",border:"none",borderRadius:100,padding:"11px",fontSize:14,fontWeight:700,background:"linear-gradient(135deg,rgba(251,191,36,0.8),rgba(251,191,36,0.55))",color:"#070F1E",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em"}}>{unlocks.neural?"Unlock Quantum Living → £5":"Unlock Brain Training → £5"}</button></div>)}
        </div>
      )}
      {(unlocks.neural || unlocks.vital) && (
        <div style={{background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`, borderRadius:14, padding:"16px 20px", marginBottom:8}}>
          <p style={{fontSize:13, fontWeight:700, color:DIMMED, letterSpacing:".12em", textTransform:"uppercase", marginBottom:10}}>💡 Your Daily Habit</p>
          <p style={{fontSize:14, color:MUTED, lineHeight:1.6}}>{unlocks.neural&&unlocks.vital?"Complete today's Brain Training session + tick all 5 Quantum Laws to log your daily progress on both 21-day journeys.":unlocks.neural?"Complete today's Brain Training session to log your daily progress and keep your streak alive.":"Tick all 5 Quantum Laws today to log your daily progress and keep your streak alive."}</p>
        </div>
      )}
      <div style={{marginTop:16,marginBottom:4,border:`1px solid ${emailStatus==="sent"?"rgba(52,211,153,0.35)":E_BLUE+"22"}`,borderRadius:14,overflow:"hidden",transition:"border-color .3s"}}>
        <button onClick={()=>{setEmailOpen(v=>!v);setEmailStatus("idle");}} style={{width:"100%",background:emailOpen?`${E_BLUE}08`:"transparent",border:"none",cursor:"pointer",padding:"14px 18px",display:"flex",alignItems:"center",gap:12,fontFamily:"'Space Grotesk',sans-serif",transition:"background .2s"}}>
          <span style={{fontSize:18}}>📧</span>
          <div style={{flex:1,textAlign:"left"}}><p style={{fontSize:13,fontWeight:700,color:E_BLUE,margin:0,letterSpacing:".04em"}}>Email My Full Report</p><p style={{fontSize:13,color:MUTED,margin:0,marginTop:2}}>{customerEmail?`Last sent to ${customerEmail}`:"Send your complete report to your inbox"}</p></div>
          <span style={{fontSize:13,color:DIMMED,fontWeight:700,letterSpacing:".06em"}}>{emailOpen?"↑ Close":"Open →"}</span>
        </button>
        {emailOpen && (
          <div style={{padding:"0 18px 18px",borderTop:`1px solid ${E_BLUE}18`,background:`${E_BLUE}05`,animation:"fadeUp .2s ease both"}}>
            {emailStatus==="sent"?(
              <div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:32,marginBottom:8}}>✅</div><p style={{fontSize:15,fontWeight:700,color:"#34D399",margin:"0 0 4px"}}>Report Sent</p><p style={{fontSize:13,color:DIMMED}}>Check your inbox — it may take a minute to arrive.</p><button onClick={()=>{setEmailStatus("idle");setEmailOpen(false);}} style={{marginTop:14,background:"none",border:"none",cursor:"pointer",fontSize:13,color:E_BLUE,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700}}>Close ↑</button></div>
            ):(
              <><p style={{fontSize:15,color:MUTED,margin:"14px 0 10px",lineHeight:1.7}}>Your full report sent as a premium email to your inbox.</p><input value={emailInput} onChange={e=>{setEmailInput(e.target.value);setEmailStatus("idle");}} placeholder="your@email.com" type="email" style={{width:"100%",background:"rgba(0,0,0,0.3)",border:`1px solid ${emailStatus==="error"?"rgba(239,68,68,0.5)":E_BLUE+"33"}`,borderRadius:9,padding:"11px 14px",color:"#fff",fontSize:14,fontFamily:"'Space Grotesk',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:10}}/>{emailStatus==="error"&&<p style={{fontSize:13,color:"#EF4444",margin:"-4px 0 8px"}}>Something went wrong — please try again or email lqm@lqmmethod.com</p>}<button onClick={handleEmailSend} disabled={emailStatus==="sending"} style={{width:"100%",padding:"12px",borderRadius:100,border:"none",cursor:emailStatus==="sending"?"default":"pointer",background:emailStatus==="sending"?"rgba(0,200,255,0.1)":E_BLUE,color:emailStatus==="sending"?E_BLUE:"#070F1E",fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:14,letterSpacing:".06em",transition:"all .2s"}}>{emailStatus==="sending"?"Sending…":"Send My Report →"}</button></>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RotatingStrapline() {
  const lines = ["Know your type. Train your mind. Live by design.","Daily brain challenges. Real cognitive gains.","Five laws of health. One daily practice."];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i+1)%lines.length); setVisible(true); }, 600);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);
  return (
    <div style={{textAlign:"center",height:36,marginBottom:24,overflow:"hidden"}}>
      <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:20,color:"rgba(255,255,255,0.72)",letterSpacing:".03em",lineHeight:1.6,transition:"opacity .65s ease, transform .65s ease",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(8px)"}}>{lines[idx]}</p>
    </div>
  );
}


// CHANGE 12: New Landing with archetype teaser, science strip, micro-preview
function Landing({onStart}){
  return(
    <div>
      {/* Logo */}
      <div className="fu" style={{textAlign:"center",marginBottom:28,paddingTop:8}}>
        <Logo size="lg"/>
      </div>

      {/* Hero headline */}
      <div className="fu1" style={{textAlign:"center",marginBottom:20}}>
        <p style={{fontSize:14,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:14}}>
          ⚡ Behavioural Intelligence Assessment
        </p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,64px)",lineHeight:1.05,letterSpacing:2,color:WHITE,marginBottom:6}}>
          You Don't Have A<br/><span className="elec">Motivation Problem.</span>
        </h1>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,5vw,40px)",lineHeight:1,letterSpacing:2,color:"rgba(255,255,255,0.28)",marginBottom:20}}>
          You Have A Systems Problem.
        </h2>
        <RotatingStrapline/>
      </div>

      {/* Philosophy quote */}
      <p className="fu2" style={{textAlign:"center",fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,lineHeight:1.75,color:MUTED,maxWidth:500,margin:"0 auto 28px"}}>
        "Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle." — The Learning Quantum Method
      </p>

      {/* ── ARCHETYPE TEASER ─────────────────────────────────────── */}
      <div className="fu3" style={{marginBottom:28}}>
        <p style={{textAlign:"center",fontSize:12,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>
          Discover your archetype
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
          {[
            {name:"Systems Architect", sym:"◈", color:"#00C8FF", tag:"Strategic · Precise · Systems-driven"},
            {name:"Deep Learner",       sym:"◉", color:"#38BDF8", tag:"Curious · Thorough · Knowledge-first"},
            {name:"Relational Catalyst",sym:"◎", color:"#34D399", tag:"Empathetic · Connecting · People-led"},
            {name:"Visionary Pioneer",  sym:"◇", color:"#A78BFA", tag:"Creative · Bold · Future-focused"},
          ].map(a=>(
            <div key={a.name} style={{
              display:"flex",alignItems:"center",gap:10,
              padding:"12px 14px",
              background:"rgba(255,255,255,0.025)",
              border:`1px solid ${a.color}33`,
              borderLeft:`3px solid ${a.color}66`,
              borderRadius:"0 10px 10px 0",
              transition:"all .2s",
            }}>
              <span style={{fontSize:20,color:a.color,flexShrink:0}}>{a.sym}</span>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:WHITE,marginBottom:2}}>{a.name}</p>
                <p style={{fontSize:11,color:DIMMED,lineHeight:1.4}}>{a.tag}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:13,color:DIMMED,fontStyle:"italic"}}>
          Which one are you?
        </p>
      </div>

      {/* ── SCIENCE CREDIBILITY STRIP ────────────────────────────── */}
      <div className="fu3" style={{
        marginBottom:28,padding:"20px 22px",
        background:"rgba(0,200,255,0.04)",
        border:`1px solid ${BORDER}`,
        borderRadius:14,
      }}>
        <p style={{fontSize:12,fontWeight:700,color:E_BLUE,letterSpacing:".16em",textTransform:"uppercase",marginBottom:14,textAlign:"center"}}>
          Built on behavioural science
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[
            ["◈","Cognitive flexibility","How the brain adapts between tasks and rules"],
            ["△","Decision architecture","How environment shapes the choices you make"],
            ["⟁","Habit formation research","How behaviours become automatic through systems"],
            ["⬡","Systems-based design","How small structural changes compound over time"],
          ].map(([sym,title,desc])=>(
            <div key={title} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{color:E_BLUE,fontSize:14,flexShrink:0,marginTop:2}}>{sym}</span>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:WHITE,marginBottom:2}}>{title}</p>
                <p style={{fontSize:12,color:DIMMED,lineHeight:1.5}}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:DIMMED,textAlign:"center",marginTop:14,lineHeight:1.7}}>
          LQM is not a personality quiz. It is a diagnostic tool built on how people actually decide, act, and perform.
        </p>
      </div>

      {/* ── MICRO-PREVIEW EXAMPLE CARD ───────────────────────────── */}
      <div className="fu3" style={{marginBottom:28}}>
        <p style={{textAlign:"center",fontSize:12,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:14}}>
          Your result will look like this
        </p>
        <div style={{
          background:`linear-gradient(145deg,${DARK2},${DARK})`,
          border:`1px solid rgba(0,200,255,0.35)`,
          borderTop:`2px solid #00C8FF`,
          borderRadius:16,padding:"20px 22px",
          position:"relative",overflow:"hidden",
        }}>
          {/* Example badge */}
          <div style={{
            position:"absolute",top:12,right:12,
            background:"rgba(251,191,36,0.12)",
            border:"1px solid rgba(251,191,36,0.35)",
            borderRadius:100,padding:"3px 10px",
            fontSize:11,fontWeight:700,color:AMBER,letterSpacing:".1em",
          }}>EXAMPLE ONLY</div>

          {/* Archetype header */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <span style={{fontSize:26,color:"#00C8FF"}}>◈</span>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:"#00C8FF",letterSpacing:".12em",textTransform:"uppercase",marginBottom:2}}>Your LQM Archetype</p>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:WHITE,lineHeight:1}}>The Systems Architect</p>
            </div>
          </div>

          {/* Tag */}
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:"rgba(0,200,255,0.9)",marginBottom:14,lineHeight:1.6}}>
            "You don't chase motivation. You engineer it."
          </p>

          {/* Behavioural pattern */}
          <div style={{
            background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",
            borderRadius:8,padding:"10px 12px",marginBottom:12,
          }}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>
              Behavioural tendency
            </p>
            <p style={{fontSize:13,color:WHITE,fontWeight:600,marginBottom:2}}>Structure orientation</p>
            <p style={{fontSize:12,color:MUTED,lineHeight:1.5}}>You prioritise frameworks and clarity before committing to action — and sometimes that delay costs you.</p>
          </div>

          {/* Strength + blind spot */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={{background:"rgba(0,200,255,0.06)",border:"1px solid rgba(0,200,255,0.2)",borderRadius:8,padding:"8px 10px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"#00C8FF",letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Strength</p>
              <p style={{fontSize:12,color:WHITE,lineHeight:1.4}}>Systems Design</p>
            </div>
            <div style={{background:"rgba(255,160,40,0.06)",border:"1px solid rgba(255,160,40,0.2)",borderRadius:8,padding:"8px 10px"}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(255,180,50,0.8)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Blind spot</p>
              <p style={{fontSize:12,color:WHITE,lineHeight:1.4}}>Perfectionism delays launch</p>
            </div>
          </div>

          <p style={{fontSize:12,color:DIMMED,textAlign:"center",fontStyle:"italic"}}>
            Your report includes 3 personalised strategy cards built for your specific profile
          </p>
        </div>
      </div>

      {/* ── WHAT'S INSIDE ──────────────────────────────────────────── */}
      <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"26px",marginBottom:24,borderTop:`2px solid rgba(0,200,255,0.18)`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE,whiteSpace:"nowrap"}}>
            What's inside your report
          </p>
          <div style={{flex:1,height:1,background:`linear-gradient(90deg,${E_BLUE}44,transparent)`}}/>
        </div>
        {[
          ["⚛","Your Behavioural Archetype","Deep analysis of your unique motivation architecture — how you're wired to learn, decide and perform"],
          ["◈","Strengths & Blind Spot Analysis","An honest breakdown of your psychological edge and the patterns that are quietly holding you back"],
          ["△","3 LQM Quantum Strategy Cards","Scenario-based systems designed specifically for your profile — not generic advice you've already tried"],
          ["⬡","Your Identity Statement","The single sentence that, when repeated, rewires how you show up every day"],
          ["◎","Behavioural Pattern Profile","How your answers distributed across structure, analysis, relational and creative tendencies — new in 2026"],
        ].map(([ic,ti,de])=>(
          <div key={ti} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <span style={{color:E_BLUE,fontSize:17,flexShrink:0,marginTop:2}}>{ic}</span>
            <div>
              <p style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:3}}>{ti}</p>
              <p style={{fontSize:16,color:MUTED,fontWeight:300,lineHeight:1.6}}>{de}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <div className="fu4" style={{textAlign:"center"}}>
        <PrimaryBtn onClick={onStart}>⚡ Begin My Free Assessment →</PrimaryBtn>
        <p style={{marginTop:10,fontSize:15,color:DIMMED}}>
          Takes 3 minutes · See your result before paying
        </p>
      </div>
    </div>
  );
}


function Quiz({q,idx,sel,onSel,onNext}){
  const pct=(idx/questions.length)*100;
  return(
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:20}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:DIMMED}}>{String(idx+1).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}</span>
      </div>
      <div style={{height:2,background:"rgba(255,255,255,0.06)",borderRadius:100,marginBottom:30,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`,borderRadius:100,transition:"width .5s ease",boxShadow:`0 0 10px ${E_BLUE}55`}}/>
      </div>
      <Panel glow>
        <div style={{fontSize:28,color:E_BLUE,marginBottom:12,textShadow:`0 0 18px ${E_BLUE}`}}>{q.sym}</div>
        {q.isVisual && (<div style={{marginBottom:20}}><div style={{display:"inline-block",background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:100,padding:"6px 16px",marginBottom:16}}><span style={{fontSize:12,fontWeight:700,color:AMBER,letterSpacing:".12em"}}>VISUAL INSIGHT</span></div></div>)}
        <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:"clamp(19px,3.5vw,25px)",fontWeight:400,lineHeight:1.5,color:WHITE,marginBottom:q.subtitle?10:26}}>{q.text}</h2>
        {q.subtitle && (<p style={{fontSize:15,color:MUTED,marginBottom:20,fontStyle:"italic"}}>{q.subtitle}</p>)}
        {q.isVisual && (<div style={{marginBottom:24,textAlign:"center"}}><img src="/tree-woman.jpg" alt="Visual perception test" style={{maxWidth:"100%",width:340,height:"auto",borderRadius:12,border:`2px solid ${BORDER2}`,boxShadow:`0 4px 24px rgba(0,0,0,0.45)`}}/></div>)}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {q.opts.map((opt,i)=>{
            const isS=sel===opt.ty;
            return(<button key={i} onClick={()=>onSel(opt.ty)} style={{background:isS?"rgba(0,200,255,0.08)":"rgba(255,255,255,0.025)",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,borderRadius:12,padding:"14px 18px",textAlign:"left",cursor:"pointer",transition:"all .2s ease",color:isS?WHITE:MUTED,fontSize:16,fontFamily:"'Space Grotesk',sans-serif",fontWeight:isS?500:400,lineHeight:1.5,display:"flex",alignItems:"center",gap:14,boxShadow:isS?`0 0 18px ${E_GLOW}`:"none"}} onMouseEnter={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=WHITE;}}} onMouseLeave={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER2;e.currentTarget.style.color=MUTED;}}}>
              <span style={{width:26,height:26,borderRadius:"50%",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,background:isS?E_BLUE:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:isS?BG:"transparent",fontWeight:800,transition:"all .2s"}}>✓</span>
              {opt.t}
            </button>);
          })}
        </div>
        {sel?<PrimaryBtn onClick={onNext}>{idx<questions.length-1?"Next Question →":"Reveal My Profile →"}</PrimaryBtn>:<button disabled style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"not-allowed",background:"rgba(255,255,255,0.04)",color:DIMMED}}>Select an answer to continue</button>}
      </Panel>
    </div>
  );
}

function Processing({step}){
  const steps=["Decoding your response patterns…","Mapping your motivation architecture…","Cross-referencing LQM behavioural data…","Identifying your psychological edge…","Generating your personalised system…"];
  return(
    <div style={{textAlign:"center",paddingTop:60}}>
      <div style={{position:"relative",width:80,height:80,margin:"0 auto 36px"}}><div style={{width:80,height:80,borderRadius:"50%",border:"2px solid rgba(0,200,255,0.1)",borderTop:`2px solid ${E_BLUE}`,animation:"spin 1s linear infinite"}}/><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:28}}>⚛</div></div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2,marginBottom:8,color:WHITE}}>Analysing Your Profile</h2>
      <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:DIMMED,marginBottom:36}}>Learning Quantum Method behavioural analysis in progress</p>
      <Panel style={{maxWidth:400,margin:"0 auto",textAlign:"left"}}>
        {steps.map((s,i)=>(<div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:i<steps.length-1?14:0,opacity:step>i?1:.2,transition:"opacity .5s ease"}}><span style={{color:step>i?E_BLUE:DIMMED,fontSize:14,flexShrink:0}}>{step>i?"⚡":"○"}</span><span style={{fontSize:16,color:step>i?WHITE:DIMMED,fontWeight:step>i?500:300}}>{s}</span></div>))}
      </Panel>
    </div>
  );
}

function Teaser({type,t,fmt,onUnlockOffer,onUnlockFull}){
  return(
    <div style={{animation:"fadeUp .6s ease both"}}>
      <Panel glow style={{textAlign:"center",marginBottom:14,borderColor:`${type.blue}44`}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:type.blue,marginBottom:14}}>⚡ Your LQM Behavioural Profile</p>
        <div style={{fontSize:50,color:type.blue,marginBottom:10}}>{type.sym}</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(26px,5vw,40px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{type.name}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,fontStyle:"italic",color:type.blue,marginBottom:18}}>{type.arch}</p>
        <div style={{width:50,height:2,background:`linear-gradient(90deg,transparent,${type.blue},transparent)`,margin:"0 auto 18px"}}/>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:17,color:MUTED,lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>"{type.hook}"</p>
      </Panel>
      <Panel style={{marginBottom:12,position:"relative",overflow:"hidden",minHeight:100}}>
        <SLabel color={type.blue}>Your Identity Statement</SLabel>
        <div className="blur-lock" style={{background:type.glow,border:`1px solid ${type.blue}33`,borderRadius:10,padding:"14px 18px"}}><p style={{fontFamily:"'Crimson Pro',serif",fontSize:18,fontStyle:"italic",color:WHITE,lineHeight:1.6}}>"{type.identity}"</p></div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:`linear-gradient(to bottom,transparent,${DARK})`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:10}}><span style={{fontSize:16,color:DIMMED}}>🔒 Unlock to reveal</span></div>
      </Panel>
      <Panel style={{marginBottom:18,position:"relative",overflow:"hidden",minHeight:170}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <div className="blur-lock">{type.strategies.map((s,i)=>(<div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}><span style={{color:type.blue,fontSize:15,flexShrink:0}}>◈</span><div><p style={{fontSize:16,fontWeight:600,color:WHITE,marginBottom:3}}>{s.area}</p><p style={{fontSize:15,color:MUTED,fontWeight:300}}>{s.scenario}</p></div></div>))}</div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"60%",background:`linear-gradient(to bottom,transparent,${DARK})`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:12}}><span style={{fontSize:16,color:DIMMED}}>🔒 3 personalised strategy cards inside</span></div>
      </Panel>
      <Panel glow style={{borderColor:t>0?BORDER:"rgba(255,60,60,0.25)"}}>
        <div style={{textAlign:"center",marginBottom:18}}><TimerBadge t={t} fmt={fmt}/></div>
        {t>0?(<>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span><span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span><span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:15,fontWeight:700}}>67% off</span></div><p style={{fontSize:16,color:DIMMED}}>One-time · Instant access · Full personalised report</p></div>
          <PrimaryBtn onClick={onUnlockOffer}>⚡ Unlock My Full Profile Report →</PrimaryBtn>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>{["Instant access","Built for your profile","7-day guarantee"].map(f=>(<span key={f} style={{fontSize:15,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:E_BLUE}}>✓</span>{f}</span>))}</div>
        </>):(<>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{ORIGINAL}</span></div><p style={{fontSize:16,color:"rgba(255,255,255,0.45)"}}>The launch offer has expired — standard price applies</p></div>
          <button onClick={onUnlockFull} style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",transition:"all .2s ease",display:"block",background:"linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08))",color:WHITE,boxShadow:"0 6px 24px rgba(255,255,255,0.08)"}}>Unlock My Full Profile Report →</button>
          <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>{["Instant access","Built for your profile","7-day guarantee"].map(f=>(<span key={f} style={{fontSize:15,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:"rgba(255,255,255,0.4)"}}>✓</span>{f}</span>))}</div>
        </>)}
      </Panel>
    </div>
  );
}

function DeliveryGate({ref_, ts, type, onConfirm}){
  const [countdown, setCountdown] = useState(5);
  const [email, setEmail]         = useState("");
  const [emailError, setEmailError] = useState(null);
  useEffect(()=>{ if(countdown<=0) return; const t=setInterval(()=>setCountdown(c=>c-1),1000); return()=>clearInterval(t); },[countdown]);
  function handleConfirm(){
    if(countdown>0) return;
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setEmailError("Please enter a valid email address"); return; }
    onConfirm(email);
  }
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(7,15,30,0.97)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:480,background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`2px solid rgba(52,211,153,0.4)`,borderRadius:22,padding:"40px 32px",textAlign:"center",boxShadow:"0 0 60px rgba(52,211,153,0.08)"}}>
        <div style={{fontSize:48,marginBottom:16}}>📋</div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:"#34D399",marginBottom:6}}>Report Ready</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:"rgba(255,255,255,0.6)",marginBottom:28,lineHeight:1.65}}>Your full LQM {type.name} report has been prepared and is ready for delivery.</p>
        <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:14,padding:"18px 20px",marginBottom:24,textAlign:"left"}}>
          <p style={{fontSize:15,fontWeight:700,color:"rgba(52,211,153,0.7)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Delivery Details</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Reference</span><span style={{fontSize:15,fontFamily:"monospace",color:"#34D399",fontWeight:700}}>{ref_}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Delivered</span><span style={{fontSize:15,color:"rgba(255,255,255,0.7)"}}>{ts}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Profile</span><span style={{fontSize:15,color:type.blue,fontWeight:600}}>{type.name}</span></div>
          </div>
        </div>
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${emailError?"rgba(239,68,68,0.5)":"rgba(0,200,255,0.18)"}`,borderRadius:14,padding:"18px 20px",marginBottom:20,textAlign:"left"}}>
          <p style={{fontSize:13,fontWeight:700,color:"rgba(0,200,255,0.7)",letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>📧 Email a copy to yourself <span style={{fontWeight:400,opacity:0.7}}>(optional)</span></p>
          <input value={email} onChange={e=>{setEmailError(null);setEmail(e.target.value);}} onKeyDown={e=>e.key==="Enter"&&handleConfirm()} placeholder="your@email.com" type="email" style={{width:"100%",background:"rgba(0,0,0,0.3)",border:`1px solid ${emailError?"rgba(239,68,68,0.4)":"rgba(0,200,255,0.2)"}`,borderRadius:9,padding:"11px 14px",color:"#fff",fontSize:15,fontFamily:"'Space Grotesk',sans-serif",outline:"none",boxSizing:"border-box"}}/>
          {emailError&&<p style={{fontSize:13,color:"#EF4444",marginTop:6,marginBottom:0}}>{emailError}</p>}
          {!emailError&&<p style={{fontSize:14,color:"rgba(255,255,255,0.65)",marginTop:6,marginBottom:0}}>Your full report sent to your inbox. Optional — you can skip this.</p>}
        </div>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.4)",lineHeight:1.65,marginBottom:22,textAlign:"left"}}>By clicking below you confirm that your full LQM report has been successfully delivered to you on screen. This serves as your delivery receipt.</p>
        <button onClick={handleConfirm} disabled={countdown>0} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:countdown>0?"not-allowed":"pointer",background:countdown>0?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#059669,#34D399)",color:countdown>0?"rgba(255,255,255,0.3)":"#070F1E",letterSpacing:".05em",transition:"all .3s"}}>
          {countdown>0?`Please read — confirming in ${countdown}s…`:`✓ I Confirm Receipt — View My Report →`}
        </button>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.55)",marginTop:12}}>Ref: {ref_} · LQM Terms apply · {ts}</p>
      </div>
    </div>
  );
}

// CHANGES 9, 13: PC_ design tokens + ResultReveal + BehaviouralPatternSection + ShareableCard
function ResultReveal({type, patterns, onExplore}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied,    setCopied]    = useState(false);

  // Colour tokens — aligned with the app's design system
  const E_BLUE  = "#00C8FF";
  const WHITE   = "#FFFFFF";
  const MUTED   = "rgba(255,255,255,0.78)";
  const DIMMED  = "rgba(255,255,255,0.55)";
  const DARK    = "#0D1830";
  const DARK2   = "#111E38";
  const BORDER  = "rgba(0,200,255,0.18)";
  const BORDER2 = "rgba(255,255,255,0.09)";
  const AMBER   = "#FBBF24";

  const secondary  = patterns ? PATTERN_DATA[patterns.secondary]  : null;
  const tension    = patterns ? TENSION_NARRATIVES[patterns.tensionKey] : null;

  const domColor   = !patterns ? E_BLUE
                   : patterns.dominance === "blended"  ? "#A78BFA"
                   : patterns.dominance === "balanced" ? E_BLUE
                   : "#34D399";

  function copyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://lqmmethod.com").catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // Archetype colour from the type object (e.g. type.blue = "#00C8FF")
  const archColor = type ? type.blue : E_BLUE;

  return (
    <div style={{animation:"fadeUp .5s ease both", paddingBottom:32}}>

      {/* Header pill */}
      <div style={{textAlign:"center", marginBottom:24}}>
        <div style={{
          display:"inline-block",
          background:"rgba(0,200,255,0.08)",
          border:`1px solid rgba(0,200,255,0.28)`,
          borderRadius:100, padding:"5px 18px", marginBottom:8,
        }}>
          <span style={{
            fontSize:12, fontWeight:700, color:E_BLUE,
            letterSpacing:".14em", textTransform:"uppercase",
          }}>Your LQM Archetype</span>
        </div>
      </div>

      {/* Archetype identity — the identity moment */}
      <div style={{
        background:`linear-gradient(145deg,${DARK2},${DARK})`,
        border:`2px solid ${archColor}44`,
        borderTop:`3px solid ${archColor}`,
        borderRadius:20, padding:"28px 24px",
        marginBottom:16, textAlign:"center",
      }}>

        {/* Symbol */}
        <p style={{fontSize:48, marginBottom:10}}>{type ? type.sym : "◈"}</p>

        {/* Archetype name — the moment */}
        <p style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"clamp(32px,7vw,48px)",
          letterSpacing:3, color:WHITE, lineHeight:1,
          marginBottom:8,
        }}>{type ? type.name : "Your Archetype"}</p>

        {/* Tag */}
        <p style={{
          fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
          fontSize:18, color:archColor, lineHeight:1.6, marginBottom:16,
        }}>"{type ? type.tag : ""}"</p>

        {/* Confidence badge */}
        {patterns && (
          <div style={{
            display:"inline-flex", alignItems:"center", gap:6,
            background:`${archColor}12`,
            border:`1px solid ${archColor}30`,
            borderRadius:100, padding:"5px 14px", marginBottom:20,
          }}>
            <span style={{fontSize:16, fontWeight:700, color:archColor}}>
              {patterns.confidence}%
            </span>
            <span style={{fontSize:12, color:DIMMED, letterSpacing:".06em"}}>
              result confidence
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{height:1, background:"rgba(255,255,255,0.08)", marginBottom:20}}/>

        {/* Secondary influence */}
        {secondary && (
          <div style={{marginBottom:16, textAlign:"left"}}>
            <p style={{
              fontSize:11, fontWeight:700, color:DIMMED,
              letterSpacing:".14em", textTransform:"uppercase", marginBottom:6,
            }}>Secondary influence</p>
            <p style={{fontSize:16, fontWeight:600, color:WHITE, marginBottom:4}}>
              {secondary.label.replace(" orientation", "")}
            </p>
            <p style={{fontSize:14, color:MUTED, lineHeight:1.65}}>
              {secondary.summary}
            </p>
          </div>
        )}

        {/* Behavioural balance insight — the hook */}
        {tension && (
          <div style={{
            background:"rgba(167,139,250,0.07)",
            border:"1px solid rgba(167,139,250,0.22)",
            borderLeft:"3px solid rgba(167,139,250,0.55)",
            borderRadius:"0 12px 12px 0",
            padding:"14px 16px", textAlign:"left",
          }}>
            <p style={{
              fontSize:11, fontWeight:700, color:"#A78BFA",
              letterSpacing:".12em", textTransform:"uppercase", marginBottom:6,
            }}>⬡ Behavioural balance</p>
            <p style={{fontSize:15, color:WHITE, fontWeight:600, marginBottom:6, lineHeight:1.5}}>
              {tension.balance}
            </p>
            <p style={{fontSize:14, color:MUTED, lineHeight:1.8}}>
              {tension.tension}
            </p>
          </div>
        )}
      </div>

      {/* Primary action — explore full profile */}
      <button
        onClick={onExplore}
        style={{
          width:"100%", marginBottom:10,
          background:`linear-gradient(135deg,${archColor}22,rgba(0,200,255,0.08))`,
          border:`2px solid ${archColor}66`,
          borderRadius:100, padding:"16px",
          fontSize:16, fontWeight:700, color:archColor,
          cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
          letterSpacing:".04em", transition:"all .2s",
        }}
      >⚛ Explore My Full Profile →</button>

      {/* Share action */}
      <button
        onClick={() => setShareOpen(v => !v)}
        style={{
          width:"100%", marginBottom:16,
          background:"rgba(255,255,255,0.03)",
          border:`1px solid ${shareOpen ? "rgba(0,200,255,0.40)" : "rgba(255,255,255,0.09)"}`,
          borderRadius:100, padding:"14px",
          fontSize:14, fontWeight:700,
          color: shareOpen ? E_BLUE : DIMMED,
          cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
          transition:"all .2s",
        }}
      >{shareOpen ? "↑ Close share" : "⬡ Share my archetype"}</button>

      {/* Inline share panel */}
      {shareOpen && (
        <div style={{
          background:"rgba(0,200,255,0.03)",
          border:"1px solid rgba(0,200,255,0.20)",
          borderRadius:14, padding:"16px",
          marginBottom:16,
          animation:"fadeUp .25s ease both",
        }}>
          {/* Mini screenshot card */}
          <div style={{
            background:`linear-gradient(145deg,${DARK2},${DARK})`,
            border:`2px solid ${archColor}44`,
            borderTop:`3px solid ${archColor}`,
            borderRadius:14, padding:"18px", marginBottom:14,
          }}>
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:14, paddingBottom:10,
              borderBottom:"1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:16, letterSpacing:3, color:WHITE,
                }}>LQM</span>
                <span style={{
                  fontSize:10, fontWeight:700, color:E_BLUE, letterSpacing:".1em",
                }}>BEHAVIOURAL INTELLIGENCE</span>
              </div>
              {patterns && (
                <div style={{
                  background:`${archColor}15`, border:`1px solid ${archColor}33`,
                  borderRadius:100, padding:"2px 8px",
                  display:"flex", alignItems:"center", gap:4,
                }}>
                  <span style={{fontSize:12, fontWeight:700, color:archColor}}>
                    {patterns.confidence}%
                  </span>
                  <span style={{fontSize:9, color:"rgba(255,255,255,0.40)"}}>conf.</span>
                </div>
              )}
            </div>
            <p style={{
              fontSize:11, fontWeight:700, color:archColor,
              letterSpacing:".14em", textTransform:"uppercase", marginBottom:4,
            }}>My archetype</p>
            <p style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:24, letterSpacing:2, color:WHITE, lineHeight:1, marginBottom:6,
            }}>{type ? type.name : ""}</p>
            {tension && (
              <p style={{fontSize:13, color:MUTED, lineHeight:1.55, marginBottom:12}}>
                {tension.balance}
              </p>
            )}
            <div style={{
              textAlign:"center",
              borderTop:"1px solid rgba(255,255,255,0.08)",
              paddingTop:10,
            }}>
              <p style={{fontSize:13, fontWeight:700, color:E_BLUE}}>lqmmethod.com</p>
            </div>
          </div>

          {/* Copy + screenshot buttons */}
          <div style={{display:"flex", gap:8}}>
            <button
              onClick={copyLink}
              style={{
                flex:1,
                background: copied ? "rgba(52,211,153,0.15)" : "rgba(0,200,255,0.08)",
                border:`1px solid ${copied ? "rgba(52,211,153,0.40)" : "rgba(0,200,255,0.40)"}`,
                borderRadius:100, padding:"11px",
                fontSize:13, fontWeight:700,
                color: copied ? "#34D399" : E_BLUE,
                cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
                transition:"all .2s",
              }}
            >{copied ? "✓ Copied!" : "⬡ Copy link"}</button>
            <div style={{
              flex:1, textAlign:"center",
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:100, padding:"11px",
              fontSize:13, fontWeight:700, color:DIMMED,
            }}>📱 Screenshot</div>
          </div>
        </div>
      )}

      {/* Footnote */}
      <p style={{
        textAlign:"center", fontSize:13, color:DIMMED,
        fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
        lineHeight:1.7,
      }}>
        Your full profile includes strategy cards, blind spot analysis,<br/>
        behavioural pattern breakdown and your identity statement.
      </p>
    </div>
  );
}

// ── Module-level design tokens (shared by all pattern components) ─────────
const PC_BLUE       = "#00C8FF";
const PC_WHITE      = "#FFFFFF";
const PC_MUTED      = "rgba(255,255,255,0.78)";
const PC_DIMMED     = "rgba(255,255,255,0.55)";
const PC_DARK       = "#0D1830";
const PC_DARK2      = "#111E38";
const PC_BORDER     = "rgba(255,255,255,0.09)";
const PC_CYAN_GLOW  = "rgba(0,200,255,0.06)";
const PC_CYAN_EDGE  = "rgba(0,200,255,0.25)";
const PC_CYAN_LINE  = "rgba(0,200,255,0.70)";
const PC_PURPLE     = "#A78BFA";
const PC_PURPLE_BG  = "rgba(167,139,250,0.06)";
const PC_PURPLE_BD  = "rgba(167,139,250,0.25)";
const PC_PURPLE_LN  = "rgba(167,139,250,0.60)";
const PC_AMBER_BG   = "rgba(255,160,40,0.06)";
const PC_AMBER_BD   = "rgba(255,160,40,0.20)";
const PC_AMBER_TX   = "rgba(255,180,50,0.80)";
const PC_GREEN_TX   = "rgba(52,211,153,0.85)";
const PC_TEAL_SUC   = "#34D399";
const PC_BARS = [
  { key:"A", label:"Structure", color:"#00C8FF" },
  { key:"B", label:"Analysis",  color:"#38BDF8" },
  { key:"C", label:"Relational",color:"#34D399" },
  { key:"D", label:"Creative",  color:"#A78BFA" },
];


// ── Behavioural Pattern Section ───────────────────────────────────────────
// Full analysis layer rendered in the report.
// Section order (matches feedback recommendation):
//   1. Confidence score + dominance label
//   2. Primary tendency (summary, honest cost, strength)
//   3. Secondary tendency
//   4. Behavioural Balance — tension narrative
//   5. Distribution bars
//
// Props: patterns = { primary, secondary, counts, tension, dominance,
//                     confidence, tensionKey }   (from calcPatterns)
// ─────────────────────────────────────────────────────────────────────────
function BehaviouralPatternSection({patterns}) {
  if (!patterns) return null;

  const primary   = PATTERN_DATA[patterns.primary];
  const secondary = PATTERN_DATA[patterns.secondary];
  const tension   = TENSION_NARRATIVES[patterns.tensionKey];
  const total     = Object.values(patterns.counts).reduce((a, b) => a + b, 0);

  const domLabel  = patterns.dominance === "blended"  ? "Highly blended style"
                  : patterns.dominance === "balanced" ? "Balanced with clear primary"
                  : "Strong archetype dominance";
  const domColor  = patterns.dominance === "blended"  ? PC_PURPLE
                  : patterns.dominance === "balanced" ? PC_BLUE
                  : PC_TEAL_SUC;

  return (
    <div style={{
      background:"rgba(255,255,255,0.03)",
      border:`1px solid ${PC_BORDER}`,
      borderTop:"2px solid rgba(255,255,255,0.15)",
      borderRadius:16, padding:"24px", marginBottom:14,
    }}>

      {/* Heading */}
      <p style={{
        fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.55)",
        letterSpacing:".12em", textTransform:"uppercase", marginBottom:4,
      }}>◈ Your Behavioural Pattern Profile</p>
      <p style={{
        fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
        fontSize:14, color:PC_MUTED, marginBottom:18, lineHeight:1.6,
      }}>Derived from your 10 answers — not a label, but a map of how you naturally operate.</p>

      {/* 1 — Confidence score */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(255,255,255,0.025)",
        border:`1px solid ${PC_BORDER}`,
        borderRadius:10, padding:"10px 14px", marginBottom:14,
      }}>
        <div>
          <p style={{
            fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.45)",
            letterSpacing:".12em", textTransform:"uppercase", marginBottom:2,
          }}>Result confidence</p>
          <p style={{fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.5}}>
            {domLabel}
          </p>
        </div>
        <div style={{textAlign:"right", flexShrink:0}}>
          <p style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:36, letterSpacing:2, lineHeight:1, color:domColor,
          }}>{patterns.confidence}%</p>
          <p style={{fontSize:11, color:"rgba(255,255,255,0.40)", marginTop:2}}>
            of answers aligned
          </p>
        </div>
      </div>

      {/* 2 — Primary tendency */}
      <div style={{
        background:PC_CYAN_GLOW,
        border:`1px solid ${PC_CYAN_EDGE}`,
        borderLeft:`3px solid ${PC_CYAN_LINE}`,
        borderRadius:"0 12px 12px 0",
        padding:"14px 16px", marginBottom:10,
      }}>
        <p style={{
          fontSize:11, fontWeight:700, color:PC_BLUE,
          letterSpacing:".14em", textTransform:"uppercase", marginBottom:6,
        }}>Primary tendency — {primary.label}</p>
        <p style={{fontSize:15, color:PC_WHITE, fontWeight:600, marginBottom:6, lineHeight:1.5}}>
          {primary.summary}
        </p>
        <p style={{fontSize:14, color:PC_MUTED, lineHeight:1.75, marginBottom:8}}>
          {primary.tendency}
        </p>
        <p style={{fontSize:14, color:PC_GREEN_TX, fontWeight:500, lineHeight:1.6}}>
          Strength: {primary.strength}
        </p>
      </div>

      {/* 3 — Secondary tendency */}
      {secondary && secondary.label !== primary.label && (
        <div style={{
          background:"rgba(255,255,255,0.025)",
          border:`1px solid ${PC_BORDER}`,
          borderLeft:"3px solid rgba(255,255,255,0.2)",
          borderRadius:"0 12px 12px 0",
          padding:"12px 16px", marginBottom:14,
        }}>
          <p style={{
            fontSize:11, fontWeight:700, color:PC_DIMMED,
            letterSpacing:".14em", textTransform:"uppercase", marginBottom:4,
          }}>Secondary tendency — {secondary.label}</p>
          <p style={{fontSize:14, color:PC_MUTED, lineHeight:1.7}}>
            {secondary.summary}
          </p>
        </div>
      )}

      {/* 4 — Behavioural Balance */}
      {tension && (
        <div style={{
          background:PC_PURPLE_BG,
          border:`1px solid ${PC_PURPLE_BD}`,
          borderLeft:`3px solid ${PC_PURPLE_LN}`,
          borderRadius:"0 12px 12px 0",
          padding:"16px 18px", marginBottom:14,
        }}>
          <p style={{
            fontSize:11, fontWeight:700, color:PC_PURPLE,
            letterSpacing:".14em", textTransform:"uppercase", marginBottom:10,
          }}>⬡ Behavioural Balance</p>
          <p style={{fontSize:15, color:PC_WHITE, fontWeight:600, marginBottom:10, lineHeight:1.5}}>
            {tension.balance}
          </p>
          <p style={{fontSize:14, color:PC_MUTED, lineHeight:1.85, marginBottom:12}}>
            {tension.tension}
          </p>
          <div style={{
            background:"rgba(167,139,250,0.08)",
            border:"1px solid rgba(167,139,250,0.20)",
            borderRadius:8, padding:"10px 12px",
          }}>
            <p style={{
              fontSize:11, fontWeight:700,
              color:"rgba(167,139,250,0.80)",
              letterSpacing:".1em", textTransform:"uppercase", marginBottom:4,
            }}>Your edge</p>
            <p style={{fontSize:14, color:"rgba(255,255,255,0.82)", lineHeight:1.8}}>
              {tension.edge}
            </p>
          </div>
        </div>
      )}

      {/* 5 — Distribution bars */}
      <p style={{
        fontSize:11, fontWeight:700, color:PC_DIMMED,
        letterSpacing:".12em", textTransform:"uppercase", marginBottom:10,
      }}>How your answers distributed</p>
      {PC_BARS.map(b => {
        const count = patterns.counts[b.key] || 0;
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={b.key} style={{marginBottom:8}}>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
              <span style={{fontSize:13, color:PC_MUTED, fontWeight:600}}>{b.label}</span>
              <span style={{fontSize:12, color:b.color, fontWeight:700}}>{pct}%</span>
            </div>
            <div style={{
              height:5, background:"rgba(255,255,255,0.06)",
              borderRadius:100, overflow:"hidden",
            }}>
              <div style={{
                height:"100%", width:`${pct}%`,
                background:`linear-gradient(90deg,${b.color}88,${b.color})`,
                borderRadius:100, transition:"width .8s ease",
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}


// ── Shareable Card ────────────────────────────────────────────────────────
// Collapsed toggle in the report. Opens to a screenshottable archetype card
// containing confidence badge, behavioural balance, strength, blind spot,
// and lqmmethod.com link. Plus clipboard copy button.
// Zero backend. Pure client. All colours from module-level tokens above.
// ─────────────────────────────────────────────────────────────────────────
function ShareableCard({type, patterns}) {
  const [open,   setOpen]   = useState(false);
  const [copied, setCopied] = useState(false);

  const tension = patterns ? TENSION_NARRATIVES[patterns.tensionKey] : null;

  function copyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://lqmmethod.com").catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div style={{marginBottom:14}}>

      {/* Collapsed toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width:"100%",
          background: open ? PC_CYAN_GLOW : "rgba(255,255,255,0.03)",
          border:`1px solid ${open ? "rgba(0,200,255,0.40)" : PC_BORDER}`,
          borderRadius:12, padding:"14px 16px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif",
          transition:"all .2s",
        }}
      >
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <span style={{fontSize:16}}>⬡</span>
          <div style={{textAlign:"left"}}>
            <p style={{
              fontSize:13, fontWeight:700, color:PC_BLUE,
              letterSpacing:".04em", marginBottom:2,
            }}>Share Your Result</p>
            <p style={{fontSize:12, color:PC_DIMMED}}>
              Screenshot your archetype card or copy your link
            </p>
          </div>
        </div>
        <span style={{
          fontSize:12, color:PC_BLUE, fontWeight:700, flexShrink:0,
        }}>{open ? "↑ Close" : "Open →"}</span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{
          marginTop:8,
          background:"rgba(0,200,255,0.03)",
          border:"1px solid rgba(0,200,255,0.20)",
          borderRadius:14, padding:"16px",
          animation:"fadeUp .25s ease both",
        }}>
          <p style={{
            fontSize:12, fontWeight:700, color:PC_DIMMED,
            letterSpacing:".12em", textTransform:"uppercase",
            marginBottom:14, textAlign:"center",
          }}>Your shareable archetype card</p>

          {/* THE SCREENSHOT CARD */}
          <div style={{
            background:`linear-gradient(145deg,${PC_DARK2},${PC_DARK})`,
            border:`2px solid ${type.blue}55`,
            borderTop:`3px solid ${type.blue}`,
            borderRadius:16, padding:"22px", marginBottom:14,
          }}>

            {/* Brand row + confidence badge */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:16, paddingBottom:12,
              borderBottom:"1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:17, letterSpacing:3, color:PC_WHITE,
                }}>LQM</span>
                <span style={{
                  fontSize:10, fontWeight:700, color:PC_BLUE, letterSpacing:".1em",
                }}>BEHAVIOURAL INTELLIGENCE</span>
              </div>
              {patterns && (
                <div style={{
                  background:`${type.blue}15`,
                  border:`1px solid ${type.blue}33`,
                  borderRadius:100, padding:"3px 10px",
                  display:"flex", alignItems:"center", gap:4,
                }}>
                  <span style={{fontSize:13, fontWeight:700, color:type.blue}}>
                    {patterns.confidence}%
                  </span>
                  <span style={{
                    fontSize:9, color:"rgba(255,255,255,0.40)", letterSpacing:".06em",
                  }}>confidence</span>
                </div>
              )}
            </div>

            {/* Archetype identity */}
            <div style={{marginBottom:14}}>
              <p style={{
                fontSize:11, fontWeight:700, color:type.blue,
                letterSpacing:".16em", textTransform:"uppercase", marginBottom:4,
              }}>My archetype</p>
              <p style={{
                fontFamily:"'Bebas Neue',sans-serif",
                fontSize:26, letterSpacing:2, color:PC_WHITE,
                lineHeight:1, marginBottom:6,
              }}>{type.name}</p>
              <p style={{
                fontFamily:"'Crimson Pro',serif", fontStyle:"italic",
                fontSize:14, color:type.blue, lineHeight:1.5,
              }}>"{type.tag}"</p>
            </div>

            {/* Behavioural balance one-liner */}
            {tension && (
              <div style={{
                background:"rgba(255,255,255,0.04)",
                border:`1px solid ${PC_BORDER}`,
                borderRadius:8, padding:"10px 12px", marginBottom:12,
              }}>
                <p style={{
                  fontSize:10, fontWeight:700, color:PC_DIMMED,
                  letterSpacing:".1em", textTransform:"uppercase", marginBottom:3,
                }}>Behavioural balance</p>
                <p style={{fontSize:12, color:PC_WHITE, lineHeight:1.55}}>
                  {tension.balance}
                </p>
              </div>
            )}

            {/* Strength + blind spot */}
            <div style={{
              display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:8, marginBottom:14,
            }}>
              <div style={{
                background:`${type.blue}0a`,
                border:`1px solid ${type.blue}22`,
                borderRadius:8, padding:"8px 10px",
              }}>
                <p style={{
                  fontSize:10, fontWeight:700, color:type.blue,
                  letterSpacing:".1em", textTransform:"uppercase", marginBottom:3,
                }}>Strength</p>
                <p style={{fontSize:12, color:PC_WHITE, lineHeight:1.4}}>
                  {type.strengths[0]}
                </p>
              </div>
              <div style={{
                background:PC_AMBER_BG,
                border:`1px solid ${PC_AMBER_BD}`,
                borderRadius:8, padding:"8px 10px",
              }}>
                <p style={{
                  fontSize:10, fontWeight:700, color:PC_AMBER_TX,
                  letterSpacing:".1em", textTransform:"uppercase", marginBottom:3,
                }}>Blind spot</p>
                <p style={{fontSize:12, color:PC_WHITE, lineHeight:1.4}}>
                  {type.blindspots[0].split("—")[0].trim().split(",")[0]}
                </p>
              </div>
            </div>

            {/* Link footer */}
            <div style={{
              textAlign:"center",
              borderTop:"1px solid rgba(255,255,255,0.08)",
              paddingTop:12,
            }}>
              <p style={{fontSize:11, color:PC_DIMMED, marginBottom:2}}>
                Discover your archetype
              </p>
              <p style={{
                fontSize:14, fontWeight:700, color:PC_BLUE, letterSpacing:".04em",
              }}>lqmmethod.com</p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{display:"flex", gap:8, marginBottom:10}}>
            <button
              onClick={copyLink}
              style={{
                flex:1,
                background: copied ? "rgba(52,211,153,0.15)" : PC_CYAN_GLOW,
                border:`1px solid ${copied
                  ? "rgba(52,211,153,0.40)"
                  : "rgba(0,200,255,0.40)"}`,
                borderRadius:100, padding:"11px",
                fontSize:13, fontWeight:700,
                color: copied ? PC_TEAL_SUC : PC_BLUE,
                cursor:"pointer",
                fontFamily:"'Space Grotesk',sans-serif",
                transition:"all .2s",
              }}
            >{copied ? "✓ Link copied!" : "⬡ Copy lqmmethod.com"}</button>
            <div style={{
              flex:1, textAlign:"center",
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(255,255,255,0.12)",
              borderRadius:100, padding:"11px",
              fontSize:13, fontWeight:700, color:PC_DIMMED,
            }}>📱 Screenshot to share</div>
          </div>
          <p style={{fontSize:12, color:PC_DIMMED, textAlign:"center", lineHeight:1.65}}>
            Post on Instagram, TikTok, or send to someone who'd find this useful.
          </p>
        </div>
      )}
    </div>
  );
}

// CHANGE 8: Report accepts patterns prop
function Report({type, patterns, deliveryRef, deliveryTs, visualAnswer}){
  const visualInsights = {
    tree: {icon:"🌳",title:"Big Picture Processing",text:"You noticed the tree structure first, suggesting you naturally see systems, patterns, and the whole before individual elements. This big-picture processing style aligns with strategic thinking and systems design. You tend to step back and see the forest, not just the trees."},
    woman: {icon:"👤",title:"Detail-First Processing",text:"You noticed the woman's face first, suggesting you naturally focus on specific details, human elements, and individual components before seeing the larger pattern. This detail-oriented processing enhances your ability to spot nuances others miss and connect with people on a deeper level."},
    both: {icon:"⚖️",title:"Dual-Mode Processing",text:"You saw both the tree and the woman equally, suggesting flexible cognitive processing. You can shift between big-picture strategic thinking and detail-oriented analysis depending on what the situation requires. This adaptability is a significant strength."},
    neutral: {icon:"⚖️",title:"Balanced Processing",text:"Your visual processing shows balanced attention to both patterns and details. You can zoom in and zoom out as needed, giving you cognitive flexibility across different contexts."}
  };
  let visualInsight = null;
  if (visualAnswer) {
    const question11 = questions[10];
    const selectedOption = question11?.opts?.find(opt => opt.ty === visualAnswer);
    const visualType = selectedOption?.visual || "neutral";
    visualInsight = visualInsights[visualType];
  }
  return(
    <div style={{animation:"blurIn .8s ease both"}}>
      {deliveryRef && <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.25)",borderRadius:12,padding:"10px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><span style={{fontSize:14,color:"#34D399",flexShrink:0}}>✓</span><div style={{flex:1}}><p style={{fontSize:14,fontWeight:700,color:"#34D399",letterSpacing:".08em"}}>REPORT DELIVERED · {deliveryTs}</p><p style={{fontSize:16,color:"rgba(255,255,255,0.35)",fontFamily:"monospace",marginTop:2}}>Ref: {deliveryRef}</p></div><span style={{fontSize:16,color:"rgba(255,255,255,0.25)"}}>Screenshot for your records</span></div>}

      {/* CHANGE 10: ShareableCard after delivery bar */}
      <ShareableCard type={type} patterns={patterns}/>

      <div style={{background:`linear-gradient(145deg,${DARK2} 0%,${DARK} 100%)`,border:`1px solid ${type.blue}33`,borderRadius:20,padding:"40px 28px",textAlign:"center",marginBottom:14,boxShadow:`0 0 50px ${type.glow}`}}>
        <div style={{display:"inline-block",background:"rgba(0,200,255,0.08)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"5px 14px",fontSize:14,color:E_BLUE,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>⚡ Report Unlocked — For You Only</div>
        <Logo size="sm"/>
        <p style={{fontSize:16,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",fontWeight:600,marginTop:8,marginBottom:20}}>Behavioural Intelligence Report</p>
        <div style={{padding:"8px 0 16px"}}><ArchetypeIllustration type={Object.keys({A:1,B:2,C:3,D:4}).find(k=>TYPES[k]===type)||"A"}/></div>
        <div style={{fontSize:52,color:type.blue,marginBottom:10,textShadow:`0 0 30px ${type.blue}`}}>{type.sym}</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,48px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{type.name}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontStyle:"italic",color:type.blue}}>{type.arch}</p>
      </div>

      <Panel style={{borderLeft:`3px solid ${type.blue}`,borderRadius:"0 14px 14px 0",marginBottom:14,background:type.glow}}>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:21,fontStyle:"italic",color:WHITE,lineHeight:1.65}}>"{type.tag}"</p>
      </Panel>

      <Panel glow style={{marginBottom:14,textAlign:"center",background:`linear-gradient(135deg,${type.glow},rgba(0,0,0,0.2))`}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:type.blue,marginBottom:14}}>◈ Your Identity Statement</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:23,fontStyle:"italic",color:WHITE,lineHeight:1.65,marginBottom:12}}>"{type.identity}"</p>
        <p style={{fontSize:16,color:MUTED,fontWeight:300}}>Repeat this daily. Identity precedes behaviour. Behaviour compounds into results.</p>
      </Panel>

      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Profile Overview</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:18,lineHeight:1.9,color:"rgba(255,255,255,0.85)",fontWeight:300}}>{type.desc}</p>
      </Panel>

      <Panel style={{marginBottom:14,borderLeft:`3px solid ${E_BLUE}`,background:"rgba(0,200,255,0.04)"}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE,marginBottom:10}}>⚛ LQM Quantum Insight</p>
        <p style={{fontSize:16,lineHeight:1.85,color:"rgba(255,255,255,0.88)",fontWeight:400}}>{type.atomic}</p>
      </Panel>

      {/* CHANGE 11: BehaviouralPatternSection after Quantum Insight */}
      <BehaviouralPatternSection patterns={patterns}/>

      {visualInsight && (
        <Panel style={{marginBottom:14,borderLeft:`3px solid ${AMBER}`,background:"rgba(251,191,36,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><span style={{fontSize:24}}>{visualInsight.icon}</span><p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:AMBER}}>Visual Processing Style</p></div>
          <p style={{fontSize:17,fontWeight:600,color:WHITE,marginBottom:8}}>{visualInsight.title}</p>
          <p style={{fontSize:16,lineHeight:1.85,color:"rgba(255,255,255,0.88)",fontWeight:400}}>{visualInsight.text}</p>
        </Panel>
      )}

      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Core Strengths</SLabel>
        <StrengthBars strengths={type.strengths} color={type.blue}/>
      </Panel>

      <Panel style={{marginBottom:18}}>
        <SLabel color="rgba(255,180,50,0.9)">Blind Spots to Navigate</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED,lineHeight:1.6,marginBottom:16}}>These aren't weaknesses. They're patterns to recognise — awareness is the first step to transcendence.</p>
        {type.blindspots.map((b,i)=>(<BlindSpotCard key={i} text={b} index={i} color={type.blue}/>))}
      </Panel>

      <Panel style={{marginBottom:12}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.65}}>The following systems are built specifically for your behavioural profile. Read them as instructions written for you alone.</p>
      </Panel>

      {type.strategies.map((s,i)=>(
        <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${type.blue}`,borderRadius:16,overflow:"hidden",marginBottom:12}}>
          <div style={{background:type.glow,borderBottom:`1px solid ${type.blue}22`,padding:"14px 22px",display:"flex",alignItems:"center",gap:12}}><span style={{width:30,height:30,borderRadius:"50%",background:type.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:BG,fontWeight:800,flexShrink:0}}>{i+1}</span><p style={{fontSize:14,fontWeight:700,color:type.blue,letterSpacing:".08em",textTransform:"uppercase"}}>{s.area}</p></div>
          <div style={{background:`linear-gradient(90deg,${type.glow},transparent)`,borderBottom:`1px solid ${type.blue}11`,padding:"14px 22px",display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:36,height:36,borderRadius:10,background:`${type.glow}`,border:`1px solid ${type.blue}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{["⟁","◎","◈"][i]}</div><div><p style={{fontSize:16,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>The Scenario</p><p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,fontStyle:"italic",color:"rgba(255,255,255,0.82)",lineHeight:1.65}}>"{s.scenario}"</p></div></div>
          <div style={{padding:"18px 22px"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:20,height:20,borderRadius:"50%",background:type.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>→</div><p style={{fontSize:16,fontWeight:700,color:type.blue,letterSpacing:".1em",textTransform:"uppercase"}}>Your Quantum System</p></div><p style={{fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.78)",fontWeight:400}}>{s.solution}</p></div>
        </div>
      ))}

      <Panel style={{textAlign:"center",background:`linear-gradient(145deg,${DARK2},${DARK})`}}>
        <Logo size="sm"/>
        <div style={{width:50,height:1,background:`linear-gradient(90deg,transparent,${E_BLUE}44,transparent)`,margin:"18px auto"}}/>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:20,fontStyle:"italic",color:MUTED,lineHeight:1.75,maxWidth:420,margin:"0 auto 12px"}}>"Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle."</p>
        <p style={{fontSize:14,color:DIMMED,letterSpacing:".06em"}}>— The Learning Quantum Method</p>
        <div style={{height:1,background:BORDER2,margin:"18px 0"}}/>
        <p style={{fontSize:14,color:DIMMED,letterSpacing:".1em"}}>LQM Behavioural Intelligence Report · {type.name}</p>
      </Panel>
    </div>
  );
}
