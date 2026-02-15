import { useState, useEffect, useRef } from "react";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');`;

const questions = [
  {
    id: 1,
    text: "When you set a major goal, what's your first instinct?",
    options: [
      { text: "Break it into a precise action plan immediately", type: "A" },
      { text: "Research everything about it thoroughly first", type: "B" },
      { text: "Talk to people who've already achieved it", type: "C" },
      { text: "Visualise the end result and what it means to you", type: "D" },
    ],
  },
  {
    id: 2,
    text: "What does success genuinely mean to you?",
    options: [
      { text: "Hitting concrete milestones and measurable results", type: "A" },
      { text: "Mastering a skill or deeply understanding something", type: "B" },
      { text: "Building something meaningful alongside others", type: "C" },
      { text: "Creating something uniquely yours that didn't exist before", type: "D" },
    ],
  },
  {
    id: 3,
    text: "You've been stuck on a project for days. What actually gets you moving?",
    options: [
      { text: "Setting a hard deadline with real consequences", type: "A" },
      { text: "Reframing it as a puzzle I need to solve", type: "B" },
      { text: "Accountability from someone I respect", type: "C" },
      { text: "Changing my environment or approach entirely", type: "D" },
    ],
  },
  {
    id: 4,
    text: "Which environment brings out your best work?",
    options: [
      { text: "Structured, with clear expectations and metrics", type: "A" },
      { text: "Open, with space to explore and experiment", type: "B" },
      { text: "Collaborative, with a strong team dynamic", type: "C" },
      { text: "Autonomous, where I control the vision and execution", type: "D" },
    ],
  },
  {
    id: 5,
    text: "What drains you most?",
    options: [
      { text: "Lack of progress or wasted effort", type: "A" },
      { text: "Repetition with no learning or growth", type: "B" },
      { text: "Working in isolation without connection", type: "C" },
      { text: "Being told exactly how to do things", type: "D" },
    ],
  },
  {
    id: 6,
    text: "Someone criticises your work. Your honest first reaction?",
    options: [
      { text: "Evaluate it against the objective — is it valid?", type: "A" },
      { text: "Ask questions to understand their reasoning", type: "B" },
      { text: "Consider how it affects my relationship with them", type: "C" },
      { text: "Feel it deeply but use it as fuel to push further", type: "D" },
    ],
  },
  {
    id: 7,
    text: "When learning something new and difficult, you tend to:",
    options: [
      { text: "Follow a structured course or proven framework", type: "A" },
      { text: "Dive deep into source material yourself", type: "B" },
      { text: "Learn best by discussing or teaching others", type: "C" },
      { text: "Experiment and learn through doing", type: "D" },
    ],
  },
  {
    id: 8,
    text: "Your relationship with long-term goals is best described as:",
    options: [
      { text: "I thrive on them — they give me direction and drive", type: "A" },
      { text: "I like goals that evolve as I learn more", type: "B" },
      { text: "Goals matter most when shared with others", type: "C" },
      { text: "My vision is clear; the path is flexible", type: "D" },
    ],
  },
  {
    id: 9,
    text: "At the end of a truly productive day, you feel:",
    options: [
      { text: "Satisfied — I completed exactly what I planned", type: "A" },
      { text: "Energised — I understood something better than before", type: "B" },
      { text: "Fulfilled — I contributed to something beyond myself", type: "C" },
      { text: "Alive — I made something that didn't exist this morning", type: "D" },
    ],
  },
  {
    id: 10,
    text: "The phrase that resonates most deeply with you:",
    options: [
      { text: '"Execute with precision. Results are everything."', type: "A" },
      { text: '"The more I learn, the more I see what\'s possible."', type: "B" },
      { text: '"We rise by lifting others."', type: "C" },
      { text: '"I\'d rather create something imperfect than copy something perfect."', type: "D" },
    ],
  },
];

