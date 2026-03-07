import { useState, useEffect, useRef } from "react";
import BrainTraining from "./BrainTraining.jsx";
import QuantumLiving from "./QuantumLiving.jsx";

const STRIPE_MAIN  = "https://buy.stripe.com/00w8wR50Xber8VZfkka3u00";
const STRIPE_MAIN_FULL = "https://buy.stripe.com/4gMfZjeBxdmzc8b0pqa3u04";
const STRIPE_BRAIN = "https://buy.stripe.com/8x2eVfgJF4Q37RVb44a3u02";
const STRIPE_VITAL = "https://buy.stripe.com/eVq5kF651gyLgorc88a3u03";

function getUnlocks() { try { return JSON.parse(localStorage.getItem("lqm_unlocks")||"{}"); } catch { return {}; } }
function setUnlock(key) { const u=getUnlocks(); u[key]=true; localStorage.setItem("lqm_unlocks",JSON.stringify(u)); }

const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;
const E_BLUE="#00C8FF",E_BLUE2="#0EA5E9",E_GLOW="rgba(0,200,255,0.15)";
const BG="#070F1E",DARK="#0D1830",DARK2="#111E38",PANEL="rgba(255,255,255,0.055)";
const BORDER="rgba(0,200,255,0.18)",BORDER2="rgba(255,255,255,0.09)";
const WHITE="#FFFFFF",MUTED="rgba(255,255,255,0.62)",DIMMED="rgba(255,255,255,0.32)";
const AMBER="#FBBF24",GREEN="#22C55E",PURPLE="#A855F7";
const SYMS=["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];
const RED="#EF4444";

// ── Spinning Archetype Illustration ────────────────────────────────────────
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
      <defs>
        <radialGradient id={`${uid}_g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={c} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="70" rx="55" ry="45" fill={`url(#${uid}_g)`} opacity="0.8"/>
      {[35,65,100,135,165].map(x=><line key={`v${x}`} x1={x} y1="15" x2={x} y2="125" stroke={c} strokeWidth="0.3" opacity="0.15"/>)}
      {[25,50,70,90,115].map(y=><line key={`h${y}`} x1="15" y1={y} x2="185" y2={y} stroke={c} strokeWidth="0.3" opacity="0.15"/>)}
      {[[18,18],[182,18],[18,122],[182,122]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.5" fill={c} opacity="0.5"/>
      ))}
      <circle cx="100" cy="70" r="50" fill="none" stroke={c} strokeWidth="0.4" opacity="0.2"/>
      <g id={`${uid}_r1`}>
        <circle cx="100" cy="70" r="40" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="42 22" opacity="0.5"/>
        <circle cx="100" cy="30" r="4.5" fill="white" opacity="0.9"/>
        <circle cx="140" cy="70" r="3" fill="white" opacity="0.65"/>
      </g>
      <g id={`${uid}_r2`}>
        <circle cx="100" cy="70" r="28" fill="none" stroke="white" strokeWidth="1.2" strokeDasharray="30 16" opacity="0.55"/>
        <circle cx="100" cy="42" r="4" fill="white" opacity="0.95"/>
        <circle cx="72" cy="70" r="3" fill={c} opacity="1"/>
      </g>
      <g id={`${uid}_r3`}>
        <circle cx="100" cy="70" r="16" fill="none" stroke="white" strokeWidth="1.8" strokeDasharray="18 10" opacity="0.65"/>
        <circle cx="100" cy="54" r="3.5" fill={c} opacity="1"/>
      </g>
      <line x1="100" y1="22" x2="100" y2="118" stroke={c} strokeWidth="0.6" opacity="0.2"/>
      <line x1="52" y1="70" x2="148" y2="70" stroke={c} strokeWidth="0.6" opacity="0.2"/>
      <circle cx="100" cy="70" r="9" fill={c} opacity="0.2"/>
      <circle cx="100" cy="70" r="5.5" fill={c} opacity="0.6"/>
      <circle cx="100" cy="70" r="2.5" fill="white" opacity="1"/>
    </svg>
  );
}

