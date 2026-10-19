import React from 'react';
import {
  Folder,
  Layers,
  Mail,
  Terminal,
  User,
  FileText,
  Settings,
  Code,
  Sparkles,
  ExternalLink,
  Globe,
  Compass,
  Cpu,
  Monitor,
  Search,
  Wifi,
  Battery,
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Check,
  Send,
  Calendar,
  Copy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Grid,
  List,
  Sun,
  Moon,
  Info,
  FolderGit2,
  Palette,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Download,
  Flame,
  Star,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  RotateCcw,
  Gamepad2,
  Bot,
  CornerDownLeft,
  Power,
  LayoutGrid,
  Gauge,
} from 'lucide-react';
import type { AppId } from '../../types/os';

export const Github = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface AppIconProps {
  appId: AppId;
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ appId, size, className = '' }) => {
  const iconConfig: Record<AppId, { bg: string; icon: React.ReactNode; border?: string }> = {
    finder: {
      bg: 'linear-gradient(135deg, #2A85FF 0%, #0056D2 100%)',
      icon: <Compass className="text-white drop-shadow-md w-full h-full" />,
    },
    projects: {
      bg: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
      icon: <Layers className="text-white drop-shadow-md w-full h-full" />,
    },
    contact: {
      bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      icon: <Mail className="text-white drop-shadow-md w-full h-full" />,
    },
    terminal: {
      bg: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      icon: <Terminal className="text-emerald-400 drop-shadow-md w-full h-full" />,
      border: 'border border-gray-700/50',
    },
    about: {
      bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      icon: <User className="text-white drop-shadow-md w-full h-full" />,
    },
    settings: {
      bg: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
      icon: <Settings className="text-white drop-shadow-md w-full h-full" />,
    },
    snake: {
      bg: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
      icon: <Gamepad2 className="text-white drop-shadow-md w-full h-full" />,
    },
    assistant: {
      bg: 'linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)',
      icon: <Sparkles className="text-white drop-shadow-md w-full h-full" />,
    },
  };

  const config = iconConfig[appId] || iconConfig.finder;

  const styleObj: React.CSSProperties = {
    background: config.bg,
    borderRadius: size ? `${size * 0.22}px` : '22%',
    ...(size ? { width: size, height: size } : {}),
  };

  return (
    <div
      style={styleObj}
      className={`aero-gloss relative flex items-center justify-center shadow-lg transition-transform duration-150 hover:brightness-105 active:scale-95 ${config.border || ''} ${className}`}
    >
      <div className="w-[56%] h-[56%] flex items-center justify-center pointer-events-none">
        {config.icon}
      </div>
    </div>
  );
};

export {
  Folder,
  Layers,
  Mail,
  Terminal,
  User,
  FileText,
  Settings,
  Code,
  Sparkles,
  ExternalLink,
  Globe,
  Compass,
  Cpu,
  Monitor,
  Search,
  Wifi,
  Battery,
  Sliders,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Check,
  Send,
  Calendar,
  Copy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Grid,
  List,
  Sun,
  Moon,
  Info,
  FolderGit2,
  Palette,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Download,
  Flame,
  Star,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  RotateCcw,
  Gamepad2,
  Bot,
  CornerDownLeft,
  Power,
  LayoutGrid,
  Gauge,
};
