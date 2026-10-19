import type { ProjectItem, SkillCategory, ExperienceItem, WallpaperTheme, AppDefinition, StackTool } from '../types/os';

export const PERSONAL_INFO = {
  name: 'Samuel Bonneau',
  shortName: 'sbonneau',
  role: 'Développeur Fullstack · Étudiant à 42',
  tagline: 'Recherche d’alternance ou de stage en développement Fullstack pour 2026.',
  bio: 'Passionné d’informatique depuis l’âge de 11 ans, j’ai progressivement développé mes compétences en programmation à travers des projets personnels. Curieux et rigoureux, je m’attache à concevoir des solutions efficaces, maintenables et adaptées aux besoins.',
  location: 'Le Havre, France · Télétravail ou présentiel',
  email: 'sbonneau@student.42lehavre.fr',
  availableForWork: true,
  availabilityText: 'Recherche d’alternance en développement Fullstack pour 2026, ouvert aussi aux stages',
  drivingLicense: 'Permis B',
  socials: {
    github: 'https://github.com/eyjvw',
    linkedin: 'https://www.linkedin.com/in/sbonneau/',
    email: 'mailto:sbonneau@student.42lehavre.fr',
  },
  highlights: [
    { value: '148 j', label: 'Tronc commun 42 terminé' },
    { value: 'RNCP 7', label: 'Certification en préparation' },
    { value: 'Mention B', label: 'Bac STI2D, spécialité SIN' },
  ],
  languages: [
    { name: 'Français', level: 'Natif' },
    { name: 'Anglais', level: 'Courant' },
    { name: 'Allemand', level: 'Débutant' },
  ],
  softSkills: ['Compétitif', 'Autodidacte', 'Ambitieux', 'Rigoureux'],
  interests: ['Jeux vidéo compétitifs', 'Nouvelles technologies', 'Sport'],
  stats: {
    favoriteStack: 'C, C++, JavaScript, TypeScript, Python, Go, Java',
  },
};

/**
 * Web3Forms access key for the contact form. It is meant to be public: it can
 * only deliver messages to the inbox it was created for.
 */
export const WEB3FORMS_ACCESS_KEY = 'bc6a646d-0401-4726-81a4-42b0cb18b1fa';

