import { ArrowUpRight, Mail } from "lucide-react";

import { profile } from "@/content/profile";
import { Badge } from "./Badge";
import { Button } from "./Button";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24 md:pb-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to QA / Automation roles
          </div>

          <h1
            className="animate-rise mt-6 text-balance text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            <span className="text-white">Oleksii</span>
            <br />
            <span className="text-gradient">Maslovskyi</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-pretty text-base leading-7 text-slate-300 md:text-lg md:leading-8"
            style={{ animationDelay: "120ms" }}
          >
            <span className="font-semibold text-white">{profile.headline}.</span> Manual QA depth with a Java
            automation edge — UI &amp; API (REST) testing that turns releases into a confident, repeatable habit.
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
            <Button href={`mailto:${profile.email}`} variant="primary">
              <Mail size={16} />
              Contact me
            </Button>
            <Button href={profile.linkedinUrl} target="_blank" variant="secondary">
              LinkedIn
              <ArrowUpRight size={16} className="text-cyan-300" />
            </Button>
            <Button href="#portfolio" variant="ghost">
              View portfolio
            </Button>
          </div>

          <div className="animate-rise mt-8 flex flex-wrap gap-2" style={{ animationDelay: "240ms" }}>
            {profile.topSkills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </div>

        <div className="animate-rise glass rounded-3xl p-6 md:p-7" style={{ animationDelay: "160ms" }}>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300/90">Core focus</div>
          <div className="mt-5 space-y-3">
            {[
              { t: "UI Automation", d: "Selenium / Selenide · stable locators · pragmatic waits" },
              { t: "API Automation", d: "REST · RestAssured · contract-minded checks" },
              { t: "Reporting & Data", d: "Allure · DB validation · Excel-driven data" },
            ].map((row) => (
              <div
                key={row.t}
                className="rounded-2xl border border-white/[0.08] bg-black/30 px-4 py-3.5 transition-colors hover:border-white/15"
              >
                <div className="text-sm font-semibold text-white">{row.t}</div>
                <div className="mt-1 text-sm text-slate-400">{row.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
            {profile.metrics.map((m) => (
              <div key={m.label}>
                <div className="bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-base font-bold text-transparent">
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