const characterTypes = {
  A: {
    name: "The Driven Achiever",
    archetype: "The Strategist",
    tagline: "You move with purpose. Every action is deliberate.",
    description:
      "You are intrinsically motivated by outcomes and results. You possess a rare ability to translate ambition into systematic action. Where others see obstacles, you see problems to be solved with the right process. Your quantum leap happens when you align your drive with the right strategy.",
    strengths: ["Goal-setting precision", "Resilience under pressure", "Execution consistency", "Self-discipline"],
    challenges: [
      "Perfectionism can stall meaningful progress",
      "Risk of burnout from relentless pace",
      "Can undervalue rest and recovery time",
    ],
    strategies: [
      {
        area: "Overcoming Procrastination",
        scenario: "I delay starting when the outcome feels uncertain or the task feels too large.",
        solution:
          "I will define a 'minimum viable first step' — the smallest possible action that counts as starting. I will time-box my first session to 20 minutes only, removing the pressure of completion. Forward motion, however small, rebuilds momentum.",
      },
      {
        area: "Sustaining Motivation",
        scenario: "My drive dips when progress isn't immediately visible or measurable.",
        solution:
          "I will implement a weekly 'Progress Audit' — a 10-minute review every Friday where I document three specific things I moved forward. Visual proof of momentum fuels my next cycle of effort and resets my motivation baseline.",
      },
      {
        area: "Growth Mindset Practice",
        scenario: "I feel frustrated and deflated when I don't perform to my own standard.",
        solution:
          "I will reframe underperformance as data, not identity. I will ask: 'What did this reveal about my process?' rather than 'What does this say about me?' This single shift transforms setback into strategic intelligence.",
      },
    ],
    color: "#B8860B",
    lightColor: "#D4A017",
    bgColor: "rgba(184,134,11,0.08)",
    borderColor: "rgba(184,134,11,0.25)",
    icon: "◈",
    gradient: "linear-gradient(135deg, #B8860B, #D4A017)",
  },
  B: {
    name: "The Deep Explorer",
    archetype: "The Intellect",
    tagline: "Your curiosity is your greatest competitive edge.",
    description:
      "You are fuelled by understanding. You don't just want to know what — you need to know why. This depth of thinking allows you to develop mastery that most people never reach. Your quantum leap happens when you convert deep knowledge into decisive, courageous action.",
    strengths: ["Intellectual depth", "Pattern recognition", "Mastery-focused mindset", "Analytical under pressure"],
    challenges: [
      "Analysis paralysis before taking action",
      "Difficulty with 'good enough' in practice",
      "Can lose motivation without intellectual stimulation",
    ],
    strategies: [
      {
        area: "Converting Knowledge to Action",
        scenario: "I over-research and delay acting until I feel completely 'ready'.",
        solution:
          "I will apply the 70% Rule — when I have 70% of the information I want, I will act and treat the experience as field research. I will schedule a 'learning deadline' before every major decision, treating action itself as the deepest form of learning.",
      },
      {
        area: "Maintaining Motivation",
        scenario: "Repetitive tasks feel meaningless and drain my energy rapidly.",
        solution:
          "I will find the hidden complexity in routine. For every repetitive task, I will identify one variable to optimise. I will ask: 'How could I do this 10% more intelligently today?' This reframes execution as experimentation.",
      },
      {
        area: "Growth Through Discomfort",
        scenario: "I struggle when I'm not immediately competent at something new.",
        solution:
          "I will embrace the 'beginner's plateau' as confirmation I am in the growth zone. I will journal one new insight per learning session, making growth tangible and cumulative. Struggle is not failure — it is the signal of expansion.",
      },
    ],
    color: "#1B6FA8",
    lightColor: "#2E8BC0",
    bgColor: "rgba(27,111,168,0.08)",
    borderColor: "rgba(27,111,168,0.25)",
    icon: "◉",
    gradient: "linear-gradient(135deg, #1B3F6A, #2E8BC0)",
  },
  C: {
    name: "The Collaborative Connector",
    archetype: "The Catalyst",
    tagline: "You make everything — and everyone — better.",
    description:
      "Your motivation is deeply relational. You are energised by shared purpose, belonging, and the knowledge that your work matters to real people. You have a rare gift: the ability to inspire commitment in others while remaining genuinely self-aware. Your quantum leap happens when you channel connection into consistent personal achievement.",
    strengths: ["Empathy and emotional intelligence", "Building trust quickly", "Motivating others authentically", "Sustained effort when others depend on you"],
    challenges: [
      "Can lose personal direction without external anchors",
      "May avoid necessary but uncomfortable conflict",
      "Susceptible to absorbing others' energy and moods",
    ],
    strategies: [
      {
        area: "Grounding Your Own Goals",
        scenario: "I lose motivation when working in isolation without a sense of shared purpose.",
        solution:
          "I will attach every personal goal to someone I care about. I will write one sentence for each goal answering: 'Who does achieving this allow me to show up better for?' Then I will share this commitment directly with them. Relationship becomes my anchor.",
      },
      {
        area: "Protecting Your Energy",
        scenario: "I absorb the motivation — and the demotivation — of those around me.",
        solution:
          "I will create a 'Morning Anchor' ritual — 10 minutes before interacting with anyone else, I will reaffirm my own intentions for the day in writing. This builds an internal foundation that external moods cannot easily destabilise.",
      },
      {
        area: "Growth Mindset Practice",
        scenario: "I find it hard to persist through challenges when working alone.",
        solution:
          "I will establish a peer accountability partnership — one person I connect with weekly to share one win, one struggle, and one commitment for the following week. I don't remove the need for connection — I build it intelligently into my growth system.",
      },
    ],
    color: "#2E7D52",
    lightColor: "#3DAA6F",
    bgColor: "rgba(46,125,82,0.08)",
    borderColor: "rgba(46,125,82,0.25)",
    icon: "◎",
    gradient: "linear-gradient(135deg, #1A5C3A, #3DAA6F)",
  },
  D: {
    name: "The Visionary Creator",
    archetype: "The Pioneer",
    tagline: "You don't follow the path. You build it.",
    description:
      "You are driven by possibility. You think in futures, not frameworks. Your motivation comes from creative autonomy and the deep satisfaction of making something that carries your fingerprint. You're not built for systems — you're built to redefine them. Your quantum leap happens when you harness your vision with just enough structure to bring it fully into the world.",
    strengths: ["Original, divergent thinking", "High intrinsic motivation", "Bold risk tolerance", "Ability to inspire others through vision"],
    challenges: [
      "Difficulty sustaining execution after the initial spark",
      "Structure and systems can feel constraining",
      "Can abandon projects before completion",
    ],
    strategies: [
      {
        area: "Bridging Vision and Execution",
        scenario: "My motivation crashes once the exciting 'creation' phase ends.",
        solution:
          "I will create an 'Evolution Log' — a living document where I record how the project is changing and improving over time. I will consciously reframe completion as the beginning of the next creative act, not the end of this one. The project never truly finishes.",
      },
      {
        area: "Sustainable Creative Output",
        scenario: "I have too many ideas and scatter my energy across all of them at once.",
        solution:
          "I will apply the 'One Brilliant Thing' rule — each week, I identify the single most important creative act and protect at least 90 uninterrupted minutes for it before anything else. Everything else is secondary until that window is honoured.",
      },
      {
        area: "Growth Mindset Practice",
        scenario: "I feel demotivated when my output doesn't match my internal vision.",
        solution:
          "I will separate creation from evaluation entirely. I will give myself a 'no-judgement zone' during the making phase, and schedule a separate 'critical review' session 24 hours later with fresh perspective. The inner critic and the inner creator cannot occupy the same space at the same time.",
      },
    ],
    color: "#7B3FA0",
    lightColor: "#A05CC8",
    bgColor: "rgba(123,63,160,0.08)",
    borderColor: "rgba(123,63,160,0.25)",
    icon: "◇",
    gradient: "linear-gradient(135deg, #4A1A6E, #A05CC8)",
  },
};

