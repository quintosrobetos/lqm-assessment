import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// LilQVideo — Reusable talking avatar component
// ═══════════════════════════════════════════════════════════════════════
//
// USAGE:
//   <LilQVideo size="md" />                              — idle, generic on tap
//   <LilQVideo size="md" archetype="A" />                — Systems Architect video
//   <LilQVideo size="lg" autoPlay />                     — auto-plays on mount
//   <LilQVideo size="sm" position="floating" />          — fixed bottom-right
//   <LilQVideo size="md" label="Tap me!" />              — with text label
//   <LilQVideo size="md" videoSrc="/my-custom.mp4" />    — custom video override
//
// FILES REQUIRED IN /public/:
//   /lilq-idle.mp4              — 2.5s silent loop (84KB)
//   /lilq-poster.jpg            — still frame (42KB)
//   /lilq-share-generic.mp4     — generic share prompt (742KB)
//   /lilq-share-architect.mp4   — Systems Architect (745KB)
//   /lilq-share-learner.mp4     — Deep Learner (487KB)
//   /lilq-share-catalyst.mp4    — Relational Catalyst (480KB)
//   /lilq-share-pioneer.mp4     — Visionary Pioneer (714KB)
//
// ═══════════════════════════════════════════════════════════════════════

const ARCHETYPE_VIDEOS = {
  A: "/lilq-share-architect.mp4",
  B: "/lilq-share-learner.mp4",
  C: "/lilq-share-catalyst.mp4",
  D: "/lilq-share-pioneer.mp4",
};

const SIZES = {
  sm: { bubble: 64,  border: 2, icon: 14, labelSize: 11 },
  md: { bubble: 100, border: 3, icon: 18, labelSize: 12 },
  lg: { bubble: 140, border: 3, icon: 22, labelSize: 13 },
};

export default function LilQVideo({
  size = "md",            // "sm" | "md" | "lg"
  archetype = null,       // "A" | "B" | "C" | "D" — picks archetype-specific video
  videoSrc = null,        // custom video URL (overrides archetype)
  autoPlay = false,       // auto-play talking video on mount
  position = "inline",    // "inline" | "floating"
  label = "",             // optional text label below bubble
  onFinish = null,        // callback when talking video ends
  style = {},             // additional wrapper styles
}) {
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const talkRef = useRef(null);
  const idleRef = useRef(null);
  const s = SIZES[size] || SIZES.md;

  // Resolve which talking video to use
  const talkingSrc = videoSrc
    || (archetype && ARCHETYPE_VIDEOS[archetype])
    || "/lilq-share-generic.mp4";

  // Auto-play on mount if requested
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => startTalking(), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  function startTalking() {
    if (playing) return;
    setPlaying(true);
    setHasPlayed(true);
    if (idleRef.current) { idleRef.current.pause(); }
    if (talkRef.current) {
      talkRef.current.currentTime = 0;
      talkRef.current.play().catch(() => {});
    }
  }

  function handleTalkEnd() {
    setPlaying(false);
    if (idleRef.current) { idleRef.current.play().catch(() => {}); }
    if (onFinish) onFinish();
  }

  function handleTap() {
    if (playing) {
      if (talkRef.current) { talkRef.current.pause(); }
      setPlaying(false);
      if (idleRef.current) { idleRef.current.play().catch(() => {}); }
    } else {
      startTalking();
    }
  }

  const floatingStyle = position === "floating" ? {
    position: "fixed",
    bottom: 90,
    right: 16,
    zIndex: 500,
    filter: "drop-shadow(0 4px 20px rgba(0,200,255,0.25))",
  } : {};

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 6,
      ...floatingStyle,
      ...style,
    }}>
      {/* Circular video bubble */}
      <div
        onClick={handleTap}
        style={{
          width: s.bubble, height: s.bubble,
          borderRadius: "50%",
          overflow: "hidden",
          border: `${s.border}px solid ${playing ? "rgba(0,200,255,0.7)" : "rgba(0,200,255,0.3)"}`,
          boxShadow: playing
            ? "0 0 20px rgba(0,200,255,0.35), 0 0 40px rgba(0,200,255,0.1)"
            : "0 0 12px rgba(0,200,255,0.15)",
          cursor: "pointer",
          position: "relative",
          transition: "border-color 0.3s, box-shadow 0.3s",
          animation: !hasPlayed ? "lilqPulse 2.5s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      >
        {/* Idle loop — silent, loops forever */}
        <video
          ref={idleRef}
          src="/lilq-idle.mp4"
          poster="/lilq-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            display: playing ? "none" : "block",
          }}
        />

        {/* Talking video — with audio, archetype-specific */}
        <video
          ref={talkRef}
          src={talkingSrc}
          poster="/lilq-poster.jpg"
          playsInline
          onEnded={handleTalkEnd}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            display: playing ? "block" : "none",
          }}
        />

        {/* Play/Speaker indicator */}
        {!playing && (
          <div style={{
            position: "absolute",
            bottom: 4, right: 4,
            width: s.icon + 6, height: s.icon + 6,
            borderRadius: "50%",
            background: "rgba(0,200,255,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: s.icon - 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            {hasPlayed ? "🔊" : "▶"}
          </div>
        )}

        {/* Speaking indicator */}
        {playing && (
          <div style={{
            position: "absolute",
            bottom: 4, right: 4,
            width: s.icon + 6, height: s.icon + 6,
            borderRadius: "50%",
            background: "rgba(0,200,255,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: s.icon - 4,
          }}>
            <span style={{ animation: "lilqSpeaking 0.8s ease-in-out infinite" }}>🔊</span>
          </div>
        )}
      </div>

      {/* Optional label */}
      {label && (
        <p style={{
          fontSize: s.labelSize,
          color: playing ? "rgba(0,200,255,0.9)" : "rgba(255,255,255,0.5)",
          fontFamily: "'Space Grotesk',sans-serif",
          fontWeight: 600, letterSpacing: ".04em",
          textAlign: "center",
          transition: "color 0.3s",
          maxWidth: s.bubble + 20,
        }}>{label}</p>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes lilqPulse {
          0%, 100% { border-color: rgba(0,200,255,0.3); box-shadow: 0 0 12px rgba(0,200,255,0.15); }
          50% { border-color: rgba(0,200,255,0.6); box-shadow: 0 0 24px rgba(0,200,255,0.3), 0 0 48px rgba(0,200,255,0.08); }
        }
        @keyframes lilqSpeaking {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
