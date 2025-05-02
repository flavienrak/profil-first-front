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
  { name: 'CV Minute', icon: Clock, href: '/cv-minute' },
  { name: 'CV et Offres', icon: Briefcase, href: '/cv-offres' },
  { name: 'Mes opportunités', icon: Star, href: '/opportunites' },
  { name: 'Ma messagerie', icon: MessageSquare, href: '/user-message' },
  { name: 'Mon Compte', icon: User, href: '/user-compte' },
];

const recruiterRoutes = [
  { name: 'Cross Sourcing', icon: Target, href: '/cross-sourcing' },
  { name: 'CVthèque', icon: FileText, href: '/cvtheque' },
  { name: 'Dashboard', icon: Building2, href: '/dashboard' },
  {
    name: 'Messages',
    icon: MessageSquare,
    href: '/recruiter-message',
    hasNotification: true,
  },
  { name: 'Mon compte', icon: User, href: '/recruiter-compte' },
];

const educationLevels = ['Bac', 'BTS', 'Licence', 'Master', 'Doctorat'];

const domains = [
  {
    label: 'Audit & Contrôle de Gestion',
    description: 'Audit interne, contrôle financier, reporting',
  },
  {
    label: 'Consulting & Gestion de projet',
    description: 'Management de projet, conseil stratégique, transformation',
  },
  { label: 'Design', description: 'Graphisme, UI/UX, Motion Design' },
  {
    label: 'Développement web & Mobile',
    description: 'Front-end, back-end, applications mobiles',
  },
  {
    label: 'Finance & Comptabilité',
    description: 'Analyse financière, comptabilité, trésorerie',
  },
  {
    label: 'Ingénieries & Technologies',
    description: 'R&D, innovation, solutions techniques',
  },
  {
    label: 'IT, Logiciels & Systèmes',
    description: 'Infrastructure, cloud, cybersécurité',
  },
  {
    label: 'Marketing & Communication',
    description: 'Stratégie digitale, content marketing, relations publiques',
  },
  {
    label: 'Ressources Humaines & Recrutement',
    description: 'Talent acquisition, formation, développement RH',
  },
  {
    label: 'Ventes & Développement Commercial',
    description: 'Business development, account management, négociation',
  },
];

export {
  questionNumber,
  userRoutes,
  recruiterRoutes,
  educationLevels,
  domains,
};
