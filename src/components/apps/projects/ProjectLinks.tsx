import React from 'react';
import type { ProjectItem } from '../../../types/os';
import { ExternalLink, Github } from '../../ui/Icons';

interface ProjectLinksProps {
  project: ProjectItem;
  variant?: 'card' | 'row';
}

const STYLES = {
  card: {
    wrapper: 'flex items-center gap-2',
    github:
      'p-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors',
    demo: 'p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors',
  },
  row: {
    wrapper: 'flex items-center justify-end gap-1.5',
    github: 'p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white',
    demo: 'p-1 rounded text-blue-500 hover:text-blue-400',
  },
} as const;

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ project, variant = 'card' }) => {
  const styles = STYLES[variant];

  return (
    <div className={styles.wrapper}>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={styles.github}
          title="Code source GitHub"
        >
          <Github size={13} />
        </a>
      )}
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={styles.demo}
          title="Démo Live"
        >
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
};
