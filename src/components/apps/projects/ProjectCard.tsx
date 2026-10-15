import React from 'react';
import type { ProjectItem } from '../../../types/os';
import { Star } from '../../ui/Icons';
import { ProjectLinks } from './ProjectLinks';

interface ProjectCardProps {
  project: ProjectItem;
  onOpen: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => (
  <div
    onClick={onOpen}
    className="group relative flex flex-col rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#252529]/70 hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
  >
    <div className="h-44 w-full relative overflow-hidden bg-slate-800">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {project.featured && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/90 text-amber-950 backdrop-blur-md flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-amber-950" /> À la une
        </span>
      )}

      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
        <span className="text-xs font-semibold drop-shadow">{project.date}</span>
        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm border border-white/20">
          {project.category.toUpperCase()}
        </span>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-neutral-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2.5">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-black/5 dark:border-white/5"
            >
              {t}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            En savoir plus &rarr;
          </span>
          <ProjectLinks project={project} variant="card" />
        </div>
      </div>
    </div>
  </div>
);
