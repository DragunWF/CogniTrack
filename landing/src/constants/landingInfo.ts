// UPDATE THIS WHEN THERE IS A NEW EXPO DEVELOPMENT BUILD AVAILABLE
const EXPO_APP_URL =
  "https://expo.dev/preview/update?message=refactor%3A+replace+logo+on+both+the+landing+page+and+the+mobile+app&updateRuntimeVersion=1.0.0&createdAt=2025-10-31T11%3A52%3A19.924Z&slug=exp&projectId=9203ba2d-9630-4ea0-88b5-9d813e63dee5&group=6129ad88-fb65-4189-80cf-431a2d79f713";

// TypeScript interfaces for landing page data
export interface CTAButton {
  text: string;
  link: string;
  variant?: "primary" | "secondary";
}

export interface HeroInfo {
  tagline: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
  expoDeepLink: string;
  directLink: string;
  githubLink: string;
  expoGoIOSLink: string;
  expoGoAndroidLink: string;
}

export interface PainPoint {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemInfo {
  title: string;
  subtitle: string;
  painPoints: PainPoint[];
}

export interface CoreConceptInfo {
  title: string;
  badge: string;
  philosophy: string;
  principle: string;
  quote: string;
  quoteAuthor: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  highlight: "primary" | "accent";
}

export interface FeaturesInfo {
  title: string;
  subtitle: string;
  features: Feature[];
}

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export interface HowItWorksInfo {
  title: string;
  subtitle: string;
  steps: Step[];
}

export interface AIShowcaseInfo {
  title: string;
  badge: string;
  description: string;
  capabilities: string[];
  exampleInsight: {
    title: string;
    content: string;
  };
}

export interface Technology {
  name: string;
  category: string;
  description: string;
  icon: string;
}

export interface TechStackInfo {
  title: string;
  subtitle: string;
  technologies: Technology[];
  architectureNote: string;
}

export interface AccessInfo {
  title: string;
  subtitle: string;
  instructions: Array<{
    step: number;
    text: string;
  }>;
  disclaimer: string;
}

export interface FooterInfo {
  tagline: string;
  copyright: string;
  links: Array<{
    title: string;
    url: string;
  }>;
}

export interface LandingInfo {
  hero: HeroInfo;
  problem: ProblemInfo;
  concept: CoreConceptInfo;
  features: FeaturesInfo;
  howItWorks: HowItWorksInfo;
  aiShowcase: AIShowcaseInfo;
  techStack: TechStackInfo;
  access: AccessInfo;
  footer: FooterInfo;
}

// Main landing page data
export const landingInfo: LandingInfo = {
  hero: {
    tagline: "Build Awareness. Break Patterns.",
    description:
      "CogniTrack is your personal habit awareness tool. Log your habits with one tap, let AI uncover hidden patterns, and transform awareness into lasting change.",
    primaryCTA: {
      text: "Try with Expo Go",
      link: "#access",
      variant: "primary",
    },
    secondaryCTA: {
      text: "Learn More",
      link: "#features",
      variant: "secondary",
    },
    expoDeepLink: EXPO_APP_URL,
    directLink: EXPO_APP_URL,
    githubLink: "https://github.com/DragunWF/CogniTrack",
    expoGoIOSLink: "https://apps.apple.com/app/expo-go/id982107779",
    expoGoAndroidLink:
      "https://play.google.com/store/apps/details?id=host.exp.exponent",
  },

  problem: {
    title: "Why Do Bad Habits Persist?",
    subtitle: "The problem isn't willpower — it's awareness.",
    painPoints: [
      {
        icon: "🔁",
        title: "Invisible Repetition",
        description:
          "You repeat behaviors without realizing how often they actually happen",
      },
      {
        icon: "🌫️",
        title: "Hidden Patterns",
        description:
          "You don't see the patterns — the times, triggers, and emotions behind your habits",
      },
      {
        icon: "💪",
        title: "Willpower Isn't Enough",
        description:
          "Raw willpower alone fails without understanding the 'why' behind your actions",
      },
      {
        icon: "📉",
        title: "Tracking Fatigue",
        description:
          "Traditional tracking feels like a chore, so you give up before seeing results",
      },
    ],
  },

  concept: {
    title: "The Core Philosophy",
    badge: "Inspired by Atomic Habits",
    philosophy:
      "CogniTrack believes that awareness is the first step to change. Simply observing and logging your habits reduces their power over you. You can't change what you don't notice.",
    principle: "Awareness > Willpower",
    quote:
      "You do not rise to the level of your goals. You fall to the level of your systems.",
    quoteAuthor: "James Clear, Atomic Habits",
  },

  features: {
    title: "Features That Work With You",
    subtitle: "Designed for real people, real life, real change.",
    features: [
      {
        icon: "⚡",
        title: "Frictionless Logging",
        description:
          "One-tap habit logging with optional notes. No complex forms, no friction. Add a habit in seconds, wherever you are.",
        highlight: "primary",
      },
      {
        icon: "🧠",
        title: "AI-Powered Insights",
        description:
          "Google Gemini 2.5 analyzes your data to reveal time-based patterns, emotional triggers, and hidden connections you'd never spot manually.",
        highlight: "accent",
      },
      {
        icon: "📊",
        title: "Data Visualization",
        description:
          "See your habits over time with intuitive charts and statistics. Track frequency, streaks, and trends at a glance.",
        highlight: "primary",
      },
      {
        icon: "📝",
        title: "Saved Reports",
        description:
          "Generate and save AI analysis reports. Revisit insights, track progress, and see how your awareness has evolved.",
        highlight: "accent",
      },
      {
        icon: "💾",
        title: "Data Management",
        description:
          "Export your data, import backups, or start fresh. Your data stays local and under your control with SQLite.",
        highlight: "primary",
      },
      {
        icon: "📅",
        title: "Historical View",
        description:
          "Browse your habit history by date. See patterns across days, weeks, and months to understand your journey.",
        highlight: "accent",
      },
    ],
  },

  howItWorks: {
    title: "How It Works",
    subtitle: "Four simple steps to awareness and change",
    steps: [
      {
        number: 1,
        title: "Log Your Habits",
        description:
          "Whenever you catch yourself doing a habit, open CogniTrack and log it with one tap. Add context with optional notes.",
        icon: "📱",
      },
      {
        number: 2,
        title: "AI Analyzes Patterns",
        description:
          "Google Gemini 2.5 Flash processes your habit data to find patterns you'd never notice — time correlations, triggers, and trends.",
        icon: "🤖",
      },
      {
        number: 3,
        title: "Discover Insights",
        description:
          "View AI-generated reports that explain when, why, and how your habits occur. Save reports to track your progress over time.",
        icon: "💡",
      },
      {
        number: 4,
        title: "Take Action",
        description:
          "Armed with awareness, make informed changes. Break patterns by understanding them first.",
        icon: "🎯",
      },
    ],
  },

  aiShowcase: {
    title: "Intelligence That Understands You",
    badge: "Powered by Google Gemini 2.5 Flash",
    description:
      "CogniTrack doesn't just store data — it thinks about it. Our AI analyzes your habit patterns to surface insights you'd never find on your own.",
    capabilities: [
      "Time-based pattern detection (morning, evening, weekends)",
      "Emotional trigger identification from your notes",
      "Frequency analysis and streak tracking",
      "Correlation discovery between different habits",
      "Personalized, judgment-free insights",
    ],
    exampleInsight: {
      title: "Example AI Insight",
      content:
        "\"I notice you tend to log social media distractions most frequently between 2-4 PM on weekdays. This coincides with your afternoon energy dip. Your notes often mention feeling 'stressed' or 'overwhelmed' during these times. Consider: What if you scheduled a short walk or coffee break at 2 PM instead?\"",
    },
  },

  techStack: {
    title: "Built with Modern Technology",
    subtitle: "Reliable, fast, and privacy-focused",
    technologies: [
      {
        name: "React Native",
        category: "Framework",
        description:
          "Cross-platform mobile development with native performance",
        icon: "⚛️",
      },
      {
        name: "Expo SDK 54",
        category: "Platform",
        description: "Streamlined development and deployment workflow",
        icon: "📦",
      },
      {
        name: "TypeScript",
        category: "Language",
        description: "Type-safe code for reliability and maintainability",
        icon: "🔷",
      },
      {
        name: "SQLite",
        category: "Database",
        description: "Local, fast, privacy-first data storage",
        icon: "💾",
      },
      {
        name: "Google Gemini API",
        category: "AI",
        description: "State-of-the-art language model for insights",
        icon: "✨",
      },
      {
        name: "Clean Architecture",
        category: "Architecture",
        description:
          "Separation of concerns with domain/application/infrastructure layers",
        icon: "🏗️",
      },
    ],
    architectureNote:
      "CogniTrack follows Clean Architecture principles with clear separation between domain entities, application use cases, and infrastructure services. This ensures testability, maintainability, and scalability.",
  },

  access: {
    title: "Ready to Try CogniTrack?",
    subtitle: "Your journey to self-awareness starts with a simple scan.",
    instructions: [
      {
        step: 1,
        text: "Install Expo Go from the App Store (iOS) or Google Play Store (Android) — it's free",
      },
      {
        step: 2,
        text: "Scan the QR code with your camera or the Expo Go app",
      },
      {
        step: 3,
        text: "Start logging your habits and discover your patterns",
      },
    ],
    disclaimer:
      "This is a personal project distributed via Expo Go. Not published to app stores.",
  },

  footer: {
    tagline: "Build Awareness. Break Patterns.",
    copyright: "© 2025 CogniTrack. Built with mindfulness.",
    links: [
      {
        title: "GitHub Repository",
        url: "https://github.com/DragunWF/CogniTrack",
      },
      {
        title: "View Developer's LinkedIn",
        url: "https://www.linkedin.com/in/marc-plarisan/",
      },
    ],
  },
};
