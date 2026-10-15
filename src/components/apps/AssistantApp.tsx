import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, EDUCATION } from '../../data/portfolio';
import { Sparkles, Send, CornerDownLeft } from '../ui/Icons';
import { soundEngine } from '../ui/AudioFx';
import { useDesktop } from '../../context/DesktopContext';

interface Message {
  id: number;
  from: 'user' | 'assistant';
  text: string;
}

interface Intent {
  keywords: string[];
  answer: () => string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const SUGGESTIONS = [
  'Quelle est ta stack ?',
  'Tu es disponible ?',
  'Montre-moi tes projets',
  'Comment te contacter ?',
];

export const AssistantApp: React.FC = () => {
  const { openApp } = useDesktop();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: 'assistant',
      text: `Bonjour, je suis l'assistant du portfolio de ${PERSONAL_INFO.name}. Posez-moi une question sur son parcours, sa stack, ses projets ou ses disponibilités.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const intents = useMemo<Intent[]>(
    () => [
      {
        keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou'],
        answer: () => `Bonjour ! Que voulez-vous savoir sur ${PERSONAL_INFO.name} ?`,
      },
      {
        keywords: ['stack', 'techno', 'technologie', 'langage', 'outil', 'competence', 'skill', 'sait faire'],
        answer: () => {
          const top = SKILL_CATEGORIES.map(
            (cat) => `${cat.name} : ${cat.skills.slice(0, 3).map((s) => s.name).join(', ')}`,
          ).join('\n');
          return `Sa stack principale est ${PERSONAL_INFO.stats.favoriteStack}.\n\n${top}`;
        },
      },
      {
        keywords: ['dispo', 'disponible', 'freelance', 'mission', 'embauche', 'recrute', 'cdi', 'alternance', 'stage'],
        answer: () =>
          PERSONAL_INFO.availableForWork
            ? `${PERSONAL_INFO.availabilityText}. Le plus simple est de passer par l'application Contact ou d'écrire à ${PERSONAL_INFO.email}.`
            : `Il n'est pas disponible actuellement, mais vous pouvez le joindre à ${PERSONAL_INFO.email}.`,
      },
      {
        keywords: ['projet', 'realisation', 'portfolio', 'travaux', 'fait quoi'],
        answer: () => {
          const list = PROJECTS.map((p) => `• ${p.title} — ${p.description}`).join('\n');
          openApp('projects');
          return `Voici ses projets (j'ouvre l'application Projets) :\n\n${list}`;
        },
      },
      {
        keywords: ['42', 'ecole', 'formation', 'etude', 'diplome', 'bac', 'rncp'],
        answer: () =>
          EDUCATION.map(
            (e) => `• ${e.role} — ${e.company}, ${e.location} (${e.period})\n  ${e.description.join(' ')}`,
          ).join('\n\n'),
      },
      {
        keywords: ['vynq', 'esn', 'entreprise', 'societe', 'boite'],
        answer: () => {
          const vynq = PROJECTS.find((p) => p.id === 'vynq');
          return vynq
            ? `${vynq.longDescription ?? vynq.description} Le site est en ligne sur vynq.dev.`
            : 'Vynq est son ESN, en ligne sur vynq.dev.';
        },
      },
      {
        keywords: ['experience', 'parcours', 'cv', 'travaille', 'poste', 'carriere'],
        answer: () => {
          const list = EDUCATION
            .map((e) => `• ${e.role} — ${e.company} (${e.period})`)
            .join('\n');
          openApp('about');
          return `Son parcours (j'ouvre son CV) :\n\n${list}`;
        },
      },
      {
        keywords: ['langue', 'anglais', 'allemand', 'francais', 'parle'],
        answer: () =>
          `Il parle ${PERSONAL_INFO.languages.map((l) => `${l.name.toLowerCase()} (${l.level.toLowerCase()})`).join(', ')}.`,
      },
      {
        keywords: ['qualite', 'soft skill', 'personnalite', 'caractere', 'interet', 'hobby', 'passion', 'loisir'],
        answer: () =>
          `Il se décrit comme ${PERSONAL_INFO.softSkills.map((s) => s.toLowerCase()).join(', ')}. Ses centres d'intérêt : ${PERSONAL_INFO.interests.map((i) => i.toLowerCase()).join(', ')}.`,
      },
      {
        keywords: ['contact', 'mail', 'email', 'joindre', 'ecrire', 'parler'],
        answer: () => {
          openApp('contact');
          return `Vous pouvez écrire à ${PERSONAL_INFO.email}, ou passer par le formulaire — j'ouvre l'application Contact.`;
        },
      },
      {
        keywords: ['github', 'code', 'source', 'repo'],
        answer: () => `Son GitHub est ici : ${PERSONAL_INFO.socials.github}`,
      },
      {
        keywords: ['linkedin', 'reseau'],
        answer: () => `Son LinkedIn : ${PERSONAL_INFO.socials.linkedin}`,
      },
      {
        keywords: ['site', 'portfolio fait', 'techniquement', 'comment tu marche', 'construit'],
        answer: () =>
          "Ce portfolio est une simulation de macOS et d'iOS dans le navigateur, en Astro, React 19, TypeScript et Tailwind 4. Les sons sont générés en Web Audio, sans aucun fichier audio.",
      },
      {
        keywords: ['snake', 'jeu', 'jouer', 'game'],
        answer: () => {
          openApp('snake');
          return "Il y a un Snake caché : tapez « snake » dans le Terminal. Je vous l'ouvre quand même. Flèches ou ZQSD pour diriger.";
        },
      },
      {
        keywords: ['qui', 'presente', 'toi', 'nom'],
        answer: () =>
          `${PERSONAL_INFO.name}, ${PERSONAL_INFO.role}. ${PERSONAL_INFO.bio}`.trim(),
      },
      {
        keywords: ['merci', 'super', 'cool', 'parfait'],
        answer: () => 'Avec plaisir. Autre chose ?',
      },
    ],
    [openApp],
  );

  const findAnswer = (question: string): string => {
    const q = normalize(question);
    const scored = intents
      .map((intent) => ({
        intent,
        score: intent.keywords.filter((k) => q.includes(normalize(k))).length,
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) return scored[0].intent.answer();

    return `Je n'ai pas la réponse à celle-là — je ne connais que ce portfolio. Essayez « sa stack », « ses projets », « ses disponibilités » ou « le contacter ». Pour tout le reste, écrivez-lui à ${PERSONAL_INFO.email}.`;
  };

  const send = (raw: string) => {
    const question = raw.trim();
    if (!question || isTyping) return;

    soundEngine.playClick();
    setMessages((prev) => [...prev, { id: nextId.current++, from: 'user', text: question }]);
    setInput('');
    setIsTyping(true);

    const answer = findAnswer(question);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId.current++, from: 'assistant', text: answer }]);
      setIsTyping(false);
      soundEngine.playPop();
    }, 420);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/70 dark:bg-[#1C1C1E]/70 select-text">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                message.from === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-[#2C2C2E] text-slate-700 dark:text-neutral-200 border border-black/5 dark:border-white/10 rounded-bl-md shadow-sm'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="px-3.5 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-[#2C2C2E] border border-black/5 dark:border-white/10 flex gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-neutral-500 animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => send(suggestion)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-[#2C2C2E] border border-black/5 dark:border-white/10 text-slate-600 dark:text-neutral-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-black/5 dark:border-white/10 flex items-center gap-2 shrink-0 bg-white/60 dark:bg-[#252529]/60"
      >
        <Sparkles size={15} className="text-blue-500 shrink-0" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez une question sur Samuel…"
          aria-label="Votre question"
          className="flex-1 bg-transparent text-xs outline-none text-slate-800 dark:text-neutral-100 placeholder:text-slate-400 dark:placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-colors"
          aria-label="Envoyer"
        >
          <Send size={13} />
        </button>
      </form>

      <p className="px-3 pb-2 text-[10px] text-slate-400 dark:text-neutral-500 flex items-center gap-1 shrink-0">
        <CornerDownLeft size={10} />
        Assistant local — répond uniquement à partir des données de ce portfolio.
      </p>
    </div>
  );
};
