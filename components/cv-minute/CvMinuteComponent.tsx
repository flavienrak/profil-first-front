'use client';

import React from 'react';
import CvMinuteForm from './CvMinuteForm';
import CvMinuteContent from './CvMinuteContent';

import { UidContext } from '@/providers/UidProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function CvMinuteComponent() {
  const context = React.useContext(UidContext);
  const { count } = useSelector((state: RootState) => state.cvMinute);

  if (context)
    return (
      <div className="flex-1 ml-64 mb-20 px-8">
        {count > 0 &&
        context.currentQuery.cvMinute &&
        !isNaN(Number(context.currentQuery.cvMinute)) ? (
          <CvMinuteContent />
        ) : (
          <CvMinuteForm />
        )}
      </div>
    );
}