export const APPS: AppDefinition[] = [
  {
    id: 'finder',
    title: 'Finder',
    icon: 'Folder',
    color: '#0A84FF',
    defaultWidth: 840,
    defaultHeight: 540,
    minWidth: 600,
    minHeight: 400,
    isPinnedToDock: true,
  },
  {
    id: 'projects',
    title: 'Projets',
    icon: 'Layers',
    color: '#5E5CE6',
    defaultWidth: 960,
    defaultHeight: 620,
    minWidth: 700,
    minHeight: 450,
    isPinnedToDock: true,
  },
  {
    id: 'contact',
    title: 'Mail / Contact',
    icon: 'Mail',
    color: '#30D158',
    defaultWidth: 800,
    defaultHeight: 520,
    minWidth: 600,
    minHeight: 380,
    isPinnedToDock: true,
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'Terminal',
    color: '#1C1C1E',
    defaultWidth: 720,
    defaultHeight: 460,
    minWidth: 500,
    minHeight: 320,
    isPinnedToDock: true,
  },
  {
    id: 'about',
    title: 'À propos / CV',
    icon: 'User',
    color: '#FF9F0A',
    defaultWidth: 860,
    defaultHeight: 600,
    minWidth: 650,
    minHeight: 450,
    isPinnedToDock: true,
  },
  {
    id: 'settings',
    title: 'Réglages',
    icon: 'Settings',
    color: '#8E8E93',
    defaultWidth: 780,
    defaultHeight: 540,
    minWidth: 600,
    minHeight: 400,
    isPinnedToDock: true,
  },
  {
    id: 'snake',
    title: 'Snake',
    icon: 'Gamepad2',
    color: '#34C759',
    defaultWidth: 460,
    defaultHeight: 560,
    minWidth: 380,
    minHeight: 480,
    isPinnedToDock: false,
    isHidden: true,
  },
  {
    id: 'assistant',
    title: 'Assistant',
    icon: 'Sparkles',
    color: '#0A84FF',
    defaultWidth: 520,
    defaultHeight: 600,
    minWidth: 400,
    minHeight: 460,
    isPinnedToDock: true,
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'vynq',
    title: 'Vynq — Site & plateforme de l’ESN',
    description: 'Site vitrine et plateforme de la société de services numériques Vynq, conçus et développés de bout en bout.',
    longDescription: 'Vynq est l’ESN que je codirige. J’ai pris en charge l’identité web complète : architecture du site, design system, intégration et déploiement. Le site sert à la fois de vitrine commerciale et de point d’entrée pour les candidatures et les demandes de mission.',
    category: 'fullstack',
    tags: ['TypeScript', 'React', 'Tailwind CSS', 'SEO', 'Design System'],
    image: '/projects/vynq.jpg',
    demoUrl: 'https://vynq.dev',
    featured: true,
    date: '2026',
    highlights: [
      'Identité visuelle et design system pensés puis implémentés de zéro',
      'Site en production, utilisé comme canal commercial et de recrutement',
      'Déploiement continu et suivi des performances Core Web Vitals',
    ],
  },
  {
    id: '42-core-curriculum',
    title: '42 — Core Curriculum',
    description: 'Ensemble des projets système du tronc commun de l’école 42, écrits en C sans bibliothèque standard.',
    longDescription: 'Le tronc commun de 42 couvre la programmation système bas niveau en C : réimplémentation de la libc, gestion mémoire, processus et signaux, sockets, threads et algorithmique. Tous les projets sont soumis à la Norme 42 et validés par peer-review.',
    category: 'tools',
    tags: ['C', 'Unix', 'Makefile', 'Gestion mémoire', 'Processus & signaux', 'Algorithmique'],
    image: '/projects/42-core.jpg',
    githubUrl: 'https://github.com/eyjvw/42-Core-Curriculum',
    featured: true,
    date: '2025 — 2026',
    highlights: [
      'Programmation système en C, sans dépendance externe',
      'Contraintes strictes de style et de gestion mémoire (Norme 42, zéro fuite)',
      'Validation par peer-review et batteries de tests automatisés',
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Programmation',
    icon: 'Code',
    skills: [
      { name: 'C & C++', description: 'Programmation bas niveau' },
      { name: 'Rust, Nim & Zig', description: 'Programmation bas niveau (débutant)' },
      { name: 'JavaScript & TypeScript', description: 'Programmation haut niveau' },
      { name: 'Python, Go & Java', description: 'Programmation haut niveau' },
      { name: 'Arduino UNO', description: 'Programmation embarquée' },
    ],
  },
  {
    name: 'Systèmes & DevOps',
    icon: 'Server',
    skills: [
      { name: 'Docker & Podman', description: 'Conteneurisation des applications' },
      { name: 'VPS & serveurs dédiés', description: 'Configuration et administration' },
      { name: 'Nginx & Caddy', description: 'Reverse proxy, certificats SSL et gestion de noms de domaine' },
      { name: 'Unix & Linux', description: 'Terminal Unix et distributions Linux' },
      { name: 'Git', description: 'Versioning' },
    ],
  },
  {
    name: 'Données & débogage',
    icon: 'Cpu',
    skills: [
      { name: 'SQLite, MySQL, PostgreSQL & MongoDB', description: 'Bases de données, y compris au format JSON' },
      { name: 'GDB, Valgrind & Helgrind', description: 'Débogage et résolution de bugs' },
    ],
  },
];

export const EDUCATION: ExperienceItem[] = [
  {
    role: 'RNCP 7 — Expert en architecture informatique',
    company: 'École 42',
    period: 'Depuis 2025',
    location: 'Le Havre, France',
    description: [
      'Spécialisation en langages bas niveau, en préparation d’une certification RNCP niveau 7.',
      'Tronc commun terminé en 148 jours : bases solides en C et en C++.',
      'Algorithmique, gestion de la mémoire et programmation orientée objet.',
      'Projets plus avancés aujourd’hui, pour approfondir la technique et gagner en autonomie.',
    ],
    tech: ['C', 'C++', 'Algorithmique', 'Gestion mémoire', 'POO'],
  },
  {
    role: 'Baccalauréat technologique STI2D',
    company: 'Lycée Henri Darras',
    period: '2024 — 2025',
    location: 'Liévin, France',
    description: [
      'Sciences et Technologies de l’Industrie et du Développement Durable.',
      'Spécialité Systèmes d’Information et Numérique.',
      'Obtenu avec la mention bien.',
    ],
    tech: ['Systèmes d’information', 'Numérique'],
  },
];

export const STACK_TOOLS: StackTool[] = [
  { name: 'Claude', slug: 'claude' },
  { name: 'Codex', slug: 'openai', src: '/codex.svg' },
  { name: 'Figma', slug: 'figma' },
  { name: 'React', slug: 'react' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'Astro', slug: 'astro' },
  { name: 'Tailwind', slug: 'tailwindcss' },
  { name: 'Bun', slug: 'bun' },
  { name: 'Node', slug: 'nodedotjs' },
];

export const WALLPAPERS: WallpaperTheme[] = [
  {
    id: 'etang',
    name: 'Étang (dynamique)',
    thumbnail: '🦢',
    type: 'dynamic',
    cssBackground:
      'radial-gradient(ellipse at 75% 0%, rgba(186,224,242,0.85) 0%, rgba(186,224,242,0) 55%), radial-gradient(ellipse at 15% 100%, rgba(120,170,80,0.55) 0%, rgba(120,170,80,0) 60%), linear-gradient(160deg, #0f2f3d 0%, #1d5a6e 35%, #2f7d6a 65%, #3f7f45 100%)',
    // Follows the visitor's clock: pink dawn, the usual day, orange dusk, moonlit night.
    timeOfDay: {
      dawn: 'radial-gradient(ellipse at 75% 0%, rgba(255,198,176,0.8) 0%, rgba(255,198,176,0) 55%), radial-gradient(ellipse at 15% 100%, rgba(120,160,80,0.45) 0%, rgba(120,160,80,0) 60%), linear-gradient(160deg, #2b2742 0%, #5b4b6c 32%, #4c7a78 65%, #3b6c46 100%)',
      day: 'radial-gradient(ellipse at 75% 0%, rgba(186,224,242,0.85) 0%, rgba(186,224,242,0) 55%), radial-gradient(ellipse at 15% 100%, rgba(120,170,80,0.55) 0%, rgba(120,170,80,0) 60%), linear-gradient(160deg, #0f2f3d 0%, #1d5a6e 35%, #2f7d6a 65%, #3f7f45 100%)',
      dusk: 'radial-gradient(ellipse at 75% 0%, rgba(255,155,95,0.75) 0%, rgba(255,155,95,0) 55%), radial-gradient(ellipse at 15% 100%, rgba(95,125,60,0.45) 0%, rgba(95,125,60,0) 60%), linear-gradient(160deg, #1f1631 0%, #4d2b50 35%, #7b4a52 65%, #2f4a34 100%)',
      night: 'radial-gradient(ellipse at 75% 0%, rgba(160,190,235,0.32) 0%, rgba(160,190,235,0) 42%), radial-gradient(ellipse at 15% 100%, rgba(40,95,72,0.4) 0%, rgba(40,95,72,0) 60%), linear-gradient(160deg, #050b14 0%, #0a1c2a 35%, #0e292b 65%, #0e2317 100%)',
    },
    isDarkDefault: true,
  },
  {
    id: 'sonoma-dusk',
    name: 'Sonoma Dusk',
    thumbnail: '🌅',
    type: 'gradient',
    cssBackground: 'linear-gradient(135deg, #1e112a 0%, #301b44 25%, #602558 50%, #9e3d64 75%, #e0705a 100%)',
    isDarkDefault: true,
  },
  {
    id: 'sequoia-night',
    name: 'Sequoia Night',
    thumbnail: '🌲',
    type: 'dynamic',
    cssBackground: 'radial-gradient(ellipse at top, #1B2735 0%, #090A0F 100%)',
    isDarkDefault: true,
  },
  {
    id: 'cupertino-blue',
    name: 'Cupertino Azure',
    thumbnail: '🌊',
    type: 'gradient',
    cssBackground: 'linear-gradient(135deg, #0b192e 0%, #0d2847 30%, #00529b 70%, #0099ff 100%)',
    isDarkDefault: true,
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Glow',
    thumbnail: '🌌',
    type: 'abstract',
    cssBackground: 'linear-gradient(135deg, #050505 0%, #0d2b27 30%, #155e54 60%, #38ef7d 100%)',
    isDarkDefault: true,
  },
  {
    id: 'cyber-sunset',
    name: 'Cyberpunk Neon',
    thumbnail: '🌆',
    type: 'abstract',
    cssBackground: 'linear-gradient(135deg, #130026 0%, #3b0054 35%, #7b0068 70%, #ff007f 100%)',
    isDarkDefault: true,
  },
  {
    id: 'minimal-slate',
    name: 'Minimalist Slate',
    thumbnail: '🌑',
    type: 'minimal',
    cssBackground: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    isDarkDefault: true,
  },
];
