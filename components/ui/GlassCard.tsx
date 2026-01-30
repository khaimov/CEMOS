import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6",
        hoverEffect && "transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
