import React, { useState, useMemo } from 'react';
import { PROJECTS } from '../../data/portfolio';
import type { ProjectItem } from '../../types/os';
import {
  Grid,
  List,
  Search,
  Sparkles,
  Layers,
  Code,
  Folder,
} from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';
import { ProjectCard } from './projects/ProjectCard';
import { ProjectLinks } from './projects/ProjectLinks';
import { ProjectQuickLook } from './projects/ProjectQuickLook';

const CATEGORY_LABELS = [
  { id: 'ai', label: 'IA & Systèmes', icon: Sparkles },
  { id: 'fullstack', label: 'Fullstack & 3D', icon: Code },
  { id: 'frontend', label: 'Frontend & UI Kits', icon: Folder },
  { id: 'tools', label: 'Outils & CLI', icon: Layers },
  { id: 'mobile', label: 'Mobile & IoT', icon: Layers },
] as const satisfies ReadonlyArray<{ id: ProjectItem['category']; label: string; icon: unknown }>;

export const ProjectsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    PROJECTS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      const matchCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchTag = !selectedTag || project.tags.includes(selectedTag);
      const matchSearch =
        searchQuery.trim() === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchTag && matchSearch;
    });
  }, [selectedCategory, selectedTag, searchQuery]);

  const categories = useMemo(() => {
    const used = new Set(PROJECTS.map((p) => p.category));
    return [
      { id: 'all', label: 'Tous les projets', icon: Layers },
      ...CATEGORY_LABELS.filter((cat) => used.has(cat.id)),
    ];
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50/70 dark:bg-[#1C1C1E]/70 select-text">
      <div className="px-4 py-2.5 bg-white/60 dark:bg-[#252529]/80 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-3 shrink-0 flex-wrap">
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
              title="Vue Grille"
            >
              <Grid size={15} />
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
              title="Vue Liste"
            >
              <List size={15} />
            </button>
          </div>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium ml-1">
            {filteredProjects.length} {filteredProjects.length > 1 ? 'projets trouvés' : 'projet trouvé'}
          </span>
        </div>
        <div className="relative w-full max-w-[240px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-200/60 dark:bg-neutral-800/80 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-neutral-500 text-slate-800 dark:text-neutral-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r border-black/5 dark:border-white/10 bg-slate-100/40 dark:bg-[#1E1E22]/40 p-3 hidden sm:flex flex-col gap-4 overflow-y-auto shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 px-2">
              Catégories
            </span>
            <div className="mt-1 space-y-0.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedCategory(cat.id);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-blue-500'} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Technologies
              </span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[10px] text-blue-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {allTags.map((tag) => {
                const isTagSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTag(isTagSelected ? null : tag);
                    }}
                    className={`px-2 py-0.5 text-[11px] rounded-md transition-all ${
                      isTagSelected
                        ? 'bg-blue-500 text-white font-medium shadow-sm'
                        : 'bg-slate-200/70 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {filteredProjects.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-slate-200/80 dark:bg-neutral-800 flex items-center justify-center text-slate-400 mb-3">
                <Search size={28} />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-neutral-200">
                Aucun projet correspondant
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xs">
                Essayez d’ajuster vos filtres de recherche ou de réinitialiser la catégorie.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => {
                    soundEngine.playPop();
                    setActiveProject(project);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-[#252529]/60 rounded-xl border border-black/5 dark:border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10 bg-slate-100/50 dark:bg-neutral-800/50 text-slate-500 dark:text-neutral-400 font-semibold">
                    <th className="py-2.5 px-4">Nom du Projet</th>
                    <th className="py-2.5 px-4 hidden md:table-cell">Catégorie</th>
                    <th className="py-2.5 px-4 hidden lg:table-cell">Stack</th>
                    <th className="py-2.5 px-4">Année</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => {
                        soundEngine.playPop();
                        setActiveProject(p);
                      }}
                      className="hover:bg-blue-500/10 dark:hover:bg-blue-500/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-neutral-100">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate max-w-xs md:max-w-md">
                          {p.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200/80 dark:bg-neutral-800 font-mono">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-neutral-400">
                        {p.date}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ProjectLinks project={p} variant="row" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {activeProject && (
        <ProjectQuickLook project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  );
};
