import { useState, useEffect, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');`;

const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const E_GLOW  = "rgba(0,200,255,0.18)";
const BLACK   = "#04070F";
const DARK    = "#080E1A";
const DARK2   = "#0C1525";
const PANEL   = "rgba(255,255,255,0.04)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.07)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.5)";
const DIMMED  = "rgba(255,255,255,0.25)";
const SYMS    = ["⚛","◈","⬡","△","◎","⊕","⟁","⬢"];

const questions = [
  {id:1,sym:"⚛",text:"When you set a major goal, what's your first instinct?",opts:[
    {t:"Design a precise system and track every step",ty:"A"},
    {t:"Research deeply until I truly understand it",ty:"B"},
    {t:"Find someone who's done it and learn from them",ty:"C"},
    {t:"Visualise the person I'll become when I achieve it",ty:"D"},
  ]},
  {id:2,sym:"◎",text:"Your honest definition of success:",opts:[
    {t:"Consistent, measurable results — proof in the numbers",ty:"A"},
    {t:"Genuine mastery — understanding something at its deepest level",ty:"B"},
    {t:"Making a meaningful difference to people I care about",ty:"C"},
    {t:"Creating something original that only I could have made",ty:"D"},
  ]},
  {id:3,sym:"△",text:"You've been stuck for three days. What actually breaks the deadlock?",opts:[
    {t:"I reset my system — break it into smaller daily actions",ty:"A"},
    {t:"I reframe it as a problem to be solved with better information",ty:"B"},
    {t:"Someone I respect holds me accountable",ty:"C"},
    {t:"I change the environment entirely and start fresh",ty:"D"},
  ]},
  {id:4,sym:"⬡",text:"Which condition produces your best work?",opts:[
    {t:"Clear structure, defined metrics, known expectations",ty:"A"},
    {t:"Freedom to explore, question, and go deep",ty:"B"},
    {t:"A strong team with shared purpose and mutual trust",ty:"C"},
    {t:"Full creative autonomy over the vision and execution",ty:"D"},
  ]},
  {id:5,sym:"⊕",text:"What depletes your motivation fastest?",opts:[
    {t:"Effort with no visible progress or measurable result",ty:"A"},
    {t:"Repetition with no growth or learning",ty:"B"},
    {t:"Isolation — working without human connection",ty:"C"},
    {t:"Being handed a script and told to follow it",ty:"D"},
  ]},
  {id:6,sym:"⟁",text:"Someone critiques your work sharply. Your real first reaction:",opts:[
    {t:"I measure it against the objective — is it accurate?",ty:"A"},
    {t:"I ask questions to understand their reasoning",ty:"B"},
    {t:"I notice how it affects my relationship with them",ty:"C"},
    {t:"I feel it intensely — then use the friction as fuel",ty:"D"},
  ]},
  {id:7,sym:"◈",text:"When learning something genuinely difficult, you naturally:",opts:[
    {t:"Follow a proven system or structured curriculum",ty:"A"},
    {t:"Go straight to source material and build your own understanding",ty:"B"},
    {t:"Learn by doing it with others or teaching it",ty:"C"},
    {t:"Experiment, fail, iterate — trial is the teacher",ty:"D"},
  ]},
  {id:8,sym:"⬢",text:"Your relationship with long-term goals:",opts:[
    {t:"I thrive on them — the system is the goal",ty:"A"},
    {t:"I like goals that evolve as my understanding deepens",ty:"B"},
    {t:"Goals feel most alive when shared with others",ty:"C"},
    {t:"My north star is fixed — how I get there is flexible",ty:"D"},
  ]},
  {id:9,sym:"⚛",text:"At the end of a high-performance day, you feel:",opts:[
    {t:"Accomplished — the system ran perfectly",ty:"A"},
    {t:"Expanded — I understand something I didn't this morning",ty:"B"},
    {t:"Connected — I contributed to something beyond myself",ty:"C"},
    {t:"Alive — I made something that didn't exist before",ty:"D"},
  ]},
  {id:10,sym:"△",text:"The sentence that wires deepest into your brain:",opts:[
    {t:'"You do not rise to the level of your goals. You fall to the level of your systems."',ty:"A"},
    {t:'"The more I learn, the more I realise how much I don\'t know."',ty:"B"},
    {t:'"Alone we can do so little. Together we can do so much."',ty:"C"},
    {t:'"The people crazy enough to think they can change the world are the ones who do."',ty:"D"},
  ]},
];

const TYPES = {
  A:{sym:"◈",name:"The Systems Architect",arch:"Identity: The Builder",
    tag:"You don't chase motivation. You engineer it.",
    hook:"Most people try to motivate themselves. You build systems that make motivation irrelevant.",
    desc:"Your psychology is wired for precision and process. While others rely on willpower — a depleting resource — you understand intuitively what the Learning Quantum Method has proven through years of behavioural research: sustainable performance follows systems, not intentions. Your quantum edge is the ability to translate ambition into repeatable, compounding architecture. The small improvements add up to extraordinary results. You know this. The question is whether your system is designed for the right identity.",
    identity:"I am someone who builds systems that work even when I don't feel like it.",
    atomic:"Your quantum stack needs auditing, not expanding. You likely have good systems — but they may be optimised for the wrong outputs. Identify the ONE behaviour that, if repeated daily, would make everything else easier or unnecessary.",
    strengths:["Systems design","Execution consistency","Long-horizon thinking","Process optimisation"],
    blindspots:["Can mistake motion for progress","Perfectionism delays launch","May optimise the wrong thing efficiently"],
    strategies:[
      {area:"The Quantum Increment",scenario:"I delay starting when the outcome feels uncertain or the project feels too large.",
       solution:"Shrink the action until it feels almost embarrassingly small. The goal isn't to write a chapter — it's to open the document. Identity is built by showing up, not by performing. Every small act of showing up is a vote for the person you're becoming."},
      {area:"Motivation Architecture",scenario:"My drive fluctuates week to week, making long-term projects unreliable.",
       solution:"Design your environment before you design your schedule. Make the desired behaviour the path of least resistance. Remove friction from what you want to do. Add friction to what you want to stop. Motivation follows the path you've already cleared."},
      {area:"The Identity Shift",scenario:"I feel frustrated when results don't match effort — I'm doing everything right but it's not working.",
       solution:"Ask not 'what do I want to achieve?' but 'who do I need to become?' Rewrite your daily actions as identity statements: 'I am someone who reviews progress every Friday.' Outcomes are lagging measures of identity. Build the identity first."},
    ],
    blue:"#00C8FF",glow:"rgba(0,200,255,0.12)"},
  B:{sym:"◉",name:"The Deep Learner",arch:"Identity: The Scholar",
    tag:"Your curiosity is a compounding asset.",
    hook:"Shallow knowledge is everywhere. What you build goes three levels deeper than anyone else in the room.",
    desc:"You are driven by a rare and powerful force: the need to truly understand. Not surface knowledge — genuine comprehension. This is the foundation of expertise, and expertise is the foundation of irreplaceable value. The research confirms what you feel intuitively: deep work produces disproportionate results. Your challenge isn't capacity — it's converting accumulated understanding into decisive, visible action.",
    identity:"I am someone who turns deep understanding into decisive, courageous action.",
    atomic:"Knowledge without deployment is stored potential. Your quantum stack needs a 'publish' step — a regular moment where you translate internal understanding into external output, however imperfect.",
    strengths:["Intellectual depth","Pattern recognition","Mastery orientation","Analytical precision"],
    blindspots:["Analysis paralysis before action","'Not ready yet' as avoidance","Over-invests in understanding, under-invests in doing"],
    strategies:[
      {area:"The 70% Threshold",scenario:"I over-research and delay acting until I feel truly ready — which rarely comes.",
       solution:"Set a decision threshold: when you have 70% of the information you want, act. Treat the remaining 30% as field research — data you can only gather by doing. Action is the most advanced form of learning available to you."},
      {area:"Complexity as Motivation",scenario:"Repetitive or routine tasks drain me rapidly — I lose interest and disengage.",
       solution:"Find the hidden variable. In every routine task, there is one dimension you could optimise. Make the question 'how could I do this 10% more intelligently?' your daily prompt. Turn execution into experimentation."},
      {area:"The Output Practice",scenario:"I accumulate knowledge but struggle to show my work or share my thinking.",
       solution:"Build a weekly 'output ritual' — one piece of thinking made visible. A note, a voice memo, a conversation where you teach what you've learned. The act of explaining is the act of understanding at depth."},
    ],
    blue:"#38BDF8",glow:"rgba(56,189,248,0.12)"},
  C:{sym:"◎",name:"The Relational Catalyst",arch:"Identity: The Connector",
    tag:"You make everything — and everyone — better.",
    hook:"While others optimise for outputs, you understand the lever that moves everything: people.",
    desc:"Your motivation is relational at its core. You are energised by shared purpose, activated by belonging, and sustained by the knowledge that your effort matters to real people. Research consistently shows that social commitment is one of the most powerful forces in behaviour change. Your quantum leap is learning to channel this relational fuel into your own consistent growth — not just the growth of those around you.",
    identity:"I am someone who builds relationships that hold me accountable to my own growth.",
    atomic:"Your quantum stack needs a social architecture layer. Every major goal should have one human being attached to it — someone who benefits from your success, or to whom you've made a commitment. Accountability is your performance-enhancing mechanism.",
    strengths:["Emotional intelligence","Trust-building","Authentic leadership","Sustained effort under social commitment"],
    blindspots:["Loses personal direction without external anchors","Avoids necessary conflict","Absorbs others' energy and momentum"],
    strategies:[
      {area:"The Relational Goal Stack",scenario:"I lose motivation when working in isolation — the drive evaporates without connection.",
       solution:"Attach every personal goal to a specific person. Write: 'Achieving this allows me to show up better for [name] because [reason].' Share it with them. You have just created the most powerful motivational force in your psychology."},
      {area:"The Morning Anchor",scenario:"I absorb the emotional weather of those around me — their demotivation becomes mine.",
       solution:"Create a 10-minute pre-contact ritual each morning before interacting with anyone. Write three intentions. This builds an internal foundation that external moods cannot destabilise. Your identity precedes their influence."},
      {area:"The Accountability Architecture",scenario:"I need external commitment to sustain effort — and feel this is a weakness.",
       solution:"It isn't a weakness — it's a feature. Formalise it. Identify one person for a weekly check-in: one win, one struggle, one commitment. You're not removing the need for connection. You're building it intelligently into your growth system."},
    ],
    blue:"#34D399",glow:"rgba(52,211,153,0.12)"},
  D:{sym:"◇",name:"The Visionary Pioneer",arch:"Identity: The Creator",
    tag:"You don't follow the map. You draw it.",
    hook:"Every framework, every system, every method you've ever used — someone like you invented it first.",
    desc:"You are driven by possibility. You think in futures that don't exist yet. Your motivation comes from creative autonomy, the thrill of the blank canvas, and the deep satisfaction of making something that carries your fingerprint. The research on intrinsic motivation is clear: autonomy, mastery, and purpose are the triumvirate. You have all three in abundance. Your challenge is not creativity — it's building just enough structure to bring your vision fully across the finish line.",
    identity:"I am someone who brings bold visions into the world with enough structure to complete them.",
    atomic:"Your quantum stack needs a completion mechanism. You likely have strong starting rituals. Build equally strong finishing rituals — a defined moment where you declare a project 'shipped' and begin the next creative act.",
    strengths:["Original thinking","Intrinsic drive","Bold risk tolerance","Inspiring through vision"],
    blindspots:["Motivation drops after the initial spark","Too many projects, too few completions","Structure feels like a cage"],
    strategies:[
      {area:"The Evolution Frame",scenario:"My motivation collapses once the exciting creation phase ends and execution begins.",
       solution:"Reframe completion as the beginning of the next creative act, not the death of this one. Keep an 'Evolution Log' — a live document tracking how your project is changing and improving. The project is never finished. It is always becoming."},
      {area:"The One Brilliant Thing",scenario:"I scatter energy across multiple ideas simultaneously and make shallow progress on all of them.",
       solution:"Each week, identify the single most important creative act. Protect 90 uninterrupted minutes for it — first, before anything else. Everything else is secondary until that window is honoured. Constraint creates the conditions for your best work."},
      {area:"The Separation Protocol",scenario:"My output never matches my internal vision and this gap demotivates me deeply.",
       solution:"Separate creation from evaluation entirely. During making: no judgement allowed. Schedule a 'critical review' 24 hours after completion with fresh eyes. The inner critic and the inner creator cannot occupy the same creative moment."},
    ],
    blue:"#A78BFA",glow:"rgba(167,139,250,0.12)"},
};

const ORIGINAL = 27, DISCOUNTED = 9, TIMER_SECS = 15 * 60;

function Particles() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {Array.from({length:16}).map((_,i) => {
        const sym = SYMS[i % SYMS.length];
        const left = 5 + (i * 6.2) % 90;
        const dur = 16 + (i * 3.7) % 18;
        const delay = -((i * 2.3) % 20);
        const size = 10 + (i * 1.7) % 14;
        const opacity = 0.04 + (i * 0.003) % 0.06;
        return (
          <div key={i} style={{position:"absolute",left:`${left}%`,bottom:-60,fontSize:size,color:E_BLUE,opacity,animation:`floatUp ${dur}s ${delay}s linear infinite`}}>{sym}</div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState(null);
  const [charType, setCharType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const [timerOn, setTimerOn] = useState(false);
  const [procStep, setProcStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = FONTS + `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html,body{background:${BLACK};}
      @keyframes floatUp{from{transform:translateY(0) rotate(0deg);}to{transform:translateY(-110vh) rotate(360deg);opacity:0;}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
      @keyframes glow{0%,100%{text-shadow:0 0 20px ${E_BLUE}88;}50%{text-shadow:0 0 40px ${E_BLUE};}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.45;}}
      @keyframes spin{to{transform:rotate(360deg);}}
      @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
      @keyframes blurIn{from{filter:blur(8px);opacity:0;}to{filter:blur(0);opacity:1;}}
      @keyframes scan{0%{transform:translateY(-100%);}100%{transform:translateY(200vh);}}
      .fu{animation:fadeUp .65s ease both;}
      .fu1{animation:fadeUp .65s .1s ease both;}
      .fu2{animation:fadeUp .65s .22s ease both;}
      .fu3{animation:fadeUp .65s .36s ease both;}
      .fu4{animation:fadeUp .65s .5s ease both;}
      .fu5{animation:fadeUp .65s .65s ease both;}
      .elec{background:linear-gradient(90deg,${E_BLUE} 0%,#fff 40%,${E_BLUE} 60%,${E_BLUE2} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;}
      .urgent{animation:pulse 1s infinite;}
      .blur-lock{filter:blur(5px);user-select:none;pointer-events:none;}
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    if (timerOn && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerOn, timeLeft]);

  const fmt = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
  const calcType = ans => { const c={A:0,B:0,C:0,D:0}; ans.forEach(a=>c[a]++); return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]; };

  const handleNext = () => {
    if (!sel) return;
    const a = [...answers, sel];
    setAnswers(a); setSel(null);
    if (qIdx < questions.length - 1) { setQIdx(qIdx + 1); }
    else {
      setCharType(calcType(a)); setPhase("processing");
      let st = 0;
      const iv = setInterval(() => { st++; setProcStep(st); if(st>=5){clearInterval(iv);setTimeout(()=>setPhase("teaser"),600);} }, 850);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 50% at 50% -10%,rgba(0,200,255,0.07) 0%,transparent 60%),${BLACK}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 80px",position:"relative",overflow:"hidden"}}>
      <Particles/>
      {/* Top bar */}
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(4,7,15,0.85)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100,marginBottom:0}}>
        <Logo size="sm"/>
      </div>
      <div style={{width:"100%",maxWidth:680,position:"relative",zIndex:1,paddingTop:40}}>
        {phase==="landing"    && <Landing onStart={()=>{setTimerOn(true);setPhase("quiz");}} t={timeLeft} fmt={fmt}/>}
        {phase==="quiz"       && <Quiz q={questions[qIdx]} idx={qIdx} sel={sel} onSel={setSel} onNext={handleNext} t={timeLeft} fmt={fmt}/>}
        {phase==="processing" && <Processing step={procStep}/>}
        {phase==="teaser"     && <Teaser type={TYPES[charType]} t={timeLeft} fmt={fmt} onUnlock={()=>setPhase("paid")}/>}
        {phase==="paid"       && <Report type={TYPES[charType]}/>}
      </div>
    </div>
  );
}

function Logo({size="md"}) {
  const sc = size==="sm"?.58:size==="lg"?1.25:1;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
      <div style={{position:"relative",display:"inline-block"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52*sc,letterSpacing:3*sc,color:WHITE,lineHeight:1,textShadow:`0 0 30px ${E_BLUE}55`}}>LQM</span>
        <span style={{position:"absolute",top:-7*sc,right:-4*sc,fontSize:15*sc,color:E_BLUE,textShadow:`0 0 12px ${E_BLUE}`,animation:"glow 2.5s ease-in-out infinite"}}>⚡</span>
        <svg style={{position:"absolute",bottom:-3*sc,left:0,width:"100%"}} height={5*sc} viewBox="0 0 160 5">
          <path d="M28 4 Q80 1 132 4" stroke={E_BLUE} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6"/>
        </svg>
      </div>
      <p style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:8*sc,fontWeight:600,letterSpacing:.2*sc+"em",color:"rgba(0,200,255,0.55)",textTransform:"uppercase",marginTop:3*sc}}>Learning Quantum Method</p>
    </div>
  );
}

function TimerBadge({t,fmt}) {
  const urgent = t < 180;
  return (
    <div className={urgent?"urgent":""} style={{display:"inline-flex",alignItems:"center",gap:8,background:urgent?"rgba(255,60,60,0.08)":"rgba(0,200,255,0.06)",border:`1px solid ${urgent?"rgba(255,60,60,0.35)":BORDER}`,borderRadius:100,padding:"6px 16px",fontSize:12,fontWeight:600,letterSpacing:".06em",color:urgent?"#FF6B6B":E_BLUE}}>
      <span>⚡</span>{t>0?`Offer expires ${fmt(t)}`:"Offer expired"}
    </div>
  );
}

function Panel({children,style={},glow=false}) {
  return (
    <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"26px 26px",boxShadow:glow?`0 0 40px ${E_GLOW},inset 0 0 40px rgba(0,200,255,0.02)`:"none",...style}}>
      {children}
    </div>
  );
}

function SLabel({children,color=E_BLUE}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
      <p style={{fontSize:10,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color,whiteSpace:"nowrap"}}>{children}</p>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,${color}44,transparent)`}}/>
    </div>
  );
}

function PrimaryBtn({onClick,children}) {
  return (
    <button onClick={onClick} style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:15,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",letterSpacing:".05em",transition:"all .2s ease",display:"block",background:`linear-gradient(135deg,${E_BLUE2},${E_BLUE})`,color:BLACK,boxShadow:`0 6px 24px rgba(0,200,255,0.25)`}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 12px 40px rgba(0,200,255,0.4)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 6px 24px rgba(0,200,255,0.25)`;}}>
      {children}
    </button>
  );
}

function Landing({onStart,t,fmt}) {
  return (
    <div>
      <div className="fu" style={{textAlign:"center",marginBottom:28,paddingTop:8}}><Logo size="lg"/></div>
      <div className="fu1" style={{textAlign:"center",marginBottom:10}}>
        <p style={{fontSize:11,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:E_BLUE,marginBottom:14}}>⚡ Behavioural Intelligence Assessment</p>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,64px)",lineHeight:1.05,letterSpacing:2,color:WHITE,marginBottom:6}}>
          You Don't Have A<br/><span className="elec">Motivation Problem.</span>
        </h1>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(24px,5vw,40px)",lineHeight:1,letterSpacing:2,color:"rgba(255,255,255,0.3)",marginBottom:22}}>You Have A Systems Problem.</h2>
      </div>
      <p className="fu2" style={{textAlign:"center",fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,lineHeight:1.75,color:MUTED,maxWidth:500,margin:"0 auto 28px"}}>
        "Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle." — The LQM Principle
      </p>
      <div className="fu3" style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
        {[["⚛","10-question profile"],["◎","4 behavioural archetypes"],["△","LQM Quantum Method"],["⬡","Personalised systems plan"]].map(([ic,lb])=>(
          <div key={lb} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:DIMMED,fontWeight:500,background:"rgba(255,255,255,0.03)",border:`1px solid ${BORDER2}`,borderRadius:100,padding:"6px 14px"}}>
            <span style={{color:E_BLUE}}>{ic}</span>{lb}
          </div>
        ))}
      </div>

      <Panel className="fu4" style={{marginBottom:14,borderColor:BORDER}} glow>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{color:E_BLUE,fontSize:18}}>⚡</span>
          <p style={{fontSize:10,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE}}>Launch Pricing — Limited Window</p>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span>
          <span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span>
          <span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:12,fontWeight:700}}>67% off</span>
        </div>
        <p style={{fontSize:14,color:MUTED,fontWeight:300,lineHeight:1.6}}>Complete the assessment to lock in this price. Full personalised report delivered instantly.</p>
      </Panel>

      <div className="fu4" style={{textAlign:"center",marginBottom:12}}><TimerBadge t={t} fmt={fmt}/></div>
      <div className="fu5" style={{textAlign:"center"}}>
        <PrimaryBtn onClick={onStart}>⚡ Begin My Profile Assessment →</PrimaryBtn>
        <p style={{marginTop:10,fontSize:12,color:DIMMED}}>No payment required until you see your results</p>
      </div>

      <Panel style={{marginTop:26,borderTop:`2px solid rgba(0,200,255,0.2)`}}>
        <SLabel>What's inside your report</SLabel>
        {[["⚛","Your Behavioural Archetype","Deep analysis of your unique motivation architecture — how you're wired to learn, decide and perform"],["◈","Strengths & Blind Spot Analysis","An honest breakdown of your psychological edge and the patterns quietly holding you back"],["△","3 LQM Quantum Strategy Cards","Scenario-based systems designed specifically for your profile — not generic advice"],["⬡","Your Identity Statement","The single sentence that, when repeated, rewires how you show up every day"],["◎","Your LQM Behaviour Blueprint","A personalised daily system built around your natural motivation architecture"]].map(([ic,ti,de])=>(
          <div key={ti} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
            <span style={{color:E_BLUE,fontSize:17,flexShrink:0,marginTop:2}}>{ic}</span>
            <div><p style={{fontSize:14,fontWeight:600,color:WHITE,marginBottom:3}}>{ti}</p><p style={{fontSize:13,color:MUTED,fontWeight:300,lineHeight:1.6}}>{de}</p></div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Quiz({q,idx,sel,onSel,onNext,t,fmt}) {
  const pct = (idx / questions.length) * 100;
  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:DIMMED}}>{String(idx+1).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}</span>
        <TimerBadge t={t} fmt={fmt}/>
      </div>
      <div style={{height:2,background:"rgba(255,255,255,0.06)",borderRadius:100,marginBottom:30,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${E_BLUE2},${E_BLUE})`,borderRadius:100,transition:"width .5s ease",boxShadow:`0 0 12px ${E_BLUE}66`}}/>
      </div>
      <Panel glow>
        <div style={{fontSize:30,color:E_BLUE,marginBottom:14,textShadow:`0 0 20px ${E_BLUE}`}}>{q.sym}</div>
        <h2 style={{fontFamily:"'Crimson Pro',serif",fontSize:"clamp(19px,3.5vw,25px)",fontWeight:400,lineHeight:1.5,color:WHITE,marginBottom:26}}>{q.text}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
          {q.opts.map((opt,i) => {
            const isS = sel===opt.ty;
            return (
              <button key={i} onClick={()=>onSel(opt.ty)} style={{background:isS?"rgba(0,200,255,0.08)":"rgba(255,255,255,0.02)",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,borderRadius:12,padding:"14px 18px",textAlign:"left",cursor:"pointer",transition:"all .2s ease",color:isS?WHITE:MUTED,fontSize:14,fontFamily:"'Space Grotesk',sans-serif",fontWeight:isS?500:400,lineHeight:1.5,display:"flex",alignItems:"center",gap:14,boxShadow:isS?`0 0 20px ${E_GLOW}`:"none"}}
                onMouseEnter={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=WHITE;}}}
                onMouseLeave={e=>{if(!isS){e.currentTarget.style.borderColor=BORDER2;e.currentTarget.style.color=MUTED;}}}>
                <span style={{width:26,height:26,borderRadius:"50%",border:`1.5px solid ${isS?E_BLUE:BORDER2}`,background:isS?E_BLUE:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color:isS?BLACK:"transparent",fontWeight:800,transition:"all .2s",boxShadow:isS?`0 0 12px ${E_BLUE}88`:"none"}}>✓</span>
                {opt.t}
              </button>
            );
          })}
        </div>
        {sel
          ? <PrimaryBtn onClick={onNext}>{idx<questions.length-1?"Next Question →":"Reveal My Profile →"}</PrimaryBtn>
          : <button disabled style={{width:"100%",border:"none",borderRadius:100,padding:"17px",fontSize:15,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"not-allowed",background:"rgba(255,255,255,0.05)",color:DIMMED}}>Select an answer to continue</button>
        }
      </Panel>
    </div>
  );
}

function Processing({step}) {
  const steps=["Decoding your response patterns…","Mapping your motivation architecture…","Cross-referencing behavioural research…","Identifying your psychological edge…","Generating your personalised system…"];
  return (
    <div style={{textAlign:"center",paddingTop:60}}>
      <div style={{position:"relative",width:80,height:80,margin:"0 auto 36px"}}>
        <div style={{width:80,height:80,borderRadius:"50%",border:"2px solid rgba(0,200,255,0.1)",borderTop:`2px solid ${E_BLUE}`,animation:"spin 1s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:28,textShadow:`0 0 20px ${E_BLUE}`}}>⚛</div>
      </div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2,marginBottom:8,color:WHITE}}>Analysing Your Profile</h2>
      <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:DIMMED,marginBottom:36}}>Learning Quantum Method behavioural analysis in progress</p>
      <Panel style={{maxWidth:400,margin:"0 auto",textAlign:"left"}}>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:i<steps.length-1?14:0,opacity:step>i?1:.2,transition:"opacity .5s ease"}}>
            <span style={{color:step>i?E_BLUE:DIMMED,fontSize:14,flexShrink:0,textShadow:step>i?`0 0 10px ${E_BLUE}`:"none"}}>{step>i?"⚡":"○"}</span>
            <span style={{fontSize:13,color:step>i?WHITE:DIMMED,fontWeight:step>i?500:300}}>{s}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function Teaser({type,t,fmt,onUnlock}) {
  return (
    <div style={{animation:"fadeUp .6s ease both"}}>
      <Panel glow style={{textAlign:"center",marginBottom:14,borderColor:`${type.blue}44`}}>
        <p style={{fontSize:10,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:type.blue,marginBottom:14}}>⚡ Your LQM Behavioural Profile</p>
        <div style={{fontSize:50,color:type.blue,marginBottom:10,textShadow:`0 0 30px ${type.blue}`}}>{type.sym}</div>
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
          <span style={{fontSize:13,color:DIMMED}}>🔒 Unlock to reveal</span>
        </div>
      </Panel>

      <Panel style={{marginBottom:18,position:"relative",overflow:"hidden",minHeight:170}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <div className="blur-lock">
          {type.strategies.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
              <span style={{color:type.blue,fontSize:15,flexShrink:0}}>◈</span>
              <div><p style={{fontSize:13,fontWeight:600,color:WHITE,marginBottom:3}}>{s.area}</p><p style={{fontSize:12,color:MUTED,fontWeight:300}}>{s.scenario}</p></div>
            </div>
          ))}
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"60%",background:`linear-gradient(to bottom,transparent,${DARK})`,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:12}}>
          <span style={{fontSize:13,color:DIMMED}}>🔒 3 personalised strategy cards inside</span>
        </div>
      </Panel>

      <Panel glow style={{borderColor:BORDER}}>
        <div style={{textAlign:"center",marginBottom:18}}><TimerBadge t={t} fmt={fmt}/></div>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12,justifyContent:"center",marginBottom:6}}>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:54,letterSpacing:1,color:WHITE}}>£{DISCOUNTED}</span>
            <span style={{fontSize:22,color:DIMMED,textDecoration:"line-through"}}>£{ORIGINAL}</span>
            <span style={{background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,color:E_BLUE,padding:"3px 12px",borderRadius:100,fontSize:12,fontWeight:700}}>67% off</span>
          </div>
          <p style={{fontSize:13,color:DIMMED}}>One-time · Instant access · Full personalised report</p>
        </div>
        <PrimaryBtn onClick={onUnlock}>⚡ Unlock My Full Profile Report →</PrimaryBtn>
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginTop:14}}>
          {["Instant access","Built for your profile","30-day guarantee"].map(f=>(
            <span key={f} style={{fontSize:12,color:DIMMED,display:"flex",alignItems:"center",gap:5}}><span style={{color:E_BLUE}}>✓</span>{f}</span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Report({type}) {
  return (
    <div style={{animation:"blurIn .8s ease both"}}>
      <div style={{background:`linear-gradient(135deg,${DARK2},${BLACK})`,border:`1px solid ${type.blue}33`,borderRadius:20,padding:"40px 28px",textAlign:"center",marginBottom:16,boxShadow:`0 0 60px ${type.glow}`}}>
        <div style={{display:"inline-block",background:"rgba(0,200,255,0.1)",border:`1px solid ${BORDER}`,borderRadius:100,padding:"5px 14px",fontSize:11,color:E_BLUE,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:18}}>⚡ Report Unlocked</div>
        <Logo size="sm"/>
        <p style={{fontSize:10,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",fontWeight:600,marginTop:8,marginBottom:22}}>Behavioural Intelligence Report</p>
        <div style={{fontSize:58,color:type.blue,marginBottom:14,textShadow:`0 0 40px ${type.blue}`}}>{type.sym}</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,48px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{type.name}</h1>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontStyle:"italic",color:type.blue}}>{type.arch}</p>
      </div>

      <Panel style={{borderLeft:`3px solid ${type.blue}`,borderRadius:"0 14px 14px 0",marginBottom:14,background:type.glow}}>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:20,fontStyle:"italic",color:WHITE,lineHeight:1.65}}>"{type.tag}"</p>
      </Panel>

      {/* Identity */}
      <Panel glow style={{marginBottom:14,textAlign:"center",background:`linear-gradient(135deg,${type.glow},rgba(0,0,0,0.3))`}}>
        <p style={{fontSize:10,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:type.blue,marginBottom:14}}>◈ Your Identity Statement</p>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:21,fontStyle:"italic",color:WHITE,lineHeight:1.65,marginBottom:14}}>"{type.identity}"</p>
        <p style={{fontSize:12,color:DIMMED,fontWeight:300}}>Repeat this daily. Identity precedes behaviour. Behaviour compounds into results.</p>
      </Panel>

      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Profile Overview</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,lineHeight:1.85,color:"rgba(255,255,255,0.75)",fontWeight:300}}>{type.desc}</p>
      </Panel>

      <Panel style={{marginBottom:14,borderLeft:`3px solid ${E_BLUE}`,background:"rgba(0,200,255,0.04)"}}>
        <p style={{fontSize:10,fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:E_BLUE,marginBottom:10}}>⚛ LQM Quantum Insight</p>
        <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.8)",fontWeight:300}}>{type.atomic}</p>
      </Panel>

      <Panel style={{marginBottom:14}}>
        <SLabel color={type.blue}>Core Strengths</SLabel>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          {type.strengths.map(s=>(
            <div key={s} style={{background:type.glow,border:`1px solid ${type.blue}44`,borderRadius:100,padding:"8px 18px",fontSize:13,color:type.blue,fontWeight:600}}>{s}</div>
          ))}
        </div>
      </Panel>

      <Panel style={{marginBottom:18}}>
        <SLabel color="rgba(255,180,50,0.8)">Blind Spots to Navigate</SLabel>
        {type.blindspots.map(b=>(
          <div key={b} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"11px 14px",background:"rgba(255,180,50,0.04)",border:"1px solid rgba(255,180,50,0.1)",borderRadius:10,marginBottom:8}}>
            <span style={{color:"rgba(255,180,50,0.7)",flexShrink:0,marginTop:1}}>△</span>
            <span style={{fontSize:14,color:MUTED,fontWeight:300,lineHeight:1.6}}>{b}</span>
          </div>
        ))}
      </Panel>

      {/* Strategy cards */}
      <Panel style={{marginBottom:12}}>
        <SLabel color={type.blue}>Your 3 LQM Quantum Strategy Cards</SLabel>
        <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.65}}>The following systems are built specifically for your behavioural profile.</p>
      </Panel>
      {type.strategies.map((s,i)=>(
        <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${type.blue}`,borderRadius:16,overflow:"hidden",marginBottom:12}}>
          <div style={{background:type.glow,borderBottom:`1px solid ${type.blue}22`,padding:"14px 22px",display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:28,height:28,borderRadius:"50%",background:type.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:BLACK,fontWeight:800,flexShrink:0}}>{i+1}</span>
            <p style={{fontSize:11,fontWeight:700,color:type.blue,letterSpacing:".08em",textTransform:"uppercase"}}>{s.area}</p>
          </div>
          <div style={{padding:"20px 22px"}}>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
              <p style={{fontSize:10,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>The Scenario</p>
              <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,fontStyle:"italic",color:"rgba(255,255,255,0.8)",lineHeight:1.65}}>"{s.scenario}"</p>
            </div>
            <p style={{fontSize:10,fontWeight:700,color:type.blue,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>Your System</p>
            <p style={{fontSize:14,lineHeight:1.85,color:"rgba(255,255,255,0.75)",fontWeight:300}}>{s.solution}</p>
          </div>
        </div>
      ))}

      <Panel style={{textAlign:"center",background:`linear-gradient(135deg,${DARK2},${BLACK})`}}>
        <Logo size="sm"/>
        <div style={{width:50,height:1,background:`linear-gradient(90deg,transparent,${E_BLUE}55,transparent)`,margin:"18px auto"}}/>
        <p style={{fontFamily:"'Crimson Pro',serif",fontSize:19,fontStyle:"italic",color:MUTED,lineHeight:1.7,maxWidth:420,margin:"0 auto 12px"}}>"Small shifts, consistently honoured, produce quantum results. The habit is not the destination — it is the vehicle."</p>
        <p style={{fontSize:11,color:DIMMED,letterSpacing:".06em"}}>— The Learning Quantum Method</p>
        <div style={{height:1,background:BORDER2,margin:"18px 0"}}/>
        <p style={{fontSize:11,color:DIMMED,letterSpacing:".1em"}}>LQM Behavioural Intelligence Report · {type.name}</p>
      </Panel>
    </div>
  );
}
