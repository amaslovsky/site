import type { ExperienceItem } from "@/content/profile";

export function Timeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <ol className="relative space-y-2">
      <span
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400/60 via-white/10 to-transparent"
      />
      {items.map((it, idx) => (
        <li key={`${it.company}-${idx}`} className="relative pl-9">
          <span className="absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border border-white/20 bg-[#06070b]">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
          </span>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <span className="text-sm font-semibold text-white">{it.title}</span>
                <span className="text-sm text-slate-400"> · {it.company}</span>
              </div>
              <span className="font-mono text-xs tracking-wide text-slate-500">
                {it.start} — {it.end}
              </span>
            </div>
            {it.location ? <div className="mt-0.5 text-xs text-slate-500">{it.location}</div> : null}
            {it.highlights?.length ? (
              <ul className="mt-3 space-y-1.5">
                {it.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm leading-6 text-slate-300">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-slate-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
