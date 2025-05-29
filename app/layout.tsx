import type { Metadata } from 'next';
import './globals.css';

import ReduxProvider from '@/providers/Redux.provider';
import ThemeProvider from '@/providers/Theme.provider';
import SocketProvider from '@/providers/Socket.provider';
import ToastProvider from '@/providers/Toast.provider';
import UserProvider from '@/providers/User.provider';

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
          <ThemeProvider>
            <SocketProvider>
              <ToastProvider>
                <UserProvider>{children}</UserProvider>
              </ToastProvider>
            </SocketProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
