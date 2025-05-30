import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Target,
  User,
} from 'lucide-react';

const questionNumber = 50;

const userRoutes = [
  { name: 'Quali Carrière CV', icon: FileText, href: '/quali-carriere' },
  { name: 'CV Minute', icon: Clock, href: '/cv-minute', ref: true },
  { name: 'CV et Offres', icon: Briefcase, href: '/cv-offres' },
  // { name: 'Mes opportunités', icon: Star, href: '/opportunites' },
  // { name: 'Ma messagerie', icon: MessageSquare, href: '/user-message' },
  // { name: 'Mon Compte', icon: User, href: '/user-compte' },
];

const recruiterRoutes = [
  { name: 'Cross Sourcing', icon: Target, href: '/cross-sourcing', ref: true },
  { name: 'CVthèque', icon: FileText, href: '/cvtheque' },
  // { name: 'Dashboard', icon: Building2, href: '/dashboard' },
  // {
  //   name: 'Messages',
  //   icon: MessageSquare,
  //   href: '/recruiter-message',
  //   hasNotification: true,
  // },
  // { name: 'Mon compte', icon: User, href: '/recruiter-compte' },
];

const educationLevels = ['Bac', 'BTS', 'Licence', 'Master', 'Doctorat'];

const domains = [
  {
    id: 1,
    label: 'Audit & Contrôle de Gestion',
    description: 'Audit interne, contrôle financier, reporting',
  },
  {
    id: 2,
    label: 'Consulting & Gestion de projet',
    description: 'Management de projet, conseil stratégique, transformation',
  },
  { id: 3, label: 'Design', description: 'Graphisme, UI/UX, Motion Design' },
  {
    id: 4,
    label: 'Développement web & Mobile',
    description: 'Front-end, back-end, applications mobiles',
  },
  {
    id: 5,
    label: 'Finance & Comptabilité',
    description: 'Analyse financière, comptabilité, trésorerie',
  },
  {
    id: 6,
    label: 'Ingénieries & Technologies',
    description: 'R&D, innovation, solutions techniques',
  },
  {
    id: 7,
    label: 'IT, Logiciels & Systèmes',
    description: 'Infrastructure, cloud, cybersécurité',
  },
  {
    id: 8,
    label: 'Marketing & Communication',
    description: 'Stratégie digitale, content marketing, relations publiques',
  },
  {
    id: 9,
    label: 'Ressources Humaines & Recrutement',
    description: 'Talent acquisition, formation, développement RH',
  },
  {
    id: 10,
    label: 'Ventes & Développement Commercial',
    description: 'Business development, account management, négociation',
  },
];

const cvThequesections = [
  { name: 'title' },
  { name: 'presentation' },
  { name: 'experiences' },
  { name: 'diplomes', order: 1 },
  { name: 'formation', order: 2 },
  { name: 'competence', order: 3 },
];

export {
  questionNumber,
  userRoutes,
  recruiterRoutes,
  educationLevels,
  domains,
  cvThequesections,
};
