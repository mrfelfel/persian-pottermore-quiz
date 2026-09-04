export interface Volume {
  id: string;
  title: string;
  slug: string;
  icon: string;
  chapters: ChapterSummary[];
}

export interface ChapterSummary {
  slug: string;
  title: string;
  epigraph?: string;
  size: number;
}

export interface Chapter {
  slug: string;
  title: string;
  volume: string;
  volumeTitle: string;
  epigraph?: string;
  content: string;
  sections: string[];
  size: number;
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  role: string;
  school: string;
  period: string;
  epigraph: string;
  content: string;
  metadata?: Record<string, string>;
}

export interface TimelineEntry {
  year: string;
  yearGregorian: string;
  events: string[];
}
