import React, { useState } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { PROJECTS, PERSONAL_INFO, APPS } from '../../data/portfolio';
import {
  Folder,
  FileText,
  Layers,
  Terminal,
  User,
  Download,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Github,
  Code,
  Compass,
} from '../ui/Icons';
import { AppIcon } from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';
import type { AppId } from '../../types/os';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'app' | 'code' | 'image' | 'archive';
  size: string;
  date: string;
  targetApp?: AppId;
  action?: () => void;
  icon?: React.ReactNode;
}

export const FinderApp: React.FC = () => {
  const { openApp } = useDesktop();
  const [currentFolder, setCurrentFolder] = useState<'recents' | 'applications' | 'documents' | 'projects' | 'downloads'>('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const foldersData: Record<string, FileItem[]> = {
    recents: [
      { id: 'r1', name: 'CV_Samuel_BONNEAU.pdf', type: 'pdf', size: '52 KB', date: 'Aujourd’hui', targetApp: 'about' },
    ],
    applications: APPS.filter((app) => !app.isHidden).map((app) => ({
      id: app.id,
      name: `${app.title}.app`,
      type: 'app',
      size: '18 MB',
      date: '31/08/2026',
      targetApp: app.id,
    })),
    documents: [
      { id: 'd1', name: 'CV_Samuel_BONNEAU.pdf', type: 'pdf', size: '52 KB', date: '15/10/2026', targetApp: 'about' },
    ],
    projects: PROJECTS.map((p) => ({
      id: p.id,
      name: `${p.title.split('—')[0].trim()}`,
      type: 'folder',
      size: `${p.tags.length} techs`,
      date: p.date,
      targetApp: 'projects',
    })),
    downloads: [
      { id: 'dl1', name: 'CV_Samuel_BONNEAU.pdf', type: 'pdf', size: '52 KB', date: '15/10/2026', targetApp: 'about' },
    ],
  };

  const currentFiles = foldersData[currentFolder] || foldersData.projects;

  const filteredFiles = currentFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileClick = (file: FileItem) => {
    soundEngine.playClick();
    setSelectedFileId(file.id);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    soundEngine.playPop();
    if (file.targetApp) {
      openApp(file.targetApp);
    }
  };

  const renderFileIcon = (file: FileItem) => {
    if (file.type === 'app' && file.targetApp) {
      return <AppIcon appId={file.targetApp} size={42} />;
    }
    if (file.type === 'folder') {
      return (
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white shadow-md">
          <Folder size={24} className="drop-shadow" />
        </div>
      );
    }
    if (file.type === 'pdf') {
      return (
        <div className="w-10 h-11 rounded-lg bg-gradient-to-tr from-red-500 to-rose-400 flex items-center justify-center text-white shadow-md border-t border-white/20">
          <span className="text-[9px] font-bold uppercase tracking-tight">PDF</span>
        </div>
      );
    }
    if (file.type === 'code') {
      return (
        <div className="w-10 h-11 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
          <Code size={20} />
        </div>
      );
    }
    if (file.type === 'archive') {
      return (
        <div className="w-10 h-11 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md">
          <Download size={20} />
        </div>
      );
    }
    return (
      <div className="w-10 h-11 rounded-lg bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center text-white shadow-md">
        <FileText size={20} />
      </div>
    );
  };

  const folderLabels: Record<string, string> = {
    recents: 'Récents',
    applications: 'Applications',
    documents: 'Documents',
    projects: 'Projets',
    downloads: 'Téléchargements',
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/80 dark:bg-[#1C1C1E]/80 select-text overflow-hidden">
      <div className="px-4 py-2.5 bg-white/60 dark:bg-[#252529]/80 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1 rounded hover:bg-slate-200/60 dark:hover:bg-neutral-800 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 rounded hover:bg-slate-200/60 dark:hover:bg-neutral-800 disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-neutral-100 flex items-center gap-1.5">
            <Compass size={14} className="text-blue-500" />
            Macintosh HD &gt; sbonneau &gt; <span className="text-blue-500">{folderLabels[currentFolder]}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/80 dark:bg-neutral-800 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('grid');
              }}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white'
              }`}
              title="Icônes"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setViewMode('list');
              }}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-white'
              }`}
              title="Liste"
            >
              <List size={14} />
            </button>
          </div>
          <div className="relative w-40 sm:w-48">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 text-xs rounded-lg bg-slate-200/60 dark:bg-neutral-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-slate-800 dark:text-neutral-100 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-[#1E1E22]/50 p-3 flex flex-col gap-4 shrink-0 overflow-y-auto select-none hidden sm:flex">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-2">
              Favoris
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFolder('projects');
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentFolder === 'projects'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Layers size={14} className={currentFolder === 'projects' ? 'text-white' : 'text-blue-500'} />
                <span>Projets</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFolder('applications');
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentFolder === 'applications'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Sparkles size={14} className={currentFolder === 'applications' ? 'text-white' : 'text-emerald-500'} />
                <span>Applications</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFolder('documents');
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentFolder === 'documents'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <FileText size={14} className={currentFolder === 'documents' ? 'text-white' : 'text-emerald-500'} />
                <span>Documents</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFolder('downloads');
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentFolder === 'downloads'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Download size={14} className={currentFolder === 'downloads' ? 'text-white' : 'text-amber-500'} />
                <span>Téléchargements</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentFolder('recents');
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentFolder === 'recents'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <Folder size={14} className={currentFolder === 'recents' ? 'text-white' : 'text-rose-500'} />
                <span>Récents</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => handleFileClick(file)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                    className={`p-3 rounded-xl flex flex-col items-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-500/20 ring-1 ring-blue-500/40 backdrop-blur-xs'
                        : 'hover:bg-slate-200/50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-center">
                      {renderFileIcon(file)}
                    </div>
                    <span className="text-xs font-medium text-slate-800 dark:text-neutral-100 truncate w-full">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{file.size}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-[#252529]/60 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-neutral-800/50 text-slate-500 dark:text-neutral-400 font-semibold">
                    <th className="py-2.5 px-4">Nom</th>
                    <th className="py-2.5 px-4">Date de modification</th>
                    <th className="py-2.5 px-4">Taille</th>
                    <th className="py-2.5 px-4">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      onDoubleClick={() => handleFileDoubleClick(file)}
                      className="hover:bg-blue-500/10 dark:hover:bg-blue-500/20 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-4 flex items-center gap-2 font-medium text-slate-800 dark:text-neutral-100">
                        {renderFileIcon(file)}
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-neutral-400">{file.date}</td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-neutral-400 font-mono">{file.size}</td>
                      <td className="py-2.5 px-4 text-slate-400 uppercase text-[10px]">{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-1.5 bg-slate-100/60 dark:bg-[#252529]/60 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
        <span>{filteredFiles.length} éléments</span>
        <span>512 Go disponible</span>
      </div>
    </div>
  );
};