function StrengthBars({strengths,color}){
  const widths=[95,88,82,76];
  return <div style={{marginTop:8}}>{strengths.map((s,i)=>(<div key={i} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,fontWeight:600,color:WHITE}}>{s}</span><span style={{fontSize:11,color,fontWeight:700}}>{widths[i]}%</span></div><div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden"}}><div style={{height:"100%",width:`${widths[i]}%`,background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:100,boxShadow:`0 0 8px ${color}66`}}/></div></div>))}</div>;
}

function BlindSpotCard({text,index,color}){
  const icons=["⚠","◎","△"];
  return <div style={{display:"flex",gap:16,alignItems:"flex-start",padding:"16px 18px",background:"rgba(255,160,40,0.06)",border:"1px solid rgba(255,160,40,0.2)",borderRadius:12,marginBottom:10,borderLeft:"3px solid rgba(255,160,40,0.5)"}}><div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,160,40,0.12)",border:"1px solid rgba(255,160,40,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14}}>{icons[index]}</div><div><p style={{fontSize:15,fontWeight:700,color:"rgba(255,200,80,0.95)",lineHeight:1.5,marginBottom:2}}>{text}</p><p style={{fontSize:12,color:"rgba(255,200,80,0.5)",fontWeight:400}}>Awareness is the first step to navigation</p></div></div>;
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
  A:{sym:"◈",name:"The Systems Architect",arch:"Identity: The Builder",tag:"You don't chase motivation. You engineer it.",hook:"Most people try to motivate themselves. You build systems that make motivation irrelevant.",desc:"Your psychology is wired for precision and process. While others rely on willpower — a depleting resource — you understand intuitively what the Learning Quantum Method has proven through years of behavioural research: sustainable performance follows systems, not intentions. Your quantum edge is the ability to translate ambition into repeatable, compounding architecture. Small compounding improvements add up to extraordinary results. You know this. The question is whether your system is designed for the right identity.",identity:"I am someone who builds systems that work even when I don't feel like it.",atomic:"Your quantum stack needs auditing, not expanding. You likely have good systems — but they may be optimised for the wrong outputs. Identify the ONE behaviour that, if repeated daily, would make everything else easier or unnecessary.",strengths:["Systems Design","Execution Consistency","Long-Horizon Thinking","Process Optimisation"],blindspots:["Can mistake motion for progress — busyness masquerading as output","Perfectionism delays launch — the system must be perfect before it begins","May optimise the wrong thing efficiently — precision without direction"],strategies:[{area:"The Quantum Increment",scenario:"I delay starting when the outcome feels uncertain or the project feels too large.",solution:"Shrink the action until it feels almost embarrassingly small. The goal isn't to write a chapter — it's to open the document. Identity is built by showing up, not by performing. Every small act of showing up is a vote for the person you're becoming."},{area:"Motivation Architecture",scenario:"My drive fluctuates week to week, making long-term projects unreliable.",solution:"Design your environment before you design your schedule. Make the desired behaviour the path of least resistance. Remove friction from what you want to do. Add friction to what you want to stop. Motivation follows the path you've already cleared."},{area:"The Identity Shift",scenario:"I feel frustrated when results don't match effort — I'm doing everything right but it's not working.",solution:"Ask not 'what do I want to achieve?' but 'who do I need to become?' Rewrite your daily actions as identity statements: 'I am someone who reviews progress every Friday.' Outcomes are lagging measures of identity. Build the identity first."}],blue:"#00C8FF",glow:"rgba(0,200,255,0.1)"},
  B:{sym:"◉",name:"The Deep Learner",arch:"Identity: The Scholar",tag:"Your curiosity is a compounding asset.",hook:"Shallow knowledge is everywhere. What you build goes three levels deeper than anyone else in the room.",desc:"You are driven by a rare and powerful force: the need to truly understand. Not surface knowledge — genuine comprehension. This is the foundation of expertise, and expertise is the foundation of irreplaceable value. The LQM research confirms what you feel intuitively: deep work produces disproportionate results. Your challenge isn't capacity — it's converting accumulated understanding into decisive, visible action.",identity:"I am someone who turns deep understanding into decisive, courageous action.",atomic:"Knowledge without deployment is stored potential. Your quantum stack needs a 'publish' step — a regular moment where you translate internal understanding into external output, however imperfect.",strengths:["Intellectual Depth","Pattern Recognition","Mastery Orientation","Analytical Precision"],blindspots:["Analysis paralysis — research becomes a substitute for action","'Not ready yet' as avoidance — readiness is a feeling, not a fact","Over-invests in understanding, under-invests in the doing"],strategies:[{area:"The 70% Threshold",scenario:"I over-research and delay acting until I feel truly ready — which rarely comes.",solution:"Set a decision threshold: when you have 70% of the information you want, act. Treat the remaining 30% as field research — data you can only gather by doing. Action is the most advanced form of learning available to you."},{area:"Complexity as Motivation",scenario:"Repetitive or routine tasks drain me rapidly — I lose interest and disengage.",solution:"Find the hidden variable. In every routine task, there is one dimension you could optimise. Make the question 'how could I do this 10% more intelligently?' your daily prompt. Turn execution into experimentation."},{area:"The Output Practice",scenario:"I accumulate knowledge but struggle to show my work or share my thinking.",solution:"Build a weekly 'output ritual' — one piece of thinking made visible. A note, a voice memo, a conversation where you teach what you've learned. The act of explaining is the act of understanding at depth."}],blue:"#38BDF8",glow:"rgba(56,189,248,0.1)"},
  C:{sym:"◎",name:"The Relational Catalyst",arch:"Identity: The Connector",tag:"You make everything — and everyone — better.",hook:"While others optimise for outputs, you understand the lever that moves everything: people.",desc:"Your motivation is relational at its core. You are energised by shared purpose, activated by belonging, and sustained by the knowledge that your effort matters to real people. LQM research consistently shows that social commitment is one of the most powerful forces in behaviour change. Your quantum leap is learning to channel this relational fuel into your own consistent growth — not just the growth of those around you.",identity:"I am someone who builds relationships that hold me accountable to my own growth.",atomic:"Your quantum stack needs a social architecture layer. Every major goal should have one human being attached to it — someone who benefits from your success, or to whom you've made a commitment. Accountability is your performance-enhancing mechanism.",strengths:["Emotional Intelligence","Trust-Building","Authentic Leadership","Sustained Effort Under Commitment"],blindspots:["Loses personal direction without external anchors — others' goals become your own","Avoids necessary conflict — keeps the peace at the cost of progress","Absorbs others' energy — their demotivation can become yours"],strategies:[{area:"The Relational Goal Stack",scenario:"I lose motivation when working in isolation — the drive evaporates without connection.",solution:"Attach every personal goal to a specific person. Write: 'Achieving this allows me to show up better for [name] because [reason].' Share it with them. You have just created the most powerful motivational force in your psychology."},{area:"The Morning Anchor",scenario:"I absorb the emotional weather of those around me — their demotivation becomes mine.",solution:"Create a 10-minute pre-contact ritual each morning before interacting with anyone. Write three intentions. This builds an internal foundation that external moods cannot destabilise. Your identity precedes their influence."},{area:"The Accountability Architecture",scenario:"I need external commitment to sustain effort — and feel this is a weakness.",solution:"It isn't a weakness — it's a feature. Formalise it. Identify one person for a weekly check-in: one win, one struggle, one commitment. You're not removing the need for connection. You're building it intelligently into your growth system."}],blue:"#34D399",glow:"rgba(52,211,153,0.1)"},
  D:{sym:"◇",name:"The Visionary Pioneer",arch:"Identity: The Creator",tag:"You don't follow the map. You draw it.",hook:"Every framework, every system, every method you've ever used — someone like you invented it first.",desc:"You are driven by possibility. You think in futures that don't exist yet. Your motivation comes from creative autonomy, the thrill of the blank canvas, and the deep satisfaction of making something that carries your fingerprint. The LQM research on intrinsic motivation is clear: autonomy, mastery, and purpose are the triumvirate. You have all three in abundance. Your challenge is not creativity — it's building just enough structure to bring your vision fully across the finish line.",identity:"I am someone who brings bold visions into the world with enough structure to complete them.",atomic:"Your quantum stack needs a completion mechanism. You likely have strong starting rituals. Build equally strong finishing rituals — a defined moment where you declare a project 'shipped' and begin the next creative act.",strengths:["Original Thinking","Intrinsic Drive","Bold Risk Tolerance","Inspiring Through Vision"],blindspots:["Motivation drops after the initial spark — the build phase feels less alive","Too many projects open, too few completed — beginnings are exciting, endings are work","Structure feels like a cage — but without it, the vision never fully lands"],strategies:[{area:"The Evolution Frame",scenario:"My motivation collapses once the exciting creation phase ends and execution begins.",solution:"Reframe completion as the beginning of the next creative act, not the death of this one. Keep an 'Evolution Log' — a live document tracking how your project is changing and improving. The project is never finished. It is always becoming."},{area:"The One Brilliant Thing",scenario:"I scatter energy across multiple ideas simultaneously and make shallow progress on all of them.",solution:"Each week, identify the single most important creative act. Protect 90 uninterrupted minutes for it — first, before anything else. Everything else is secondary until that window is honoured. Constraint creates the conditions for your best work."},{area:"The Separation Protocol",scenario:"My output never matches my internal vision and this gap demotivates me deeply.",solution:"Separate creation from evaluation entirely. During making: no judgement allowed. Schedule a 'critical review' 24 hours after completion with fresh eyes. The inner critic and the inner creator cannot occupy the same creative moment."}],blue:"#A78BFA",glow:"rgba(167,139,250,0.1)"},
};


