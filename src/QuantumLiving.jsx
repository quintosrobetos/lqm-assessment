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
    dailyPractice: "Tonight, set your sleep window — the same time to bed as last night, the same time to rise tomorrow. Seven to nine hours is not a luxury. It is the foundation everything else runs on. Protect tonight as fiercely as your most important appointment.",
    todaySummary: "Set your sleep window tonight — same time to bed, same time to rise.",
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
    dailyPractice: "Step outside today for at least 20 minutes of fresh air. Move while you do it. Open a window at home right now. Breathe slowly, deeply, through your nose. Today's air is today's fuel.",
    todaySummary: "Get outside today for 20 minutes of fresh air and movement.",
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
    dailyPractice: "Today, notice one thing you are overdoing — screen time, rushing, negative self-talk. Then notice one thing you are under-doing — rest, stillness, a real conversation. Pick one of those and rebalance it today. Not tomorrow. Today.",
    todaySummary: "Spot one excess and one deficit in your life today. Rebalance one of them.",
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
    dailyPractice: "Move your body today — not as punishment, not as obligation, but as the most powerful upgrade available to you right now at zero cost. Walk, run, lift, swim, dance, stretch. Pick one. Do it today. The modality matters far less than the doing.",
    todaySummary: "Move your body today — walk, run, lift, swim or stretch. Pick one and do it.",
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
    dailyPractice: "At your next meal today, fill at least two-thirds of your plate with whole fruits or vegetables. Choose one food today that is as close to its natural state as possible. The simpler you eat today, the cleaner your energy will feel by this evening.",
    todaySummary: "At your next meal, fill two-thirds of your plate with whole, natural food.",
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


