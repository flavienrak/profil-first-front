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

const educationLevels = [
  { value: 'bac', label: 'Bac' },
  { value: 'bts', label: 'BTS' },
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'doctorat', label: 'Doctorat' },
];

export { questionNumber, userRoutes, recruiterRoutes, educationLevels };
