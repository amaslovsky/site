export type ExperienceItem = {
  company: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  highlights?: string[];
};

export type EducationItem = {
  school: string;
  program?: string;
  years?: string;
};

export const profile = {
  name: "Oleksii Maslovskyi",
  headline: "MQA / AQA Engineer",
  location: "Kyiv Metropolitan Area",
  email: "a.maslovsky@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/oleksii-maslovskyi-aa92221b6",
  summary: [
    "3+ years of consistent QA experience, specializing in manual testing.",
    "6+ months of hands-on automation experience, focused on Java-based UI and API (REST) testing.",
    "Comfortable building tests around databases, Excel-driven data, and Allure reporting. I enjoy improving QA processes and delivering high-quality results.",
  ],
  topSkills: ["Test Automation", "Java", "JUnit"],
  toolsAndTech: [
    "Selenium",
    "Selenide",
    "JUnit",
    "RestAssured",
    "Cucumber (BDD)",
    "Allure",
    "UI automation",
    "API (REST) testing",
    "Databases",
    "Excel data",
  ],
  certifications: ["Advanced Test Automation (Java)"],
  valuePillars: [
    {
      title: "Quality strategy",
      description:
        "Define risk-based coverage, prioritize critical paths, and keep regression reliable with lean, high-signal suites.",
    },
    {
      title: "Automation design",
      description:
        "Java-first frameworks for UI + API with maintainable page objects, reusable fixtures, and stable selectors.",
    },
    {
      title: "Release confidence",
      description:
        "Clear reporting, actionable defects, and feedback loops that help teams ship safely and on time.",
    },
  ],
  processHighlights: [
    "Exploratory testing that mirrors real customer workflows.",
    "Automation to cover smoke, regression, and API contract checks.",
    "Allure reporting for fast visibility and defect triage.",
    "Database and data-driven validations to catch edge cases early.",
  ],
  differentiators: [
    "Manual QA depth with a modern automation mindset.",
    "Cross-layer test coverage: UI, API, and data validation.",
    "Pragmatic process improvements that reduce churn and rework.",
  ],
  metrics: [
    { label: "QA experience", value: "3+ yrs" },
    { label: "Automation focus", value: "Java / REST" },
    { label: "Current role", value: "GroupBWT" },
  ],
  experience: [
    {
      company: "GroupBWT",
      title: "QA Test Engineer",
      start: "Nov 2021",
      end: "Present",
      highlights: [
        "Manual QA across web products, focused on quality and regression stability.",
        "Process improvement mindset: clearer bug reports, better test coverage, faster feedback loops.",
      ],
    },
    {
      company: "Outstaff Web-Project",
      title: "QA Automation Engineer",
      start: "May 2024",
      end: "Jan 2025",
      highlights: [
        "Java-based UI automation using Selenium/Selenide and JUnit.",
        "API automation with RestAssured; BDD coverage with Cucumber when appropriate.",
        "Allure reporting; tests integrating with DB checks and Excel-driven test data.",
      ],
    },
    {
      company: "AG-team",
      title: "QA Test Engineer",
      start: "Feb 2021",
      end: "Oct 2021",
      location: "Kyiv, Ukraine",
      highlights: ["Manual testing and structured bug reporting.", "Collaboration with devs to reproduce issues and validate fixes."],
    },
    {
      company: "Chain of supermarkets",
      title: "QA Test Engineer",
      start: "May 2018",
      end: "Sep 2020",
      location: "Kyiv, Ukraine",
      highlights: ["Database beta testing.", "Bug reporting.", "Improvement suggestions."],
    },
    {
      company: "StarUP",
      title: "QA Test Engineer",
      start: "Feb 2015",
      end: "Nov 2015",
      location: "Kiev",
      highlights: ["Functional testing.", "Compatibility testing.", "Localization testing."],
    },
  ] satisfies ExperienceItem[],
  education: [
    { school: "QALight IT specialist training center", program: "QA Engineer", years: "2021" },
    { school: "QALight", program: "Advanced Test Automation (Java)" },
    { school: "Kyiv National University of Trade and Economics (KNTEU)", program: "Marketing", years: "2006–2008" },
    {
      school: "National Aviation University",
      program: "Specialist — Automation & Computer Engineering",
      years: "1992–1998",
    },
  ] satisfies EducationItem[],
} as const;

