# Building a Portfolio Site with an AI "Digital Twin" — A Beginner's Tutorial

This document explains, from the ground up, the website we built for Oleksii Maslovskyi: a
professional portfolio with a built‑in AI chat assistant that answers questions about his career.

It is written for someone who is **brand new to front‑end development**. We start with the big
ideas, walk through how the pieces fit together, then review the actual code file by file. At the
end you'll find five honest suggestions for how the code could be improved.

---

## Table of contents

1. [What we built](#1-what-we-built)
2. [The technology, in plain English](#2-the-technology-in-plain-english)
3. [Project structure](#3-project-structure)
4. [High‑level walkthrough](#4-high-level-walkthrough)
5. [Detailed code review](#5-detailed-code-review)
6. [How the AI chat works end‑to‑end](#6-how-the-ai-chat-works-end-to-end)
7. [Five suggested improvements (self‑review)](#7-five-suggested-improvements-self-review)
8. [How to run it](#8-how-to-run-it)

---

## 1. What we built

A single‑page website with:

- A **hero** (the big intro at the top) with the name, headline, and call‑to‑action buttons.
- **About**, **Career Journey**, **Expertise**, **Portfolio**, and **Contact** sections.
- A dark, "enterprise‑meets‑edgy" visual style.
- A floating **AI Digital Twin** chat widget. Visitors type a question ("What's your automation
  experience?") and an AI answers in the first person, using only the real facts from the profile.

The AI part is the interesting bit: the browser never talks to the AI provider directly. Instead it
talks to **our own server**, and our server talks to the AI. This keeps the secret API key hidden.

---

## 2. The technology, in plain English

### HTML, CSS, and JavaScript — the foundation

Every website is built on three languages:

- **HTML** is the *structure* (headings, paragraphs, buttons).
- **CSS** is the *style* (colors, spacing, fonts).
- **JavaScript** is the *behavior* (what happens when you click, type, or scroll).

Everything below is ultimately just a more powerful way of producing these three things.

### React — building UIs from "components"

[React](https://react.dev) lets you build a UI out of reusable building blocks called
**components**. A component is a JavaScript function that returns a description of some UI. For
example, a `Button` component can be reused everywhere instead of copy‑pasting the same HTML.

React uses a syntax called **JSX**, which looks like HTML living inside JavaScript:

```jsx
function Hello() {
  return <h1>Hello world</h1>;
}
```

Two core React ideas you'll see often:

- **Props**: inputs you pass *into* a component (like function arguments).
- **State**: data a component *remembers* and can change over time (e.g. the text in a chat box).

### Next.js — the framework around React

[Next.js](https://nextjs.org) is a framework built on top of React. It adds the things real
websites need: routing (which URL shows which page), a build system, image optimization, and —
crucially for us — the ability to run **server code** (like our secure AI proxy) right alongside the
front‑end. We used the modern **App Router**, where the folder structure inside `src/app/` *is* the
routing.

A key concept: **Server Components vs. Client Components**.

- By default, components render **on the server**. They're fast and can't use interactivity like
  clicks or typing.
- Adding `"use client";` at the top of a file marks it as a **Client Component**, which runs in the
  browser and *can* use state, effects, and event handlers.

### TypeScript — JavaScript with a safety net

[TypeScript](https://www.typescriptlang.org) is JavaScript plus **types**. Types describe the
"shape" of data. If you say a value is a `string` and then treat it like a number, TypeScript warns
you *before* you ever run the code. This catches a huge class of bugs early.

```ts
type Person = { name: string; age: number };
const p: Person = { name: "Ada", age: 36 }; // OK
// const bad: Person = { name: "Ada" };     // Error: 'age' is missing
```

### Tailwind CSS — styling with utility classes

[Tailwind](https://tailwindcss.com) lets you style elements by adding small, single‑purpose classes
directly in your markup, instead of writing separate CSS files. For example:

```jsx
<div className="rounded-2xl bg-white/5 p-6 text-slate-200">…</div>
```

- `rounded-2xl` = rounded corners
- `bg-white/5` = white background at 5% opacity
- `p-6` = padding
- `text-slate-200` = light gray text

It feels verbose at first, but it's fast and keeps styles next to the thing they style.

### OpenRouter — one doorway to many AI models

[OpenRouter](https://openrouter.ai) is a service that gives you a single API to talk to many
different AI models. We use the free model `openai/gpt-oss-120b:free`. Our server sends the
conversation to OpenRouter and gets the AI's reply back as a **stream** (word‑by‑word), so the chat
feels alive.

---

## 3. Project structure

The app lives in the `web/` folder. The files we created or changed:

```
web/
├─ .env.local                      # Secret API key (never committed to git)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # Wraps every page (fonts, <html>, <body>)
│  │  ├─ page.tsx                  # The home page, assembles all sections
│  │  ├─ globals.css               # Design system: colors, background, effects
│  │  ├─ api/
│  │  │  └─ chat/route.ts          # SERVER endpoint that talks to OpenRouter
│  │  └─ _components/
│  │     ├─ Header.tsx             # Sticky top navigation bar
│  │     ├─ Hero.tsx               # Big intro section
│  │     ├─ Section.tsx            # Reusable titled section wrapper
│  │     ├─ Timeline.tsx           # Career history list
│  │     ├─ Badge.tsx              # Small "pill" label
│  │     ├─ Button.tsx             # Reusable link‑button
│  │     └─ ChatWidget.tsx         # The floating AI chat UI (client component)
│  ├─ content/
│  │  └─ profile.ts                # All of the CV data in one place
│  └─ lib/
│     ├─ cn.ts                     # Small helper to combine CSS classes
│     └─ twin.ts                   # Builds the AI's "personality" instructions
```

A useful mental model:

- **`content/`** = *data* (the facts).
- **`_components/`** = *UI* (how it looks).
- **`app/api/`** = *server logic* (the secure AI bridge).
- **`lib/`** = *small reusable helpers*.

> The `_components` folder name starts with an underscore. In the App Router that tells Next.js
> "this is just a folder of helpers, not a route" — so it never becomes a page URL.

---

## 4. High‑level walkthrough

### When someone visits the site

1. The browser requests the page.
2. Next.js renders `layout.tsx` (the shell) and `page.tsx` (the content) **on the server** and sends
   back finished HTML. This is fast and good for search engines.
3. `page.tsx` pulls the facts from `content/profile.ts` and arranges components (`Hero`, `Section`,
   `Timeline`, …) into the final layout.
4. The only interactive parts — the `Header` (scroll effect) and the `ChatWidget` — are marked
   `"use client"`, so the browser "hydrates" them and they become interactive.

### When someone uses the chat

1. The visitor types a question in `ChatWidget` and hits send.
2. The widget sends the whole conversation to **our own** `/api/chat` endpoint.
3. `/api/chat` (running on the server) attaches the secret key and a system prompt, then forwards the
   request to OpenRouter.
4. OpenRouter streams the answer back token‑by‑token; our server relays it to the browser; the widget
   appends each chunk to the screen in real time.

The secret key only ever exists on the server — the browser never sees it.

---

## 5. Detailed code review

### 5.1 The data layer — `content/profile.ts`

We keep every fact in one file. This is the single source of truth used by both the visual sections
and the AI. Storing data separately from UI is a foundational good habit.

```ts
export const profile = {
  name: "Oleksii Maslovskyi",
  headline: "MQA / AQA Engineer",
  location: "Kyiv Metropolitan Area",
  email: "a.maslovsky@gmail.com",
  // …summary, topSkills, toolsAndTech, experience, education, etc.
} as const;
```

`as const` tells TypeScript to treat these values as fixed, exact values (not just "some string").
We also define **types** so the rest of the app knows the shape of an experience entry:

```ts
export type ExperienceItem = {
  company: string;
  title: string;
  start: string;
  end: string;
  location?: string;     // the "?" means optional
  highlights?: string[]; // an array of strings
};
```

### 5.2 The root shell — `app/layout.tsx`

`layout.tsx` wraps **every** page. It sets up the fonts, the page `<title>` and description (good for
SEO and browser tabs), and the `<html>`/`<body>` tags.

```tsx
export const metadata: Metadata = {
  title: "Oleksii Maslovskyi — QA / AQA Engineer",
  description: "QA & Java automation engineer. UI and API (REST) testing…",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

`children` is a special prop meaning "whatever page is being shown goes here."

### 5.3 The design system — `app/globals.css`

Rather than relying on the visitor's operating system theme (which earlier caused white text on a
white background), we **force** a dark theme and define reusable styles.

```css
body {
  background-color: #06070b;
  color: #e8eaf0;
}

/* A reusable "frosted glass" card look */
.glass {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(10px);
}

/* Gentle entrance animation */
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-rise { animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both; }
```

A nice detail: we respect users who prefer less motion:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-rise { animation: none; }
}
```

### 5.4 A tiny but important helper — `lib/cn.ts`

When you build class names conditionally, you can end up with duplicates or conflicts. The `cn`
helper merges them intelligently (later Tailwind classes win over earlier conflicting ones).

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This lets components accept an optional `className` and combine it safely with their defaults.

### 5.5 Reusable UI — `Badge`, `Button`, `Section`

These are small **presentational components**. They take props and return styled markup. Here's
`Button`, which renders a Next.js `Link` styled three different ways:

```tsx
type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "text-slate-950 bg-gradient-to-r from-indigo-300 via-white to-cyan-200 …",
  secondary: "text-white border border-white/15 bg-white/[0.04] hover:bg-white/[0.08]",
  ghost: "text-slate-300 hover:text-white hover:bg-white/[0.06]",
};

export function Button({ href, variant = "secondary", className, children, target }: {
  href: string; variant?: Variant; className?: string; children: React.ReactNode;
  target?: "_blank" | "_self";
}) {
  return (
    <Link href={href} target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn("inline-flex items-center …", variants[variant], className)}>
      {children}
    </Link>
  );
}
```

Notice `variant = "secondary"` — a **default value**, so callers can omit it. And `rel="noopener
noreferrer"` is a security best‑practice when opening links in a new tab.

`Section` standardizes the heading style for each part of the page, so they all look consistent:

```tsx
export function Section({ id, eyebrow, title, intro, children }: { /* …props… */ }) {
  return (
    <section id={id} className="scroll-mt-24">
      {eyebrow ? <span className="…uppercase tracking-[0.28em] text-indigo-300/90">{eyebrow}</span> : null}
      <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
      {intro ? <p className="mt-3 max-w-2xl text-slate-400">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}
```

The pattern `condition ? <X/> : null` means "only show this if the prop was provided."

### 5.6 Rendering lists — `Timeline.tsx`

To turn the array of jobs into UI, we use JavaScript's `.map()` to transform each item into markup:

```tsx
{items.map((it, idx) => (
  <li key={`${it.company}-${idx}`} className="relative pl-9">
    <span className="text-sm font-semibold text-white">{it.title}</span>
    <span className="text-sm text-slate-400"> · {it.company}</span>
    {it.highlights?.length ? (
      <ul>
        {it.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>
    ) : null}
  </li>
))}
```

The `key` prop is important: React uses it to track list items efficiently. The `?.` ("optional
chaining") safely handles the case where `highlights` doesn't exist.

### 5.7 A pinch of interactivity — `Header.tsx`

The header is a Client Component because it reacts to scrolling. It uses two React hooks:

- `useState` to remember whether the page is scrolled.
- `useEffect` to subscribe to the browser's scroll event when the component appears, and clean up
  when it leaves.

```tsx
"use client";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll); // cleanup
  }, []);
  // …when `scrolled` is true we add a blurred dark background to the bar
}
```

The empty array `[]` means "run this effect once when the component mounts."

### 5.8 Assembling the page — `app/page.tsx`

This is a Server Component. It imports the data and the components and lays everything out. Because
it's just composing other pieces, it reads almost like an outline of the page:

```tsx
export default function Home() {
  return (
    <div id="top" className="page-bg min-h-full">
      <Header />
      <main>
        <Hero />
        <div className="mx-auto max-w-6xl space-y-24 px-5 …">
          <Section id="about" eyebrow="About" title="…">…</Section>
          <Section id="journey" eyebrow="Career Journey" title="…">
            <Timeline items={profile.experience} />
          </Section>
          {/* Expertise, Portfolio, Contact … */}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
```

### 5.9 The AI's personality — `lib/twin.ts`

Before we ask the AI anything, we give it a **system prompt**: instructions describing who it is and
what rules to follow. We build that text from the same `profile` data, so the AI can only speak to
real facts.

```ts
export function buildSystemPrompt(): string {
  const experience = profile.experience
    .map((e) => `- ${e.title} at ${e.company} (${e.start} – ${e.end}).`)
    .join("\n");

  return [
    `You are the "digital twin" of ${profile.name}, a ${profile.headline}…`,
    "## Rules",
    "- Only answer using the information above…",
    "- Never invent employers, dates, certifications, or technologies…",
    `## Experience\n${experience}`,
  ].join("\n");
}
```

This is **prompt engineering**: most of the AI's quality and safety comes from clear instructions
like "never invent facts" and "keep answers short."

### 5.10 The secure server bridge — `app/api/chat/route.ts`

This is the heart of the AI feature, and the most important file to understand. It is a **server**
file: it runs on the machine hosting the site, never in the visitor's browser. That's why it can
safely read the secret key.

**Step 1 — read the secret key and validate input:**

```ts
export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;        // secret, server‑only
  if (!apiKey) {
    return Response.json({ error: "Server is missing OPENROUTER_API_KEY." }, { status: 500 });
  }

  const body = await req.json();
  const messages = Array.isArray(body?.messages) ? body.messages : [];
```

`process.env` is how server code reads environment variables — values loaded from `.env.local` that
never get shipped to the browser.

**Step 2 — sanitize the conversation** (keep only valid roles, the last 12 messages, and cap length):

```ts
const cleaned = messages
  .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
  .slice(-12)
  .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
```

This is basic defensive programming: never fully trust data that arrived over the network.

**Step 3 — call OpenRouter**, attaching the key and the system prompt, asking for a stream:

```ts
const upstream = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "X-Title": "Oleksii Maslovskyi - Digital Twin",
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b:free",
    stream: true,
    temperature: 0.5,
    messages: [{ role: "system", content: buildSystemPrompt() }, ...cleaned],
  }),
});
```

> **A real bug we hit and fixed here:** the `X-Title` header originally contained an em dash (`—`).
> HTTP header values must be plain ASCII, so every request crashed with *"Cannot convert argument to
> a ByteString."* Switching the dash to a regular hyphen (`-`) fixed it. A good reminder that small
> characters can have big consequences.

**Step 4 — translate the stream.** OpenRouter sends "Server‑Sent Events" — lines that start with
`data:` and contain JSON. We parse out just the text tokens and re‑emit plain text to the browser:

```ts
const stream = new ReadableStream<Uint8Array>({
  async start(controller) {
    const reader = upstream.body!.getReader();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";          // keep the last, possibly‑incomplete line

      for (const line of lines) {
        if (!line.trim().startsWith("data:")) continue;
        const data = line.trim().slice(5).trim();
        if (data === "[DONE]") { controller.close(); return; }
        const json = JSON.parse(data);
        const token = json?.choices?.[0]?.delta?.content ?? "";
        if (token) controller.enqueue(encoder.encode(token)); // push text to browser
      }
    }
  },
});

return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
```

The `buffer`/`lines.pop()` trick handles the fact that network data arrives in arbitrary chunks — a
single line might be split across two chunks, so we hold the leftover until the rest arrives.

### 5.11 The chat UI — `_components/ChatWidget.tsx`

This Client Component manages the conversation and reads the streaming reply. Its state:

```tsx
const [open, setOpen] = useState(false);        // is the panel open?
const [messages, setMessages] = useState<Message[]>([GREETING]);
const [input, setInput] = useState("");          // current textbox value
const [loading, setLoading] = useState(false);
```

When you send a message, it optimistically adds your message **and** an empty assistant message, then
fills that empty bubble in as text streams in:

```tsx
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: next }),
});

const reader = res.body.getReader();
const decoder = new TextDecoder();
let acc = "";

for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  acc += decoder.decode(value, { stream: true });
  setMessages((prev) => {
    const copy = [...prev];
    copy[copy.length - 1] = { role: "assistant", content: acc }; // update last bubble
    return copy;
  });
}
```

Every time `setMessages` runs, React re‑draws the chat with the latest text — that's what produces
the live "typing" effect. There's also a small `useEffect` that auto‑scrolls to the newest message,
and an error branch that shows a friendly message if the request fails.

---

## 6. How the AI chat works end‑to‑end

```
You type a question
        │
        ▼
ChatWidget (browser)  ──POST /api/chat──►  route.ts (our server)
                                              │  adds secret key + system prompt
                                              ▼
                                         OpenRouter  ──►  AI model
                                              │
                                   streams tokens back
                                              ▼
ChatWidget  ◄── plain‑text stream ──  route.ts relays the stream
        │
        ▼
Text appears word‑by‑word on screen
```

The golden rule visible here: **secrets stay on the server**. The browser only ever talks to
`/api/chat`, which belongs to us.

---

## 7. Five suggested improvements (self‑review)

These are honest weaknesses in the current code and how I'd address them.

### 1. Add rate limiting and abuse protection to `/api/chat`
Right now anyone who finds the endpoint can call it repeatedly, which could burn through API quota or
run up costs. **Improvement:** add per‑IP rate limiting (e.g. a small in‑memory or Redis counter),
basic input‑length checks beyond the current cap, and maybe a simple bot check. This is the single
most important production hardening step.

### 2. Let the user stop a response, and clean up requests
There's no "stop generating" button, and if the component unmounts mid‑stream the fetch keeps going.
**Improvement:** use an `AbortController` so the user can cancel, and abort the request automatically
in a `useEffect` cleanup. This improves UX and prevents wasted tokens.

### 3. Render the AI's Markdown properly
The AI often replies with Markdown (`**bold**`, links, lists), but we display it as raw text, so
visitors see literal asterisks. **Improvement:** render assistant messages through a safe Markdown
renderer (e.g. `react-markdown`) with sanitization, so formatting and links display correctly.

### 4. Extract repeated styles and "magic" values into shared tokens
Class strings like `glass rounded-3xl p-6 md:p-7` and colors like the indigo→cyan gradient are
repeated across many files. **Improvement:** centralize these as small wrapper components (e.g. a
`<Card>`) or Tailwind theme tokens. This makes a future redesign a one‑place change instead of a
find‑and‑replace.

### 5. Add automated tests and accessibility checks
There are currently no tests, and the chat widget could be more screen‑reader friendly (e.g.
announcing new messages, trapping focus when open). **Improvement:** add a few component tests (e.g.
with Vitest + React Testing Library), a mocked test for the streaming parser in `route.ts`, and
ARIA live regions plus focus management in `ChatWidget`. Tests would have caught the em‑dash header
bug automatically.

---

## 8. How to run it

From the `web/` folder:

```bash
npm install      # first time only — downloads dependencies
npm run dev      # start the local development server
```

Then open <http://localhost:3000> and click **"Ask my AI twin"** in the bottom‑right corner.

Other useful commands:

```bash
npm run lint     # check the code for common mistakes
npm run build    # create an optimized production build
```

> The AI chat needs `OPENROUTER_API_KEY` set in `web/.env.local`. That file is intentionally kept out
> of git so the secret is never published. If the key is ever exposed, rotate it in the OpenRouter
> dashboard.

---

Happy building! Start by changing a value in `src/content/profile.ts` (like the headline), save, and
watch the page update instantly. That feedback loop — edit, save, see — is the heart of front‑end
development.
