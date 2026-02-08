import { cn } from "@/lib/utils";

interface CardWrapperProps {
  children?: React.ReactNode;
  glowPosition?: "top-right" | "top-left" | "bottom-left" | "bottom-right";
  className?: string;
}

const BORDER_GRADIENTS = {
  "top-right":
    "bg-gradient-to-bl from-[#B0D4FF] via-[#2A8DFF] via-15% to-[#050505] to-60%",
  "top-left":
    "bg-gradient-to-br from-[#B0D4FF] via-[#2A8DFF] via-15% to-[#050505] to-60%",
  "bottom-left":
    "bg-gradient-to-tr from-[#B0D4FF] via-[#2A8DFF] via-15% to-[#050505] to-60%",
  "bottom-right":
    "bg-gradient-to-tl from-[#B0D4FF] via-[#2A8DFF] via-15% to-[#050505] to-60%",
} as const;

const BLOOM_POSITIONS = {
  "top-right":
    "top-0 right-0 bg-[radial-gradient(circle_at_100%_0%,rgba(42,141,255,0.25)_0%,transparent_50%)]",
  "top-left":
    "top-0 left-0 bg-[radial-gradient(circle_at_0%_0%,rgba(42,141,255,0.25)_0%,transparent_50%)]",
  "bottom-left":
    "bottom-0 left-0 bg-[radial-gradient(circle_at_0%_100%,rgba(42,141,255,0.25)_0%,transparent_50%)]",
  "bottom-right":
    "bottom-0 right-0 bg-[radial-gradient(circle_at_100%_100%,rgba(42,141,255,0.25)_0%,transparent_50%)]",
} as const;

export function CardWrapper({
  children,
  glowPosition = "top-right",
  className,
}: CardWrapperProps) {
  return (
    <div
      className={cn(
        "p-[1px] rounded-[32px] relative group h-full transition-all duration-500",
        BORDER_GRADIENTS[glowPosition],
        className,
      )}
    >
      <div className="bg-[#0c0c0c] rounded-[31px] h-full w-full overflow-hidden relative">
        <div
          className={cn(
            "absolute size-[300px] pointer-events-none opacity-80 mix-blend-screen transition-opacity duration-500",
            BLOOM_POSITIONS[glowPosition],
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}