// ── Daily natural product fun fact ──────────────────────────────────────
const FUN_FACTS = [
  { ingredient:"Garlic", fact:"Raw garlic contains allicin — a compound shown in research to reduce cortisol levels and support immune function. Let it sit for 10 minutes after chopping to activate the allicin before eating." },
  { ingredient:"Turmeric", fact:"Curcumin, the active compound in turmeric, has been shown to cross the blood-brain barrier and reduce neuroinflammation. Adding black pepper increases its absorption by up to 2,000%." },
  { ingredient:"Blueberries", fact:"Blueberries are one of the few foods shown in studies to directly improve memory and delay cognitive ageing. A handful a day is enough to see measurable effects within 12 weeks." },
  { ingredient:"Walnuts", fact:"Walnuts are the only nut with significant omega-3 content. Their shape isn't accidental — research confirms they specifically support brain structure and improve working memory." },
  { ingredient:"Dark Chocolate", fact:"Cacao contains theobromine and flavonoids that increase blood flow to the brain. 70%+ dark chocolate in small amounts has been linked to improved focus and reduced anxiety." },
  { ingredient:"Green Tea", fact:"L-theanine in green tea produces alert calmness — it increases alpha brain waves, the same state seen in experienced meditators. Combined with caffeine, it's one of nature's best focus compounds." },
  { ingredient:"Ginger", fact:"Ginger contains gingerols and shogaols that inhibit inflammatory pathways in the brain. Fresh ginger tea before bed has been shown to reduce muscle soreness and improve sleep quality." },
  { ingredient:"Avocado", fact:"Avocados are rich in oleic acid — the same fat that makes up 25% of the myelin sheath protecting your nerve fibres. They also contain more potassium than a banana, critical for cognitive function." },
  { ingredient:"Spinach", fact:"Spinach contains lutein and folate, both linked to slower cognitive decline. Research from Tufts University found people who ate leafy greens daily had brains 11 years younger than those who didn't." },
  { ingredient:"Wild Salmon", fact:"DHA from wild salmon makes up 40% of the polyunsaturated fats in your brain. Low DHA levels are consistently linked to depression, brain fog, and slower learning speeds." },
  { ingredient:"Oats", fact:"Beta-glucan in oats feeds the beneficial bacteria in your gut — which produce 90% of your body's serotonin. A slow-release breakfast is directly linked to more stable mood throughout the day." },
  { ingredient:"Cinnamon", fact:"Just half a teaspoon of cinnamon a day has been shown to improve insulin sensitivity, stabilise blood sugar, and increase BDNF — the protein responsible for creating new brain cells." },
  { ingredient:"Beetroot", fact:"Beetroot is one of the richest dietary sources of nitrates, which convert to nitric oxide in the body — widening blood vessels and increasing oxygen delivery to the prefrontal cortex by up to 16%." },
  { ingredient:"Broccoli", fact:"Broccoli contains sulforaphane — a compound that activates your body's own antioxidant defence system. It's also one of the best food sources of Vitamin K, essential for cognitive function." },
  { ingredient:"Eggs", fact:"Eggs are the richest dietary source of choline — the precursor to acetylcholine, the neurotransmitter responsible for memory formation. One egg contains 35% of your daily choline requirement." },
  { ingredient:"Pomegranate", fact:"Pomegranate juice contains ellagitannins that convert in the gut to urolithins — compounds shown to clear damaged mitochondria from brain cells, essentially performing cellular housekeeping." },
  { ingredient:"Almonds", fact:"Almonds contain riboflavin and L-carnitine, two nutrients that support neural pathways and have been linked to increased brain activity. They're also one of the best magnesium sources — critical for sleep." },
  { ingredient:"Olive Oil", fact:"Extra virgin olive oil contains oleocanthal — a natural anti-inflammatory with a mechanism similar to ibuprofen. Regular consumption is one of the most replicated predictors of long-term brain health." },
  { ingredient:"Fermented Foods", fact:"Kimchi, kefir, and live yoghurt contain live bacteria that communicate with your brain via the vagus nerve. Studies show fermented food consumption correlates strongly with reduced anxiety scores." },
  { ingredient:"Brazil Nuts", fact:"A single Brazil nut contains your entire daily selenium requirement. Selenium is essential for thyroid function, which directly regulates energy, mood, and metabolic rate." },
  { ingredient:"Sweet Potato", fact:"Sweet potatoes are one of the richest sources of beta-carotene, which converts to Vitamin A in the body — essential for maintaining the protective layer around brain and spinal cord neurons." },
  { ingredient:"Lemon", fact:"The scent of lemon alone has been shown in research to increase alertness and cognitive performance. Lemon water first thing in the morning supports liver detoxification and alkalises the body." },
  { ingredient:"Pumpkin Seeds", fact:"Pumpkin seeds are the richest plant source of zinc, which is essential for nerve signalling. They also contain magnesium, iron, copper and manganese — critical micronutrients for brain function." },
  { ingredient:"Chamomile", fact:"Chamomile contains apigenin — an antioxidant that binds to GABA receptors in your brain, producing a mild sedative effect. It's one of the most studied natural sleep aids, shown to improve sleep quality." },
  { ingredient:"Rosemary", fact:"The aroma of rosemary alone has been shown to improve memory performance by 15% in research trials. Carnosic acid in rosemary also protects the brain from oxidative stress and free radical damage." },
  { ingredient:"Flaxseed", fact:"Ground flaxseed is one of the best plant-based sources of ALA omega-3 fatty acids. It also contains lignans — phytoestrogens shown to reduce inflammation and support hormonal balance." },
  { ingredient:"Honey", fact:"Raw honey contains prebiotics that feed beneficial gut bacteria, trace minerals, and a small amount of melatonin precursors. A teaspoon of raw honey before bed may improve sleep quality and morning alertness." },
  { ingredient:"Cayenne Pepper", fact:"Capsaicin in cayenne triggers the release of endorphins and increases thermogenesis — your body's heat production. It's also shown to reduce appetite and increase energy expenditure for several hours after eating." },
  { ingredient:"Coconut Oil", fact:"Medium-chain triglycerides (MCTs) in coconut oil are converted rapidly to ketones — an alternative fuel source the brain uses efficiently. MCTs have shown promise in early cognitive decline research." },
  { ingredient:"Black Pepper", fact:"Piperine in black pepper doesn't just enhance nutrient absorption — it also inhibits an enzyme that breaks down serotonin and dopamine in the brain, effectively boosting their availability naturally." },
  { ingredient:"Watercress", fact:"Watercress has the highest nutrient density of any vegetable tested by the CDC. It contains isothiocyanates shown to protect DNA from damage caused by oxidative stress — a leading driver of ageing." },
  { ingredient:"Maca Root", fact:"Maca is an adaptogen — a plant that helps your body regulate its stress response. Studies show consistent maca use improves energy, mood, and endurance without stimulant effects or adrenal burden." },
  { ingredient:"Ashwagandha", fact:"Withaferin A in ashwagandha has been shown to reduce cortisol by 27% over 60 days in clinical trials. It's the most studied adaptogen for stress reduction and sleep quality improvement." },
  { ingredient:"Saffron", fact:"Saffron contains safranal and crocin — compounds shown in multiple studies to be as effective as low-dose antidepressants for mild to moderate depression, with no significant side effects reported." },
  { ingredient:"Lion's Mane Mushroom", fact:"Lion's Mane is the only known food that stimulates Nerve Growth Factor (NGF) production — the protein responsible for growing and maintaining neurons. It's the most studied natural compound for neuroplasticity." },
];
const todayFact = FUN_FACTS[Math.floor(Date.now() * 0.0000115741) % FUN_FACTS.length];

