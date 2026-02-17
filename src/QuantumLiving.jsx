import { useState, useEffect } from "react";

const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const BG      = "#070F1E";
const DARK    = "#0D1830";
const DARK2   = "#111E38";
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.62)";
const DIMMED  = "rgba(255,255,255,0.32)";
const GREEN   = "#34D399";
const AMBER   = "#FBBF24";

// ── 5 Quantum Laws ────────────────────────────────────────────────────────────
const LAWS = [
  {
    num: "01",
    sym: "◎",
    title: "Quantum Rest",
    subtitle: "Law of Proper Sleep",
    color: "#818CF8",
    glow: "rgba(129,140,248,0.12)",
    icon: "🌙",
    principle: "Sleep is not recovery from life. Sleep is where life is built.",
    truth: "Every cognitive function, emotional regulation, hormonal balance, and physical repair depends on the quality of your sleep. The brain consolidates learning, flushes toxins, and resets motivation architecture during deep sleep. A tired brain is a reactive brain — not a responsive one.",
    dailyPractice: "Set a consistent sleep window — same time to bed, same time to rise. Seven to nine hours is not a luxury. It is the non-negotiable foundation of your quantum performance. Protect it as fiercely as your most important appointment.",
    quantumEdge: "People who sleep 7–9 hours consistently outperform those who sleep less across every measurable cognitive and emotional metric. Sleep is not the opposite of productivity. It is its engine.",
    practices: [
      { title:"The Wind-Down Protocol", desc:"One hour before sleep: no screens, dim lights, lower room temperature. Your brain needs a runway, not an emergency landing." },
      { title:"The Consistent Window", desc:"Wake at the same time every day — even weekends. This anchors your circadian rhythm and dramatically improves sleep quality within 2 weeks." },
      { title:"The Dark Sanctuary", desc:"Make your bedroom darker than you think necessary. Blackout curtains. No device lights. Darkness triggers melatonin — your natural sleep signal." },
      { title:"The Morning Light Anchor", desc:"Get natural light within 30 minutes of waking. This resets your internal clock and sets you up for better sleep the following night." },
    ],
    avoid: ["Caffeine after 2pm", "Screens within 1 hour of sleep", "Alcohol as a sleep aid (it fragments sleep architecture)", "Irregular sleep schedules"],
    lqmNote: "Your motivation archetype directly affects your sleep patterns. Systems types often stay up optimising. Visionaries lose hours to creative spirals. Know your pattern — and build your sleep system around it.",
  },
  {
    num: "02",
    sym: "⟁",
    title: "Quantum Breath",
    subtitle: "Law of Fresh Air",
    color: "#34D399",
    glow: "rgba(52,211,153,0.12)",
    icon: "🌿",
    principle: "The body is designed for oxygen-rich environments. Most people are living in chronic low-grade oxygen debt.",
    truth: "Fresh air isn't simply pleasant — it's neurologically essential. Oxygen is the primary fuel for your brain. Poor indoor air quality, reduced time outside, and shallow breathing patterns deprive your prefrontal cortex — the seat of focus, decision-making, and emotional regulation — of its primary resource.",
    dailyPractice: "Spend a minimum of 20 minutes daily in fresh, outdoor air. Move your body while you do it. Open windows at home and at work. Breathe consciously — slowly, deeply, through your nose where possible.",
    quantumEdge: "Studies consistently show that time outdoors in natural environments reduces cortisol, improves focus by up to 20%, and enhances creative thinking. The Quantum Mind needs clean air the way an engine needs clean fuel.",
    practices: [
      { title:"The Morning Walk", desc:"20 minutes of walking in fresh air before the day's demands begin. Not a podcast walk — a present walk. Notice your surroundings. Breathe deliberately." },
      { title:"The Breath Reset", desc:"Box breathing: inhale 4 counts, hold 4 counts, exhale 4 counts, hold 4 counts. Repeat 4 times. Resets the nervous system in under 2 minutes." },
      { title:"The Open Window Protocol", desc:"Spend the first 30 minutes of work with a window open. Fresh air increases oxygen availability to the brain and improves sustained attention." },
      { title:"The Nature Immersion", desc:"Once per week, spend 90 minutes in a genuinely natural environment — park, woodland, open space. This has measurable effects on brain function lasting days." },
    ],
    avoid: ["Long periods in closed, recirculated air environments without breaks", "Shallow chest breathing as a default pattern", "Smoking and passive smoke exposure", "Heavy indoor chemical exposure (cleaning products, synthetic fragrances)"],
    lqmNote: "Deep learner types often neglect outdoor time — the research rabbit hole has no fresh air. Relational types thrive when outdoor time includes meaningful connection. Know your archetype's tendencies and design your air practice accordingly.",
  },
  {
    num: "03",
    sym: "◈",
    title: "Quantum Balance",
    subtitle: "Law of Temperance",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.12)",
    icon: "⚖️",
    principle: "True balance is not just physical and mental. It is the alignment of body, mind and spirit — the complete you.",
    truth: "Temperance is the art of doing enough — not too much, not too little. It governs everything: work, rest, stimulation, consumption, digital engagement, and spiritual wellbeing. The most enduring performers in history have not simply managed their time and energy — they have anchored themselves in something greater than performance itself. Belief, faith, and a sense of divine purpose are not separate from peak living. They are foundational to it. When the inner life is nourished alongside the outer life, the whole person operates from a place of genuine strength rather than striving.",
    dailyPractice: "Audit your patterns of excess. Where are you overdoing it — work, screen time, stimulants, negative self-talk, social media? Then audit your patterns of deficiency. What are you under-investing in — rest, stillness, connection, your faith? Temperance is not abstinence. It is the wisdom to know what truly sustains you — and to choose it daily.",
    quantumEdge: "The nervous system cannot sustain constant activation. Chronic overstimulation leads to burnout, inflammation, and cognitive decline. The Quantum Mind operates in cycles — intense focus followed by genuine recovery. People with a strong sense of faith and spiritual grounding consistently show greater resilience, lower anxiety, and stronger recovery from adversity. Build your life in rhythms, not red lines — and let your belief be the bedrock beneath those rhythms.",
    practices: [
      { title:"The Stillness Practice", desc:"Begin or end your day with a period of quiet — not to empty the mind, but to bring it before something greater. Whether through prayer, reading scripture, or simply sitting in grateful silence, stillness anchors the whole day differently to those who never stop." },
      { title:"The Work-Rest Rhythm", desc:"Work in focused blocks of 90 minutes maximum, followed by genuine breaks of at least 10 minutes. This aligns with your body's natural ultradian rhythms — the same cycles of effort and restoration found throughout the natural world." },
      { title:"The Screen Sabbath", desc:"One full day per week with minimal screen engagement. The principle of Sabbath — a day set apart for rest, reflection, and renewal — is one of the oldest and wisest productivity insights ever recorded. This is not a detox. It is a recalibration of what matters." },
      { title:"The Enough Practice", desc:"At the end of each day, write the sentence 'Today I did enough because...' This builds the psychological muscle of sufficiency. Gratitude and sufficiency are the antidote to the depletion of excess — and they are practices with deep roots in faith traditions across history." },
    ],
    avoid: ["Substances that create dependency (alcohol, nicotine, recreational drugs)", "Chronic overwork masquerading as productivity", "Digital overstimulation — endless scrolling and consumption without creation", "Neglecting the inner life — spiritual emptiness is as real a depletion as physical exhaustion", "Extreme regimes that cannot be sustained"],
    lqmNote: "Systems Architects often violate temperance through over-optimisation — adding more to an already full system. Visionary types burn intensely at the start and crash. But every archetype benefits from anchoring their balance in something beyond performance. The most sustainable version of yourself is the complete you — body, mind and spirit working together.",
  },
  {
    num: "04",
    sym: "△",
    title: "Quantum Motion",
    subtitle: "Law of Exercise",
    color: "#00C8FF",
    glow: "rgba(0,200,255,0.12)",
    icon: "⚡",
    principle: "The body in motion produces a brain in flow. Physical training is cognitive training.",
    truth: "Exercise is not a vanity practice. It is neuroscience in action. Physical movement triggers the release of BDNF — Brain-Derived Neurotrophic Factor — which accelerates the growth of new neural connections. It also regulates mood, reduces anxiety, improves sleep quality, and increases the capacity for sustained focus. Moving your body is one of the highest-return investments available to you.",
    dailyPractice: "Move your body deliberately every day — not as punishment, not as obligation, but as the single most powerful cognitive and emotional upgrade available to you without cost. Walk, run, lift, swim, dance, stretch. The modality matters less than the consistency.",
    quantumEdge: "A single session of moderate aerobic exercise improves focus and working memory for up to 2 hours afterwards. Regular exercisers show significantly better stress regulation, emotional resilience, and creative output. You cannot optimise your mind while neglecting your body.",
    practices: [
      { title:"The Daily Movement Non-Negotiable", desc:"30 minutes of deliberate physical movement every day. Not optional. This is maintenance, not heroism. A walk counts. Consistency beats intensity." },
      { title:"The Strength Practice", desc:"Two to three sessions per week of resistance-based movement. Building muscular strength improves metabolic health, bone density, posture, and confidence — all of which affect cognitive performance." },
      { title:"The Outdoor Run", desc:"Running outdoors — not on a treadmill — combines the benefits of fresh air, movement, and natural environment into a single high-return practice. 20 minutes is sufficient." },
      { title:"The Movement Snack", desc:"Every 90 minutes of sitting, stand and move for 5 minutes. Walk, stretch, step outside. This prevents the physiological and cognitive decline associated with prolonged sitting." },
    ],
    avoid: ["Sedentary periods longer than 2 hours without movement", "Treating exercise as a punishment for eating", "Overtraining without adequate recovery", "Using 'I don't have time' as a reason — a 20-minute walk requires no equipment, no gym, no schedule"],
    lqmNote: "Deep Learners resist leaving the desk. Systems Architects may over-programme exercise until it becomes another optimisation project. The best movement practice is the one you'll actually do consistently. Start embarrassingly small.",
  },
  {
    num: "05",
    sym: "⬡",
    title: "Quantum Fuel",
    subtitle: "Law of Simple Nourishment",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.12)",
    icon: "🌱",
    principle: "The body performs at the level of the fuel it receives. Complexity in diet creates complexity in function.",
    truth: "The most well-researched diets in the world share one characteristic: they are built around whole, unprocessed plant foods. Fruits, vegetables, legumes, grains, nuts, and seeds provide everything the human brain and body require to function at their highest capacity. Simple, close-to-source food creates stable energy, clear cognition, and sustained physical vitality.",
    dailyPractice: "Fill at least two-thirds of every plate with fruits and vegetables in their whole form. Eat foods as close to their natural state as possible. The simpler your food, the cleaner and more stable your energy. Choose whole over processed at every opportunity.",
    quantumEdge: "The gut-brain connection is one of the most significant discoveries in modern neuroscience. Your gut microbiome — fed primarily by plant fibre and variety — directly influences neurotransmitter production, mood regulation, and cognitive clarity. What you eat today shapes how your brain performs tomorrow.",
    practices: [
      { title:"The Rainbow Rule", desc:"Aim for at least 5 different colours of fruit and vegetables each day. Colour diversity signals nutrient diversity. Make your plate visually striking — nature designed it that way." },
      { title:"The Whole Food First Principle", desc:"Before eating anything processed, ask: is there a whole food version of this? An apple before apple juice. Whole grain before white bread. Consistently choosing whole creates the compound effect." },
      { title:"The Hydration Foundation", desc:"Drink water as your primary beverage. Dehydration of as little as 1-2% impairs cognitive performance, mood, and energy. Begin every morning with a large glass of water before anything else." },
      { title:"The Mindful Meal", desc:"Eat at least one meal per day without a screen. Chew thoroughly. This improves digestion, reduces overeating, and creates a moment of genuine presence in your day." },
    ],
    avoid: ["Ultra-processed foods with long ingredient lists", "Refined sugar as a primary fuel source — it creates energy spikes followed by crashes that impair sustained focus", "Harmful substances that damage the body's natural systems", "Eating in a chronic state of stress — cortisol impairs digestion and nutrient absorption"],
    lqmNote: "Your body is the hardware your quantum mind runs on. No software upgrade compensates for failing hardware. Nourishing your body simply and consistently is one of the highest-leverage practices available to you.",
  },
];

