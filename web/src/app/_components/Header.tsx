"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const links = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#expertise", label: "Expertise" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-white/10 bg-[#06070b]/80 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="group inline-flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-400 to-cyan-300 text-xs font-bold text-slate-950">
              OM
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">Oleksii Maslovskyi</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.09]"
          >
            Get in touch
            <ArrowUpRight size={15} className="text-cyan-300" />
          </a>
        </div>
      </div>
    </header>
  );
}
