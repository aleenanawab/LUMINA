import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "none";
}

export default function GlassCard({
  children,
  className,
  glow = "none",
}: GlassCardProps) {
  const glowClasses = {
    cyan: "hover:border-cyan-500/40 hover:glow-cyan",
    purple: "hover:border-purple-500/40 hover:glow-purple",
    none: "",
  };

  return (
    <div
      className={cn(
        "rounded-2xl glass dark:bg-obsidian-card border border-white/5 transition-all duration-300",
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}