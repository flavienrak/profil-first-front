'use client';

import React from 'react';
import Popup from '@/components/utils/Popup';
import AuthComponent from '@/components/auth/AuthComponent';
import Header from './Header';
import Hero from './Hero';
import CreatorInfo from './CreatorInfo';
import OptimizeExperience from './OptimizeExperience';
import PersonalizedAdvice from './PersonalizedAdvice';
import Advantages from './Advantages';
import DemoSection from './DemoSection';
import Testimonials from './Testimonials';
import Faq from './Faq';
import Cta from './Cta';
import Footer from './Footer';

import { UserInterface } from '@/interfaces/user.interface';

export default function LandingComponent() {
  const [showAuth, setShowAuth] = React.useState({
    show: 'login',
    empty: false,
  });
  const [role, setRole] = React.useState<UserInterface['role']>('user');

  const handleShowAuth = (
    value: UserInterface['role'],
    show?: string,
    empty?: boolean,
  ) => {
    setRole(value);
    setShowAuth({ show: show ?? 'login', empty: empty ?? false });
  };

  return (
    <div className="min-h-screen [background-image:var(--bg-primary)] transition-all duration-150">
      <Header handleShowAuth={handleShowAuth} />
      <main>
        <Hero />
        <CreatorInfo />
        <OptimizeExperience />
        <PersonalizedAdvice />
        <Advantages />
        <DemoSection />
        <Testimonials />
        <Faq />
        <Cta handleShowAuth={handleShowAuth} />
      </main>
      <Footer />

      {showAuth.show && (
        <Popup full onClose={() => setShowAuth({ show: '', empty: false })}>
          <AuthComponent
            role={role}
            show={showAuth.show}
            empty={showAuth.empty}
          />
        </Popup>
      )}
    </div>
  );
}
