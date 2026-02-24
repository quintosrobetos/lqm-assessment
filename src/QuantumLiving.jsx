import { useState, useEffect } from "react";
import { 
  getChallengeData, 
  enrollInChallenge, 
  updateChallengeProgress,
  getStreak,
  getDaysActive,
  getCompletionPercentage,
  isChallengeComplete
} from "./challenge21";
import { trackQuantumDay } from "./firebase";
import { playQuantumSound, playMilestoneSound } from "./sounds";

const E_BLUE  = "#00C8FF";
const E_BLUE2 = "#0EA5E9";
const BG      = "#070F1E";
const DARK    = "#0D1830";
const DARK2   = "#111E38";
const PANEL   = "rgba(255,255,255,0.055)";
const BORDER  = "rgba(0,200,255,0.18)";
const BORDER2 = "rgba(255,255,255,0.09)";
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(255,255,255,0.72)"; // Improved readability
const DIMMED  = "rgba(255,255,255,0.40)"; // Improved readability
const GREEN   = "#34D399";
const AMBER   = "#FBBF24";

// ── Daily Insights (30 wellness facts, rotates daily) ────────────────────────
const DAILY_INSIGHTS = [
  { icon:"🥑", title:"Avocado Power", fact:"Avocados contain more potassium than bananas and are packed with heart-healthy monounsaturated fats that help your body absorb fat-soluble vitamins A, D, E, and K." },
  { icon:"🧄", title:"Garlic's Secret", fact:"Garlic has been used as a natural antibiotic for thousands of years. Allicin, the compound released when garlic is crushed, has powerful antimicrobial properties that can help fight infections." },
  { icon:"🫐", title:"Blueberry Brain Boost", fact:"Blueberries are among the most antioxidant-rich foods on Earth. Studies show they can improve memory, reduce oxidative stress, and may delay brain aging by up to 2.5 years." },
  { icon:"🥦", title:"Broccoli Defense", fact:"Broccoli contains sulforaphane, a compound that activates your body's natural detoxification enzymes and has been shown to have powerful anti-cancer properties." },
  { icon:"🌶️", title:"Chili Heat Therapy", fact:"Capsaicin in chili peppers triggers endorphin release (natural painkillers), boosts metabolism by up to 25% temporarily, and may help you live longer according to large population studies." },
  { icon:"🥬", title:"Leafy Green Gold", fact:"Dark leafy greens like kale and spinach contain lutein and zeaxanthin — compounds that accumulate in your retinas and can reduce age-related vision decline by up to 40%." },
  { icon:"🍓", title:"Strawberry Surprise", fact:"One cup of strawberries provides more vitamin C than an orange — about 150% of your daily needs. Vitamin C is essential for collagen production, immune function, and iron absorption." },
  { icon:"🥜", title:"Walnut Wisdom", fact:"Walnuts are the only nut that contains significant omega-3 fatty acids (ALA). Just 7 walnuts a day has been shown to improve cognitive function and reduce inflammation." },
  { icon:"🍠", title:"Sweet Potato Strength", fact:"Sweet potatoes have a lower glycemic index than white potatoes, meaning they provide steady energy without blood sugar spikes. They're also rich in beta-carotene, which your body converts to vitamin A." },
  { icon:"🥕", title:"Carrot Vision", fact:"The beta-carotene in carrots really does support eye health. Your body converts it to vitamin A, which is essential for the light-sensing cells in your retinas to function properly." },
  { icon:"☕", title:"Coffee Clarity", fact:"Coffee doesn't just wake you up — studies show 3-4 cups daily is associated with up to 65% lower risk of Alzheimer's disease and significantly reduced risk of depression." },
  { icon:"🍵", title:"Green Tea Magic", fact:"Green tea contains L-theanine, an amino acid that promotes calm alertness by increasing alpha brain waves. Combined with caffeine, it creates focused relaxation without jitters." },
  { icon:"🫘", title:"Bean Longevity", fact:"People in Blue Zones (regions where people live longest) eat beans daily. Beans are protein-rich, high in fiber, stabilize blood sugar, and feed beneficial gut bacteria." },
  { icon:"🥥", title:"Coconut Health", fact:"Coconut water is naturally rich in electrolytes, making it superior to many sports drinks. The MCT fats in coconut can be quickly converted to energy by your liver." },
  { icon:"🍋", title:"Lemon Fresh Start", fact:"Starting your day with warm lemon water supports liver function, aids digestion, and provides vitamin C. The citric acid helps your body absorb minerals throughout the day." },
  { icon:"🧅", title:"Onion Layers", fact:"Onions contain quercetin, a powerful antioxidant and anti-inflammatory compound. Red onions have the highest levels. Crying while cutting them releases sulfur compounds with antimicrobial properties." },
  { icon:"🍄", title:"Mushroom Medicine", fact:"Mushrooms are the only plant source of vitamin D when exposed to sunlight. Some varieties like shiitake and maitake also contain compounds that boost immune function." },
  { icon:"🌰", title:"Almond Nutrition", fact:"Almonds are incredibly nutrient-dense — high in vitamin E, magnesium, and healthy fats. Just 23 almonds (1 ounce) contains 6g of protein and 3.5g of fiber." },
  { icon:"🍯", title:"Honey Healing", fact:"Raw honey has natural antibacterial properties and has been used to treat wounds for millennia. It contains antioxidants and enzymes that support gut health. Darker honey has more antioxidants." },
  { icon:"🥒", title:"Cucumber Hydration", fact:"Cucumbers are 96% water, making them one of the most hydrating foods. They also contain silica, which supports healthy skin, hair, and nails." },
  { icon:"🫑", title:"Bell Pepper Power", fact:"Red bell peppers contain 3x more vitamin C than green ones and are one of the best sources of beta-carotene. They're technically fruits, not vegetables." },
  { icon:"🍅", title:"Tomato Science", fact:"Cooking tomatoes actually increases their lycopene content by up to 35%. Lycopene is a powerful antioxidant linked to reduced heart disease and cancer risk." },
  { icon:"🧈", title:"Healthy Fat Truth", fact:"Your brain is 60% fat. Omega-3 fatty acids (from walnuts, flaxseed, chia) are essential for brain structure and function. Low-fat diets can impair cognitive performance." },
  { icon:"💧", title:"Water First", fact:"Even 2% dehydration can impair attention, memory, and mood. Most people mistake thirst for hunger. Try drinking water first before reaching for a snack." },
  { icon:"🌅", title:"Sunlight Vitamin", fact:"Just 10-30 minutes of midday sun provides enough UVB for your body to produce optimal vitamin D. This regulates calcium absorption, immune function, and mood." },
  { icon:"🚶", title:"Walking Therapy", fact:"A 20-minute walk in nature reduces cortisol by an average of 21%. Walking meetings have been shown to increase creative thinking by up to 60% compared to sitting." },
  { icon:"🧘", title:"Breath Control", fact:"Deep breathing activates your parasympathetic nervous system (rest mode). Box breathing — 4 counts in, hold 4, out 4, hold 4 — can lower heart rate and anxiety in under 2 minutes." },
  { icon:"😴", title:"Sleep Cycles", fact:"Each sleep cycle lasts about 90 minutes. Waking between cycles (after 6, 7.5, or 9 hours) feels better than waking mid-cycle. Set alarms accordingly." },
  { icon:"🔥", title:"Metabolism Truth", fact:"Muscle tissue burns 3x more calories at rest than fat tissue. Strength training is one of the most effective ways to boost your resting metabolic rate long-term." },
  { icon:"🌿", title:"Plant Protein", fact:"You don't need meat for complete protein. Combinations like beans + rice, or hummus + whole grain provide all essential amino acids. Many athletes thrive on plant-based diets." },
];

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
  const [challengeData, setChallengeData] = useState(null);
  const [showMilestone, setShowMilestone] = useState(null);
  const arch = archetype || null;

  const ARCH_NAMES  = {A:"Systems Architect", B:"Deep Learner", C:"Relational Catalyst", D:"Visionary Pioneer"};
  const ARCH_COLORS = {A:"#00C8FF", B:"#38BDF8", C:"#34D399", D:"#A78BFA"};
  const archColor   = arch ? ARCH_COLORS[arch] : E_BLUE;
  const archName    = arch ? ARCH_NAMES[arch]  : "Your Archetype";

  // Which law is featured today — rotates through 5 on a 5-day cycle
  const todayLawIdx = Math.floor(new Date().getTime() / 86400000) % 5;
  const todayLaw    = LAWS[todayLawIdx];
  const todayArchNote = arch && ARCH_LAW_NOTES[arch] ? ARCH_LAW_NOTES[arch][todayLawIdx] : null;

  // Daily archetype-specific micro-tip (rotates independently each day)
  const ARCH_DAILY = {
    A: [
      "Schedule your outdoor break the same way you schedule a meeting — 20 minutes, same time daily. Consistency is your system.",
      "Sleep is your system's maintenance window. No great architecture runs without downtime. Protect 8 hours tonight.",
      "Batch your meals for the week tonight. One decision, seven days of optimal fuel. This is how you eat like a Systems Architect.",
      "Build a movement trigger: every time you close your laptop, stand up and walk for 5 minutes. Habit stacking is your edge.",
      "Your temperance practice today: identify one thing you are overdoing and one thing you are underdoing. Rebalance one of them.",
    ],
    B: [
      "Your best insight this week is waiting at the end of a 20-minute outdoor walk. Leave the podcast. Think with your feet.",
      "The research you're chasing at midnight will be there at 6am — rested. Set a hard stop tonight.",
      "For every 3 things you read today, apply or share one. That is your temperance in action.",
      "Movement is cognitive enhancement. A 20-minute walk before your deep work session will improve it measurably.",
      "Simplify today's eating: one meal with no screen, no decision — just presence and whole food.",
    ],
    C: [
      "Invite someone to walk with you today. Fresh air + connection = double the return on 20 minutes.",
      "Before bed tonight: write one thing resolved and one thing you choose to release until tomorrow. Clear the relational slate.",
      "You cannot pour from empty. Protecting your energy today is not selfish — it is the prerequisite to giving well.",
      "Find a movement partner this week. Group exercise transforms obligation into connection for your archetype.",
      "Eat one meal today with someone you care about, fully present, no phones. This is nourishment in every sense.",
    ],
    D: [
      "Take your thinking outside today. Novel environments activate novel neural pathways — your next idea is outdoors.",
      "Set a hard stop for creative work tonight — same time as last night. Your best vision comes from a rested brain.",
      "Sustainable intensity outlasts explosive bursts. Where are you burning too hot right now?",
      "Change your movement route today. New environment, new stimulation — design movement the way you design everything.",
      "Prepare your food environment now so when flow is interrupted, the best choice is the obvious choice.",
    ],
  };
  const dailyArchTip = arch && ARCH_DAILY[arch]
    ? ARCH_DAILY[arch][Math.floor(new Date().getTime() / 86400000) % 5]
    : null;

  // Initialize challenge
  useEffect(() => {
    let data = getChallengeData("quantum");
    if (!data) data = enrollInChallenge("quantum", archetype || "unknown");
    setChallengeData(data);
  }, [archetype]);

  // Animations
  useEffect(()=>{
    const id = "quantum-living-styles";
    if(document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
      @keyframes leafFall{from{transform:translateY(-100px) rotate(0deg);opacity:0;}to{transform:translateY(100vh) rotate(720deg);opacity:0.12;}}
      @keyframes moonGlow{0%,100%{filter:drop-shadow(0 0 8px rgba(129,140,248,0.6));transform:scale(1);}50%{filter:drop-shadow(0 0 16px rgba(129,140,248,0.9));transform:scale(1.05);}}
      @keyframes leafSway{0%,100%{transform:rotate(-5deg) translateY(0);}50%{transform:rotate(5deg) translateY(-3px);}}
      @keyframes scalesTilt{0%,100%{transform:rotate(0deg);}25%{transform:rotate(-8deg);}50%{transform:rotate(0deg);}75%{transform:rotate(8deg);}}
      @keyframes lightningPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(251,191,36,0.6));opacity:1;}50%{filter:drop-shadow(0 0 12px rgba(251,191,36,1));opacity:0.8;}}
      @keyframes fruitShine{0%,100%{filter:brightness(1) drop-shadow(0 0 4px rgba(52,211,153,0.4));}50%{filter:brightness(1.2) drop-shadow(0 0 8px rgba(52,211,153,0.6));}}
      .law-icon-0{animation:moonGlow 3s ease-in-out infinite;}
      .law-icon-1{animation:leafSway 4s ease-in-out infinite;}
      .law-icon-2{animation:scalesTilt 5s ease-in-out infinite;}
      .law-icon-3{animation:lightningPulse 2s ease-in-out infinite;}
      .law-icon-4{animation:fruitShine 3s ease-in-out infinite;}
      @keyframes focusPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.0);}60%{box-shadow:0 0 0 8px rgba(255,255,255,0.04);}}
      @keyframes focusGlow{0%,100%{opacity:0.7;}50%{opacity:1;}}
      .focus-law-item{animation:focusPulse 2.5s ease-in-out infinite;}
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if(el) el.remove(); };
  }, []);

  const score   = checklist.filter(Boolean).length;
  const allDone = score === 5;

  function toggleCheck(i) {
    const n = [...checklist];
    n[i] = !n[i];
    setChecklist(n);
    // Streak only triggers when TODAY'S FOCUS LAW is ticked
    if(i === todayLawIdx && n[i] === true) {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lqm_living", JSON.stringify({ streak: streak + 1, lastDay: today }));
      setStreak(s => s + 1);
      playQuantumSound();
      const updated = updateChallengeProgress("quantum");
      if(updated){
        setChallengeData(updated);
        trackQuantumDay(n.filter(Boolean).length, updated.daysCompleted?.length || 0);
        if(updated.currentDay >= 7  && !updated.milestones.day_7.unlocked)  { playMilestoneSound(); setShowMilestone("day7");  }
        else if(updated.currentDay >= 14 && !updated.milestones.day_14.unlocked) { playMilestoneSound(); setShowMilestone("day14"); }
        else if(updated.currentDay >= 21 && !updated.milestones.day_21.unlocked) { playMilestoneSound(); setShowMilestone("day21"); }
      }
    }
  }

  if (activeLaw !== null) return <LawDetail law={LAWS[activeLaw]} arch={arch} onBack={()=>setActiveLaw(null)}/>;

  return (
    <div style={{minHeight:"100vh", background:`radial-gradient(ellipse 80% 40% at 50% 0%,rgba(52,211,153,0.06) 0%,transparent 60%),${BG}`, fontFamily:"'Space Grotesk',sans-serif", color:WHITE, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 16px 60px", position:"relative", overflow:"hidden"}}>

      {/* Floating leaves */}
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.12}}>
        {[...Array(6)].map((_,i)=>(
          <div key={i} style={{position:"absolute",left:`${10+i*16}%`,top:`${-20-i*15}%`,fontSize:18+i*3,animation:`leafFall ${22+i*4}s linear infinite`,animationDelay:`${i*3}s`}}>🍃</div>
        ))}
      </div>

      {/* Header */}
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.9)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${BORDER}`,borderRadius:100,padding:"8px 16px",color:MUTED,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=WHITE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,color:WHITE}}>LQM</span>
          <span style={{fontSize:14,color:GREEN,fontWeight:700,letterSpacing:".1em"}}>QUANTUM LIVING</span>
        </div>
        <div style={{fontSize:14,color:allDone?GREEN:MUTED,fontWeight:700}}>{score}/5 ✓</div>
      </div>

      <div style={{width:"100%",maxWidth:620,paddingTop:28,zIndex:1}}>

        {/* ── ARCHETYPE HEADER ── */}
        {arch && (
          <div style={{textAlign:"center",marginBottom:24,animation:"fadeUp .5s ease both"}}>
            <div style={{display:"inline-block",background:`${archColor}12`,border:`1px solid ${archColor}44`,borderRadius:100,padding:"5px 16px",marginBottom:12}}>
              <span style={{fontSize:12,fontWeight:700,color:archColor,letterSpacing:".14em",textTransform:"uppercase"}}>🌿 Quantum Living — {archName}</span>
            </div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(26px,5vw,40px)",letterSpacing:2,color:WHITE,lineHeight:1.1,marginBottom:6}}>Your Daily<br/><span style={{color:GREEN}}>Living Practice</span></h1>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:15,color:MUTED,lineHeight:1.65,maxWidth:380,margin:"0 auto"}}>"Peak performance is built in the whole life — rested, breathed, balanced, moved and nourished."</p>
          </div>
        )}

        {/* ── TODAY'S FEATURED LAW ── */}
        <div style={{background:`linear-gradient(145deg,${todayLaw.color}12,${DARK2})`,border:`2px solid ${todayLaw.color}55`,borderRadius:20,padding:"24px",marginBottom:16,animation:"fadeUp .5s .05s ease both",boxShadow:`0 0 40px ${todayLaw.color}10`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{background:`${todayLaw.color}18`,border:`1px solid ${todayLaw.color}44`,borderRadius:100,padding:"4px 12px"}}>
              <span style={{fontSize:12,fontWeight:700,color:todayLaw.color,letterSpacing:".12em",textTransform:"uppercase"}}>⭐ Today's Focus Law</span>
            </div>
            <span style={{fontSize:22,opacity:.7}}><span className={`law-icon-${todayLawIdx}`} style={{display:"inline-block"}}>{todayLaw.icon}</span></span>
          </div>

          <p style={{fontSize:13,fontWeight:700,color:todayLaw.color,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Law {todayLaw.num} · {todayLaw.subtitle}</p>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:2,color:WHITE,marginBottom:10}}>{todayLaw.title}</h2>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:todayLaw.color,lineHeight:1.6,marginBottom:16}}>"{todayLaw.principle}"</p>

          {/* Today's practice */}
          <div style={{background:"rgba(255,255,255,0.04)",border:`1px solid rgba(255,255,255,0.08)`,borderRadius:12,padding:"14px 16px",marginBottom:todayArchNote?14:0}}>
            <p style={{fontSize:13,fontWeight:700,color:DIMMED,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>◈ Today's Practice</p>
            <p style={{fontSize:14,color:MUTED,lineHeight:1.75}}>{todayLaw.dailyPractice}</p>
          </div>

          {/* Archetype-specific note for today's law */}
          {todayArchNote && (
            <div style={{background:`${archColor}0c`,border:`1px solid ${archColor}33`,borderLeft:`3px solid ${archColor}`,borderRadius:"0 10px 10px 0",padding:"12px 14px"}}>
              <p style={{fontSize:12,fontWeight:700,color:archColor,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>⚛ {archName} — Applied to You</p>
              <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:14,color:MUTED,lineHeight:1.7}}>{todayArchNote}</p>
            </div>
          )}

          <button onClick={()=>setActiveLaw(todayLawIdx)} style={{width:"100%",marginTop:14,border:`1px solid ${todayLaw.color}44`,borderRadius:100,padding:"11px",fontSize:13,fontWeight:700,background:`${todayLaw.color}12`,color:todayLaw.color,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",letterSpacing:".06em"}}
            onMouseEnter={e=>e.currentTarget.style.background=`${todayLaw.color}22`}
            onMouseLeave={e=>e.currentTarget.style.background=`${todayLaw.color}12`}>
            Read the Full Law — 4 Practices, Science & More →
          </button>
        </div>

        {/* ── DAILY ARCHETYPE TIP ── */}
        {dailyArchTip && (
          <div style={{background:`${archColor}08`,border:`1px solid ${archColor}33`,borderRadius:14,padding:"16px 18px",marginBottom:16,animation:"fadeUp .5s .1s ease both"}}>
            <p style={{fontSize:12,fontWeight:700,color:archColor,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>💡 Your Tip Today — {archName}</p>
            <p style={{fontSize:14,color:MUTED,lineHeight:1.7}}>{dailyArchTip}</p>
          </div>
        )}

        {/* ── DAILY CHECKLIST — Focus Law (streak) + Bonus Laws (bonus points) ── */}
        <div style={{marginBottom:16, animation:"fadeUp .5s .15s ease both"}}>

          {/* TODAY'S FOCUS — tied to streak */}
          <div className="focus-law-item" style={{
            background:`linear-gradient(135deg,${todayLaw.color}12,${DARK2})`,
            border:`2px solid ${todayLaw.color}${checklist[todayLawIdx]?"99":"55"}`,
            borderRadius:16, padding:"18px 20px", marginBottom:10,
            boxShadow:checklist[todayLawIdx]?`0 0 25px ${todayLaw.color}25`:`0 0 15px ${todayLaw.color}08`,
            transition:"all .3s"
          }}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
              <div>
                <p style={{fontSize:11, fontWeight:700, color:todayLaw.color, letterSpacing:".14em", textTransform:"uppercase", marginBottom:4}}>🔥 DAILY STREAK TASK</p>
                <p style={{fontSize:13, color:MUTED}}>Complete this to count today toward your streak</p>
              </div>
              {streak > 0 && <div style={{background:AMBER+"18", border:`1px solid ${AMBER}44`, borderRadius:100, padding:"4px 12px"}}>
                <span style={{fontSize:13, color:AMBER, fontWeight:700}}>🔥 {streak} days</span>
              </div>}
            </div>
            <div onClick={()=>toggleCheck(todayLawIdx)} style={{
              display:"flex", gap:14, alignItems:"center", cursor:"pointer",
              padding:"14px 16px", borderRadius:12,
              background:checklist[todayLawIdx]?`${todayLaw.color}18`:"rgba(255,255,255,0.03)",
              border:`1.5px solid ${checklist[todayLawIdx]?todayLaw.color:todayLaw.color+"44"}`,
              transition:"all .25s"
            }}>
              <div style={{
                width:32, height:32, borderRadius:9,
                background:checklist[todayLawIdx]?todayLaw.color:"transparent",
                border:`2px solid ${todayLaw.color}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, transition:"all .25s", fontSize:16
              }}>
                {checklist[todayLawIdx]
                  ? <span style={{color:BG, fontWeight:900, fontSize:16}}>✓</span>
                  : <span className={`law-icon-${todayLawIdx}`} style={{display:"inline-block"}}>{todayLaw.icon}</span>
                }
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:17, fontWeight:700, color:checklist[todayLawIdx]?todayLaw.color:WHITE, marginBottom:2, transition:"color .2s"}}>{todayLaw.title}</p>
                <p style={{fontSize:13, color:MUTED}}>{todayLaw.subtitle} · {todayLaw.dailyPractice.substring(0,60)}...</p>
              </div>
              {!checklist[todayLawIdx] && <div style={{
                background:todayLaw.color, color:BG, fontWeight:800, fontSize:13,
                borderRadius:100, padding:"6px 14px", flexShrink:0, letterSpacing:".05em",
                animation:"focusGlow 2s ease-in-out infinite"
              }}>TAP TO TICK</div>}
            </div>
            {checklist[todayLawIdx] && (
              <div style={{marginTop:10, padding:"10px 14px", background:"rgba(52,211,153,0.08)", borderRadius:10, display:"flex", alignItems:"center", gap:8}}>
                <span style={{fontSize:16}}>✅</span>
                <p style={{fontSize:14, color:GREEN, fontWeight:600}}>Streak logged! Daily focus complete.</p>
              </div>
            )}
          </div>

          {/* BONUS LAWS — additional points, don't affect streak */}
          <div style={{background:PANEL, border:`1px solid ${BORDER2}`, borderRadius:16, padding:"16px 18px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
              <p style={{fontSize:12, fontWeight:700, color:DIMMED, letterSpacing:".14em", textTransform:"uppercase"}}>⭐ Additional Tasks — Bonus Points</p>
              <span style={{fontSize:12, color:AMBER, fontWeight:700}}>
                {checklist.filter((v,i)=>v && i!==todayLawIdx).length * 10} pts earned
              </span>
            </div>
            {LAWS.map((law,i) => i === todayLawIdx ? null : (
              <div key={i} onClick={()=>toggleCheck(i)} style={{
                display:"flex", gap:12, alignItems:"center",
                padding:"10px 12px", marginBottom:6, borderRadius:10, cursor:"pointer",
                background:checklist[i]?`${law.color}0d`:"rgba(255,255,255,0.02)",
                border:`1px solid ${checklist[i]?law.color+"44":BORDER2}`,
                transition:"all .2s"
              }}>
                <div style={{
                  width:24, height:24, borderRadius:7,
                  background:checklist[i]?law.color:"transparent",
                  border:`1.5px solid ${checklist[i]?law.color:BORDER2}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0, transition:"all .2s"
                }}>
                  {checklist[i]
                    ? <span style={{color:BG, fontSize:13, fontWeight:900}}>✓</span>
                    : <span className={`law-icon-${i}`} style={{display:"inline-block", fontSize:13}}>{law.icon}</span>
                  }
                </div>
                <div style={{flex:1}}>
                  <span style={{fontSize:14, color:checklist[i]?WHITE:MUTED, fontWeight:checklist[i]?600:400, transition:"color .2s"}}>{law.title}</span>
                  <p style={{fontSize:11, color:DIMMED, marginTop:1}}>{law.subtitle}</p>
                </div>
                <span style={{fontSize:12, color:checklist[i]?AMBER:DIMMED, fontWeight:700}}>+10 pts</span>
              </div>
            ))}
            <div style={{marginTop:10, padding:"8px 12px", background:"rgba(251,191,36,0.04)", border:"1px solid rgba(251,191,36,0.15)", borderRadius:8}}>
              <p style={{fontSize:12, color:"rgba(251,191,36,0.6)", lineHeight:1.5}}>💡 Bonus points add to your LQM score. Only Today's Focus Law counts for your daily streak.</p>
            </div>
          </div>

          {/* All done celebration */}
          {allDone && (
            <div style={{marginTop:10,padding:"14px 18px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:12,textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,color:GREEN,marginBottom:4}}>🌿 All 5 Laws Honoured Today</p>
              <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:14,color:MUTED}}>"Small shifts, consistently honoured, produce quantum results."</p>
              {showMilestone==="day7"  && <div style={{marginTop:10,padding:"10px",background:"rgba(52,211,153,0.12)",borderRadius:8}}><p style={{color:GREEN,fontWeight:700}}>🌱 Week 1 Complete! You built the foundation.</p></div>}
              {showMilestone==="day14" && <div style={{marginTop:10,padding:"10px",background:"rgba(52,211,153,0.12)",borderRadius:8}}><p style={{color:GREEN,fontWeight:700}}>🌿 Week 2 Complete! The habit is forming.</p></div>}
              {showMilestone==="day21" && <div style={{marginTop:10,padding:"10px",background:"rgba(52,211,153,0.15)",borderRadius:8}}><p style={{color:GREEN,fontWeight:700}}>🌳 21 Days Complete! You transformed your daily living.</p></div>}
            </div>
          )}
        </div>

        {/* ── 21-DAY PROGRESS ── */}
        {challengeData && (
          <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:16,padding:"18px 20px",marginBottom:16,animation:"fadeUp .5s .2s ease both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <p style={{fontSize:14,fontWeight:700,color:GREEN,letterSpacing:".1em",textTransform:"uppercase"}}>🌿 21-Day Challenge</p>
              <span style={{fontSize:13,color:AMBER,fontWeight:700}}>Day {challengeData.currentDay||1} of 21</span>
            </div>
            <div style={{height:7,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden",marginBottom:12}}>
              <div style={{height:"100%",width:`${((challengeData.currentDay||1)/21)*100}%`,background:"linear-gradient(90deg,rgba(52,211,153,0.6),#34D399)",borderRadius:100,transition:"width .8s ease"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-around",marginBottom:12}}>
              {[{d:7,icon:"🌱",label:"Week 1"},{d:14,icon:"🌿",label:"Week 2"},{d:21,icon:"🌳",label:"Complete"}].map(m=>(
                <div key={m.d} style={{textAlign:"center"}}>
                  <div style={{fontSize:20,marginBottom:2,opacity:(challengeData.currentDay||0)>=m.d?1:0.25}}>{m.icon}</div>
                  <p style={{fontSize:10,fontWeight:700,color:(challengeData.currentDay||0)>=m.d?GREEN:DIMMED}}>{m.label}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",background:"rgba(255,255,255,0.03)",borderRadius:10}}>
              <span style={{fontSize:13,color:MUTED}}>✅ {challengeData.sessionsCompleted||0} days completed</span>
              <span style={{fontSize:13,color:AMBER,fontWeight:700}}>🔥 {streak} day streak</span>
            </div>
          </div>
        )}

        {/* ── ALL 5 LAWS — secondary ── */}
        <p style={{fontSize:13,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:12,animation:"fadeUp .5s .25s ease both"}}>All 5 Quantum Laws — Tap to explore</p>
        {LAWS.map((law,i)=>(
          <div key={i} onClick={()=>setActiveLaw(i)}
            style={{background:i===todayLawIdx?`${law.color}0a`:PANEL, border:`1px solid ${i===todayLawIdx?law.color+"44":BORDER2}`, borderLeft:`3px solid ${law.color}`, borderRadius:14, padding:"14px 16px", marginBottom:8, cursor:"pointer", transition:"all .2s", animation:`fadeUp .5s ${.28+i*.06}s ease both`, display:"flex", alignItems:"center", gap:14}}
            onMouseEnter={e=>{e.currentTarget.style.background=law.glow;}}
            onMouseLeave={e=>{e.currentTarget.style.background=i===todayLawIdx?`${law.color}0a`:PANEL;}}>
            <span className={`law-icon-${i}`} style={{fontSize:24,display:"inline-block",flexShrink:0}}>{law.icon}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:700,color:law.color,letterSpacing:".08em",textTransform:"uppercase",marginBottom:2}}>Law {law.num} · {law.subtitle}</p>
              <p style={{fontSize:15,fontWeight:700,color:WHITE}}>{law.title}</p>
            </div>
            {i===todayLawIdx && <span style={{fontSize:11,fontWeight:700,color:law.color,background:`${law.color}18`,padding:"3px 10px",borderRadius:100,flexShrink:0}}>Today</span>}
            <span style={{color:DIMMED,fontSize:16}}>→</span>
          </div>
        ))}

        {/* Disclaimer */}
        <div style={{marginTop:16,padding:"14px 18px",background:"rgba(255,255,255,0.02)",border:`1px solid ${BORDER2}`,borderRadius:12}}>
          <p style={{fontSize:12,color:DIMMED,lineHeight:1.6}}>The 5 Quantum Laws are educational principles for general wellbeing — not medical advice. Please consult a doctor before making changes to exercise or health habits.</p>
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

// ══════════════════════════════════════════════════════════════════════════
// 21-DAY QUANTUM LIVING MILESTONES
// ══════════════════════════════════════════════════════════════════════════

function QuantumMilestoneDay7({challengeData, onContinue}){
  const streak = getStreak(challengeData);
  const daysActive = getDaysActive(challengeData);
  
  return(
    <div style={{minHeight:"100vh",background:BG,padding:"60px 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:600,animation:"fadeUp .6s ease both"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:80,marginBottom:16}}>🌱</div>
          <div style={{display:"inline-block",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:100,padding:"8px 20px",marginBottom:16}}>
            <span style={{fontSize:14,fontWeight:700,color:GREEN,letterSpacing:".12em"}}>DAY 7 MILESTONE REACHED</span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,58px)",letterSpacing:2,color:WHITE,marginBottom:12}}>First Week Complete</h1>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:18,color:MUTED,lineHeight:1.7}}>You've honored the 5 Quantum Laws for 7 days. Wellness habits are taking root.</p>
        </div>

        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${BORDER2}`,borderRadius:20,padding:"32px 28px",marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:16,marginBottom:24}}>
            <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"18px",textAlign:"center"}}>
              <p style={{fontSize:13,color:DIMMED,marginBottom:6}}>Days Active</p>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:2,color:GREEN}}>{daysActive}</p>
            </div>
            {streak > 0 && (
              <div style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:12,padding:"18px",textAlign:"center"}}>
                <p style={{fontSize:13,color:DIMMED,marginBottom:6}}>Streak</p>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:2,color:AMBER}}>{streak}🔥</p>
              </div>
            )}
          </div>

          <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"20px"}}>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.8}}>
              <strong style={{color:WHITE}}>The foundation is set.</strong> Week one builds awareness. Week two builds consistency. Week three makes it permanent. Keep going.
            </p>
          </div>
        </div>

        <button onClick={onContinue} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:"linear-gradient(135deg,#059669,#34D399)",color:WHITE,letterSpacing:".05em"}}>
          Continue Journey →
        </button>
      </div>
    </div>
  );
}

