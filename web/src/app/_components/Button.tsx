import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "text-slate-950 bg-gradient-to-r from-indigo-300 via-white to-cyan-200 hover:from-indigo-200 hover:to-cyan-100 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.7)]",
  secondary: "text-white border border-white/15 bg-white/[0.04] hover:bg-white/[0.08]",
  ghost: "text-slate-300 hover:text-white hover:bg-white/[0.06]",
};

export function Button({
  href,
  variant = "secondary",
  className,
  children,
  target,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  target?: "_blank" | "_self";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60";
  return (
    <Link
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </Link>
  );
}
