import {
  Briefcase,
  Building2,
  ClipboardList,
  Clock,
  FileText,
  MessageSquare,
  NotebookPen,
  Star,
  Target,
  User,
} from 'lucide-react';

const notLoggedRoutes = ['/'];

const publicRoutes = ['/conditions', '/payment', '/auth'];

const candidatRoutes = [
  { name: 'Quali Carrière CV', icon: FileText, href: '/quali-carriere' },
  { name: 'CV Minute', icon: Clock, href: '/cv-minute', ref: true },
  { name: 'CV et Offres', icon: Briefcase, href: '/cv-offres' },
  { name: 'Mon Plan', icon: ClipboardList, href: '/mon-plan' },
  { name: 'Réservation Séance', icon: NotebookPen, href: '/reservation' },
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

const isNotLoggedRoute = (pathname: string): boolean => {
  return notLoggedRoutes.some((item) =>
    item === '/' ? pathname === item : pathname.startsWith(item),
  );
};

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((item) => pathname.startsWith(item));
};

const isCandidateRoute = (pathname: string): boolean => {
  return candidatRoutes.some((item) => pathname.startsWith(item.href));
};

const isRecruiterRoute = (pathname: string): boolean => {
  return recruiterRoutes.some((item) => pathname.startsWith(item.href));
};

export {
  notLoggedRoutes,
  publicRoutes,
  candidatRoutes,
  recruiterRoutes,
  isNotLoggedRoute,
  isPublicRoute,
  isCandidateRoute,
  isRecruiterRoute,
};