const CHECKLIST_ITEMS = [
  "7–9 hours of sleep last night",
  "20+ minutes of fresh air today",
  "Chose moderation in body, mind and spirit today",
  "30+ minutes of movement",
  "Fruits or vegetables at the heart of every meal today",
];

export default function QuantumLiving({ onBack, archetype }) {
  const [activeLaw, setActiveLaw] = useState(null);
  const [checklist, setChecklist] = useState([false,false,false,false,false]);
  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lqm_living")||"{}").streak || 0; } catch{ return 0; }
  });
  const arch = archetype || null;

  const score = checklist.filter(Boolean).length;
  const allDone = score === 5;

  function toggleCheck(i) {
    const n = [...checklist];
    n[i] = !n[i];
    setChecklist(n);
    if(n.filter(Boolean).length === 5) {
      const today = new Date().toISOString().split("T")[0];
      const data = { streak: streak + 1, lastDay: today };
      localStorage.setItem("lqm_living", JSON.stringify(data));
      setStreak(s => s+1);
    }
  }

  if (activeLaw !== null) return <LawDetail law={LAWS[activeLaw]} arch={arch} onBack={()=>setActiveLaw(null)}/>;

  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 40% at 50% 0%,rgba(52,211,153,0.06) 0%,transparent 60%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 60px"}}>
      {/* Header */}
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.9)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${BORDER}`,borderRadius:100,padding:"8px 16px",color:MUTED,fontSize:12,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",display:"flex",alignItems:"center",gap:6}} onMouseEnter={e=>e.currentTarget.style.color=WHITE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:WHITE}}>LQM</span>
          <span style={{fontSize:11,color:GREEN,fontWeight:700,letterSpacing:".1em"}}>QUANTUM LIVING</span>
        </div>
        <div style={{fontSize:11,color:GREEN,fontWeight:700}}>{score}/5 ✓</div>
      </div>

      <div style={{width:"100%",maxWidth:620,paddingTop:36,zIndex:1}}>
        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:28,animation:"fadeUp .6s ease both"}}>
          <p style={{fontSize:11,fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:GREEN,marginBottom:12}}>🌱 The 5 Quantum Laws of Living</p>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,7vw,52px)",letterSpacing:2,color:WHITE,lineHeight:1.05,marginBottom:8}}>Complete You.<br/><span style={{color:GREEN}}>Quantum Living.</span></h1>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:17,color:MUTED,lineHeight:1.7,maxWidth:440,margin:"0 auto"}}>"Peak performance is not built in the mind alone. It is built in the whole life — rested, breathed, balanced, moved and nourished."</p>
        </div>

        {/* A Note Before You Begin */}
        <div style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${BORDER2}`,borderRadius:14,padding:"16px 20px",marginBottom:20,animation:"fadeUp .6s .05s ease both"}}>
          <p style={{fontSize:11,fontWeight:700,color:MUTED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>A Note Before You Begin</p>
          <p style={{fontSize:13,color:DIMMED,lineHeight:1.75,fontWeight:300}}>The 5 Quantum Laws are educational principles for general wellbeing — not medical advice. If you have any health conditions, injuries, or concerns, please speak with your doctor before making changes to your exercise or lifestyle habits. Everything here is offered in the spirit of thoughtful self-improvement, not prescription.</p>
        </div>

        {/* Daily checklist */}
        <div style={{background:PANEL,border:`1px solid ${allDone?"rgba(52,211,153,0.4)":BORDER2}`,borderRadius:16,padding:"22px 24px",marginBottom:20,boxShadow:allDone?`0 0 30px rgba(52,211,153,0.1)`:"none",animation:"fadeUp .6s .1s ease both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase"}}>Today's Quantum Checklist</p>
            {streak>0 && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:AMBER,fontWeight:700}}>🔥 {streak}-day streak</div>}
          </div>
          {CHECKLIST_ITEMS.map((item,i)=>(
            <div key={i} onClick={()=>toggleCheck(i)} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:i<CHECKLIST_ITEMS.length-1?`1px solid ${BORDER2}`:"none",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${checklist[i]?GREEN:BORDER2}`,background:checklist[i]?"rgba(52,211,153,0.15)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                {checklist[i] && <span style={{color:GREEN,fontSize:12,fontWeight:800}}>✓</span>}
              </div>
              <span style={{fontSize:13,color:checklist[i]?GREEN:MUTED,fontWeight:checklist[i]?600:400,textDecoration:checklist[i]?"none":"none",transition:"color .2s"}}>{LAWS[i].icon} {item}</span>
            </div>
          ))}
          {allDone && (
            <div style={{marginTop:14,padding:"12px 16px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:10,textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:GREEN}}>⚡ All 5 Laws Honoured Today</p>
              <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:14,color:MUTED,marginTop:4}}>"Small shifts, consistently honoured, produce quantum results."</p>
            </div>
          )}
        </div>

        {/* 5 Laws grid */}
        <p style={{fontSize:10,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:14,animation:"fadeUp .6s .2s ease both"}}>The 5 Quantum Laws — Tap to explore</p>
        {LAWS.map((law,i)=>(
          <div key={i} onClick={()=>setActiveLaw(i)} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${law.color}`,borderRadius:16,padding:"20px 22px",marginBottom:12,cursor:"pointer",transition:"all .2s",animation:`fadeUp .6s ${.1+i*.08}s ease both`}}
            onMouseEnter={e=>{e.currentTarget.style.background=law.glow;e.currentTarget.style.borderColor=`${law.color}44`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=PANEL;e.currentTarget.style.borderColor=BORDER2;}}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:12,background:law.glow,border:`1px solid ${law.color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:22}}>{law.icon}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <p style={{fontSize:10,fontWeight:700,color:law.color,letterSpacing:".1em",textTransform:"uppercase",marginBottom:3}}>Law {law.num} · {law.subtitle}</p>
                    <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:WHITE}}>{law.title}</h3>
                  </div>
                  <span style={{fontSize:18,color:law.color,opacity:.6,marginTop:2}}>{law.sym}</span>
                </div>
                <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:14,color:MUTED,lineHeight:1.6,marginTop:4}}>"{law.principle.substring(0,80)}..."</p>
              </div>
            </div>
          </div>
        ))}

        {/* LQM connection note */}
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderLeft:`3px solid ${E_BLUE}`,borderRadius:"0 14px 14px 0",padding:"18px 20px",marginTop:8}}>
          <p style={{fontSize:10,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>⚡ The LQM Connection</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,color:MUTED,lineHeight:1.75}}>Your motivation archetype shapes how you live — not just how you work. Each of the 5 Quantum Laws contains specific insights for your profile type. Tap any law to read the LQM-specific guidance for your archetype.</p>
        </div>
      </div>
    </div>
  );
}

// ── Archetype-specific law notes ─────────────────────────────────────────
const ARCH_LAW_NOTES = {
  A: [ // Systems Architect
    "Systems Architects often sacrifice sleep to optimise output. This is a category error — sleep IS the optimisation. Your system cannot run without its maintenance window. Protect sleep as your highest-leverage system.",
    "You spend more time in closed, recirculated environments than any other archetype. Fresh air breaks are not indulgence — they are cognitive resets. Schedule them like a system process.",
    "Your tendency is to over-optimise and over-extend. Temperance is the meta-system — the architecture of architectures. Build rest and sufficiency into your system design, not as afterthoughts.",
    "Build movement into your system the way you build anything — with clear triggers, not willpower. Habit stacking (movement immediately after a scheduled event) is your highest-success approach here.",
    "You optimise everything else — now optimise your fuel. A whole-food, plant-rich diet is the highest-return nutritional system available. Batch preparation and simple defaults align with your architecture mindset.",
  ],
  B: [ // Deep Learner
    "Deep Learners are notorious for reading, researching, and consuming into the night. Your best thinking is impossible on insufficient sleep. The insight you're chasing at midnight is available in 90 minutes at 6am — rested.",
    "Research sessions must include movement and fresh air breaks. The best ideas in your history likely came during a walk, not at a desk. Build outdoor thinking time into your deep work schedule.",
    "You are at risk of intellectual over-consumption without proportional output. Temperance in learning means: for every 3 things absorbed, one thing must be applied or shared. This is your temperance practice.",
    "Exercise is cognitive enhancement, not a distraction from learning. BDNF — the protein produced during aerobic exercise — literally accelerates new neural connection formation. Movement is research for your brain.",
    "Your focus on intellectual nourishment can outpace physical nourishment. Simple, whole plant foods require minimal cognitive load to choose. Set a default plate and protect your decision budget for what matters most.",
  ],
  C: [ // Relational Catalyst
    "Your sleep is often disrupted by unresolved relational tension — replaying conversations, anticipating interactions. Create a '10-minute clear' before bed: write one thing resolved and one thing you choose to release until tomorrow.",
    "Relational Catalysts recharge differently outdoors — especially in social natural settings. A walk with someone meaningful doubles as relational fuel and fresh air. Combine where possible.",
    "You give energy generously, often beyond your reserves. Temperance for you means protecting your own energy as the prerequisite to giving well. You cannot pour from empty. This is not selfishness — it is sustainability.",
    "Group exercise or movement with others is your highest-motivation format. Accountability partners, walking meetings, group classes — the social dimension transforms exercise from obligation to connection.",
    "Shared meals are sacred for your archetype. Eating together, intentionally, is a relational practice as much as a nutritional one. Prioritise food that nourishes both your body and the social moment.",
  ],
  D: [ // Visionary Pioneer
    "Visionaries enter flow states that override sleep signals entirely. You don't notice tiredness until it's critical. Set a hard stop for creative work — your best vision emerges from a rested brain, not an exhausted one.",
    "Fresh air and new environments are creative catalysts for Visionaries. Some of your best ideas have come outdoors. This isn't coincidence — novel environments activate novel neural pathways. Use outdoor time intentionally as a creative tool.",
    "Visionaries burn intensely at the start and collapse later. Temperance is your most countercultural practice — and your highest leverage one. Sustainable intensity outlasts explosive bursts every time.",
    "Movement for Visionaries works best when it carries novelty — new routes, new environments, new challenges. The treadmill will bore you within weeks. Design movement with the same creative attention you give your best projects.",
    "Visionaries often forget to eat when in flow, then grab whatever is nearby. Design your nutritional environment in advance so the default choice when flow is interrupted is a good one. Whole foods that require no decision are your friend.",
  ],
};

function LawDetail({ law, arch, onBack }) {
  const archNote = arch && ARCH_LAW_NOTES[arch] ? ARCH_LAW_NOTES[arch][LAWS.indexOf(law)] : null;
  const ARCH_NAMES = {A:"Systems Architect",B:"Deep Learner",C:"Relational Catalyst",D:"Visionary Pioneer"};
  const ARCH_COLORS = {A:"#00C8FF",B:"#38BDF8",C:"#34D399",D:"#A78BFA"};
  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 40% at 50% 0%,${law.glow} 0%,transparent 60%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 60px"}}>
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.9)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${BORDER}`,borderRadius:100,padding:"8px 16px",color:MUTED,fontSize:12,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=WHITE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>← All Laws</button>
        <p style={{fontSize:11,fontWeight:700,color:law.color,letterSpacing:".1em",textTransform:"uppercase"}}>Law {law.num}</p>
        <span style={{fontSize:20,color:law.color}}>{law.sym}</span>
      </div>

      <div style={{width:"100%",maxWidth:620,paddingTop:36,zIndex:1}}>
        {/* Hero */}
        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${law.color}44`,borderRadius:20,padding:"36px 28px",textAlign:"center",marginBottom:16,boxShadow:`0 0 50px ${law.glow}`,animation:"fadeUp .6s ease both"}}>
          <div style={{fontSize:52,marginBottom:12}}>{law.icon}</div>
          <p style={{fontSize:10,fontWeight:700,color:law.color,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>Quantum Law {law.num} · {law.subtitle}</p>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,44px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{law.title}</h1>
          <div style={{width:50,height:2,background:`linear-gradient(90deg,transparent,${law.color},transparent)`,margin:"16px auto"}}/>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,color:law.color,lineHeight:1.65}}>"{law.principle}"</p>
        </div>

        {/* The Truth */}
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"24px",marginBottom:14,animation:"fadeUp .6s .1s ease both"}}>
          <p style={{fontSize:10,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>The Truth</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,lineHeight:1.85,color:"rgba(255,255,255,0.8)",fontWeight:300}}>{law.truth}</p>
        </div>

        {/* Quantum Edge */}
        <div style={{background:law.glow,border:`1px solid ${law.color}33`,borderLeft:`3px solid ${law.color}`,borderRadius:"0 14px 14px 0",padding:"18px 20px",marginBottom:14,animation:"fadeUp .6s .15s ease both"}}>
          <p style={{fontSize:10,fontWeight:700,color:law.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>⚡ Quantum Edge</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,color:MUTED,lineHeight:1.75}}>{law.quantumEdge}</p>
        </div>

        {/* Daily Practice */}
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:16,padding:"22px",marginBottom:14,animation:"fadeUp .6s .2s ease both"}}>
          <p style={{fontSize:10,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>◈ Daily Practice</p>
          <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.82)",fontWeight:400}}>{law.dailyPractice}</p>
        </div>

        {/* 4 Practices */}
        <p style={{fontSize:10,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12,animation:"fadeUp .6s .25s ease both"}}>4 Quantum Practices</p>
        {law.practices.map((p,i)=>(
          <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${law.color}88`,borderRadius:14,padding:"18px 20px",marginBottom:10,animation:`fadeUp .6s ${.28+i*.06}s ease both`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:law.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:BG,fontWeight:800,flexShrink:0}}>{i+1}</div>
              <p style={{fontSize:13,fontWeight:700,color:law.color,letterSpacing:".06em"}}>{p.title}</p>
            </div>
            <p style={{fontSize:14,lineHeight:1.8,color:MUTED,fontWeight:300}}>{p.desc}</p>
          </div>
        ))}

        {/* Things to avoid */}
        <div style={{background:"rgba(255,160,40,0.04)",border:"1px solid rgba(255,160,40,0.15)",borderRadius:16,padding:"20px 22px",marginBottom:14,animation:"fadeUp .6s .5s ease both"}}>
          <p style={{fontSize:10,fontWeight:700,color:"rgba(255,180,50,0.8)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>△ Patterns to Avoid</p>
          {law.avoid.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<law.avoid.length-1?10:0}}>
              <span style={{color:"rgba(255,180,50,0.6)",flexShrink:0,marginTop:2,fontSize:13}}>◦</span>
              <span style={{fontSize:14,color:"rgba(255,200,80,0.85)",fontWeight:400,lineHeight:1.6}}>{a}</span>
            </div>
          ))}
        </div>

        {/* Personalised archetype note */}
        {archNote ? (
          <div style={{background:`linear-gradient(135deg,${ARCH_COLORS[arch]}0a,transparent)`,border:`1px solid ${ARCH_COLORS[arch]}33`,borderLeft:`3px solid ${ARCH_COLORS[arch]}`,borderRadius:"0 14px 14px 0",padding:"20px 22px",animation:"fadeUp .6s .55s ease both"}}>
            <p style={{fontSize:10,fontWeight:700,color:ARCH_COLORS[arch],letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>⚛ {ARCH_NAMES[arch]} — This Law Applied to You</p>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.8}}>{archNote}</p>
          </div>
        ) : (
          <div style={{background:`linear-gradient(135deg,rgba(0,200,255,0.06),rgba(0,200,255,0.02))`,border:`1px solid ${E_BLUE}33`,borderRadius:16,padding:"20px 22px",animation:"fadeUp .6s .55s ease both"}}>
            <p style={{fontSize:10,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>⚛ LQM Archetype Note</p>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.75}}>{law.lqmNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
