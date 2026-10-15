import React, { useState } from 'react';
import { PERSONAL_INFO, SKILL_CATEGORIES, EDUCATION } from '../../data/portfolio';
import {
  User,
  GraduationCap,
  Code,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from '../ui/Icons';
import { useDesktop } from '../../context/DesktopContext';
import { soundEngine } from '../ui/AudioFx';

const HIGHLIGHT_COLORS = [
  'text-sky-600 dark:text-sky-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-amber-500',
  'text-teal-500',
];

export const AboutApp: React.FC = () => {
  const { openApp } = useDesktop();
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'skills'>('profile');

  return (
    <div className="flex flex-col h-full bg-slate-50/80 dark:bg-[#1C1C1E]/80 select-text overflow-hidden">
      <div className="px-4 py-2.5 bg-white/60 dark:bg-[#252529]/80 border-b border-black/5 dark:border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center bg-slate-200/80 dark:bg-neutral-800 rounded-lg p-0.5 shadow-inner">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('profile');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User size={13} /> Profil & Bio
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('skills');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code size={13} /> Compétences
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('experience');
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'experience'
                ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap size={13} /> Parcours
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 shadow-sm">
              <img
                src="/chat.png"
                alt={PERSONAL_INFO.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
                    {PERSONAL_INFO.name}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-center sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Alternance · Stage 2026
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  {PERSONAL_INFO.role}
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <MapPin size={12} /> {PERSONAL_INFO.location}
                </p>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-3">
                  {PERSONAL_INFO.availabilityText}
                </p>
                <p className="text-xs text-slate-700 dark:text-neutral-300 mt-2 leading-relaxed">
                  {PERSONAL_INFO.bio}
                </p>
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => openApp('contact')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Mail size={13} /> Me Contacter
                  </button>
                  <button
                    onClick={() => openApp('projects')}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200/80 dark:bg-neutral-800 hover:bg-slate-300 dark:hover:bg-neutral-700 text-slate-800 dark:text-neutral-200 transition-all"
                  >
                    Explorer mes Projets
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PERSONAL_INFO.highlights.map((item, idx) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 text-center"
                >
                  <span className={`text-xl font-bold ${HIGHLIGHT_COLORS[idx % HIGHLIGHT_COLORS.length]}`}>
                    {item.value}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-1.5">
                <GraduationCap size={15} /> Formation & Diplômes
              </h3>
              <div className="space-y-2">
                {EDUCATION.map((edu) => (
                  <div key={edu.role} className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                      {edu.role} <span className="font-normal text-slate-500 dark:text-neutral-400">· {edu.company}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">{edu.period}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Langues</h3>
                {PERSONAL_INFO.languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-neutral-200">{lang.name}</span>
                    <span className="text-slate-500 dark:text-neutral-400">{lang.level}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Soft skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONAL_INFO.softSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">Centres d'intérêt</h3>
                <ul className="space-y-1">
                  {PERSONAL_INFO.interests.map((interest) => (
                    <li key={interest} className="text-xs text-slate-700 dark:text-neutral-300">{interest}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 pt-1">{PERSONAL_INFO.drivingLicense}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-500" /> {cat.name}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-800 dark:text-neutral-200">{skill.name}</span>
                        {skill.level !== undefined && (
                          <span className="font-mono text-slate-500 dark:text-neutral-400">
                            {skill.level}%
                          </span>
                        )}
                      </div>
                      {skill.level !== undefined && (
                        <div className="h-2 w-full bg-slate-200/80 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      )}
                      {skill.description && (
                        <p className="text-[10px] text-slate-500 dark:text-neutral-400">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {EDUCATION.map((exp, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/70 dark:bg-[#252529]/70 border border-black/5 dark:border-white/10 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-neutral-100">
                      {exp.role}
                    </h3>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {exp.company} • <span className="text-slate-500">{exp.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1.5 pt-1">
                  {exp.description.map((desc, dIdx) => (
                    <li
                      key={dIdx}
                      className="text-xs text-slate-600 dark:text-neutral-300 flex items-start gap-2"
                    >
                      <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 flex flex-wrap gap-1">
                  {exp.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