function QuantumMilestoneDay14({challengeData, onContinue}){
  const streak = getStreak(challengeData);
  const daysActive = getDaysActive(challengeData);
  const completion = getCompletionPercentage(challengeData);
  
  return(
    <div style={{minHeight:"100vh",background:BG,padding:"60px 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:600,animation:"fadeUp .6s ease both"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:80,marginBottom:16}}>⚖️</div>
          <div style={{display:"inline-block",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:100,padding:"8px 20px",marginBottom:16}}>
            <span style={{fontSize:14,fontWeight:700,color:GREEN,letterSpacing:".12em"}}>DAY 14 MILESTONE REACHED</span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,8vw,58px)",letterSpacing:2,color:WHITE,marginBottom:12}}>Two Weeks Strong</h1>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:18,color:MUTED,lineHeight:1.7}}>Halfway to transformation. The habit is forming.</p>
        </div>

        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`2px solid ${GREEN}44`,borderRadius:20,padding:"32px 28px",marginBottom:20,boxShadow:"0 0 30px rgba(52,211,153,0.15)"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:72,letterSpacing:2,color:GREEN,lineHeight:1}}>{completion}%</div>
            <p style={{fontSize:16,color:MUTED,marginTop:8}}>Challenge completion</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:12,marginBottom:24}}>
            <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:10,padding:"14px",textAlign:"center"}}>
              <p style={{fontSize:12,color:DIMMED,marginBottom:4}}>Days Active</p>
              <p style={{fontSize:24,fontWeight:700,color:GREEN}}>{daysActive}</p>
            </div>
            {streak > 0 && (
              <div style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:10,padding:"14px",textAlign:"center"}}>
                <p style={{fontSize:12,color:DIMMED,marginBottom:4}}>Streak</p>
                <p style={{fontSize:24,fontWeight:700,color:AMBER}}>{streak} days</p>
              </div>
            )}
          </div>

          <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"20px"}}>
            <p style={{fontSize:15,color:MUTED,lineHeight:1.8}}>
              <strong style={{color:WHITE}}>Consistency compounds.</strong> The next 7 days are where the 5 Quantum Laws shift from conscious practice to automatic behavior.
            </p>
          </div>
        </div>

        <button onClick={onContinue} style={{width:"100%",border:"none",borderRadius:100,padding:"16px",fontSize:16,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:"linear-gradient(135deg,#059669,#34D399)",color:WHITE,letterSpacing:".05em"}}>
          Final Week →
        </button>
      </div>
    </div>
  );
}

