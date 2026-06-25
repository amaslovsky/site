import { cn } from "@/lib/cn";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs font-medium tracking-wide text-slate-200/90",
        className,
      )}
    >
      {children}
    </span>
  );
}
