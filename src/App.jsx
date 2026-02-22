import { useState, useEffect, useRef } from "react";
import BrainTraining from "./BrainTraining.jsx";
import QuantumLiving from "./QuantumLiving.jsx";

// ── Stripe Payment Links ───────────────────────────────────────────────────
const STRIPE_MAIN    = "https://buy.stripe.com/00w8wR50Xber8VZfkka3u00"; // £9 main report
const STRIPE_BRAIN   = "https://buy.stripe.com/8x2eVfgJF4Q37RVb44a3u02";      // £5 Brain Training
const STRIPE_VITAL   = "https://buy.stripe.com/eVq5kF651gyLgorc88a3u03";      // £5 Quantum Living

// ── Unlock helpers (localStorage simulates post-payment state) ────────────
function getUnlocks() {
  try { return JSON.parse(localStorage.getItem("lqm_unlocks")||"{}"); } catch { return {}; }
}
function setUnlock(key) {
  const u = getUnlocks(); u[key]=true;
  localStorage.setItem("lqm_unlocks", JSON.stringify(u));
}


const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;

// ── Palette — softer, more breathable dark ────────────────────────────────────
const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const E_GLOW  = "rgba(0,200,255,0.15)";
const BG      = "#070F1E";          // softer than pure black
const DARK    = "#0D1830";          // panels/cards
const DARK2   = "#111E38";          // elevated surfaces
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.62)";
const DIMMED  = "rgba(255,255,255,0.32)";
const AMBER   = "#FBBF24";             // amber/gold accent colour
const GREEN   = "#22C55E";             // green accent colour
const PURPLE  = "#A855F7";             // purple accent colour
const SYMS    = ["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];

// ── Archetype SVG Illustrations ───────────────────────────────────────────────
function ArchetypeIllustration({ type: t }) {
  const ARCH_COLORS = {A:"#00C8FF", B:"#38BDF8", C:"#34D399", D:"#A78BFA"};
  const c = ARCH_COLORS[t] || "#00C8FF";
  const r1Ref = useRef(null);
  const r2Ref = useRef(null);
  const r3Ref = useRef(null);
  const frameRef = useRef(null);
  const anglesRef = useRef({a1:0, a2:0, a3:45});

  useEffect(()=>{
    function tick(){
      anglesRef.current.a1 = (anglesRef.current.a1 + 0.4) % 360;
      anglesRef.current.a2 = (anglesRef.current.a2 - 0.25 + 360) % 360;
      anglesRef.current.a3 = (anglesRef.current.a3 + 0.7) % 360;
      if(r1Ref.current) r1Ref.current.setAttribute("transform", `rotate(${anglesRef.current.a1} 100 70)`);
      if(r2Ref.current) r2Ref.current.setAttribute("transform", `rotate(${anglesRef.current.a2} 100 70)`);
      if(r3Ref.current) r3Ref.current.setAttribute("transform", `rotate(${anglesRef.current.a3} 100 70)`);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const id = `ag${t}`;
  return (
    <svg viewBox="0 0 200 140" style={{width:"100%",maxWidth:340,display:"block",margin:"0 auto"}}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Glow */}
      <ellipse cx="100" cy="70" rx="55" ry="45" fill={`url(#${id})`} opacity="0.8"/>

      {/* Grid */}
      {[35,65,100,135,165].map(x=><line key={`v${x}`} x1={x} y1="15" x2={x} y2="125" stroke={c} strokeWidth="0.3" opacity="0.15"/>)}
      {[25,50,70,90,115].map(y=><line key={`h${y}`} x1="15" y1={y} x2="185" y2={y} stroke={c} strokeWidth="0.3" opacity="0.15"/>)}

      {/* Corner dots */}
      {[[18,18],[182,18],[18,122],[182,122]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.5" fill={c} opacity="0.5"/>
      ))}

      {/* Outer static ring */}
      <circle cx="100" cy="70" r="50" fill="none" stroke={c} strokeWidth="0.4" opacity="0.2"/>

      {/* RING 1 — slow clockwise */}
      <g ref={r1Ref}>
        <circle cx="100" cy="70" r="40" fill="none" stroke="white" strokeWidth="1.2" strokeDasharray="42 22" opacity="0.4"/>
        <circle cx="100" cy="30" r="4" fill="white" opacity="0.85"/>
        <circle cx="140" cy="70" r="2.5" fill="white" opacity="0.6"/>
      </g>

      {/* RING 2 — counter-clockwise */}
      <g ref={r2Ref}>
        <circle cx="100" cy="70" r="28" fill="none" stroke="white" strokeWidth="1" strokeDasharray="28 18" opacity="0.5"/>
        <circle cx="100" cy="42" r="3.5" fill="white" opacity="0.9"/>
        <circle cx="72" cy="70" r="2.5" fill={c} opacity="0.9"/>
      </g>

      {/* RING 3 — fast */}
      <g ref={r3Ref}>
        <circle cx="100" cy="70" r="16" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="18 12" opacity="0.6"/>
        <circle cx="100" cy="54" r="3" fill={c} opacity="1"/>
      </g>

      {/* Axis */}
      <line x1="100" y1="22" x2="100" y2="118" stroke={c} strokeWidth="0.6" opacity="0.25"/>
      <line x1="52" y1="70" x2="148" y2="70" stroke={c} strokeWidth="0.6" opacity="0.25"/>

      {/* Core */}
      <circle cx="100" cy="70" r="9" fill={c} opacity="0.2"/>
      <circle cx="100" cy="70" r="5.5" fill={c} opacity="0.6"/>
      <circle cx="100" cy="70" r="2.5" fill="white" opacity="1"/>
    </svg>
  );
}
function getUnlocks() {
  try { return JSON.parse(localStorage.getItem("lqm_unlocks")||"{}"); } catch { return {}; }
}
function setUnlock(key) {
  const u = getUnlocks(); u[key]=true;
  localStorage.setItem("lqm_unlocks", JSON.stringify(u));
}


const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;

// ── Palette — softer, more breathable dark ────────────────────────────────────
const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const E_GLOW  = "rgba(0,200,255,0.15)";
const BG      = "#070F1E";          // softer than pure black
const DARK    = "#0D1830";          // panels/cards
const DARK2   = "#111E38";          // elevated surfaces
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.62)";
const DIMMED  = "rgba(255,255,255,0.32)";
const AMBER   = "#FBBF24";             // amber/gold accent colour
const GREEN   = "#22C55E";             // green accent colour
const PURPLE  = "#A855F7";             // purple accent colour
const SYMS    = ["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];

// ── Archetype SVG Illustrations ───────────────────────────────────────────────
function getUnlocks() {
  try { return JSON.parse(localStorage.getItem("lqm_unlocks")||"{}"); } catch { return {}; }
}
function setUnlock(key) {
  const u = getUnlocks(); u[key]=true;
  localStorage.setItem("lqm_unlocks", JSON.stringify(u));
}


const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;

// ── Palette — softer, more breathable dark ────────────────────────────────────
const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const E_GLOW  = "rgba(0,200,255,0.15)";
const BG      = "#070F1E";          // softer than pure black
const DARK    = "#0D1830";          // panels/cards
const DARK2   = "#111E38";          // elevated surfaces
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.62)";
const DIMMED  = "rgba(255,255,255,0.32)";
const AMBER   = "#FBBF24";             // amber/gold accent colour
const GREEN   = "#22C55E";             // green accent colour
const PURPLE  = "#A855F7";             // purple accent colour
const SYMS    = ["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];

// ── Archetype SVG Illustrations ───────────────────────────────────────────────

function StrengthBars({ strengths, color }) {
  const widths = [95, 88, 82, 76];
  return (
    <div style={{ marginTop: 8 }}>
      {strengths.map((s, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{s}</span>
            <span style={{ fontSize: 11, color, fontWeight: 700 }}>{widths[i]}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${widths[i]}%`, background: `linear-gradient(90deg,${color}88,${color})`, borderRadius: 100, boxShadow: `0 0 8px ${color}66` }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Blind Spot Visual Card ─────────────────────────────────────────────────────
function BlindSpotCard({ text, index, color }) {
  const icons = ["⚠", "◎", "△"];
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 18px", background: "rgba(255,160,40,0.06)", border: "1px solid rgba(255,160,40,0.2)", borderRadius: 12, marginBottom: 10, borderLeft: "3px solid rgba(255,160,40,0.5)" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,160,40,0.12)", border: "1px solid rgba(255,160,40,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
        {icons[index]}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,200,80,0.95)", lineHeight: 1.5, marginBottom: 2 }}>{text}</p>
        <p style={{ fontSize: 12, color: "rgba(255,200,80,0.5)", fontWeight: 400 }}>Awareness is the first step to navigation</p>
      </div>
    </div>
  );
}

// ── Questions ──────────────────────────────────────────────────────────────────
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
  A:{sym:"◈",name:"The Systems Architect",arch:"Identity: The Builder",tag:"You don't chase motivation. You engineer it.",hook:"Most people try to motivate themselves. You build systems that make motivation irrelevant.",desc:"Your psychology is wired for precision and process. While others rely on willpower — a depleting resource — you understand intuitively what the Learning Quantum Method has proven through years of behavioural research: sustainable performance follows systems, not intentions. Your quantum edge is the ability to translate ambition into repeatable, compounding architecture. Small compounding improvements add up to extraordinary results. You know this. The question is whether your system is designed for the right identity.",identity:"I am someone who builds systems that work even when I don't feel like it.",atomic:"Your quantum stack needs auditing, not expanding. You likely have good systems — but they may be optimised for the wrong outputs. Identify the ONE behaviour that, if repeated daily, would make everything else easier or unnecessary.",strengths:["Systems Design","Execution Consistency","Long-Horizon Thinking","Process Optimisation"],blindspots:["Can mistake motion for progress — busyness masquerading as output","Perfectionism delays launch — the system must be perfect before it begins","May optimise the wrong thing efficiently — precision without direction"],strategies:[{area:"The Quantum Increment",scenario:"I delay starting when the outcome feels uncertain or the project feels too large.",solution:"Shrink the action until it feels almost embarrassingly small. The goal isn't to write a chapter — it's to open the document. Identity is built by showing up, not by performing. Every small act of showing up is a vote for the person you're becoming."},{area:"Motivation Architecture",scenario:"My drive fluctuates week to week, making long-term projects unreliable.",solution:"Design your environment before you design your schedule. Make the desired behaviour the path of least resistance. Remove friction from what you want to do. Add friction to what you want to stop. Motivation follows the path you've already cleared."},{area:"The Identity Shift",scenario:"I feel frustrated when results don't match effort — I'm doing everything right but it's not working.",solution:"Ask not 'what do I want to achieve?' but 'who do I need to become?' Rewrite your daily actions as identity statements: 'I am someone who reviews progress every Friday.' Outcomes are lagging measures of identity. Build the identity first."}],blue:"#00C8FF",glow:"rgba(0,200,255,0.1)"},
  B:{sym:"◉",name:"The Deep Learner",arch:"Identity: The Scholar",tag:"Your curiosity is a compounding asset.",hook:"Shallow knowledge is everywhere. What you build goes three levels deeper than anyone else in the room.",desc:"You are driven by a rare and powerful force: the need to truly understand. Not surface knowledge — genuine comprehension. This is the foundation of expertise, and expertise is the foundation of irreplaceable value. The LQM research confirms what you feel intuitively: deep work produces disproportionate results. Your challenge isn't capacity — it's converting accumulated understanding into decisive, visible action.",identity:"I am someone who turns deep understanding into decisive, courageous action.",atomic:"Knowledge without deployment is stored potential. Your quantum stack needs a 'publish' step — a regular moment where you translate internal understanding into external output, however imperfect.",strengths:["Intellectual Depth","Pattern Recognition","Mastery Orientation","Analytical Precision"],blindspots:["Analysis paralysis — research becomes a substitute for action","'Not ready yet' as avoidance — readiness is a feeling, not a fact","Over-invests in understanding, under-invests in the doing"],strategies:[{area:"The 70% Threshold",scenario:"I over-research and delay acting until I feel truly ready — which rarely comes.",solution:"Set a decision threshold: when you have 70% of the information you want, act. Treat the remaining 30% as field research — data you can only gather by doing. Action is the most advanced form of learning available to you."},{area:"Complexity as Motivation",scenario:"Repetitive or routine tasks drain me rapidly — I lose interest and disengage.",solution:"Find the hidden variable. In every routine task, there is one dimension you could optimise. Make the question 'how could I do this 10% more intelligently?' your daily prompt. Turn execution into experimentation."},{area:"The Output Practice",scenario:"I accumulate knowledge but struggle to show my work or share my thinking.",solution:"Build a weekly 'output ritual' — one piece of thinking made visible. A note, a voice memo, a conversation where you teach what you've learned. The act of explaining is the act of understanding at depth."}],blue:"#38BDF8",glow:"rgba(56,189,248,0.1)"},
  C:{sym:"◎",name:"The Relational Catalyst",arch:"Identity: The Connector",tag:"You make everything — and everyone — better.",hook:"While others optimise for outputs, you understand the lever that moves everything: people.",desc:"Your motivation is relational at its core. You are energised by shared purpose, activated by belonging, and sustained by the knowledge that your effort matters to real people. LQM research consistently shows that social commitment is one of the most powerful forces in behaviour change. Your quantum leap is learning to channel this relational fuel into your own consistent growth — not just the growth of those around you.",identity:"I am someone who builds relationships that hold me accountable to my own growth.",atomic:"Your quantum stack needs a social architecture layer. Every major goal should have one human being attached to it — someone who benefits from your success, or to whom you've made a commitment. Accountability is your performance-enhancing mechanism.",strengths:["Emotional Intelligence","Trust-Building","Authentic Leadership","Sustained Effort Under Commitment"],blindspots:["Loses personal direction without external anchors — others' goals become your own","Avoids necessary conflict — keeps the peace at the cost of progress","Absorbs others' energy — their demotivation can become yours"],strategies:[{area:"The Relational Goal Stack",scenario:"I lose motivation when working in isolation — the drive evaporates without connection.",solution:"Attach every personal goal to a specific person. Write: 'Achieving this allows me to show up better for [name] because [reason].' Share it with them. You have just created the most powerful motivational force in your psychology."},{area:"The Morning Anchor",scenario:"I absorb the emotional weather of those around me — their demotivation becomes mine.",solution:"Create a 10-minute pre-contact ritual each morning before interacting with anyone. Write three intentions. This builds an internal foundation that external moods cannot destabilise. Your identity precedes their influence."},{area:"The Accountability Architecture",scenario:"I need external commitment to sustain effort — and feel this is a weakness.",solution:"It isn't a weakness — it's a feature. Formalise it. Identify one person for a weekly check-in: one win, one struggle, one commitment. You're not removing the need for connection. You're building it intelligently into your growth system."}],blue:"#34D399",glow:"rgba(52,211,153,0.1)"},
  D:{sym:"◇",name:"The Visionary Pioneer",arch:"Identity: The Creator",tag:"You don't follow the map. You draw it.",hook:"Every framework, every system, every method you've ever used — someone like you invented it first.",desc:"You are driven by possibility. You think in futures that don't exist yet. Your motivation comes from creative autonomy, the thrill of the blank canvas, and the deep satisfaction of making something that carries your fingerprint. The LQM research on intrinsic motivation is clear: autonomy, mastery, and purpose are the triumvirate. You have all three in abundance. Your challenge is not creativity — it's building just enough structure to bring your vision fully across the finish line.",identity:"I am someone who brings bold visions into the world with enough structure to complete them.",atomic:"Your quantum stack needs a completion mechanism. You likely have strong starting rituals. Build equally strong finishing rituals — a defined moment where you declare a project 'shipped' and begin the next creative act.",strengths:["Original Thinking","Intrinsic Drive","Bold Risk Tolerance","Inspiring Through Vision"],blindspots:["Motivation drops after the initial spark — the build phase feels less alive","Too many projects open, too few completed — beginnings are exciting, endings are work","Structure feels like a cage — but without it, the vision never fully lands"],strategies:[{area:"The Evolution Frame",scenario:"My motivation collapses once the exciting creation phase ends and execution begins.",solution:"Reframe completion as the beginning of the next creative act, not the death of this one. Keep an 'Evolution Log' — a live document tracking how your project is changing and improving. The project is never finished. It is always becoming."},{area:"The One Brilliant Thing",scenario:"I scatter energy across multiple ideas simultaneously and make shallow progress on all of them.",solution:"Each week, identify the single most important creative act. Protect 90 uninterrupted minutes for it — first, before anything else. Everything else is secondary until that window is honoured. Constraint creates the conditions for your best work."},{area:"The Separation Protocol",scenario:"My output never matches my internal vision and this gap demotivates me deeply.",solution:"Separate creation from evaluation entirely. During making: no judgement allowed. Schedule a 'critical review' 24 hours after completion with fresh eyes. The inner critic and the inner creator cannot occupy the same creative moment."}],blue:"#A78BFA",glow:"rgba(167,139,250,0.1)"},
};

const ORIGINAL = 27, DISCOUNTED = 9, TIMER_SECS = 15 * 60;

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
  const [activeView,setActiveView]=useState("hub"); // hub, report, addon-shop
  const [unlocks,setUnlocks]=useState(getUnlocks);
  const [showDeliveryGate,setShowDeliveryGate]=useState(false);
  const [deliveryRef,setDeliveryRef]=useState(null);
  const [deliveryTs,setDeliveryTs]=useState(null);
  const timerRef=useRef(null);

  function generateDeliveryRef(){
    const ref="LQM-"+new Date().getFullYear()+"-"+Math.random().toString(36).substring(2,10).toUpperCase();
    const ts=new Date().toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
    setDeliveryRef(ref); setDeliveryTs(ts);
    localStorage.setItem("lqm_delivery",JSON.stringify({ref,ts,confirmed:false}));
    setShowDeliveryGate(true);
  }
  function confirmDelivery(){
    const stored=JSON.parse(localStorage.getItem("lqm_delivery")||"{}");
    localStorage.setItem("lqm_delivery",JSON.stringify({...stored,confirmed:true}));
    setShowDeliveryGate(false);
  }

  // Check localStorage on mount - if delivery data exists, skip to paid phase
  useEffect(()=>{
    const delivery = localStorage.getItem("lqm_delivery");
    const unlocks = getUnlocks();
    if(delivery && phase==="landing"){
      // User has already unlocked - show them the report
      // We need to simulate completing the quiz first
      const testAnswers = ["A","B","A","C","D","A","B","C","D","A"];
      setAnswers(testAnswers);
      setCharType(calcType(testAnswers));
      setPhase("paid");
      const deliveryData = JSON.parse(delivery);
      setDeliveryRef(deliveryData.ref);
      setDeliveryTs(deliveryData.ts);
    }
  },[]);

  function handleUnlockAddon(key) {
    setUnlock(key);
    setUnlocks(getUnlocks());
    setActiveAddon(key);
  }

  // Test mode - auto-unlock everything if ?test=true in URL
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    if(params.get('test')==='true'){
      // Unlock main report
      if(!localStorage.getItem('lqm_delivery')){
        localStorage.setItem('lqm_delivery',JSON.stringify({ref:'LQM-2026-TEST'+Math.random().toString(36).substring(2,8).toUpperCase(),ts:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),confirmed:true}));
      }
      // Unlock both add-ons
      localStorage.setItem('lqm_unlocks',JSON.stringify({neural:true,vital:true}));
      // Set to paid phase
      if(charType && phase==='teaser'){
        setPhase('paid');
      }
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
      .fu{animation:fadeUp .6s ease both;}
      .fu1{animation:fadeUp .6s .1s ease both;}
      .fu2{animation:fadeUp .6s .22s ease both;}
      .fu3{animation:fadeUp .6s .36s ease both;}
      .fu4{animation:fadeUp .6s .5s ease both;}
      .fu5{animation:fadeUp .6s .65s ease both;}
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

  const handleNext=()=>{
    if(!sel)return;
    const a=[...answers,sel];setAnswers(a);setSel(null);
    if(qIdx<questions.length-1){setQIdx(qIdx+1);}
    else{setCharType(calcType(a));setPhase("processing");let st=0;const iv=setInterval(()=>{st++;setProcStep(st);if(st>=5){clearInterval(iv);setTimeout(()=>setPhase("teaser"),600);}},850);}
  };

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 90% 45% at 50% -5%,rgba(0,200,255,0.06) 0%,transparent 65%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 80px",position:"relative",overflow:"hidden"}}>
      <Particles/>

      {/* ── Active Add-on views ── */}
      {activeAddon==="neural" && unlocks.neural && <BrainTraining archetype={charType} onBack={()=>setActiveAddon(null)}/>}
      {activeAddon==="vital"  && unlocks.vital  && <QuantumLiving  archetype={charType} onBack={()=>setActiveAddon(null)}/>}

      {/* ── Main app ── */}
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
          {!showLegal && phase==="landing"    && <Landing onStart={()=>{setTimerOn(true);setPhase("quiz");}} t={timeLeft} fmt={fmt}/>}
          {!showLegal && phase==="quiz"       && <Quiz q={questions[qIdx]} idx={qIdx} sel={sel} onSel={setSel} onNext={handleNext} t={timeLeft} fmt={fmt}/>}
          {!showLegal && phase==="processing" && <Processing step={procStep}/>}
          {!showLegal && phase==="teaser"     && <Teaser type={TYPES[charType]} t={timeLeft} fmt={fmt} onUnlock={()=>{ generateDeliveryRef(); window.open(STRIPE_MAIN,"_blank"); }}/>}
          {!showLegal && phase==="paid"       && <>
            {showDeliveryGate && <DeliveryGate ref_={deliveryRef} ts={deliveryTs} type={TYPES[charType]} onConfirm={confirmDelivery}/>}
            {!showDeliveryGate && <>
              {activeView==="hub"      && <Hub type={TYPES[charType]} unlocks={unlocks} onOpenNeural={()=>setActiveAddon("neural")} onOpenVital={()=>setActiveAddon("vital")} onViewReport={()=>setActiveView("report")} onUnlockNeural={()=>window.open(STRIPE_BRAIN,"_blank")} onUnlockVital={()=>window.open(STRIPE_VITAL,"_blank")} onSimulateNeural={()=>handleUnlockAddon("neural")} onSimulateVital={()=>handleUnlockAddon("vital")}/>}
              {activeView==="report"   && <><Report type={TYPES[charType]} deliveryRef={deliveryRef} deliveryTs={deliveryTs} visualAnswer={answers[10]}/><button onClick={()=>setActiveView("hub")} style={{width:"100%",marginTop:16,border:`1px solid ${BORDER}`,borderRadius:100,padding:"13px",fontSize:14,fontWeight:700,background:"rgba(255,255,255,0.03)",color:MUTED,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}}>← Back to My Hub</button></>}
            </>}
          </>}
        </div>
        {!showLegal && <Footer onShowLegal={setShowLegal}/>}
      </>}
    </div>
  );
}

function Logo({size="md"}){
  const sc=size==="sm"?.58:size==="lg"?1.25:1;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <div style={{position:"relative",display:"inline-block"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52*sc,letterSpacing:3*sc,color:WHITE,lineHeight:1,textShadow:`0 0 28px ${E_BLUE}44`}}>LQM</span>
        <span style={{position:"absolute",top:-7*sc,right:-4*sc,fontSize:15*sc,color:E_BLUE,animation:"glow 2.5s ease-in-out infinite"}}>⚡</span>
        <svg style={{position:"absolute",bottom:-3*sc,left:0,width:"100%"}} height={5*sc} viewBox="0 0 160 5">
          <path d="M28 4 Q80 1 132 4" stroke={E_BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".55"/>
        </svg>
      </div>
      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:8*sc,fontWeight:600,letterSpacing:.2*sc+"em",color:"rgba(0,200,255,0.5)",textTransform:"uppercase",marginTop:3*sc}}>Learning Quantum Method</p>
    </div>
  );
}

function TimerBadge({t,fmt}){
  const urgent=t<180;
  return(
    <div className={urgent?"urgent":""} style={{display:"inline-flex",alignItems:"center",gap:8,background:urgent?"rgba(255,60,60,0.08)":"rgba(0,200,255,0.06)",border:`1px solid ${urgent?"rgba(255,60,60,0.35)":BORDER}`,borderRadius:100,padding:"6px 16px",fontSize:15,fontWeight:600,letterSpacing:".06em",color:urgent?"#FF6B6B":E_BLUE}}>
      <span>⚡</span>{t>0?`Offer expires ${fmt(t)}`:"Offer expired"}
    </div>
  );
}

function Panel({children,style={},glow=false}){
  return(
    <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"26px",boxShadow:glow?`0 0 40px ${E_GLOW}`:"none",...style}}>
      {children}
    </div>
  );
}

function SLabel({children,color=E_BLUE}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color,whiteSpace:"nowrap"}}>{children}</p>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}44,transparent)`}}/>
    </div>
  );
}

function PrimaryBtn({onClick,children}){
  return(
    <button onClick={onClick} style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",transition:"all .2s ease",display:"block",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,boxShadow:`0 6px 24px rgba(0,200,255,0.22)`}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 36px rgba(0,200,255,0.38)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,200,255,0.22)`;}}>
      {children}
    </button>
  );
}

function Footer({onShowLegal}){
  function activateTestMode(){
    // Unlock main report
    localStorage.setItem('lqm_delivery',JSON.stringify({
      ref:'LQM-2026-TEST'+Math.random().toString(36).substring(2,8).toUpperCase(),
      ts:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),
      confirmed:true
    }));
    // Unlock both add-ons
    localStorage.setItem('lqm_unlocks',JSON.stringify({neural:true,vital:true}));
    alert('✓ TEST MODE ACTIVATED\n\nAll features unlocked!\n\nClick OK then refresh the page (F5) to see everything.');
  }
  
  return(
    <div style={{width:"100%",maxWidth:680,marginTop:60,paddingTop:24,borderTop:`1px solid ${BORDER2}`,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>onShowLegal("privacy")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Privacy Policy</button>
        <button onClick={()=>onShowLegal("terms")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Terms & Conditions</button>
      </div>
      <p style={{fontSize:14,color:DIMMED,textAlign:"center"}}>© 2026 Learning Quantum Method. All rights reserved.</p>
      <p style={{fontSize:16,color:DIMMED,textAlign:"center",maxWidth:500,lineHeight:1.5}}>For questions or support: <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE,textDecoration:"none"}}>lqm@lqmmethod.com</a></p>
      
      {/* TEST MODE BUTTON - Remove before public launch */}
      <button onClick={activateTestMode} style={{marginTop:16,background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:8,padding:'10px 20px',color:'#FBBF24',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif"}}>
        🔧 TEST MODE — Unlock All Features
      </button>
    </div>
  );
}

function LegalPage({type,onClose}){
  const content = type==="privacy" ? PRIVACY_TEXT : TERMS_TEXT;
  return(
    <div style={{animation:"fadeUp .5s ease both"}}>
      <button onClick={onClose} style={{marginBottom:20,background:"none",border:`1px solid ${BORDER}`,borderRadius:100,padding:"10px 20px",color:WHITE,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.borderColor=E_BLUE} onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
        ← Back
      </button>
      <Panel style={{maxWidth:680}}>
        <div style={{fontFamily:"'Crimson Pro',serif",fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.85)"}} dangerouslySetInnerHTML={{__html:content}}/>
      </Panel>
    </div>
  );
}

const PRIVACY_TEXT=`<h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#00C8FF;margin-bottom:8px;letter-spacing:2px">Privacy Policy</h1><p style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:32px">Last updated: 21 February 2026</p><p style="margin-bottom:20px"><strong>Learning Quantum Method (LQM)</strong> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">1. Who We Are</h2><p style="margin-bottom:12px"><strong>Business name:</strong> Learning Quantum Method (LQM)<br/><strong>Contact email:</strong> lqm@lqmmethod.com<br/><strong>Website:</strong> https://lqm-assessment.vercel.app</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">2. What Information We Collect</h2><p style="margin-bottom:12px"><strong>Information you provide:</strong> Name, email address when you purchase<br/><strong>Payment information:</strong> Processed securely by Stripe (we never see card details)<br/><strong>Quiz responses:</strong> Stored temporarily in your browser to generate your report<br/><strong>We do NOT collect:</strong> Sensitive data, children's data, or marketing preferences without consent</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">3. How We Use Your Information</h2><p style="margin-bottom:12px">We use your information to:<br/>• Deliver your purchased report<br/>• Process payments via Stripe<br/>• Provide customer support<br/>• Improve our service</p><p style="margin-bottom:12px"><strong>Legal basis (UK GDPR):</strong> Contract performance and legitimate interests</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">4. How We Share Your Information</h2><p style="margin-bottom:12px">We share your data ONLY with <strong>Stripe</strong> (our payment processor) to process payments.<br/>Stripe privacy policy: <a href="https://stripe.com/gb/privacy" style="color:#00C8FF">stripe.com/gb/privacy</a></p><p style="margin-bottom:12px"><strong>We do NOT:</strong> Sell your data, use it for advertising, or share quiz responses</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">5. How Long We Keep Your Data</h2><p style="margin-bottom:12px">• Purchase records: 7 years (UK tax law requirement)<br/>• Quiz responses: Deleted after report generation<br/>• Browser session: Cleared when you close browser</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">6. Your Rights Under UK GDPR</h2><p style="margin-bottom:12px">You have the right to:<br/>• <strong>Access</strong> your data<br/>• <strong>Rectify</strong> inaccurate information<br/>• <strong>Erase</strong> your data (subject to legal requirements)<br/>• <strong>Restrict</strong> processing<br/>• <strong>Data portability</strong><br/>• <strong>Object</strong> to processing</p><p style="margin-bottom:12px">Email <strong>lqm@lqmmethod.com</strong> to exercise these rights. We respond within 30 days.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">7. How We Protect Your Data</h2><p style="margin-bottom:12px">• All payments encrypted by Stripe<br/>• HTTPS encryption on our website<br/>• Limited data access<br/>• We never store card details</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">8. Cookies</h2><p style="margin-bottom:12px">We use only essential session cookies for the quiz to function. No tracking cookies.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">9. Contact Us</h2><p style="margin-bottom:12px">Questions? Email <strong>lqm@lqmmethod.com</strong></p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">10. Complaints</h2><p style="margin-bottom:12px">You can complain to the UK Information Commissioner's Office (ICO):<br/>Website: <a href="https://ico.org.uk/make-a-complaint/" style="color:#00C8FF">ico.org.uk/make-a-complaint</a><br/>Phone: 0303 123 1113</p>`;

const TERMS_TEXT=`<h1 style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:#00C8FF;margin-bottom:8px;letter-spacing:2px">Terms & Conditions</h1><p style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:32px">Last updated: 21 February 2026</p><p style="margin-bottom:20px">By using our website and purchasing our report, you agree to these terms.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">1. The Service</h2><p style="margin-bottom:12px"><strong>What you receive:</strong> An 11-question behavioural quiz (10 core questions + 1 visual bonus question) and personalised LQM report with your archetype, identity statement, strengths, blind spots, and 3 strategy cards.</p><p style="margin-bottom:12px"><strong>Optional add-ons:</strong> Brain Training (6 cognitive challenges with 21-day transformation tracking) and Quantum Living (5 wellness laws with 21-day journey tracking), each £5.00.</p><p style="margin-bottom:12px"><strong>What this is NOT:</strong> Professional counselling, medical advice, or employment screening.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">2. Pricing & Payment</h2><p style="margin-bottom:12px">• Main report: £9.00<br/>• Brain Training add-on: £5.00<br/>• Quantum Living add-on: £5.00<br/>• Payment via Stripe<br/>• One-time payments (no subscriptions)<br/>• Prices may change at any time</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">3. Delivery & Confirmation</h2><p style="margin-bottom:12px">Your report is delivered <strong>instantly on screen</strong> after payment. You will be shown a <strong>Delivery Confirmation Screen</strong> with a unique reference number and timestamp <strong>BEFORE</strong> viewing your report.</p><p style="margin-bottom:12px"><strong>You must confirm receipt</strong> by clicking "I Confirm Receipt" to access your report. This confirmation serves as proof of delivery and creates an audit trail showing you received the digital product.</p><p style="margin-bottom:12px"><strong>Important:</strong> Save or screenshot your report and the delivery reference immediately. No email delivery is provided. The delivery reference number appears at the top of your report for your records.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">4. Refund Policy</h2><p style="margin-bottom:12px"><strong>7-day money-back guarantee.</strong><br/>Email <strong>lqm@lqmmethod.com</strong> within 7 days if dissatisfied. Include your delivery reference number. Refunds processed within 5-7 business days.</p><p style="margin-bottom:12px"><strong>No refunds will be issued if:</strong></p><p style="margin-bottom:12px">• You confirmed receipt via the Delivery Confirmation Screen and then claim you "never received" the report<br/>• You already saved, screenshot, or downloaded your report<br/>• You simply changed your mind after reading the full report<br/>• 7 days have passed since purchase</p><p style="margin-bottom:12px"><strong>Audit trail:</strong> Your delivery confirmation (reference number, timestamp, and confirmation click) serves as proof of delivery. Fraudulent refund requests will be declined.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">5. Intellectual Property</h2><p style="margin-bottom:12px">All LQM content, including the quiz, reports, Brain Training challenges, Quantum Living laws, and all associated materials, are copyrighted by Learning Quantum Method.</p><p style="margin-bottom:12px"><strong>You CAN:</strong> Use your report personally, share insights with friends<br/><strong>You CANNOT:</strong> Republish commercially, resell, redistribute, or create competing products based on LQM content</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">6. Disclaimer</h2><p style="margin-bottom:12px">The report is for <strong>educational and informational purposes only</strong>. We do not guarantee specific results, outcomes, or behavioural changes. You are responsible for your own decisions and actions.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">7. Limitation of Liability</h2><p style="margin-bottom:12px">Our maximum liability for any claim related to your purchase is limited to the amount you paid (£9.00 for the main report, or the amount paid for add-ons).</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">8. Age Restriction</h2><p style="margin-bottom:12px">You must be 18 years or older to purchase.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">9. Digital Product Nature</h2><p style="margin-bottom:12px">This is a <strong>digital product delivered instantly on screen</strong>. By confirming receipt via the Delivery Confirmation Screen, you acknowledge that:<br/>• You have received the complete digital product<br/>• The delivery is complete and satisfactory<br/>• You understand this creates a binding audit trail<br/>• The standard 14-day cooling-off period for digital content does not apply once you confirm receipt and access the report</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">10. Governing Law</h2><p style="margin-bottom:12px">These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p><h2 style="font-size:20px;color:#00C8FF;margin:28px 0 12px;font-family:'Space Grotesk',sans-serif;font-weight:600">11. Contact</h2><p style="margin-bottom:12px">For questions, support, or refund requests, email: <strong>lqm@lqmmethod.com</strong></p><p style="margin-bottom:12px">Include your delivery reference number in all correspondence.</p>`;


// ══════════════════════════════════════════════════════════════════════════
// LQM HUB — Central dashboard after report unlock
// ══════════════════════════════════════════════════════════════════════════
function Hub({type, unlocks, onOpenNeural, onOpenVital, onViewReport, onUnlockNeural, onUnlockVital, onSimulateNeural, onSimulateVital}) {
  // Read live progress from localStorage
  const brainData = (() => { try { return JSON.parse(localStorage.getItem("lqm_brain")||"{}"); } catch { return {}; } })();
  const livingData = (() => { try { return JSON.parse(localStorage.getItem("lqm_living")||"{}"); } catch { return {}; } })();
  const challengeBrain = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_brain")||"{}"); } catch { return {}; } })();
  const challengeQuantum = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_quantum")||"{}"); } catch { return {}; } })();

  const brainDay = challengeBrain.currentDay || 0;
  const quantumDay = challengeQuantum.currentDay || 0;
  const brainStreak = brainData.streak || 0;
  const quantumStreak = livingData.streak || 0;
  const brainXP = brainData.totalXP || 0;

  return (
    <div style={{animation:"fadeUp .5s ease both", paddingBottom:20}}>
      {/* Welcome banner */}
      <div style={{textAlign:"center", marginBottom:28}}>
        <div style={{display:"inline-block", background:`${type.blue}15`, border:`1px solid ${type.blue}44`, borderRadius:100, padding:"6px 18px", marginBottom:14}}>
          <span style={{fontSize:13, fontWeight:700, color:type.blue, letterSpacing:".14em", textTransform:"uppercase"}}>Welcome to Your LQM Hub</span>
        </div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(28px,6vw,44px)", letterSpacing:2, color:WHITE, lineHeight:1.1, marginBottom:8}}>
          {type.name}
        </h1>
        <p style={{fontFamily:"'Crimson Pro',serif", fontStyle:"italic", fontSize:16, color:MUTED, maxWidth:400, margin:"0 auto", lineHeight:1.65}}>
          "{type.identity}"
        </p>
      </div>

      {/* Quick stats bar */}
      <div style={{display:"flex", gap:8, marginBottom:24, justifyContent:"center", flexWrap:"wrap"}}>
        {brainStreak > 0 && <div style={{background:"rgba(0,200,255,0.08)", border:`1px solid ${BORDER}`, borderRadius:100, padding:"6px 14px", fontSize:13, color:E_BLUE, fontWeight:700}}>⚡ {brainStreak} day brain streak</div>}
        {quantumStreak > 0 && <div style={{background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.25)", borderRadius:100, padding:"6px 14px", fontSize:13, color:"#34D399", fontWeight:700}}>🌿 {quantumStreak} day living streak</div>}
        {brainXP > 0 && <div style={{background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:100, padding:"6px 14px", fontSize:13, color:AMBER, fontWeight:700}}>⭐ {brainXP} XP</div>}
      </div>

      {/* ── My Report Card ── */}
      <div onClick={onViewReport} style={{background:`linear-gradient(135deg,${type.blue}12,${DARK2})`, border:`1px solid ${type.blue}44`, borderTop:`2px solid ${type.blue}`, borderRadius:18, padding:"20px 22px", marginBottom:12, cursor:"pointer", transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 30px ${type.blue}18`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <div style={{width:46, height:46, borderRadius:14, background:`${type.blue}18`, border:`1px solid ${type.blue}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22}}>📊</div>
            <div>
              <p style={{fontSize:13, fontWeight:700, color:type.blue, letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>My Profile Report</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE}}>Full Archetype Analysis</p>
              <p style={{fontSize:13, color:DIMMED, marginTop:2}}>Strengths · Blind spots · 3 strategy cards · Visual insight</p>
            </div>
          </div>
          <span style={{fontSize:20, color:type.blue, opacity:.7}}>→</span>
        </div>
      </div>

      {/* ── Brain Training Card ── */}
      <div style={{background:unlocks.neural ? `linear-gradient(135deg,rgba(0,200,255,0.07),${DARK2})` : DARK, border:`1px solid ${unlocks.neural ? "rgba(0,200,255,0.35)" : BORDER2}`, borderTop:`2px solid ${unlocks.neural ? E_BLUE : "rgba(0,200,255,0.2)"}`, borderRadius:18, padding:"20px 22px", marginBottom:12, cursor:unlocks.neural?"pointer":"default", transition:"all .2s"}}
        onClick={unlocks.neural ? onOpenNeural : undefined}
        onMouseEnter={e=>{if(unlocks.neural){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(0,200,255,0.1)";}}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"flex-start", gap:14, flex:1}}>
            <div style={{width:46, height:46, borderRadius:14, background:"rgba(0,200,255,0.1)", border:"1px solid rgba(0,200,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0}}>⚡</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13, fontWeight:700, color:E_BLUE, letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>Brain Training</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE, marginBottom:4}}>Neural Protocol</p>
              {unlocks.neural ? (<>
                <p style={{fontSize:13, color:DIMMED, marginBottom:10}}>6 cognitive challenges · XP system · 21-day journey</p>
                {/* Progress bar */}
                <div style={{marginBottom:6}}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                    <span style={{fontSize:12, color:DIMMED}}>21-Day Challenge</span>
                    <span style={{fontSize:12, color:E_BLUE, fontWeight:700}}>Day {brainDay} of 21</span>
                  </div>
                  <div style={{height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${(brainDay/21)*100}%`, background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`, borderRadius:100}}/>
                  </div>
                </div>
                <div style={{display:"flex", gap:12}}>
                  {[{d:7,icon:"⭐"},{d:14,icon:"🌟"},{d:21,icon:"🏆"}].map(m=>(
                    <span key={m.d} style={{fontSize:16, opacity:brainDay>=m.d?1:0.2}}>{m.icon}</span>
                  ))}
                  {brainStreak>0 && <span style={{fontSize:12, color:AMBER, fontWeight:700, marginLeft:"auto"}}>🔥 {brainStreak} day streak</span>}
                </div>
              </>) : (
                <p style={{fontSize:13, color:DIMMED, marginBottom:12}}>6 cognitive challenges · XP system · 21-day transformation</p>
              )}
            </div>
          </div>
          <div style={{flexShrink:0}}>
            {unlocks.neural
              ? <div style={{background:"rgba(0,200,255,0.1)", border:"1px solid rgba(0,200,255,0.3)", borderRadius:100, padding:"6px 14px", fontSize:13, color:E_BLUE, fontWeight:700}}>Open →</div>
              : <button onClick={e=>{e.stopPropagation();onUnlockNeural();}} style={{border:"none", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`, color:BG, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap"}}>🔒 £5</button>
            }
          </div>
        </div>
      </div>

      {/* ── Quantum Living Card ── */}
      <div style={{background:unlocks.vital ? "linear-gradient(135deg,rgba(52,211,153,0.07),#0D1830)" : DARK, border:`1px solid ${unlocks.vital ? "rgba(52,211,153,0.35)" : BORDER2}`, borderTop:`2px solid ${unlocks.vital ? "#34D399" : "rgba(52,211,153,0.2)"}`, borderRadius:18, padding:"20px 22px", marginBottom:20, cursor:unlocks.vital?"pointer":"default", transition:"all .2s"}}
        onClick={unlocks.vital ? onOpenVital : undefined}
        onMouseEnter={e=>{if(unlocks.vital){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px rgba(52,211,153,0.08)";}}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
        <div style={{display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12}}>
          <div style={{display:"flex", alignItems:"flex-start", gap:14, flex:1}}>
            <div style={{width:46, height:46, borderRadius:14, background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0}}>🌿</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13, fontWeight:700, color:"#34D399", letterSpacing:".12em", textTransform:"uppercase", marginBottom:3}}>Quantum Living</p>
              <p style={{fontSize:18, fontWeight:700, color:WHITE, marginBottom:4}}>5 Laws of Living</p>
              {unlocks.vital ? (<>
                <p style={{fontSize:13, color:DIMMED, marginBottom:10}}>Daily checklist · 5 quantum laws · 21-day journey</p>
                {/* Progress bar */}
                <div style={{marginBottom:6}}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
                    <span style={{fontSize:12, color:DIMMED}}>21-Day Challenge</span>
                    <span style={{fontSize:12, color:"#34D399", fontWeight:700}}>Day {quantumDay} of 21</span>
                  </div>
                  <div style={{height:6, background:"rgba(255,255,255,0.06)", borderRadius:100, overflow:"hidden"}}>
                    <div style={{height:"100%", width:`${(quantumDay/21)*100}%`, background:"linear-gradient(90deg,#059669,#34D399)", borderRadius:100}}/>
                  </div>
                </div>
                <div style={{display:"flex", gap:12}}>
                  {[{d:7,icon:"🌱"},{d:14,icon:"🌿"},{d:21,icon:"🌳"}].map(m=>(
                    <span key={m.d} style={{fontSize:16, opacity:quantumDay>=m.d?1:0.2}}>{m.icon}</span>
                  ))}
                  {quantumStreak>0 && <span style={{fontSize:12, color:AMBER, fontWeight:700, marginLeft:"auto"}}>🔥 {quantumStreak} day streak</span>}
                </div>
              </>) : (
                <p style={{fontSize:13, color:DIMMED, marginBottom:12}}>Daily checklist · 5 quantum laws · 21-day transformation</p>
              )}
            </div>
          </div>
          <div style={{flexShrink:0}}>
            {unlocks.vital
              ? <div style={{background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.3)", borderRadius:100, padding:"6px 14px", fontSize:13, color:"#34D399", fontWeight:700}}>Open →</div>
              : <button onClick={e=>{e.stopPropagation();onUnlockVital();}} style={{border:"none", borderRadius:100, padding:"8px 16px", fontSize:13, fontWeight:700, background:"linear-gradient(135deg,#059669,#34D399)", color:BG, cursor:"pointer", fontFamily:"'Space Grotesk',sans-serif", whiteSpace:"nowrap"}}>🔒 £5</button>
            }
          </div>
        </div>
      </div>

      {/* Today's focus — only show if at least one addon unlocked */}
      {(unlocks.neural || unlocks.vital) && (
        <div style={{background:"rgba(255,255,255,0.02)", border:`1px solid ${BORDER2}`, borderRadius:14, padding:"16px 20px", marginBottom:8}}>
          <p style={{fontSize:13, fontWeight:700, color:DIMMED, letterSpacing:".12em", textTransform:"uppercase", marginBottom:10}}>💡 Your Daily Habit</p>
          <p style={{fontSize:14, color:MUTED, lineHeight:1.6}}>
            {unlocks.neural && unlocks.vital
              ? "Complete today's Brain Training session + tick all 5 Quantum Laws to log your daily progress on both 21-day journeys."
              : unlocks.neural
              ? "Complete today's Brain Training session to log your daily progress and keep your streak alive."
              : "Tick all 5 Quantum Laws today to log your daily progress and keep your streak alive."}
          </p>
        </div>
      )}
    </div>
  );
}

function AddOnShop({unlocks, onUnlockNeural, onUnlockVital, onOpenNeural, onOpenVital, onSimulateNeural, onSimulateVital}) {
  return (
    <div style={{marginTop:32}}>
      {/* Section header */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${BORDER},transparent)`,marginBottom:24}}/>
        <p style={{fontSize:14,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:10}}>⚡ LQM Add-On Suite</p>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,5vw,38px)",letterSpacing:2,color:WHITE,marginBottom:8}}>Go Deeper. Perform Better.</h2>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,maxWidth:440,margin:"0 auto",lineHeight:1.7}}>Two powerful extensions to your LQM profile — each unlocked for just £5.</p>
      </div>

      {/* Neural Protocol card */}
      <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${unlocks.neural?"rgba(0,200,255,0.4)":BORDER2}`,borderTop:`2px solid ${unlocks.neural?E_BLUE:"rgba(0,200,255,0.25)"}`,borderRadius:20,overflow:"hidden",marginBottom:14,boxShadow:unlocks.neural?`0 0 30px rgba(0,200,255,0.08)`:"none"}}>
        <div style={{padding:"24px 24px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{fontSize:16,fontWeight:700,color:E_BLUE,letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>⚡ Add-On 1</p>
              <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:WHITE,marginBottom:4}}>Brain Training</h3>
              <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED}}>Daily cognitive challenges — 6 rounds, ~6-7 minutes</p>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:1,color:WHITE}}>£5</div>
              <div style={{fontSize:14,color:DIMMED}}>one-time</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {[["🎨","Stroop Challenge — executive function & conflict resolution"],["🧠","2-Back Test — working memory & fluid intelligence"],["🔷","Pattern Matrix — spatial reasoning & abstract logic"],["⚡","Reaction Velocity — processing speed & decision time"],["🔄","Cognitive Switch — mental flexibility & task switching"],["🛡️","Neural Defense — sustained attention & visual tracking"]].map(([ic,tx])=>(
              <div key={tx} style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{color:E_BLUE,fontSize:16,flexShrink:0}}>{ic}</span>
                <span style={{fontSize:16,color:MUTED}}>{tx}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 14px",background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:10,marginBottom:16}}>
            <span style={{fontSize:14}}>🔥</span>
            <span style={{fontSize:15,color:DIMMED}}>Streak tracking · XP system · 5 Neural Levels · Daily action cards</span>
          </div>
          {unlocks.neural
            ? <button onClick={onOpenNeural} style={{width:"100%",border:"none",borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                ⚡ Open Neural Protocol →
              </button>
            : <button onClick={onUnlockNeural} style={{width:"100%",border:"none",borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BG,letterSpacing:".05em",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                🔒 Unlock for £5 →
              </button>
          }
        </div>
      </div>

      {/* Vital Laws card */}
      <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${unlocks.vital?"rgba(52,211,153,0.4)":BORDER2}`,borderTop:`2px solid ${unlocks.vital?"#34D399":"rgba(52,211,153,0.25)"}`,borderRadius:20,overflow:"hidden",marginBottom:28,boxShadow:unlocks.vital?`0 0 30px rgba(52,211,153,0.07)`:"none"}}>
        <div style={{padding:"24px 24px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{fontSize:16,fontWeight:700,color:"#34D399",letterSpacing:".14em",textTransform:"uppercase",marginBottom:8}}>🌱 Add-On 2</p>
              <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:WHITE,marginBottom:4}}>Quantum Living</h3>
              <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED}}>5 Quantum Laws + daily wellness insights</p>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:1,color:WHITE}}>£5</div>
              <div style={{fontSize:14,color:DIMMED}}>one-time</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {[["🌙","Law I — Proper Sleep — the quantum rest protocol"],["🌿","Law II — Fresh Air — the oxygen advantage"],["⚖️","Law III — Temperance — the art of enough"],["⚡","Law IV — Exercise — the moving brain"],["🌱","Law V — Simple Nourishment — the quantum plate"]].map(([ic,tx])=>(
              <div key={tx} style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:14,flexShrink:0}}>{ic}</span>
                <span style={{fontSize:16,color:MUTED}}>{tx}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 14px",background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:10,marginBottom:16}}>
            <span style={{fontSize:14}}>🌿</span>
            <span style={{fontSize:15,color:DIMMED}}>Plant-based · Science-backed · Daily practice tracker · LQM-aligned principles</span>
          </div>
          {unlocks.vital
            ? <button onClick={onOpenVital} style={{width:"100%",border:"none",borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:"linear-gradient(135deg,#059669,#34D399)",color:BG,letterSpacing:".05em",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                🌱 Open Vital Laws →
              </button>
            : <button onClick={onUnlockVital} style={{width:"100%",border:"none",borderRadius:100,padding:"14px",fontSize:14,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:"linear-gradient(135deg,#059669,#34D399)",color:BG,letterSpacing:".05em",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                🔒 Unlock for £5 →
              </button>
          }
        </div>
      </div>

      {/* Bundle note */}
      <div style={{textAlign:"center",background:"rgba(255,255,255,0.02)",border:`1px solid ${BORDER2}`,borderRadius:14,padding:"16px 20px",marginBottom:8}}>
        <p style={{fontSize:16,color:MUTED,lineHeight:1.6}}>Each add-on is <strong style={{color:WHITE}}>£5</strong> — £10 for both. No subscriptions. Yours forever.</p>
      </div>
    </div>
  );
}

function Landing({onStart,t,fmt}){
  return(
    <div>
      <div className="fu" style={{textAlign:"center",marginBottom:28,paddingTop:8}}><Logo size="lg"/></div>
      <div className="fu1" style={{textAlign:"center",marginBottom:10}}>
        <p style={{fontSize:14,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:14}}>⚡ Behavioural Intelligence Assessment</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,64px)",lineHeight:1.05,letterSpacing:2,color:WHITE,marginBottom:6}}>You Don't Have A<br/><span className="elec">Motivation Problem.</span></h1>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,5vw,40px)",lineHeight:1,letterSpacing:2,color:"rgba(255,255,255,0.28)",marginBottom:22}}>You Have A Systems Problem.</h2>
      </div>
      <p className="fu2" style={{textAlign:"center",fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,lineHeight:1.75,color:MUTED,maxWidth:500,margin:"0 auto 28px"}}>"Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle." — The LQM Principle</p>
      <div className="fu3" style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
        {[["⚛","10-question profile"],["◎","4 behavioural archetypes"],["△","LQM Quantum Method"],["⬡","Personalised systems plan"]].map(([ic,lb])=>(
          <div key={lb} style={{display:"flex",alignItems:"center",gap:7,fontSize:16,color:DIMMED,fontWeight:500,background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:100,padding:"6px 14px"}}>
            <span style={{color:E_BLUE}}>{ic}</span>{lb}
          </div>
        ))}
      </div>
      <Panel className="fu4" style={{marginBottom:14,borderColor:BORDER}} glow>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{color:E_BLUE,fontSize:18}}>⚡</span>
          <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE}}>Launch Pricing — Limited Window</p>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span>
          <span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span>
          <span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:15,fontWeight:700}}>67% off</span>
        </div>
        <p style={{fontSize:14,color:MUTED,fontWeight:300,lineHeight:1.6}}>Complete the assessment to lock in this price. Full personalised report delivered instantly.</p>
      </Panel>
      <div className="fu4" style={{textAlign:"center",marginBottom:12}}><TimerBadge t={t} fmt={fmt}/></div>
      <div className="fu5" style={{textAlign:"center"}}>
        <PrimaryBtn onClick={onStart}>⚡ Begin My Profile Assessment →</PrimaryBtn>
        <p style={{marginTop:10,fontSize:15,color:DIMMED}}>No payment required until you see your results</p>
      </div>
      <Panel style={{marginTop:26,borderTop:`2px solid rgba(0,200,255,0.18)`}}>
        <SLabel>What's inside your report</SLabel>
        {[["⚛","Your Behavioural Archetype","Deep analysis of your unique motivation architecture — how you're wired to learn, decide and perform"],["◈","Strengths & Blind Spot Analysis","An honest breakdown of your psychological edge and the patterns quietly holding you back"],["△","3 LQM Quantum Strategy Cards","Scenario-based systems designed specifically for your profile"],["⬡","Your Identity Statement","The single sentence that, when repeated, rewires how you show up every day"],["◎","Your LQM Behaviour Blueprint","A personalised daily system built around your natural motivation architecture"]].map(([ic,ti,de])=>(
          <div key={ti} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <span style={{color:E_BLUE,fontSize:17,flexShrink:0,marginTop:2}}>{ic}</span>
            <div><p style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:3}}>{ti}</p><p style={{fontSize:16,color:MUTED,fontWeight:300,lineHeight:1.6}}>{de}</p></div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Quiz({q,idx,sel,onSel,onNext,t,fmt}){
  const pct=(idx/questions.length)*100;
  return(
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:DIMMED}}>{String(idx+1).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}</span>
        <TimerBadge t={t} fmt={fmt}/>
      </div>
      <div style={{height:2,background:"rgba(255,255,255,0.06)",borderRadius:100,marginBottom:30,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`,borderRadius:100,transition:"width .5s ease",boxShadow:`0 0 10px ${E_BLUE}55`}}/>
      </div>
      <Panel glow>
        <div style={{fontSize:28,color:E_BLUE,marginBottom:12,textShadow:`0 0 18px ${E_BLUE}`}}>{q.sym}</div>
        
        {/* Visual Bonus Question */}
        {q.isVisual && (
          <div style={{marginBottom:20}}>
            <div style={{display:"inline-block",background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:100,padding:"6px 16px",marginBottom:16}}>
              <span style={{fontSize:12,fontWeight:700,color:AMBER,letterSpacing:".12em"}}>VISUAL INSIGHT</span>
            </div>
          </div>
        )}
        
        <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:"clamp(19px,3.5vw,25px)",fontWeight:400,lineHeight:1.5,color:WHITE,marginBottom:q.subtitle?10:26}}>{q.text}</h2>
        
        {q.subtitle && (
          <p style={{fontSize:15,color:MUTED,marginBottom:20,fontStyle:"italic"}}>{q.subtitle}</p>
        )}
        
        {/* Visual Question Image */}
        {q.isVisual && (
          <div style={{marginBottom:24,textAlign:"center"}}>
            <img 
              src={`/${q.imageUrl}`} 
              alt="Visual perception test" 
              style={{
                maxWidth:"100%",
                width:380,
                height:"auto",
                borderRadius:12,
                border:`2px solid ${BORDER2}`,
                boxShadow:`0 4px 20px rgba(0,0,0,0.3)`
              }}
              onError={(e) => {
                // Fallback if image not found
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{display:"none",padding:"60px 20px",background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:12}}>
              <p style={{fontSize:14,color:DIMMED,marginBottom:8}}>📁 Image placeholder</p>
              <p style={{fontSize:12,color:DIMMED,fontStyle:"italic"}}>Place tree-woman-illusion.jpg in the public folder</p>
            </div>
          </div>
        )}
        
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {q.opts.map((opt,i)=>{
            const isS=sel===opt.ty;
            return(
              <button key={i} onClick={()=>onSel(opt.ty)} style={{background:isS?"rgba(0,200,255,0.08)":"rgba(255,255,255,0.025)",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,borderRadius:12,padding:"14px 18px",textAlign:"left",cursor:"pointer",transition:"all .2s ease",color:isS?WHITE:MUTED,fontSize:16,fontFamily:"'Space Grotesk',sans-serif",fontWeight:isS?500:400,lineHeight:1.5,display:"flex",alignItems:"center",gap:14,boxShadow:isS?`0 0 18px ${E_GLOW}`:"none"}}
                onMouseEnter={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=WHITE;}}}
                onMouseLeave={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER2;e.currentTarget.style.color=MUTED;}}}>
                <span style={{width:26,height:26,borderRadius:"50%",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,background:isS?E_BLUE:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:isS?BG:"transparent",fontWeight:800,transition:"all .2s"}}>✓</span>
                {opt.t}
              </button>
            );
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
      <div style={{position:"relative",width:80,height:80,margin:"0 auto 36px"}}>
        <div style={{width:80,height:80,borderRadius:"50%",border:"2px solid rgba(0,200,255,0.1)",borderTop:`2px solid ${E_BLUE}`,animation:"spin 1s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:28}}>⚛</div>
      </div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2,marginBottom:8,color:WHITE}}>Analysing Your Profile</h2>
      <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:DIMMED,marginBottom:36}}>Learning Quantum Method behavioural analysis in progress</p>
      <Panel style={{maxWidth:400,margin:"0 auto",textAlign:"left"}}>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:i<steps.length-1?14:0,opacity:step>i?1:.2,transition:"opacity .5s ease"}}>
            <span style={{color:step>i?E_BLUE:DIMMED,fontSize:14,flexShrink:0}}>{step>i?"⚡":"○"}</span>
            <span style={{fontSize:16,color:step>i?WHITE:DIMMED,fontWeight:step>i?500:300}}>{s}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Teaser({type,t,fmt,onUnlock}){
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
        <div className="blur-lock" style={{background:type.glow,border:`1px solid ${type.blue}33`,borderRadius:10,padding:"14px 18px"}}>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:18,fontStyle:"italic",color:WHITE,lineHeight:1.6}}>"{type.identity}"</p>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:`linear-gradient(to bottom,transparent,${DARK})`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:10}}>
          <span style={{fontSize:16,color:DIMMED}}>🔒 Unlock to reveal</span>
        </div>
      </Panel>
      <Panel style={{marginBottom:18,position:"relative",overflow:"hidden",minHeight:170}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <div className="blur-lock">
          {type.strategies.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
              <span style={{color:type.blue,fontSize:15,flexShrink:0}}>◈</span>
              <div><p style={{fontSize:16,fontWeight:600,color:WHITE,marginBottom:3}}>{s.area}</p><p style={{fontSize:15,color:MUTED,fontWeight:300}}>{s.scenario}</p></div>
            </div>
          ))}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"60%",background:`linear-gradient(to bottom,transparent,${DARK})`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:12}}>
          <span style={{fontSize:16,color:DIMMED}}>🔒 3 personalised strategy cards inside</span>
        </div>
      </Panel>
      <Panel glow style={{borderColor:BORDER}}>
        <div style={{textAlign:"center",marginBottom:18}}><TimerBadge t={t} fmt={fmt}/></div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span>
            <span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span>
            <span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:15,fontWeight:700}}>67% off</span>
          </div>
          <p style={{fontSize:16,color:DIMMED}}>One-time · Instant access · Full personalised report</p>
        </div>
        <PrimaryBtn onClick={onUnlock}>⚡ Unlock My Full Profile Report →</PrimaryBtn>
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
          {["Instant access","Built for your profile","7-day guarantee"].map(f=>(
            <span key={f} style={{fontSize:15,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:E_BLUE}}>✓</span>{f}</span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function DeliveryGate({ref_, ts, type, onConfirm}){
  const [countdown, setCountdown] = useState(5);
  useEffect(()=>{
    if(countdown<=0) return;
    const t=setInterval(()=>setCountdown(c=>c-1),1000);
    return()=>clearInterval(t);
  },[countdown]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(7,15,30,0.97)",backdropFilter:"blur(12px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:480,background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`2px solid rgba(52,211,153,0.4)`,borderRadius:22,padding:"40px 32px",textAlign:"center",boxShadow:"0 0 60px rgba(52,211,153,0.08)"}}>
        <div style={{fontSize:48,marginBottom:16}}>📋</div>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:"#34D399",marginBottom:6}}>Report Ready</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:"rgba(255,255,255,0.6)",marginBottom:28,lineHeight:1.65}}>Your full LQM {type.name} report has been prepared and is ready for delivery.</p>

        <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:14,padding:"18px 20px",marginBottom:24,textAlign:"left"}}>
          <p style={{fontSize:15,fontWeight:700,color:"rgba(52,211,153,0.7)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Delivery Details</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Reference</span>
              <span style={{fontSize:15,fontFamily:"monospace",color:"#34D399",fontWeight:700}}>{ref_}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Delivered</span>
              <span style={{fontSize:15,color:"rgba(255,255,255,0.7)"}}>{ts}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Profile</span>
              <span style={{fontSize:15,color:type.blue,fontWeight:600}}>{type.name}</span>
            </div>
          </div>
        </div>

        <p style={{fontSize:15,color:"rgba(255,255,255,0.4)",lineHeight:1.65,marginBottom:22}}>By clicking below you confirm that your full LQM report has been successfully delivered to you on screen. This serves as your delivery receipt. We recommend screenshotting this screen and your report for your records.</p>

        <button onClick={countdown>0?undefined:onConfirm} disabled={countdown>0} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:countdown>0?"not-allowed":"pointer",background:countdown>0?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#059669,#34D399)",color:countdown>0?"rgba(255,255,255,0.3)":"#070F1E",letterSpacing:".05em",transition:"all .3s"}}>
          {countdown>0?`Please read — confirming in ${countdown}s…`:"✓ I Confirm Receipt — View My Report →"}
        </button>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.2)",marginTop:12}}>Ref: {ref_} · LQM Terms apply · {ts}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DASHBOARD — Home Hub
// ══════════════════════════════════════════════════════════════════════════
function Dashboard({type, unlocks, onViewReport, onOpenBrain, onOpenQuantum, onUnlockBrain, onUnlockQuantum}) {
  const brainData = (() => { try { return JSON.parse(localStorage.getItem("lqm_brain")||"{}"); } catch { return {}; } })();
  const livingData = (() => { try { return JSON.parse(localStorage.getItem("lqm_living")||"{}"); } catch { return {}; } })();
  
  // Load 21-day challenge data
  const brainChallenge = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_brain")||"null"); } catch { return null; } })();
  const quantumChallenge = (() => { try { return JSON.parse(localStorage.getItem("lqm_challenge_quantum")||"null"); } catch { return null; } })();
  
  const brainXP = brainData.totalXP || 0;
  const brainStreak = brainData.streak || 0;
  const brainLevel = brainXP >= 500 ? "Advanced" : brainXP >= 250 ? "Proficient" : brainXP >= 100 ? "Developing" : brainXP >= 25 ? "Initiate" : "Beginner";
  const livingStreak = livingData.streak || 0;
  
  // 21-day progress for Brain Training
  const brainDay = brainChallenge?.currentDay || 0;
  const brainDaysCompleted = brainChallenge?.daysCompleted?.length || 0;
  const brainProgress = Math.min(100, Math.round((brainDay / 21) * 100));
  const brainNextMilestone = brainDay < 7 ? 7 : brainDay < 14 ? 14 : 21;
  const brainDaysToMilestone = brainNextMilestone - brainDay;
  
  // 21-day progress for Quantum Living
  const quantumDay = quantumChallenge?.currentDay || 0;
  const quantumDaysCompleted = quantumChallenge?.daysCompleted?.length || 0;
  const quantumProgress = Math.min(100, Math.round((quantumDay / 21) * 100));

  return (
    <div style={{animation:"fadeUp .6s ease both"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <p style={{fontSize:13,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:12}}>⚡ Your LQM Dashboard</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,7vw,52px)",letterSpacing:2,color:WHITE,lineHeight:1.05,marginBottom:8}}>
          Welcome Back,<br/><span style={{color:type.blue}}>{type.name}</span>
        </h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:17,color:MUTED,lineHeight:1.7}}>Your complete Learning Quantum Method system — all in one place.</p>
      </div>

      <div onClick={onViewReport} style={{background:`linear-gradient(145deg,${type.glow},rgba(0,0,0,0.3))`,border:`2px solid ${type.blue}55`,borderRadius:20,padding:"28px 26px",marginBottom:16,cursor:"pointer",transition:"all .25s",boxShadow:`0 4px 20px ${type.glow}`}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 30px ${type.glow}`;}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 20px ${type.glow}`;}}>
        <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:14}}>
          <div style={{fontSize:48,filter:`drop-shadow(0 0 12px ${type.blue})`}}>{type.sym}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:700,color:type.blue,letterSpacing:".12em",textTransform:"uppercase",marginBottom:4}}>📊 Your Profile</p>
            <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:WHITE,marginBottom:2}}>{type.name}</h3>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED}}>{type.arch}</p>
          </div>
          <div style={{fontSize:28,color:type.blue}}>→</div>
        </div>
        <div style={{padding:"12px 16px",background:"rgba(0,0,0,0.2)",borderRadius:10,border:`1px solid ${type.blue}22`}}>
          <p style={{fontSize:14,color:MUTED,textAlign:"center"}}>
            <strong style={{color:WHITE}}>Full behavioural analysis</strong> · Core strengths · Blind spots · Quantum actions
          </p>
        </div>
      </div>

      {/* 21-Day Challenge Progress Widget */}
      {(brainChallenge || quantumChallenge) && (
        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${BORDER2}`,borderRadius:18,padding:"24px",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:4}}>🎯 21-Day Transformation</p>
              <p style={{fontSize:15,color:MUTED}}>Track your daily progress and unlock milestones</p>
            </div>
          </div>

          {brainChallenge && unlocks.neural && (
            <div style={{marginBottom:brainChallenge && quantumChallenge ? 20 : 0}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>⚡</span>
                  <span style={{fontSize:14,fontWeight:600,color:WHITE}}>Brain Training</span>
                </div>
                <span style={{fontSize:13,color:E_BLUE,fontWeight:700}}>Day {brainDay} of 21</span>
              </div>
              
              <div style={{position:"relative",height:8,background:"rgba(255,255,255,0.06)",borderRadius:100,marginBottom:12,overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${brainProgress}%`,background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`,borderRadius:100,transition:"width .5s ease"}}/>
                {/* Milestone markers */}
                <div style={{position:"absolute",left:"33.33%",top:0,width:2,height:"100%",background:"rgba(255,255,255,0.2)"}}/>
                <div style={{position:"absolute",left:"66.66%",top:0,width:2,height:"100%",background:"rgba(255,255,255,0.2)"}}/>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:12,fontSize:12}}>
                  <span style={{color:brainDay >= 7 ? GREEN : DIMMED}}>✓ Day 7</span>
                  <span style={{color:brainDay >= 14 ? GREEN : DIMMED}}>✓ Day 14</span>
                  <span style={{color:brainDay >= 21 ? GREEN : DIMMED}}>✓ Day 21</span>
                </div>
                {brainDay < 21 && (
                  <span style={{fontSize:12,color:DIMMED}}>{brainDaysToMilestone} days to next milestone</span>
                )}
              </div>
              
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <div style={{flex:1,background:"rgba(0,200,255,0.06)",border:`1px solid ${BORDER2}`,borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <p style={{fontSize:11,color:DIMMED,marginBottom:2}}>Sessions</p>
                  <p style={{fontSize:16,fontWeight:700,color:E_BLUE}}>{brainChallenge.sessionsCompleted || 0}</p>
                </div>
                <div style={{flex:1,background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <p style={{fontSize:11,color:DIMMED,marginBottom:2}}>Days Active</p>
                  <p style={{fontSize:16,fontWeight:700,color:GREEN}}>{brainDaysCompleted}</p>
                </div>
                {brainStreak > 0 && (
                  <div style={{flex:1,background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:8,padding:"10px",textAlign:"center"}}>
                    <p style={{fontSize:11,color:DIMMED,marginBottom:2}}>Streak</p>
                    <p style={{fontSize:16,fontWeight:700,color:AMBER}}>{brainStreak}🔥</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {quantumChallenge && unlocks.vital && (
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>🌱</span>
                  <span style={{fontSize:14,fontWeight:600,color:WHITE}}>Quantum Living</span>
                </div>
                <span style={{fontSize:13,color:GREEN,fontWeight:700}}>Day {quantumDay} of 21</span>
              </div>
              
              <div style={{position:"relative",height:8,background:"rgba(255,255,255,0.06)",borderRadius:100,marginBottom:12,overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${quantumProgress}%`,background:"linear-gradient(90deg,#059669,#34D399)",borderRadius:100,transition:"width .5s ease"}}/>
                <div style={{position:"absolute",left:"33.33%",top:0,width:2,height:"100%",background:"rgba(255,255,255,0.2)"}}/>
                <div style={{position:"absolute",left:"66.66%",top:0,width:2,height:"100%",background:"rgba(255,255,255,0.2)"}}/>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:12,fontSize:12}}>
                  <span style={{color:quantumDay >= 7 ? GREEN : DIMMED}}>✓ Day 7</span>
                  <span style={{color:quantumDay >= 14 ? GREEN : DIMMED}}>✓ Day 14</span>
                  <span style={{color:quantumDay >= 21 ? GREEN : DIMMED}}>✓ Day 21</span>
                </div>
              </div>
              
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <div style={{flex:1,background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,padding:"10px",textAlign:"center"}}>
                  <p style={{fontSize:11,color:DIMMED,marginBottom:2}}>Days Active</p>
                  <p style={{fontSize:16,fontWeight:700,color:GREEN}}>{quantumDaysCompleted}</p>
                </div>
                {livingStreak > 0 && (
                  <div style={{flex:1,background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:8,padding:"10px",textAlign:"center"}}>
                    <p style={{fontSize:11,color:DIMMED,marginBottom:2}}>Streak</p>
                    <p style={{fontSize:16,fontWeight:700,color:AMBER}}>{livingStreak}🔥</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!brainChallenge && !quantumChallenge && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <p style={{fontSize:14,color:DIMMED,lineHeight:1.75}}>
                Start your first training session to begin the 21-Day Transformation Challenge
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:16,marginBottom:16}}>
        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`2px solid ${unlocks.neural?"rgba(0,200,255,0.4)":BORDER2}`,borderRadius:18,padding:"24px 22px",cursor:"pointer",transition:"all .25s",boxShadow:unlocks.neural?`0 0 25px rgba(0,200,255,0.1)`:"none"}}
          onClick={unlocks.neural ? onOpenBrain : onUnlockBrain}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=unlocks.neural?E_BLUE:"rgba(0,200,255,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=unlocks.neural?"rgba(0,200,255,0.4)":BORDER2;}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{width:48,height:48,borderRadius:12,background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>⚡</div>
            {unlocks.neural 
              ? <div style={{padding:"4px 12px",background:"rgba(0,200,255,0.12)",border:`1px solid ${BORDER}`,borderRadius:100,fontSize:12,color:E_BLUE,fontWeight:700}}>UNLOCKED</div>
              : <div style={{padding:"4px 12px",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:100,fontSize:12,color:AMBER,fontWeight:700}}>£5</div>
            }
          </div>
          <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,color:WHITE,marginBottom:6}}>Brain Training</h3>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.65,marginBottom:16}}>
            {unlocks.neural ? "6 science-backed cognitive challenges. Train your quantum mind daily." : "Unlock 6 cognitive challenges with XP progression and streak tracking."}
          </p>
          {unlocks.neural && (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(0,200,255,0.05)",borderRadius:8}}>
                <span style={{fontSize:13,color:DIMMED}}>Neural Level</span>
                <span style={{fontSize:14,color:E_BLUE,fontWeight:700}}>{brainLevel}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(0,200,255,0.05)",borderRadius:8}}>
                <span style={{fontSize:13,color:DIMMED}}>Total XP</span>
                <span style={{fontSize:14,color:WHITE,fontWeight:700}}>{brainXP}</span>
              </div>
              {brainStreak > 0 && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(251,191,36,0.08)",borderRadius:8}}>
                  <span style={{fontSize:13,color:AMBER}}>🔥 Streak</span>
                  <span style={{fontSize:14,color:AMBER,fontWeight:700}}>{brainStreak} days</span>
                </div>
              )}
            </div>
          )}
          <button style={{width:"100%",border:"none",borderRadius:100,padding:"12px",fontSize:15,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:unlocks.neural?`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`:"rgba(0,200,255,0.12)",color:unlocks.neural?BG:E_BLUE,letterSpacing:".05em"}}>
            {unlocks.neural ? "⚡ Start Training →" : "🔒 Unlock for £5 →"}
          </button>
        </div>

        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`2px solid ${unlocks.vital?"rgba(52,211,153,0.4)":BORDER2}`,borderRadius:18,padding:"24px 22px",cursor:"pointer",transition:"all .25s",boxShadow:unlocks.vital?`0 0 25px rgba(52,211,153,0.1)`:"none"}}
          onClick={unlocks.vital ? onOpenQuantum : onUnlockQuantum}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=unlocks.vital?"#34D399":"rgba(52,211,153,0.3)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=unlocks.vital?"rgba(52,211,153,0.4)":BORDER2;}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{width:48,height:48,borderRadius:12,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🌱</div>
            {unlocks.vital 
              ? <div style={{padding:"4px 12px",background:"rgba(52,211,153,0.12)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:100,fontSize:12,color:"#34D399",fontWeight:700}}>UNLOCKED</div>
              : <div style={{padding:"4px 12px",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:100,fontSize:12,color:AMBER,fontWeight:700}}>£5</div>
            }
          </div>
          <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,color:WHITE,marginBottom:6}}>Quantum Living</h3>
          <p style={{fontSize:14,color:MUTED,lineHeight:1.65,marginBottom:16}}>
            {unlocks.vital ? "5 Quantum Laws for complete wellbeing. Daily insights and progress tracking." : "Unlock the 5 Laws of holistic wellness with daily insights and checklist."}
          </p>
          {unlocks.vital && livingStreak > 0 && (
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(251,191,36,0.08)",borderRadius:8}}>
                <span style={{fontSize:13,color:AMBER}}>🔥 Streak</span>
                <span style={{fontSize:14,color:AMBER,fontWeight:700}}>{livingStreak} days</span>
              </div>
            </div>
          )}
          <button style={{width:"100%",border:"none",borderRadius:100,padding:"12px",fontSize:15,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:unlocks.vital?"linear-gradient(135deg,#059669,#34D399)":"rgba(52,211,153,0.12)",color:unlocks.vital?BG:"#34D399",letterSpacing:".05em"}}>
            {unlocks.vital ? "🌱 Continue Quantum Living →" : "🔒 Unlock for £5 →"}
          </button>
        </div>
      </div>

      <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"16px 20px",textAlign:"center"}}>
        <p style={{fontSize:14,color:MUTED,lineHeight:1.75}}>
          <strong style={{color:WHITE}}>Pro tip:</strong> Use the header buttons (⚡ and 🌱) for quick access from anywhere in your LQM system.
        </p>
      </div>
    </div>
  );
}
function Report({type, deliveryRef, deliveryTs, visualAnswer}){
  // Visual processing insights
  const visualInsights = {
    tree: {
      icon: "🌳",
      title: "Big Picture Processing",
      text: "You noticed the tree structure first, suggesting you naturally see systems, patterns, and the whole before individual elements. This big-picture processing style aligns with strategic thinking and systems design. You tend to step back and see the forest, not just the trees."
    },
    woman: {
      icon: "👤",
      title: "Detail-First Processing",
      text: "You noticed the woman's face first, suggesting you naturally focus on specific details, human elements, and individual components before seeing the larger pattern. This detail-oriented processing enhances your ability to spot nuances others miss and connect with people on a deeper level."
    },
    both: {
      icon: "⚖️",
      title: "Dual-Mode Processing",
      text: "You saw both the tree and the woman equally, suggesting flexible cognitive processing. You can shift between big-picture strategic thinking and detail-oriented analysis depending on what the situation requires. This adaptability is a significant strength."
    },
    neutral: {
      icon: "⚖️",
      title: "Balanced Processing",
      text: "Your visual processing shows balanced attention to both patterns and details. You can zoom in and zoom out as needed, giving you cognitive flexibility across different contexts."
    }
  };
  
  // Determine which insight to show based on visual answer
  let visualInsight = null;
  if (visualAnswer) {
    const question11 = questions[10]; // The visual question
    const selectedOption = question11?.opts?.find(opt => opt.ty === visualAnswer);
    const visualType = selectedOption?.visual || "neutral";
    visualInsight = visualInsights[visualType];
  }
  
  return(
    <div style={{animation:"blurIn .8s ease both"}}>

      {/* ── Delivery confirmation bar ── */}
      {deliveryRef && <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.25)",borderRadius:12,padding:"10px 18px",marginBottom:14,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <span style={{fontSize:14,color:"#34D399",flexShrink:0}}>✓</span>
        <div style={{flex:1}}>
          <p style={{fontSize:14,fontWeight:700,color:"#34D399",letterSpacing:".08em"}}>REPORT DELIVERED · {deliveryTs}</p>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.35)",fontFamily:"monospace",marginTop:2}}>Ref: {deliveryRef}</p>
        </div>
        <span style={{fontSize:16,color:"rgba(255,255,255,0.25)"}}>Screenshot for your records</span>
      </div>}

      {/* ── Hero header ── */}
      <div style={{background:`linear-gradient(145deg,${DARK2} 0%,${DARK} 100%)`,border:`1px solid ${type.blue}33`,borderRadius:20,padding:"40px 28px",textAlign:"center",marginBottom:14,boxShadow:`0 0 50px ${type.glow}`}}>
        <div style={{display:"inline-block",background:"rgba(0,200,255,0.08)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"5px 14px",fontSize:14,color:E_BLUE,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>⚡ Report Unlocked — For You Only</div>
        <Logo size="sm"/>
        <p style={{fontSize:16,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",fontWeight:600,marginTop:8,marginBottom:20}}>Behavioural Intelligence Report</p>
        {/* Archetype illustration */}
        <div style={{padding:"8px 0 16px"}}>
          <ArchetypeIllustration type={Object.keys({A:1,B:2,C:3,D:4}).find(k=>TYPES[k]===type)||"A"}/>
        </div>
        <div style={{fontSize:52,color:type.blue,marginBottom:10,textShadow:`0 0 30px ${type.blue}`}}>{type.sym}</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,48px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{type.name}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontStyle:"italic",color:type.blue}}>{type.arch}</p>
      </div>

      {/* ── Tagline ── */}
      <Panel style={{borderLeft:`3px solid ${type.blue}`,borderRadius:"0 14px 14px 0",marginBottom:14,background:type.glow}}>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:20,fontStyle:"italic",color:WHITE,lineHeight:1.65}}>"{type.tag}"</p>
      </Panel>

      {/* ── Identity statement ── */}
      <Panel glow style={{marginBottom:14,textAlign:"center",background:`linear-gradient(135deg,${type.glow},rgba(0,0,0,0.2))`}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:type.blue,marginBottom:14}}>◈ Your Identity Statement</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:21,fontStyle:"italic",color:WHITE,lineHeight:1.65,marginBottom:12}}>"{type.identity}"</p>
        <p style={{fontSize:15,color:DIMMED,fontWeight:300}}>Repeat this daily. Identity precedes behaviour. Behaviour compounds into results.</p>
      </Panel>

      {/* ── Overview ── */}
      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Profile Overview</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,lineHeight:1.85,color:"rgba(255,255,255,0.78)",fontWeight:300}}>{type.desc}</p>
      </Panel>

      {/* ── LQM Quantum Insight ── */}
      <Panel style={{marginBottom:14,borderLeft:`3px solid ${E_BLUE}`,background:"rgba(0,200,255,0.04)"}}>
        <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE,marginBottom:10}}>⚛ LQM Quantum Insight</p>
        <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.82)",fontWeight:400}}>{type.atomic}</p>
      </Panel>

      {/* ── Visual Processing Style (if answered bonus question) ── */}
      {visualInsight && (
        <Panel style={{marginBottom:14,borderLeft:`3px solid ${AMBER}`,background:"rgba(251,191,36,0.04)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <span style={{fontSize:24}}>{visualInsight.icon}</span>
            <p style={{fontSize:16,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:AMBER}}>Visual Processing Style</p>
          </div>
          <p style={{fontSize:17,fontWeight:600,color:WHITE,marginBottom:8}}>{visualInsight.title}</p>
          <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.82)",fontWeight:400}}>{visualInsight.text}</p>
        </Panel>
      )}

      {/* ── Strengths with visual bars ── */}
      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Core Strengths</SLabel>
        <StrengthBars strengths={type.strengths} color={type.blue}/>
      </Panel>

      {/* ── Blind spots — BOLD, LARGE, VISUAL ── */}
      <Panel style={{marginBottom:18}}>
        <SLabel color="rgba(255,180,50,0.9)">Blind Spots to Navigate</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED,lineHeight:1.6,marginBottom:16}}>These aren't weaknesses. They're patterns to recognise — awareness is the first step to transcendence.</p>
        {type.blindspots.map((b,i)=>(
          <BlindSpotCard key={i} text={b} index={i} color={type.blue}/>
        ))}
      </Panel>

      {/* ── Strategy cards ── */}
      <Panel style={{marginBottom:12}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.65}}>The following systems are built specifically for your behavioural profile. Read them as instructions written for you alone.</p>
      </Panel>

      {type.strategies.map((s,i)=>(
        <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${type.blue}`,borderRadius:16,overflow:"hidden",marginBottom:12}}>
          <div style={{background:type.glow,borderBottom:`1px solid ${type.blue}22`,padding:"14px 22px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:30,height:30,borderRadius:"50%",background:type.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:BG,fontWeight:800,flexShrink:0}}>{i+1}</span>
            <p style={{fontSize:14,fontWeight:700,color:type.blue,letterSpacing:".08em",textTransform:"uppercase"}}>{s.area}</p>
          </div>
          {/* Visual scenario strip */}
          <div style={{background:`linear-gradient(90deg,${type.glow},transparent)`,borderBottom:`1px solid ${type.blue}11`,padding:"14px 22px",display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${type.glow}`,border:`1px solid ${type.blue}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
              {["⟁","◎","◈"][i]}
            </div>
            <div>
              <p style={{fontSize:16,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>The Scenario</p>
              <p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,fontStyle:"italic",color:"rgba(255,255,255,0.82)",lineHeight:1.65}}>"{s.scenario}"</p>
            </div>
          </div>
          <div style={{padding:"18px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:type.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>→</div>
              <p style={{fontSize:16,fontWeight:700,color:type.blue,letterSpacing:".1em",textTransform:"uppercase"}}>Your Quantum System</p>
            </div>
            <p style={{fontSize:14,lineHeight:1.9,color:"rgba(255,255,255,0.78)",fontWeight:400}}>{s.solution}</p>
          </div>
        </div>
      ))}

      {/* ── Footer ── */}
      <Panel style={{textAlign:"center",background:`linear-gradient(145deg,${DARK2},${DARK})`}}>
        <Logo size="sm"/>
        <div style={{width:50,height:1,background:`linear-gradient(90deg,transparent,${E_BLUE}44,transparent)`,margin:"18px auto"}}/>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:19,fontStyle:"italic",color:MUTED,lineHeight:1.7,maxWidth:420,margin:"0 auto 12px"}}>"Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle."</p>
        <p style={{fontSize:14,color:DIMMED,letterSpacing:".06em"}}>— The Learning Quantum Method</p>
        <div style={{height:1,background:BORDER2,margin:"18px 0"}}/>
        <p style={{fontSize:14,color:DIMMED,letterSpacing:".1em"}}>LQM Behavioural Intelligence Report · {type.name}</p>
      </Panel>
    </div>
  );
}
