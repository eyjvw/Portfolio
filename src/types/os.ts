export const APP_IDS = [
  'finder',
  'projects',
  'contact',
  'terminal',
  'about',
  'settings',
  'snake',
  'assistant',
] as const;

export type AppId = (typeof APP_IDS)[number];

export const isAppId = (value: string): value is AppId =>
  (APP_IDS as readonly string[]).includes(value);

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  isPinnedToDock: boolean;
  /** Easter egg: kept out of the dock, home screen, Finder and Spotlight. */
  isHidden?: boolean;
  canHaveMultipleInstances?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  preMaximizeState?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'fullstack' | 'frontend' | 'ai' | 'mobile' | 'tools';
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  date: string;
  highlights?: string[];
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: {
    name: string;
    /** Percentage, shown as a bar only when set. */
    level?: number;
    icon?: string;
    description?: string;
  }[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  tech: string[];
}

export interface StackTool {
  name: string;
  /** Simple Icons slug, used when no local `src` is given. */
  slug: string;
  src?: string;
}

export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night';

export interface WallpaperTheme {
  id: string;
  name: string;
  thumbnail: string;
  type: 'gradient' | 'dynamic' | 'abstract' | 'minimal';
  /** Daytime look, also used for thumbnails and server rendering. */
  cssBackground: string;
  /** Variants that follow the visitor's local time (dynamic wallpapers only). */
  timeOfDay?: Record<DayPhase, string>;
  isDarkDefault: boolean;
}

/** Boot screen, normal use, or the fake kernel panic from `sudo rm -rf /`. */
export type SystemState = 'booting' | 'running' | 'panic';
