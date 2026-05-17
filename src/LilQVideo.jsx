import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════
// LilQVideo — Reusable talking avatar component (v3.1)
// ═══════════════════════════════════════════════════════════════════════
//
// FIX: v3 tried to load guide videos that don't exist yet and failed
// silently. v3.1 detects the load error and falls back to share videos.
//
// FILES IN /public/:
//   /lilq-avatar.jpg              — static idle image (15KB)
//
//   Guide videos (post-purchase, add when recorded):
//   /lilq-guide-architect.mp4     — Systems Architect guide
//   /lilq-guide-learner.mp4       — Deep Learner guide
//   /lilq-guide-catalyst.mp4      — Relational Catalyst guide
//   /lilq-guide-pioneer.mp4       — Visionary Pioneer guide
//
//   Share videos (marketing, already uploaded):
//   /lilq-share-architect.mp4     — Systems Architect
//   /lilq-share-learner.mp4       — Deep Learner
//   /lilq-share-catalyst.mp4      — Relational Catalyst
//   /lilq-share-pioneer.mp4       — Visionary Pioneer
//   /lilq-share-generic.mp4       — generic fallback
//
// ═══════════════════════════════════════════════════════════════════════

const GUIDE_VIDEOS = {
  A: "/lilq-guide-architect.mp4",
  B: "/lilq-guide-learner.mp4",
  C: "/lilq-guide-catalyst.mp4",
  D: "/lilq-guide-pioneer.mp4",
};

const SHARE_VIDEOS = {
  A: "/lilq-share-architect.mp4",
  B: "/lilq-share-learner.mp4",
  C: "/lilq-share-catalyst.mp4",
  D: "/lilq-share-pioneer.mp4",
};

const SIZES = {
  sm: { bubble: 64,  border: 2, icon: 14, labelSize: 11 },
  md: { bubble: 100, border: 3, icon: 18, labelSize: 12 },
  lg: { bubble: 140, border: 3, icon: 22, labelSize: 13 },
  xl: { bubble: 180, border: 4, icon: 26, labelSize: 14 },
};

export default function LilQVideo({
  size = "md",
  archetype = null,
  context = "guide",
  videoSrc = null,
  autoPlay = false,
  position = "inline",
  label = "",
  onFinish = null,
  style = {},
}) {
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const talkRef = useRef(null);
  const s = SIZES[size] || SIZES.md;

  // Build ordered list of video URLs to try
  // First choice: custom override or context-specific
  // Fallback: share video for this archetype
  // Last resort: generic
  useEffect(() => {
    if (videoSrc) {
      setCurrentSrc(videoSrc);
    } else if (archetype) {
      const primary = context === "share"
        ? SHARE_VIDEOS[archetype]
        : GUIDE_VIDEOS[archetype];
      setCurrentSrc(primary || SHARE_VIDEOS[archetype] || "/lilq-share-generic.mp4");
    } else {
      setCurrentSrc("/lilq-share-generic.mp4");
    }
  }, [archetype, context, videoSrc]);

  // If video fails to load (file doesn't exist), fall back to share video
  function handleVideoError() {
    if (!currentSrc) return;
    const shareFallback = archetype ? SHARE_VIDEOS[archetype] : "/lilq-share-generic.mp4";
    const genericFallback = "/lilq-share-generic.mp4";

    if (currentSrc !== shareFallback && shareFallback) {
      setCurrentSrc(shareFallback);
    } else if (currentSrc !== genericFallback) {
      setCurrentSrc(genericFallback);
    }
    // If even generic fails, video just won't play — no crash
  }

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
    if (talkRef.current) {
      talkRef.current.currentTime = 0;
      talkRef.current.play().catch(() => {});
    }
  }

  function handleTalkEnd() {
    setPlaying(false);
    if (onFinish) onFinish();
  }

  function handleTap() {
    if (playing) {
      if (talkRef.current) { talkRef.current.pause(); }
      setPlaying(false);
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
        {/* Idle — static image, mouth closed */}
        {!playing && (
          <img
            src="/lilq-avatar.jpg"
            alt="Lil'Q"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* Talking video */}
        {currentSrc && (
          <video
            ref={talkRef}
            src={currentSrc}
            poster="/lilq-avatar.jpg"
            playsInline
            onEnded={handleTalkEnd}
            onError={handleVideoError}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              display: playing ? "block" : "none",
            }}
          />
        )}

        {/* Play/Speaker indicator */}
        {!playing && (
          <div style={{
            position: "absolute",
            bottom: Math.max(4, s.bubble * 0.03), right: Math.max(4, s.bubble * 0.03),
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
            bottom: Math.max(4, s.bubble * 0.03), right: Math.max(4, s.bubble * 0.03),
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
