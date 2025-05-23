import type { Metadata } from 'next';
import './globals.css';

import UserProvider from '@/providers/User.provider';
import ToastProvider from '@/providers/Toast.provider';
import ReduxProvider from '@/providers/Redux.provider';
import SocketProvider from '@/providers/Socket.provider';

export const metadata: Metadata = {
  title: 'Profil First',
  description: 'Profil First',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body cz-shortcut-listen="true">
        <ReduxProvider>
          <SocketProvider>
            <ToastProvider>
              <UserProvider>{children}</UserProvider>
            </ToastProvider>
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
