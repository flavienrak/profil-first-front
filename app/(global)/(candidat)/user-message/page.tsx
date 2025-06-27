import React from 'react';
// import UserMessageComponent from '@/components/role/user/user-message/UserMessageComponent';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Messages Profile First',
};

export default function Messages() {
  return (
    <div className="h-full w-full flex justify-center overflow-y-auto">
      <div className="max-w-7xl w-full h-full">
        {/* <UserMessageComponent /> */}
      </div>
    </div>
  );
}
