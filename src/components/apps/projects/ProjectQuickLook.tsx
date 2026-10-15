import React, { useEffect } from 'react';
import type { ProjectItem } from '../../../types/os';
import { CheckCircle2, ExternalLink, Github, X } from '../../ui/Icons';

interface ProjectQuickLookProps {
  project: ProjectItem;
  onClose: () => void;
}

export const ProjectQuickLook: React.FC<ProjectQuickLookProps> = ({ project, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
  <div
    className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-2xl bg-white dark:bg-[#1E1E22] rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col max-h-full"
    >
      <div className="px-5 py-3.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-[#252529]/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-800 dark:text-neutral-100">
            {project.title}
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {project.date}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          title="Fermer (Échap)"
          className="shrink-0 w-6 h-6 rounded-full bg-slate-200/80 dark:bg-neutral-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto space-y-5">
        <div className="w-full h-56 rounded-xl overflow-hidden relative shadow-inner">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Présentation
          </h4>
          <p className="text-sm text-slate-700 dark:text-neutral-200 mt-1 leading-relaxed">
            {project.longDescription || project.description}
          </p>
        </div>
        {project.highlights && project.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2">
              Points clés d’architecture
            </h4>
            <ul className="space-y-1.5">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-600 dark:text-neutral-300 flex items-start gap-2"
                >
                  <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2">
            Stack Technique
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 font-medium border border-black/5 dark:border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-black/5 dark:border-white/10 bg-slate-50/80 dark:bg-[#252529]/80 flex items-center justify-end gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-100 flex items-center gap-2 transition-all"
          >
            <Github size={14} /> Voir le Code Source
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <ExternalLink size={14} /> Lancer la Démo Live
          </a>
        )}
      </div>
    </div>
  </div>
  );
};
