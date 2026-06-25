import { ArrowUpRight, CheckCircle2, Mail, Sparkles } from "lucide-react";

import { profile } from "@/content/profile";
import { Badge } from "./_components/Badge";
import { Button } from "./_components/Button";
import { ChatWidget } from "./_components/ChatWidget";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Section } from "./_components/Section";
import { Timeline } from "./_components/Timeline";

export default function Home() {
  return (
    <div id="top" className="page-bg min-h-full">
      <Header />

      <main>
        <Hero />

        <div className="mx-auto max-w-6xl space-y-24 px-5 pb-24 md:space-y-32 md:px-8 md:pb-32">
          {/* ABOUT */}
          <Section
            id="about"
            eyebrow="About"
            title="Quality-driven, automation-capable, product-minded."
            intro="I care about clean signal: catching what matters early, automating what repeats, and giving teams the confidence to ship."
          >
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="glass rounded-3xl p-6 md:p-7">
                <div className="space-y-4 text-sm leading-7 text-slate-300 md:text-base md:leading-8">
                  {profile.summary.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.certifications.map((c) => (
                    <Badge key={c} className="border-indigo-400/30 bg-indigo-400/10 text-indigo-200">
                      <Sparkles size={12} className="mr-1.5" />
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-6 md:p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">
                  What sets me apart
                </div>
                <ul className="mt-5 space-y-3">
                  {profile.differentiators.map((d) => (
                    <li key={d} className="flex gap-3 text-sm leading-6 text-slate-300">
                      <CheckCircle2 size={18} className="mt-0.5 flex-none text-cyan-300" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* CAREER JOURNEY */}
          <Section
            id="journey"
            eyebrow="Career Journey"
            title="A decade of testing across real products."
            intro="From functional and localization testing to modern Java-based UI and API automation."
          >
            <div className="glass rounded-3xl p-6 md:p-8">
              <Timeline items={profile.experience} />
            </div>
          </Section>

          {/* EXPERTISE: value + process + skills */}
          <Section
            id="expertise"
            eyebrow="Expertise"
            title="How I create value for teams."
            intro="A pragmatic blend of strategy, automation, and reporting that keeps releases reliable."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {profile.valuePillars.map((p, i) => (
                <div key={p.title} className="glass rounded-3xl p-6">
                  <div className="bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text font-mono text-sm font-bold text-transparent">
                    0{i + 1}
                  </div>
                  <div className="mt-3 text-base font-semibold text-white">{p.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{p.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="glass rounded-3xl p-6 md:p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300/90">
                  How I build confidence
                </div>
                <ul className="mt-5 space-y-3">
                  {profile.processHighlights.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-6 text-slate-300">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass rounded-3xl p-6 md:p-7">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Tools &amp; tech</div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.toolsAndTech.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>

                <div className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">Education</div>
                <ul className="mt-4 space-y-3">
                  {profile.education.map((e) => (
                    <li key={`${e.school}-${e.program ?? ""}`} className="text-sm">
                      <div className="text-slate-200">{e.school}</div>
                      <div className="text-slate-500">
                        {e.program}
                        {e.years ? <span className="text-slate-600"> · {e.years}</span> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* PORTFOLIO */}
          <Section
            id="portfolio"
            eyebrow="Portfolio"
            title="Selected work — coming soon."
            intro="This space is reserved for case studies: automation frameworks, reporting dashboards, and measurable quality wins."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { t: "Automation Framework", d: "Java · Selenide · JUnit · RestAssured" },
                { t: "Reporting Dashboard", d: "Allure-driven visibility & triage" },
                { t: "Quality Case Study", d: "Problem → approach → results" },
              ].map((c) => (
                <div
                  key={c.t}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/15"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 blur-2xl transition-opacity group-hover:opacity-100" />
                  <div className="text-base font-semibold text-white">{c.t}</div>
                  <p className="mt-2 text-sm text-slate-400">{c.d}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    Coming soon
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* CONTACT */}
          <Section id="contact" eyebrow="Contact" title="Let’s talk quality &amp; automation.">
            <div className="glass relative overflow-hidden rounded-3xl p-8 md:p-12">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
              <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <div className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                    Ready when you are.
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-7 text-slate-400 md:text-base">
                    The fastest way to reach me is email — happy to share more detail on experience, tooling, or
                    availability.
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-4 inline-block font-mono text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    {profile.email}
                  </a>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href={`mailto:${profile.email}`} variant="primary">
                    <Mail size={16} />
                    Email me
                  </Button>
                  <Button href={profile.linkedinUrl} target="_blank" variant="secondary">
                    LinkedIn
                    <ArrowUpRight size={16} className="text-cyan-300" />
                  </Button>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-slate-500 sm:flex-row md:px-8">
            <div>© 2026 {profile.name} · {profile.location}</div>
            <a href="#top" className="text-slate-400 transition-colors hover:text-white">
              Back to top ↑
            </a>
          </div>
        </footer>
      </main>

      <ChatWidget />
    </div>
  );
}
