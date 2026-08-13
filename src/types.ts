export type PillarId = "system-design" | "low-level-design" | "mathematics" | "implementation";

export type WorkType =
  | "case-study"
  | "technical-note"
  | "design-record"
  | "implementation-log"
  | "specification";

export interface Pillar {
  id: PillarId;
  title: string;
  shortTitle: string;
  description: string;
  topics: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Subsystem {
  id: string;
  title: string;
  description: string;
  children?: Subsystem[];
}

export interface Project {
  id: string;
  name: string;
  tagline?: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  technologies: string[];
  pillars: PillarId[];
  subsystems: Subsystem[];
  links: ProjectLink[];
  featured?: boolean;
}

/**
 * Content is built from typed blocks rather than free-form HTML so that
 * code, flows, lists and equations render natively and stay readable on
 * mobile. New block kinds can be added without changing page code.
 */
export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "code"; label?: string; language?: string; code: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "flow"; steps: string[] }
  | { kind: "callout"; variant?: "info" | "warning"; text: string }
  | { kind: "math"; text: string };

export interface ContentSection {
  label: string;
  blocks: ContentBlock[];
}

export interface TechnicalWork {
  id: string;
  title: string;
  projectId: string;
  subsystemId?: string;
  pillars: PillarId[];
  type: WorkType;
  tags: string[];
  summary: string;
  sections: ContentSection[];
  relatedNoteIds: string[];
}

export interface EngineeringNote {
  id: string;
  title: string;
  description: string;
  date?: string;
  readingTime?: string;
  category: string;
  tags: string[];
  relatedProjectId?: string;
  relatedSubsystemId?: string;
  pillarIds: PillarId[];
  status: "draft" | "planned" | "published";
  content: ContentSection[];
}
