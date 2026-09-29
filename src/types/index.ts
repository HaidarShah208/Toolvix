export type ToolCategory = "calculators" | "tools";

export type ToolGroup =
  | "math"
  | "finance"
  | "health"
  | "education"
  | "date-time"
  | "text"
  | "converters"
  | "generators"
  | "developer"
  | "image";

/** Name of an icon exported from `@/components/ui/icon`. */
export type IconName =
  | "cake"
  | "percent"
  | "graduation-cap"
  | "school"
  | "heart-pulse"
  | "landmark"
  | "wallet"
  | "tag"
  | "hand-coins"
  | "piggy-bank"
  | "trending-up"
  | "sigma"
  | "scale"
  | "divide"
  | "calendar-range"
  | "clock"
  | "flame"
  | "footprints"
  | "qr-code"
  | "file-text"
  | "type"
  | "case-sensitive"
  | "key-round"
  | "arrow-left-right"
  | "ruler"
  | "weight"
  | "thermometer"
  | "globe"
  | "scaling"
  | "image-down"
  | "braces"
  | "file-check"
  | "fingerprint"
  | "pilcrow"
  | "dices"
  | "palette"
  | "undo-2"
  | "eraser"
  | "calculator"
  | "wrench"
  | "book-open";

export interface Tool {
  /** Stable identifier, also used as the widget key. */
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  group: ToolGroup;
  /** One-sentence description for cards and search. */
  description: string;
  icon: IconName;
  keywords: string[];
  relatedTools: string[];
  relatedGuides: string[];
  /** Title without the brand suffix; the root layout template appends it. */
  seoTitle: string;
  seoDescription: string;
  popular?: boolean;
  /** ISO date the page content was last meaningfully changed. */
  updated: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Formula {
  label: string;
  expression: string;
  /** Explains each variable in the expression. */
  variables?: { symbol: string; meaning: string }[];
  note?: string;
}

export interface WorkedExample {
  title: string;
  steps: string[];
  result: string;
}

export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  ordered?: boolean;
}

export interface ToolContent {
  /** One or two sentences answering the main search intent directly. */
  directAnswer: string;
  intro: string;
  howToUse: string[];
  howItWorks: string[];
  formulas?: Formula[];
  examples?: WorkedExample[];
  /** Extra question-led sections (H2) specific to the tool. */
  sections?: ContentSection[];
  faqs: FAQ[];
  disclaimer?: string;
}

export interface GuideMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  relatedTools: string[];
  relatedGuides: string[];
  popular?: boolean;
  published: string;
  updated: string;
}

export interface GuideContent {
  /** Concise answer shown directly under the H1. */
  directAnswer: string;
  intro: string;
  steps: string[];
  formulas?: Formula[];
  examples?: WorkedExample[];
  /** Question-led H2 sections. */
  sections: ContentSection[];
  faqs: FAQ[];
  disclaimer?: string;
}

export type Guide = GuideMeta & GuideContent;