const ORIGINAL_PRICE = 27;
const DISCOUNTED_PRICE = 9;
const TIMER_SECONDS = 15 * 60;

// ─── LQM Brand Colours ───────────────────────────────────────────────────────
const NAVY = "#1B2B5E";
const NAVY_DARK = "#0F1A3D";
const NAVY_MID = "#1E3170";
const GOLD = "#B8860B";
const GOLD_LIGHT = "#D4A850";
const GOLD_BRIGHT = "#F0C040";
const WHITE = "#FFFFFF";
const OFF_WHITE = "#F4F6FA";
const MUTED = "rgba(27,43,94,0.55)";

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [characterType, setCharacterType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerStarted, setTimerStarted] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GOOGLE_FONTS + `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { background: #F4F6FA; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
      @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      @keyframes sparkle { 0%,100%{transform:scale(1) rotate(0deg); opacity:1} 50%{transform:scale(1.3) rotate(20deg); opacity:0.8} }
      @keyframes blurIn { from{filter:blur(6px);opacity:0} to{filter:blur(0);opacity:1} }
      @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      .fade-up { animation: fadeUp 0.6s ease both; }
      .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
      .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
      .fade-up-3 { animation: fadeUp 0.6s 0.35s ease both; }
      .fade-up-4 { animation: fadeUp 0.6s 0.5s ease both; }
      .fade-up-5 { animation: fadeUp 0.6s 0.65s ease both; }
      .shimmer-gold {
        background: linear-gradient(90deg, ${GOLD} 0%, ${GOLD_BRIGHT} 40%, ${GOLD} 60%, ${GOLD_LIGHT} 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      }
      .sparkle { animation: sparkle 2.5s ease-in-out infinite; display:inline-block; }
      .timer-urgent { animation: pulse 1s infinite; }
      .blur-locked { filter: blur(5px); user-select:none; pointer-events:none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerStarted, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const calculateType = (ans) => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    ans.forEach((a) => counts[a]++);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleStart = () => {
    setTimerStarted(true);
    setPhase("quiz");
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setCharacterType(calculateType(newAnswers));
      setPhase("processing");
      let s = 0;
      const iv = setInterval(() => {
        s++;
        setProcessingStep(s);
        if (s >= 4) { clearInterval(iv); setTimeout(() => setPhase("teaser"), 600); }
      }, 900);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, fontFamily: "'Montserrat', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 60px", position: "relative" }}>
      {/* Top navy bar */}
      <div style={{ width: "100%", background: NAVY_DARK, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 0 }}>
        <LQMLogo size="sm" />
      </div>

      <div style={{ width: "100%", maxWidth: 660, position: "relative", zIndex: 1, paddingTop: 36 }}>
        {phase === "landing" && <LandingPage onStart={handleStart} timeLeft={timeLeft} formatTime={formatTime} />}
        {phase === "quiz" && (
          <QuizPage
            question={questions[currentQ]}
            index={currentQ}
            total={questions.length}
            selected={selectedOption}
            onSelect={setSelectedOption}
            onNext={handleNext}
            timeLeft={timeLeft}
            formatTime={formatTime}
          />
        )}
        {phase === "processing" && <ProcessingPage step={processingStep} />}
        {phase === "teaser" && (
          <TeaserPage
            type={characterTypes[characterType]}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onUnlock={() => setPhase("paid")}
          />
        )}
        {phase === "paid" && <FullReportPage type={characterTypes[characterType]} />}
      </div>
    </div>
  );
}

// ─── LQM Logo SVG Component ───────────────────────────────────────────────────
function LQMLogo({ size = "md" }) {
  const scale = size === "sm" ? 0.55 : size === "lg" ? 1.2 : 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <svg width={160 * scale} height={60 * scale} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* L */}
        <text x="0" y="50" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="56" fill={WHITE} letterSpacing="-2">L</text>
        {/* Q with swoosh */}
        <text x="42" y="50" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="56" fill={WHITE} letterSpacing="-2">Q</text>
        {/* Swoosh under Q */}
        <path d="M44 54 Q 70 62 98 52" stroke={GOLD_LIGHT} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* M */}
        <text x="90" y="50" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="56" fill={WHITE} letterSpacing="-2">M</text>
        {/* Sparkle star on M */}
        <g transform="translate(118, 4)">
          <line x1="0" y1="-9" x2="0" y2="9" stroke={GOLD_BRIGHT} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="-9" y1="0" x2="9" y2="0" stroke={GOLD_BRIGHT} strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="-6" y1="-6" x2="6" y2="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round"/>
          <line x1="6" y1="-6" x2="-6" y2="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="0" cy="0" r="2" fill={WHITE}/>
          {/* Glow */}
          <circle cx="0" cy="0" r="5" fill="rgba(100,180,255,0.2)"/>
        </g>
      </svg>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 9 * scale,
        fontWeight: 600,
        letterSpacing: "0.2em",
        color: GOLD_LIGHT,
        textTransform: "uppercase",
        marginTop: -4 * scale,
      }}>Learning Quantum Method</p>
    </div>
  );
}

// ─── Timer Badge ─────────────────────────────────────────────────────────────
function TimerBadge({ timeLeft, formatTime }) {
  const urgent = timeLeft < 180;
  return (
    <div className={urgent ? "timer-urgent" : ""} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: urgent ? "rgba(180,30,30,0.1)" : `rgba(${27},${43},${94},0.08)`,
      border: `1px solid ${urgent ? "rgba(180,30,30,0.35)" : "rgba(184,134,11,0.35)"}`,
      borderRadius: 100, padding: "7px 16px",
      fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
      color: urgent ? "#C0392B" : GOLD,
    }}>
      <span style={{ fontSize: 7 }}>●</span>
      {timeLeft > 0 ? `Special offer expires ${formatTime(timeLeft)}` : "Offer expired"}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: WHITE,
      borderRadius: 20,
      boxShadow: "0 4px 24px rgba(27,43,94,0.10)",
      padding: "32px 28px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────
function LandingPage({ onStart, timeLeft, formatTime }) {
  return (
    <div>
      {/* Hero */}
      <Card style={{ textAlign: "center", marginBottom: 20, background: NAVY_DARK, padding: "44px 28px" }}>
        <div className="fade-up" style={{ marginBottom: 20 }}>
          <LQMLogo size="lg" />
        </div>
        <div className="fade-up-1" style={{ marginBottom: 10 }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 5vw, 40px)", lineHeight: 1.15,
            color: WHITE, display: "block", marginBottom: 6,
          }}>
            Discover What
          </span>
          <span className="shimmer-gold" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 5vw, 40px)", lineHeight: 1.15, display: "block",
          }}>
            Actually Drives You
          </span>
        </div>
        <p className="fade-up-2" style={{
          fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.65)",
          fontWeight: 300, maxWidth: 440, margin: "16px auto 28px",
        }}>
          10 questions. Your unique LQM Motivation Profile. A personalised action plan built around the way <em>you</em> are wired — not generic advice.
        </p>
        <div className="fade-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 28 }}>
          {["3-minute assessment", "4 unique profiles", "Personalised growth plan"].map((f) => (
            <span key={f} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
              <span style={{ color: GOLD_LIGHT }}>◆</span>{f}
            </span>
          ))}
        </div>
        <div className="fade-up-4" style={{ marginBottom: 14 }}>
          <TimerBadge timeLeft={timeLeft} formatTime={formatTime} />
        </div>
        <div className="fade-up-5">
          <button onClick={onStart} style={btnStyle("gold")} onMouseEnter={btnHover} onMouseLeave={btnLeave}>
            Begin My Assessment →
          </button>
          <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>No payment required until you see your results</p>
        </div>
      </Card>

      {/* Pricing card */}
      <Card className="fade-up" style={{ border: `1px solid rgba(184,134,11,0.25)`, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span className="sparkle" style={{ fontSize: 20, color: GOLD }}>✦</span>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>
            Introductory Pricing — Limited Time
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: NAVY_DARK, fontFamily: "'Montserrat', sans-serif" }}>£{DISCOUNTED_PRICE}</span>
          <span style={{ fontSize: 22, color: "rgba(27,43,94,0.3)", textDecoration: "line-through" }}>£{ORIGINAL_PRICE}</span>
          <span style={{ background: "rgba(46,125,82,0.1)", color: "#2E7D52", padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>67% off</span>
        </div>
        <p style={{ fontSize: 14, color: MUTED, fontWeight: 300, lineHeight: 1.6 }}>
          Complete the assessment now to lock in this discounted price. Full personalised report delivered instantly.
        </p>
      </Card>

      {/* What you get */}
      <Card style={{ borderTop: `3px solid ${NAVY}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: NAVY, marginBottom: 18 }}>
          What's in your report
        </p>
        {[
          ["Your LQM Motivation Profile", "Understand your core motivation architecture — how you're wired to learn, grow and perform at your best"],
          ["Strengths & Blind Spots Analysis", "An honest, personalised breakdown of what gives you your edge and what gets in your way"],
          ["3 Personalised Growth Strategies", "Scenario-based action plans written specifically for your profile — not generic advice"],
          ["Motivation Maintenance Plan", "Practical daily and weekly systems to sustain high performance over time"],
        ].map(([title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD, marginTop: 6, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: NAVY_DARK, marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: 13, color: MUTED, fontWeight: 300, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
function QuizPage({ question, index, total, selected, onSelect, onNext, timeLeft, formatTime }) {
  const progress = (index / total) * 100;
  return (
    <div className="slide-in" style={{ animation: "slideIn 0.4s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: "0.08em" }}>QUESTION {index + 1} OF {total}</span>
        <TimerBadge timeLeft={timeLeft} formatTime={formatTime} />
      </div>

      {/* Progress */}
      <div style={{ height: 4, background: "rgba(27,43,94,0.1)", borderRadius: 100, marginBottom: 28, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${NAVY}, ${GOLD_LIGHT})`, borderRadius: 100, transition: "width 0.5s ease" }} />
      </div>

      <Card style={{ marginBottom: 0 }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(18px, 3.5vw, 22px)", fontWeight: 500, lineHeight: 1.5, color: NAVY_DARK, marginBottom: 24 }}>
          {question.text}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {question.options.map((opt, i) => {
            const isSelected = selected === opt.type;
            return (
              <button
                key={i}
                onClick={() => onSelect(opt.type)}
                style={{
                  background: isSelected ? `rgba(27,43,94,0.06)` : "rgba(244,246,250,0.7)",
                  border: `1.5px solid ${isSelected ? NAVY : "rgba(27,43,94,0.12)"}`,
                  borderRadius: 12, padding: "14px 18px",
                  textAlign: "left", cursor: "pointer", transition: "all 0.2s ease",
                  color: isSelected ? NAVY_DARK : "rgba(27,43,94,0.65)",
                  fontSize: 14, fontFamily: "'Montserrat', sans-serif", fontWeight: isSelected ? 500 : 400,
                  lineHeight: 1.5, display: "flex", alignItems: "center", gap: 14,
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(27,43,94,0.3)"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "rgba(27,43,94,0.12)"; }}
              >
                <span style={{
                  width: 26, height: 26, borderRadius: "50%",
                  border: `1.5px solid ${isSelected ? NAVY : "rgba(27,43,94,0.2)"}`,
                  background: isSelected ? NAVY : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 11, color: isSelected ? WHITE : "transparent",
                  fontWeight: 700, transition: "all 0.2s",
                }}>✓</span>
                {opt.text}
              </button>
            );
          })}
        </div>
        <button
          onClick={onNext}
          disabled={!selected}
          style={selected ? btnStyle("navy") : btnStyle("disabled")}
          onMouseEnter={selected ? btnHover : undefined}
          onMouseLeave={selected ? btnLeave : undefined}
        >
          {index < questions.length - 1 ? "Next Question →" : "Reveal My Profile →"}
        </button>
      </Card>
    </div>
  );
}

// ─── Processing ───────────────────────────────────────────────────────────────
function ProcessingPage({ step }) {
  const steps = ["Analysing your response patterns…", "Mapping your motivation architecture…", "Identifying your growth edge…", "Building your personalised report…"];
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 36px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid rgba(27,43,94,0.1)`, borderTop: `3px solid ${NAVY}`, animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 22, color: GOLD }}>✦</div>
      </div>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 500, marginBottom: 8, color: NAVY_DARK }}>
        Constructing Your Profile
      </h2>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 36, fontWeight: 300 }}>Learning Quantum Method analysis in progress</p>
      <Card style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: i < steps.length - 1 ? 16 : 0, opacity: step > i ? 1 : 0.25, transition: "opacity 0.5s ease" }}>
            <span style={{ color: step > i ? "#2E7D52" : "rgba(27,43,94,0.2)", fontSize: 16, flexShrink: 0 }}>{step > i ? "✓" : "○"}</span>
            <span style={{ fontSize: 13, color: NAVY_DARK, fontWeight: step > i ? 500 : 300 }}>{s}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Teaser / Paywall ─────────────────────────────────────────────────────────
function TeaserPage({ type, timeLeft, formatTime, onUnlock }) {
  return (
    <div className="fade-up">
      {/* Profile header */}
      <Card style={{ textAlign: "center", marginBottom: 16, borderTop: `4px solid ${type.color}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: type.color, marginBottom: 14 }}>
          Your LQM Profile
        </p>
        <div style={{ fontSize: 44, marginBottom: 10, color: type.color }}>{type.icon}</div>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(22px, 4vw, 32px)", color: NAVY_DARK, marginBottom: 4 }}>
          {type.name}
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 16, fontStyle: "italic", color: type.lightColor, marginBottom: 16 }}>
          The {type.archetype}
        </p>
        <div style={{ width: 48, height: 2, background: type.gradient, margin: "0 auto 16px", borderRadius: 100 }} />
        <p style={{ fontSize: 15, color: MUTED, fontWeight: 400, lineHeight: 1.7 }}>{type.tagline}</p>
      </Card>

      {/* Blurred strengths */}
      <Card style={{ marginBottom: 16, position: "relative", overflow: "hidden", minHeight: 130 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 14 }}>Your Core Strengths</p>
        <div className="blur-locked" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {type.strengths.map((s) => (
            <span key={s} style={{ background: type.bgColor, border: `1px solid ${type.borderColor}`, borderRadius: 100, padding: "6px 14px", fontSize: 13, color: type.color, fontWeight: 500 }}>{s}</span>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: "linear-gradient(to bottom, transparent, white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>🔒 Unlock to reveal</span>
        </div>
      </Card>

      {/* Blurred strategies */}
      <Card style={{ marginBottom: 20, position: "relative", overflow: "hidden", minHeight: 160 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, marginBottom: 14 }}>Your 3 Personalised Growth Strategies</p>
        <div className="blur-locked">
          {type.strategies.map((s) => (
            <div key={s.area} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: NAVY_DARK, marginBottom: 4 }}>◆ {s.area}</p>
              <p style={{ fontSize: 12, color: MUTED, fontWeight: 300 }}>{s.scenario}</p>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to bottom, transparent, white)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>🔒 3 strategies waiting inside</span>
        </div>
      </Card>

      {/* CTA */}
      <Card style={{ border: `1px solid rgba(184,134,11,0.3)`, background: "linear-gradient(135deg, #FFFBF0, #FFF)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <TimerBadge timeLeft={timeLeft} formatTime={formatTime} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, justifyContent: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: NAVY_DARK }}>£{DISCOUNTED_PRICE}</span>
            <span style={{ fontSize: 22, color: "rgba(27,43,94,0.3)", textDecoration: "line-through" }}>£{ORIGINAL_PRICE}</span>
          </div>
          <p style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}>One-time · Instant access · Full personalised report</p>
        </div>
        <button onClick={onUnlock} style={btnStyle("gold")} onMouseEnter={btnHover} onMouseLeave={btnLeave}>
          Unlock My Full Report →
        </button>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
          {["Instant access", "Personalised to you", "30-day guarantee"].map((f) => (
            <span key={f} style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ color: "#2E7D52" }}>✓</span>{f}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Full Report ──────────────────────────────────────────────────────────────
function FullReportPage({ type }) {
  return (
    <div style={{ animation: "blurIn 0.8s ease both" }}>
      {/* Header */}
      <div style={{ background: NAVY_DARK, borderRadius: 20, padding: "40px 28px", textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-block", background: "rgba(46,125,82,0.2)", border: "1px solid rgba(46,125,82,0.4)", borderRadius: 100, padding: "6px 18px", fontSize: 12, color: "#6FCF8A", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          ✓ Report Unlocked
        </div>
        <div style={{ marginBottom: 4 }}>
          <LQMLogo size="sm" />
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20, marginTop: 8 }}>
          Motivation Profile Report
        </p>
        <div style={{ fontSize: 52, color: type.lightColor, marginBottom: 12 }}>{type.icon}</div>
        <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 5vw, 38px)", color: WHITE, marginBottom: 6 }}>
          {type.name}
        </h1>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 18, fontStyle: "italic", color: type.lightColor, marginBottom: 0 }}>
          The {type.archetype}
        </p>
      </div>

      {/* Tagline */}
      <Card style={{ borderLeft: `4px solid ${type.color}`, borderRadius: "0 16px 16px 0", marginBottom: 20, background: type.bgColor }}>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 18, color: NAVY_DARK, fontStyle: "italic", lineHeight: 1.6, fontWeight: 400 }}>
          "{type.tagline}"
        </p>
      </Card>

      {/* Description */}
      <Card style={{ marginBottom: 20 }}>
        <SectionLabel>Profile Overview</SectionLabel>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(27,43,94,0.75)", fontWeight: 300 }}>
          {type.description}
        </p>
      </Card>

      {/* Strengths */}
      <Card style={{ marginBottom: 20 }}>
        <SectionLabel>Your Core Strengths</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {type.strengths.map((s) => (
            <div key={s} style={{ background: type.bgColor, border: `1px solid ${type.borderColor}`, borderRadius: 100, padding: "8px 18px", fontSize: 13, color: type.color, fontWeight: 600 }}>{s}</div>
          ))}
        </div>
      </Card>

      {/* Blind spots */}
      <Card style={{ marginBottom: 20 }}>
        <SectionLabel>Blind Spots to Navigate</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {type.challenges.map((c) => (
            <div key={c} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", background: "rgba(244,246,250,0.8)", border: "1px solid rgba(27,43,94,0.08)", borderRadius: 10 }}>
              <span style={{ color: "rgba(180,60,60,0.6)", flexShrink: 0, marginTop: 1 }}>△</span>
              <span style={{ fontSize: 14, color: MUTED, fontWeight: 300, lineHeight: 1.6 }}>{c}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Strategies */}
      <div style={{ marginBottom: 32 }}>
        <Card style={{ marginBottom: 12 }}>
          <SectionLabel>Your Personalised Growth & Motivation Plan</SectionLabel>
          <p style={{ fontSize: 13, color: MUTED, fontWeight: 300, lineHeight: 1.6 }}>
            The following strategies have been built specifically for your profile. Each one is grounded in your natural motivation architecture.
          </p>
        </Card>
        {type.strategies.map((s, i) => (
          <Card key={i} style={{ marginBottom: 12, borderTop: `3px solid ${type.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: type.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: WHITE, fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: type.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.area}</p>
            </div>
            {/* Scenario */}
            <div style={{ background: OFF_WHITE, border: `1px solid rgba(27,43,94,0.08)`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Scenario</p>
              <p style={{ fontFamily: "'Lora', serif", fontSize: 15, fontStyle: "italic", color: NAVY_DARK, lineHeight: 1.65 }}>
                "{s.scenario}"
              </p>
            </div>
            {/* Solution */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: NAVY, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Your Strategy</p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(27,43,94,0.75)", fontWeight: 300 }}>{s.solution}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card style={{ background: NAVY_DARK, textAlign: "center" }}>
        <LQMLogo size="sm" />
        <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`, margin: "20px auto" }} />
        <p style={{ fontFamily: "'Lora', serif", fontSize: 17, fontStyle: "italic", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 14 }}>
          "The greatest motivation is not the achievement itself — it is becoming the person capable of it."
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
          LQM Motivation Profile · {type.name}
        </p>
      </Card>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY, whiteSpace: "nowrap" }}>{children}</p>
      <div style={{ flex: 1, height: 1, background: "rgba(27,43,94,0.08)" }} />
    </div>
  );
}

// ─── Button helpers ───────────────────────────────────────────────────────────
function btnStyle(variant) {
  const base = {
    width: "100%", border: "none", borderRadius: 100,
    padding: "16px", fontSize: 15, fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif", cursor: "pointer",
    letterSpacing: "0.05em", transition: "all 0.2s ease",
    display: "block",
  };
  if (variant === "gold") return { ...base, background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_BRIGHT} 100%)`, color: NAVY_DARK, boxShadow: "0 6px 24px rgba(184,134,11,0.3)" };
  if (variant === "navy") return { ...base, background: `linear-gradient(135deg, ${NAVY_DARK} 0%, ${NAVY_MID} 100%)`, color: WHITE, boxShadow: "0 6px 24px rgba(27,43,94,0.25)" };
  return { ...base, background: "rgba(27,43,94,0.06)", color: "rgba(27,43,94,0.3)", cursor: "not-allowed" };
}
const btnHover = (e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.filter = "brightness(1.08)"; };
const btnLeave = (e) => { e.target.style.transform = "translateY(0)"; e.target.style.filter = "none"; };
