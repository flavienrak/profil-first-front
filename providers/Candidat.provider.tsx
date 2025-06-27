'use client';

import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PaymentInterface, PaymentType } from '@/interfaces/payment.interface';

interface CandidatProviderContextType {
  isFree: boolean;
  credits: number;
  cvPlan: PaymentType;
  qualiCarrierePlan: boolean;
}

const CandidatContext = React.createContext<
  CandidatProviderContextType | undefined
>(undefined);

export const useCandidat = (): CandidatProviderContextType => {
  const context = React.useContext(CandidatContext);
  if (context === undefined) {
    throw new Error('useCandidat must be used within a CandidatProvider');
  }
  return context;
};

const getCVPlanType = (payments: PaymentInterface[]): PaymentType => {
  const now = new Date();

  // Vérifie s’il existe un premium actif
  const hasActivePremium = payments.some(
    (item) =>
      item.type === 'premium' &&
      item.expiredAt &&
      new Date(item.expiredAt) > now,
  );

  if (hasActivePremium) {
    return 'premium';
  }

  // Vérifie s’il existe un booster
  const hasBooster = payments.some((item) => item.type === 'booster');

  if (hasBooster) {
    return 'booster';
  }

  // Sinon c’est free
  return 'free';
};

export default function CandidatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: RootState) => state.user);

  const [credits, setCredits] = React.useState(0);
  const [isFree, setIsFree] = React.useState(false);
  const [cvPlan, setCVPlanType] = React.useState<PaymentType>('free');
  const [qualiCarrierePlan, setQualiCarrierePlan] = React.useState(false);

  React.useEffect(() => {
    if (user && user.role && user.role === 'candidat' && user.payments) {
      const actualCredits = user.payments.reduce((sum, item) => {
        if (item.credit) {
          if (
            item.type === 'premium' &&
            item.expiredAt &&
            new Date(item.expiredAt) > new Date()
          ) {
            return sum + item.credit.value;
          }
          return sum + item.credit.value;
        }
        return sum;
      }, 0);

      setIsFree(user.payments.length === 1);
      setCVPlanType(getCVPlanType(user.payments));
      setQualiCarrierePlan(
        !!user.payments.find(
          (item) =>
            item.type === 'quali-carriere' &&
            item.expiredAt &&
            new Date(item.expiredAt) > new Date(),
        ),
      );
      setCredits(actualCredits);
    }
  }, [user?.role, user?.payments]);

  return (
    <CandidatContext.Provider
      value={{
        isFree,
        credits,
        cvPlan,
        qualiCarrierePlan,
      }}
    >
      {children}
    </CandidatContext.Provider>
  );
}