function QuantumMilestoneDay21({challengeData, onContinue}){
  const streak = getStreak(challengeData);
  const daysActive = getDaysActive(challengeData);
  const completion = getCompletionPercentage(challengeData);
  
  return(
    <div style={{minHeight:"100vh",background:BG,padding:"60px 20px",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:600,animation:"fadeUp .6s ease both"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:80,marginBottom:16}}>🏆</div>
          <div style={{display:"inline-block",background:"linear-gradient(135deg,#059669,#34D399)",borderRadius:100,padding:"8px 20px",marginBottom:16}}>
            <span style={{fontSize:14,fontWeight:700,color:WHITE,letterSpacing:".12em"}}>21-DAY WELLNESS TRANSFORMATION COMPLETE</span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(40px,9vw,64px)",letterSpacing:2,color:WHITE,marginBottom:12}}>Transformation Complete</h1>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,color:MUTED,lineHeight:1.7}}>21 days of honoring the 5 Quantum Laws. The habit is formed.</p>
        </div>

        <div style={{background:`linear-gradient(145deg,rgba(52,211,153,0.15),transparent)`,border:`2px solid ${GREEN}`,borderRadius:20,padding:"36px 32px",marginBottom:24,boxShadow:"0 0 40px rgba(52,211,153,0.2)"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:88,letterSpacing:2,color:GREEN,lineHeight:1}}>{completion}%</div>
            <p style={{fontSize:17,color:MUTED,marginTop:10}}>Challenge completion rate</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:14,marginBottom:28}}>
            <div style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"16px",textAlign:"center"}}>
              <p style={{fontSize:13,color:DIMMED,marginBottom:6}}>Days Active</p>
              <p style={{fontSize:28,fontWeight:700,color:GREEN}}>{daysActive}</p>
            </div>
            {streak > 0 && (
              <div style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${BORDER2}`,borderRadius:12,padding:"16px",textAlign:"center"}}>
                <p style={{fontSize:13,color:DIMMED,marginBottom:6}}>Final Streak</p>
                <p style={{fontSize:28,fontWeight:700,color:AMBER}}>{streak}🔥</p>
              </div>
            )}
          </div>

          <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:14,padding:"24px"}}>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:WHITE,lineHeight:1.85,textAlign:"center"}}>
              "Small shifts, consistently honoured, produce quantum results."
            </p>
          </div>
        </div>

        <button onClick={onContinue} style={{width:"100%",border:"none",borderRadius:100,padding:"18px",fontSize:17,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",cursor:"pointer",background:"linear-gradient(135deg,#059669,#34D399)",color:WHITE,letterSpacing:".05em"}}>
          Continue Living Quantum →
        </button>
        
        <p style={{fontSize:13,color:DIMMED,textAlign:"center",marginTop:12}}>The 21 days built the habit. Now maintain it for life.</p>
      </div>
    </div>
  );
}

function LawDetail({ law, arch, onBack }) {
  const archNote = arch && ARCH_LAW_NOTES[arch] ? ARCH_LAW_NOTES[arch][LAWS.indexOf(law)] : null;
  const ARCH_NAMES = {A:"Systems Architect",B:"Deep Learner",C:"Relational Catalyst",D:"Visionary Pioneer"};
  const ARCH_COLORS = {A:"#00C8FF",B:"#38BDF8",C:"#34D399",D:"#A78BFA"};
  return (
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 80% 40% at 50% 0%,${law.glow} 0%,transparent 60%),${BG}`,fontFamily:"'Space Grotesk',sans-serif",color:WHITE,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 60px"}}>
      <div style={{width:"100%",borderBottom:`1px solid ${BORDER}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(7,15,30,0.9)",backdropFilter:"blur(14px)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${BORDER}`,borderRadius:100,padding:"8px 16px",color:MUTED,fontSize:15,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.color=WHITE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>← All Laws</button>
        <p style={{fontSize:14,fontWeight:700,color:law.color,letterSpacing:".1em",textTransform:"uppercase"}}>Law {law.num}</p>
        <span style={{fontSize:20,color:law.color}}>{law.sym}</span>
      </div>

      <div style={{width:"100%",maxWidth:620,paddingTop:36,zIndex:1}}>
        {/* Hero */}
        <div style={{background:`linear-gradient(145deg,${DARK2},${DARK})`,border:`1px solid ${law.color}44`,borderRadius:20,padding:"36px 28px",textAlign:"center",marginBottom:16,boxShadow:`0 0 50px ${law.glow}`,animation:"fadeUp .6s ease both"}}>
          <div style={{fontSize:52,marginBottom:12}}>{law.icon}</div>
          <p style={{fontSize:16,fontWeight:700,color:law.color,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>Quantum Law {law.num} · {law.subtitle}</p>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,6vw,44px)",letterSpacing:2,color:WHITE,marginBottom:4}}>{law.title}</h1>
          <div style={{width:50,height:2,background:`linear-gradient(90deg,transparent,${law.color},transparent)`,margin:"16px auto"}}/>
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:19,color:law.color,lineHeight:1.65}}>"{law.principle}"</p>
        </div>

        {/* The Truth */}
        <div style={{background:PANEL,border:`1px solid ${BORDER2}`,borderRadius:16,padding:"24px",marginBottom:14,animation:"fadeUp .6s .1s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>The Truth</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:17,lineHeight:1.85,color:"rgba(255,255,255,0.8)",fontWeight:300}}>{law.truth}</p>
        </div>

        {/* Quantum Edge */}
        <div style={{background:law.glow,border:`1px solid ${law.color}33`,borderLeft:`3px solid ${law.color}`,borderRadius:"0 14px 14px 0",padding:"18px 20px",marginBottom:14,animation:"fadeUp .6s .15s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:law.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>⚡ Quantum Edge</p>
          <p style={{fontFamily:"'Crimson Pro',serif",fontSize:16,color:MUTED,lineHeight:1.75}}>{law.quantumEdge}</p>
        </div>

        {/* Daily Practice */}
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:16,padding:"22px",marginBottom:14,animation:"fadeUp .6s .2s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>◈ Daily Practice</p>
          <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.82)",fontWeight:400}}>{law.dailyPractice}</p>
        </div>

        {/* 4 Practices */}
        <p style={{fontSize:16,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12,animation:"fadeUp .6s .25s ease both"}}>4 Quantum Practices</p>
        {law.practices.map((p,i)=>(
          <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${law.color}88`,borderRadius:14,padding:"18px 20px",marginBottom:10,animation:`fadeUp .6s ${.28+i*.06}s ease both`}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:law.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:BG,fontWeight:800,flexShrink:0}}>{i+1}</div>
              <p style={{fontSize:16,fontWeight:700,color:law.color,letterSpacing:".06em"}}>{p.title}</p>
            </div>
            <p style={{fontSize:14,lineHeight:1.8,color:MUTED,fontWeight:300}}>{p.desc}</p>
          </div>
        ))}

        {/* Things to avoid */}
        <div style={{background:"rgba(255,160,40,0.04)",border:"1px solid rgba(255,160,40,0.15)",borderRadius:16,padding:"20px 22px",marginBottom:14,animation:"fadeUp .6s .5s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:"rgba(255,180,50,0.8)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>△ Patterns to Avoid</p>
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
            <p style={{fontSize:16,fontWeight:700,color:ARCH_COLORS[arch],letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>⚛ {ARCH_NAMES[arch]} — This Law Applied to You</p>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.8}}>{archNote}</p>
          </div>
        ) : (
          <div style={{background:`linear-gradient(135deg,rgba(0,200,255,0.06),rgba(0,200,255,0.02))`,border:`1px solid ${E_BLUE}33`,borderRadius:16,padding:"20px 22px",animation:"fadeUp .6s .55s ease both"}}>
            <p style={{fontSize:16,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>⚛ LQM Archetype Note</p>
            <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:MUTED,lineHeight:1.75}}>{law.lqmNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
