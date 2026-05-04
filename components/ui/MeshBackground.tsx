"use client";

export default function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base */}
      <div className="absolute inset-0 dark:bg-[#050505] bg-[#f0f4ff]" />

      {/* Orb 1 — cyan */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full
        dark:bg-cyan-500/8 bg-cyan-400/20
        blur-[120px] animate-float" />

      {/* Orb 2 — purple */}
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full
        dark:bg-purple-500/8 bg-purple-400/20
        blur-[120px] animate-float"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Orb 3 — center glow, dark only */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[700px] h-[700px] rounded-full
        dark:bg-cyan-500/4 bg-transparent
        blur-[140px] animate-glow-pulse hidden dark:block" />

      {/* Grid lines — dark only */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Light mode subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