export default function QuantumLiving({ onBack, archetype }) {
  const [activeLaw, setActiveLaw] = useState(null);
  const todayKey = new Date().toISOString().split("T")[0]; // "2026-02-25"

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("lqm_living") || "{}");
      // Only restore ticks if they were saved TODAY
      if(saved.checklistDate === todayKey && Array.isArray(saved.checklist)) {
        return saved.checklist;
      }
    } catch{}
    return [false,false,false,false,false];
  });

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
  const todayLawIdx = Math.floor(Date.now() * 0.0000115741) % 5;
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
    ? ARCH_DAILY[arch][Math.floor(Date.now() * 0.0000115741) % 5]
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
    // Focus law: once ticked, lock it — cannot un-tick (streak is logged)
    if(i === todayLawIdx && checklist[i] === true) return;

    const n = [...checklist];
    n[i] = !n[i];
    setChecklist(n);

    // Always persist checklist state with today's date
    try {
      const saved = JSON.parse(localStorage.getItem("lqm_living") || "{}");
      localStorage.setItem("lqm_living", JSON.stringify({
        ...saved,
        checklist: n,
        checklistDate: todayKey
      }));
    } catch{}

    // Streak only triggers when TODAY'S FOCUS LAW is first ticked
    if(i === todayLawIdx && n[i] === true) {
      try {
        const saved = JSON.parse(localStorage.getItem("lqm_living") || "{}");
        // Guard: don't double-count if already logged today
        if(saved.lastDay === todayKey) return;
        localStorage.setItem("lqm_living", JSON.stringify({
          ...saved,
          checklist: n,
          checklistDate: todayKey,
          streak: streak + 1,
          lastDay: todayKey
        }));
      } catch{}
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
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:13,fontWeight:700,color:checklist[todayLawIdx]?GREEN:MUTED}}>
            {checklist[todayLawIdx]?"1":"0"}{" of 1 🔥"}
          </span>
          <span style={{fontSize:12,color:DIMMED}}>+</span>
          <span style={{fontSize:13,fontWeight:700,color:AMBER}}>
            {checklist.filter((v,i)=>v && i!==todayLawIdx).length}{" of 4 ⭐"}
          </span>
        </div>
      </div>

      <div style={{width:"100%",maxWidth:620,paddingTop:28,zIndex:1}}>

        {/* ── SECTION 1: TODAY'S INTENTION — Law + streak tick integrated ── */}
        <div style={{marginBottom:16,animation:"fadeUp .5s ease both"}}>

          {/* Law identity badge */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:28}}>{todayLaw.icon}</span>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:todayLaw.color,letterSpacing:".14em",textTransform:"uppercase",marginBottom:2}}>Law {todayLaw.num} · Today's Focus</p>
                <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,color:WHITE,lineHeight:1}}>{todayLaw.title}</h2>
              </div>
            </div>
            {streak > 0 && <div style={{background:AMBER+"15",border:`1px solid ${AMBER}44`,borderRadius:100,padding:"5px 12px",flexShrink:0}}>
              <span style={{fontSize:13,color:AMBER,fontWeight:700}}>🔥 {streak} days</span>
            </div>}
          </div>

          {/* Principle quote */}
          <p style={{fontFamily:"'Crimson Pro',serif",fontStyle:"italic",fontSize:16,color:todayLaw.color,lineHeight:1.6,marginBottom:14,paddingLeft:4}}>"{todayLaw.principle}"</p>

          {/* Practice — the actual thing to do today */}
          <div style={{background:`linear-gradient(135deg,${todayLaw.color}0e,${DARK2})`,border:`1.5px solid ${todayLaw.color}44`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:todayLaw.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>◈ Your Practice Today</p>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.78)",lineHeight:1.85,fontWeight:400}}>{todayLaw.dailyPractice}</p>
          </div>

          {/* Archetype note */}
          {todayArchNote && (
            <div style={{background:`${archColor}0a`,borderLeft:`3px solid ${archColor}`,borderRadius:"0 10px 10px 0",padding:"12px 14px",marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:archColor,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>⚛ For {archName}</p>
              <p style={{fontSize:14,color:"rgba(255,255,255,0.72)",lineHeight:1.75,fontWeight:400}}>{todayArchNote}</p>
            </div>
          )}

          {/* TICK — integrated into the law card, not a separate section */}
          <div onClick={()=>toggleCheck(todayLawIdx)} style={{
            display:"flex",alignItems:"center",gap:14,
            padding:"14px 16px",borderRadius:14,cursor:"pointer",
            background:checklist[todayLawIdx]?`${todayLaw.color}18`:"rgba(255,255,255,0.03)",
            border:`2px solid ${checklist[todayLawIdx]?todayLaw.color:todayLaw.color+"55"}`,
            boxShadow:checklist[todayLawIdx]?`0 0 20px ${todayLaw.color}22`:"none",
            transition:"all .3s",marginBottom:8
          }}>
            <div style={{
              width:36,height:36,borderRadius:10,flexShrink:0,
              background:checklist[todayLawIdx]?todayLaw.color:`${todayLaw.color}22`,
              border:`2px solid ${todayLaw.color}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all .25s",fontSize:18
            }}>
              {checklist[todayLawIdx]
                ? <span style={{color:BG,fontWeight:900,fontSize:18}}>✓</span>
                : <span style={{display:"inline-block"}}>{todayLaw.icon}</span>}
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:16,fontWeight:700,color:checklist[todayLawIdx]?todayLaw.color:WHITE,transition:"color .2s",marginBottom:2}}>
                {checklist[todayLawIdx] ? "Done for today ✓" : todayLaw.title}
              </p>
              <p style={{fontSize:13,color:MUTED,lineHeight:1.4}}>{checklist[todayLawIdx] ? "Streak logged — come back tomorrow" : todayLaw.todaySummary}</p>
            </div>
            {!checklist[todayLawIdx] && (
              <div style={{
                background:todayLaw.color,color:BG,fontWeight:800,fontSize:13,
                borderRadius:100,padding:"8px 16px",flexShrink:0,
                boxShadow:`0 0 14px ${todayLaw.color}66`,
                animation:"focusGlow 2s ease-in-out infinite",
                whiteSpace:"nowrap"
              }}>Mark Done</div>
            )}
          </div>

          {/* Dive deeper */}
          <button onClick={()=>setActiveLaw(todayLawIdx)} style={{
            width:"100%",border:`1px solid ${todayLaw.color}33`,borderRadius:100,
            padding:"10px",fontSize:13,fontWeight:700,background:"transparent",
            color:todayLaw.color,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",
            letterSpacing:".06em",opacity:.8
          }}
            onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background=`${todayLaw.color}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.opacity=".8";e.currentTarget.style.background="transparent";}}>
            Explore full law — practices, science & more →
          </button>
        </div>

        {/* ── SECTION 2: YOUR TIP — archetype insight (discoverable on scroll) ── */}
        {dailyArchTip && (
          <div style={{background:`${archColor}08`,border:`1px solid ${archColor}25`,borderRadius:14,padding:"16px 18px",marginBottom:16,animation:"fadeUp .5s .08s ease both"}}>
            <p style={{fontSize:11,fontWeight:700,color:archColor,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>💡 Your Edge Today — {archName}</p>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.78)",lineHeight:1.8,fontWeight:400}}>{dailyArchTip}</p>
          </div>
        )}

        {/* ── SECTION 3: NATURAL INTELLIGENCE — daily fact ── */}
        <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:14,padding:"16px 18px",marginBottom:16,animation:"fadeUp .5s .12s ease both"}}>
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:15}}>🌿</span>
              <p style={{fontSize:11,fontWeight:700,color:"rgba(52,211,153,0.6)",letterSpacing:".14em",textTransform:"uppercase"}}>Today's Natural Intelligence</p>
            </div>
            <p style={{fontSize:17,fontWeight:700,color:GREEN,letterSpacing:".04em"}}>{todayFact.ingredient}</p>
          </div>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.8}}>{todayFact.fact}</p>
        </div>

        {/* ── SECTION 4: THE OTHER 4 LAWS — compact explore strip ── */}
        <div style={{marginBottom:16,animation:"fadeUp .5s .16s ease both"}}>
          <p style={{fontSize:11,fontWeight:700,color:DIMMED,letterSpacing:".14em",textTransform:"uppercase",marginBottom:10}}>⭐ The 5 Quantum Laws — tap any to explore</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {LAWS.map((law,i) => (
              <div key={i} style={{
                display:"flex",alignItems:"center",gap:12,
                padding:"12px 14px",borderRadius:12,cursor:"pointer",
                background:checklist[i]?`${law.color}10`:(i===todayLawIdx?`${law.color}0a`:"rgba(255,255,255,0.02)"),
                border:`1px solid ${checklist[i]?law.color+"55":(i===todayLawIdx?law.color+"44":BORDER2)}`,
                transition:"all .2s",position:"relative"
              }}
                onClick={()=>{ if(i===todayLawIdx) toggleCheck(i); else toggleCheck(i); setActiveLaw(i); }}
                onMouseEnter={e=>e.currentTarget.style.background=`${law.color}12`}
                onMouseLeave={e=>e.currentTarget.style.background=checklist[i]?`${law.color}10`:(i===todayLawIdx?`${law.color}0a`:"rgba(255,255,255,0.02)")}
              >
                {/* Checkbox */}
                <div onClick={e=>{e.stopPropagation();toggleCheck(i);}} style={{
                  width:26,height:26,borderRadius:8,flexShrink:0,
                  background:checklist[i]?law.color:"transparent",
                  border:`1.5px solid ${checklist[i]?law.color:BORDER2}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  transition:"all .2s",cursor:"pointer"
                }}>
                  {checklist[i]
                    ? <span style={{color:BG,fontSize:13,fontWeight:900}}>✓</span>
                    : <span style={{fontSize:13}}>{law.icon}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <p style={{fontSize:14,fontWeight:600,color:checklist[i]?WHITE:(i===todayLawIdx?law.color:MUTED),transition:"color .2s"}}>{law.title}</p>
                    {i===todayLawIdx && <span style={{fontSize:10,fontWeight:700,color:law.color,background:`${law.color}18`,borderRadius:100,padding:"2px 7px",letterSpacing:".06em",textTransform:"uppercase",flexShrink:0}}>Today</span>}
                  </div>
                  <p style={{fontSize:11,color:DIMMED,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{law.subtitle}</p>
                </div>
                <span style={{fontSize:11,color:checklist[i]?AMBER:DIMMED,fontWeight:700,flexShrink:0}}>{i===todayLawIdx?"🔥":"+10"}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:10,padding:"8px 12px",background:"rgba(251,191,36,0.03)",border:"1px solid rgba(251,191,36,0.12)",borderRadius:8}}>
            <p style={{fontSize:12,color:"rgba(251,191,36,0.5)",lineHeight:1.5}}>💡 Tap any law to explore its full practice. Today's focus law 🔥 builds your streak.</p>
          </div>
        </div>

          {/* All done celebration */}
          {allDone && (
            <div style={{marginTop:10,padding:"14px 18px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.3)",borderRadius:12,textAlign:"center"}}>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,color:GREEN,marginBottom:4}}>🌿 All 5 Laws Honoured Today</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6,fontStyle:"italic"}}>"Small shifts, consistently honoured, produce quantum results."</p>
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
              <div style={{height:"100%",width:`${Math.round((challengeData.currentDay||1)*4.762)}%`,background:"linear-gradient(90deg,rgba(52,211,153,0.6),#34D399)",borderRadius:100,transition:"width .8s ease"}}/>
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
            style={{background:i===todayLawIdx?`${law.color}0a`:PANEL, border:`1px solid ${i===todayLawIdx?law.color+"44":BORDER2}`, borderLeft:`3px solid ${law.color}`, borderRadius:14, padding:"14px 16px", marginBottom:8, cursor:"pointer", transition:"all .2s", animation:`fadeUp 0.5s ${0.28+i*0.06}s ease both`, display:"flex", alignItems:"center", gap:14}}
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
          <p style={{fontSize:16,color:"rgba(255,255,255,0.75)",lineHeight:1.75,fontWeight:400}}>You've honored the 5 Quantum Laws for 7 days. Wellness habits are taking root.</p>
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
          <p style={{fontSize:16,color:"rgba(255,255,255,0.75)",lineHeight:1.75,fontWeight:400}}>Halfway to transformation. The habit is forming.</p>
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
          <p style={{fontSize:16,color:"rgba(255,255,255,0.75)",lineHeight:1.75,fontWeight:400}}>21 days of honoring the 5 Quantum Laws. The habit is formed.</p>
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
          <p style={{fontSize:15,color:"rgba(255,255,255,0.78)",lineHeight:1.9,fontWeight:400}}>{law.truth}</p>
        </div>

        {/* Quantum Edge */}
        <div style={{background:law.glow,border:`1px solid ${law.color}33`,borderLeft:`3px solid ${law.color}`,borderRadius:"0 14px 14px 0",padding:"18px 20px",marginBottom:14,animation:"fadeUp .6s .15s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:law.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>⚡ Quantum Edge</p>
          <p style={{fontSize:15,color:"rgba(255,255,255,0.72)",lineHeight:1.85,fontWeight:400}}>{law.quantumEdge}</p>
        </div>

        {/* Daily Practice */}
        <div style={{background:"rgba(0,200,255,0.04)",border:`1px solid ${BORDER}`,borderRadius:16,padding:"22px",marginBottom:14,animation:"fadeUp .6s .2s ease both"}}>
          <p style={{fontSize:16,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>◈ Daily Practice</p>
          <p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.82)",fontWeight:400}}>{law.dailyPractice}</p>
        </div>

        {/* 4 Practices */}
        <p style={{fontSize:16,fontWeight:700,color:DIMMED,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12,animation:"fadeUp .6s .25s ease both"}}>4 Quantum Practices</p>
        {law.practices.map((p,i)=>(
          <div key={i} style={{background:PANEL,border:`1px solid ${BORDER2}`,borderTop:`2px solid ${law.color}88`,borderRadius:14,padding:"18px 20px",marginBottom:10,animation:`fadeUp 0.6s ${0.28+i*0.06}s ease both`}}>
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
            <p style={{fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.85,fontWeight:400}}>{archNote}</p>
          </div>
        ) : (
          <div style={{background:`linear-gradient(135deg,rgba(0,200,255,0.06),rgba(0,200,255,0.02))`,border:`1px solid ${E_BLUE}33`,borderRadius:16,padding:"20px 22px",animation:"fadeUp .6s .55s ease both"}}>
            <p style={{fontSize:16,fontWeight:700,color:E_BLUE,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>⚛ LQM Archetype Note</p>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.75)",lineHeight:1.85,fontWeight:400}}>{law.lqmNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