const ORIGINAL = 27, DISCOUNTED = 9, TIMER_SECS = 5 * 60;

// ── TEST MODE ──────────────────────────────────────────────────────────────
// Set to true to show the "Unlock All" button in the footer for testing.
// Set to false before going live to real customers.
const TEST_MODE = true;
// ──────────────────────────────────────────────────────────────────────────

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
    // Save quiz state so we can restore it when Stripe redirects back
    // lqm_delivery is intentionally NOT written here — only written after
    // Stripe confirms payment via ?paid=main redirect. This prevents
    // anyone who clicks unlock but doesn't pay from getting free access.
    localStorage.setItem("lqm_pending_session",JSON.stringify({
      answers, charType
    }));
  }
  function confirmDelivery(){
    const stored=JSON.parse(localStorage.getItem("lqm_delivery")||"{}");
    localStorage.setItem("lqm_delivery",JSON.stringify({...stored,confirmed:true}));
    setShowDeliveryGate(false);
  }

  // ── KEY FIX 3: full mount restore — handles all three return scenarios ──
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const paid=params.get("paid");
    const cancelled=params.get("cancelled");

    // Scenario A1: returning from Stripe main report payment (?paid=main)
    // lqm_delivery is written HERE — only after Stripe confirms payment
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
        setDeliveryRef(ref);
        setDeliveryTs(ts);
        setPhase("paid");
        setShowDeliveryGate(true);
      }
      window.history.replaceState({},"",window.location.pathname);
      return;
    }

    // Scenario A2: returning from Stripe add-on payment (?paid=neural/vital)
    if(paid==="neural"||paid==="vital"){
      setUnlock(paid);
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

    // Scenario B: returning from cancelled Stripe add-on (?cancelled=1)
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

    // Scenario C: page refresh — restore a genuine paying customer
    // Only fires if lqm_delivery exists AND was confirmed (customer clicked
    // "I Confirm Receipt"). This means they definitely paid and accessed
    // the report at least once. Unconfirmed delivery = not yet paid.
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
        setUnlocks(getUnlocks());
        setPhase("paid");
        setDeliveryRef(deliveryData.ref);
        setDeliveryTs(deliveryData.ts);
      }
    }
  },[]);

  function handleUnlockAddon(key) {
    setUnlock(key);
    setUnlocks(getUnlocks());
    setActiveAddon(key);
  }

  // ── KEY FIX 2: save state then redirect same-tab for add-on payment ──
  // Stripe success URLs must be configured in the Stripe dashboard:
  //   Brain Training → https://lqm-assessment.vercel.app?paid=neural
  //   Quantum Living  → https://lqm-assessment.vercel.app?paid=vital
  // Cancel URLs:
  //   Both            → https://lqm-assessment.vercel.app?cancelled=1
  function handleAddonRedirect(stripeUrl){
    localStorage.setItem("lqm_session_state",JSON.stringify({
      answers, charType, activeView:"hub"
    }));
    window.location.href=stripeUrl;
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
      @keyframes eureka{0%,100%{filter:drop-shadow(0 0 3px rgba(0,200,255,0.4));opacity:0.78;}45%{filter:drop-shadow(0 0 22px rgba(0,200,255,1)) drop-shadow(0 0 50px rgba(0,200,255,0.55)) drop-shadow(0 0 90px rgba(0,200,255,0.2));opacity:1;}}
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
    else{setCharType(calcType(a));setPhase("processing");let st=0;const iv=setInterval(()=>{st++;setProcStep(st);if(st>=5){clearInterval(iv);setTimeout(()=>{setTimerOn(true);setPhase("teaser");},600);}},850);}
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
          {!showLegal && phase==="landing"    && <Landing onStart={()=>setPhase("quiz")}/>}
          {!showLegal && phase==="quiz"       && <Quiz q={questions[qIdx]} idx={qIdx} sel={sel} onSel={setSel} onNext={handleNext}/>}
          {!showLegal && phase==="processing" && <Processing step={procStep}/>}
          {!showLegal && phase==="teaser"     && <Teaser type={TYPES[charType]} t={timeLeft} fmt={fmt} onUnlockOffer={()=>{ generateDeliveryRef(); window.open(STRIPE_MAIN,"_blank"); }} onUnlockFull={()=>{ generateDeliveryRef(); window.open(STRIPE_MAIN_FULL,"_blank"); }}/>}
          {!showLegal && phase==="paid"       && <>
            {showDeliveryGate && <DeliveryGate ref_={deliveryRef} ts={deliveryTs} type={TYPES[charType]} onConfirm={confirmDelivery}/>}
            {!showDeliveryGate && <>
              {activeView==="hub"      && <Hub type={TYPES[charType]} unlocks={unlocks} onOpenNeural={()=>setActiveAddon("neural")} onOpenVital={()=>setActiveAddon("vital")} onViewReport={()=>setActiveView("report")} onUnlockNeural={()=>handleAddonRedirect(STRIPE_BRAIN)} onUnlockVital={()=>handleAddonRedirect(STRIPE_VITAL)} onSimulateNeural={()=>handleUnlockAddon("neural")} onSimulateVital={()=>handleUnlockAddon("vital")}/>}
              {activeView==="report"   && <><Report type={TYPES[charType]} deliveryRef={deliveryRef} deliveryTs={deliveryTs} visualAnswer={answers[10]}/><button onClick={()=>setActiveView("hub")} style={{width:"100%",marginTop:16,border:"1px solid rgba(0,200,255,0.32)",borderRadius:100,padding:"13px",fontSize:14,fontWeight:700,background:"rgba(0,200,255,0.07)",color:E_BLUE,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".05em",transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,200,255,0.16)";e.currentTarget.style.borderColor="rgba(0,200,255,0.65)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,200,255,0.07)";e.currentTarget.style.borderColor="rgba(0,200,255,0.32)";}}>⌂ Back to My Hub</button></>}
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
      <div style={{position:"relative",display:"inline-block",paddingBottom:4*sc}}>
        <span style={{
          position:"absolute",top:"50%",left:"50%",
          transform:"translate(-50%,-52%) rotate(-5deg)",
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:90*sc,letterSpacing:6*sc,
          background:"linear-gradient(160deg,rgba(0,200,255,0.12),rgba(0,200,255,0.03))",
          WebkitBackgroundClip:"text",backgroundClip:"text",
          WebkitTextFillColor:"transparent",
          whiteSpace:"nowrap",pointerEvents:"none",zIndex:0,lineHeight:1,
        }}>LQM</span>
        <svg
          style={{
            position:"absolute",
            top:`${-36*sc}px`,left:`${-22*sc}px`,
            width:`calc(100% + ${44*sc}px)`,
            height:`calc(100% + ${58*sc}px)`,
            zIndex:1,pointerEvents:"none",
            animation:"eureka 3s ease-in-out infinite",
            overflow:"visible",
          }}
          viewBox="0 0 300 110"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lqmBolt" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"/>
              <stop offset="15%"  stopColor="#a8f0ff" stopOpacity="1"/>
              <stop offset="32%"  stopColor="#00C8FF" stopOpacity="0.95"/>
              <stop offset="58%"  stopColor="#00C8FF" stopOpacity="0.45"/>
              <stop offset="78%"  stopColor="#00C8FF" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#00C8FF" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="lqmCore" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9"/>
              <stop offset="25%"  stopColor="#ffffff" stopOpacity="0.5"/>
              <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 52 0 L 18 52 L 42 52 L 6 110 L 14 110 L 52 60 L 28 60 L 64 0 Z" transform="skewX(-8)" fill="url(#lqmBolt)"/>
          <path d="M 55 2 L 24 50 L 44 50 L 10 106 L 50 58 L 32 58 L 62 2 Z" transform="skewX(-8)" fill="url(#lqmCore)" opacity="0.55"/>
        </svg>
        <span style={{position:"relative",zIndex:2,fontFamily:"'Bebas Neue',sans-serif",fontSize:52*sc,letterSpacing:3*sc,color:WHITE,lineHeight:1,textShadow:`0 0 28px ${E_BLUE}22`,display:"block"}}>LQM</span>
        <svg style={{position:"absolute",bottom:0,left:0,width:"100%",zIndex:3,pointerEvents:"none"}} height={5*sc} viewBox="0 0 160 5">
          <path d="M18 4 Q80 1 142 4" stroke={E_BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/>
        </svg>
      </div>
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
    localStorage.setItem('lqm_delivery',JSON.stringify({
      ref:'LQM-2026-TEST'+Math.random().toString(36).substring(2,8).toUpperCase(),
      ts:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),
      confirmed:true
    }));
    localStorage.setItem('lqm_unlocks',JSON.stringify({neural:true,vital:true}));
    alert('✓ TEST MODE ACTIVATED\n\nAll features unlocked!\n\nClick OK then refresh the page (F5) to see everything.');
  }
  function resetAll(){
    localStorage.clear();
    alert('✓ All data cleared. Refreshing now...');
    window.location.reload();
  }
  return(
    <div style={{width:"100%",maxWidth:680,marginTop:60,paddingTop:24,borderTop:`1px solid ${BORDER2}`,display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
      <div style={{display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>onShowLegal("privacy")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Privacy Policy</button>
        <button onClick={()=>onShowLegal("terms")} style={{background:"none",border:"none",color:DIMMED,fontSize:15,cursor:"pointer",textDecoration:"underline",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=E_BLUE} onMouseLeave={e=>e.currentTarget.style.color=DIMMED}>Terms & Conditions</button>
      </div>
      <p style={{fontSize:14,color:DIMMED,textAlign:"center"}}>© 2026 Learning Quantum Method. All rights reserved.</p>
      <p style={{fontSize:16,color:DIMMED,textAlign:"center",maxWidth:500,lineHeight:1.5}}>For questions or support: <a href="mailto:lqm@lqmmethod.com" style={{color:E_BLUE,textDecoration:"none"}}>lqm@lqmmethod.com</a></p>
      {TEST_MODE && (
        <div style={{marginTop:16,display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={activateTestMode} style={{background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:8,padding:'10px 20px',color:'#FBBF24',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif"}}>
            🔧 Unlock All (Test)
          </button>
          <button onClick={resetAll} style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 20px',color:'#EF4444',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:"'Space Grotesk',sans-serif"}}>
            🗑️ Reset All Data
          </button>
        </div>
      )}
      {TEST_MODE && (
        <p style={{fontSize:12,color:'rgba(251,191,36,0.5)',fontWeight:700,letterSpacing:'.1em'}}>⚠ TEST MODE IS ON — set TEST_MODE = false before going live</p>
      )}
    </div>
  );
}

function LegalPage({type,onClose}){
  const content = type==="privacy" ? PRIVACY_TEXT : TERMS_TEXT;
  return(
    <div style={{animation:"fadeUp .5s ease both"}}>
      <button onClick={onClose} style={{marginBottom:20,background:"rgba(0,200,255,0.07)",border:"1px solid rgba(0,200,255,0.32)",borderRadius:100,padding:"9px 20px",color:E_BLUE,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".04em",transition:"all .18s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,200,255,0.16)";e.currentTarget.style.borderColor="rgba(0,200,255,0.65)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,200,255,0.07)";e.currentTarget.style.borderColor="rgba(0,200,255,0.32)";}}>
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

function RotatingStrapline() {
  const lines = [
    "Know your type. Train your mind. Live by design.",
    "Daily brain challenges. Real cognitive gains.",
    "Five laws of health. One daily practice."
  ];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % lines.length);
        setVisible(true);
      }, 600);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div style={{textAlign:"center",height:36,marginBottom:24,overflow:"hidden"}}>
      <p style={{
        fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:20,
        color:"rgba(255,255,255,0.72)",letterSpacing:".03em",lineHeight:1.6,
        transition:"opacity .65s ease, transform .65s ease",
        opacity:visible?1:0,
        transform:visible?"translateY(0)":"translateY(8px)"
      }}>{lines[idx]}</p>
    </div>
  );
}

function Landing({onStart}){
  return(
    <div>
      <div className="fu" style={{textAlign:"center",marginBottom:28,paddingTop:8}}><Logo size="lg"/></div>
      <div className="fu1" style={{textAlign:"center",marginBottom:10}}>
        <p style={{fontSize:14,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:14}}>⚡ Behavioural Intelligence Assessment</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,64px)",lineHeight:1.05,letterSpacing:2,color:WHITE,marginBottom:6}}>You Don't Have A<br/><span className="elec">Motivation Problem.</span></h1>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,5vw,40px)",lineHeight:1,letterSpacing:2,color:"rgba(255,255,255,0.28)",marginBottom:20}}>You Have A Systems Problem.</h2>
        <RotatingStrapline/>
      </div>
      <p className="fu2" style={{textAlign:"center",fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,lineHeight:1.75,color:MUTED,maxWidth:500,margin:"0 auto 28px"}}>"Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle." — The Learning Quantum Method</p>
      <div className="fu3" style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
        {[["⚛","10-question profile"],["◎","4 behavioural archetypes"],["△","LQM Quantum Method"],["⬡","Personalised systems plan"]].map(([ic,lb])=>(
          <div key={lb} style={{display:"flex",alignItems:"center",gap:7,fontSize:16,color:DIMMED,fontWeight:500,background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:100,padding:"6px 14px"}}>
            <span style={{color:E_BLUE}}>{ic}</span>{lb}
          </div>
        ))}
      </div>
      <Panel style={{marginBottom:24,borderTop:`2px solid rgba(0,200,255,0.18)`}}>
        <SLabel>What's inside your report</SLabel>
        {[["⚛","Your Behavioural Archetype","Deep analysis of your unique motivation architecture — how you're wired to learn, decide and perform"],["◈","Strengths & Blind Spot Analysis","An honest breakdown of your psychological edge and the patterns quietly holding you back"],["△","3 LQM Quantum Strategy Cards","Scenario-based systems designed specifically for your profile"],["⬡","Your Identity Statement","The single sentence that, when repeated, rewires how you show up every day"],["◎","Your LQM Behaviour Blueprint","A personalised daily system built around your natural motivation architecture"]].map(([ic,ti,de])=>(
          <div key={ti} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <span style={{color:E_BLUE,fontSize:17,flexShrink:0,marginTop:2}}>{ic}</span>
            <div><p style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:3}}>{ti}</p><p style={{fontSize:16,color:MUTED,fontWeight:300,lineHeight:1.6}}>{de}</p></div>
          </div>
        ))}
      </Panel>
      <div className="fu4" style={{textAlign:"center"}}>
        <PrimaryBtn onClick={onStart}>⚡ Begin My Free Assessment →</PrimaryBtn>
        <p style={{marginTop:10,fontSize:15,color:DIMMED}}>Takes 3 minutes · No payment until you see your results</p>
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
        
        {/* Visual Question Image — inline base64, no file dependency */}
        {q.isVisual && (
          <div style={{marginBottom:24,textAlign:"center"}}>
            <img
              src="data:image/jpeg;base64,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"
              alt="Visual perception test"
              style={{
                maxWidth:"100%",
                width:340,
                height:"auto",
                borderRadius:12,
                border:`2px solid ${BORDER2}`,
                boxShadow:`0 4px 24px rgba(0,0,0,0.45)`
              }}
            />
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
      <Panel glow style={{borderColor:t>0?BORDER:"rgba(255,60,60,0.25)"}}>
        <div style={{textAlign:"center",marginBottom:18}}><TimerBadge t={t} fmt={fmt}/></div>
        {t>0 ? (
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span>
                <span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span>
                <span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:15,fontWeight:700}}>67% off</span>
              </div>
              <p style={{fontSize:16,color:DIMMED}}>One-time · Instant access · Full personalised report</p>
            </div>
            <PrimaryBtn onClick={onUnlockOffer}>⚡ Unlock My Full Profile Report →</PrimaryBtn>
            <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
              {["Instant access","Built for your profile","7-day guarantee"].map(f=>(
                <span key={f} style={{fontSize:15,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:E_BLUE}}>✓</span>{f}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{ORIGINAL}</span>
              </div>
              <p style={{fontSize:16,color:"rgba(255,255,255,0.45)"}}>The launch offer has expired — standard price applies</p>
            </div>
            <button onClick={onUnlockFull} style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",transition:"all .2s ease",display:"block",background:"linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08))",color:WHITE,boxShadow:"0 6px 24px rgba(255,255,255,0.08)"}}>Unlock My Full Profile Report →</button>
            <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
              {["Instant access","Built for your profile","7-day guarantee"].map(f=>(
                <span key={f} style={{fontSize:15,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:"rgba(255,255,255,0.4)"}}>✓</span>{f}</span>
              ))}
            </div>
          </>
        )}
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
