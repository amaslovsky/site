import { cn } from "@/lib/cn";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="flex items-center gap-3">
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
            {eyebrow}
          </span>
        ) : null}
      </div>
      <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      {intro ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}
