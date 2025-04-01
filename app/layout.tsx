import type { Metadata } from 'next';
import './globals.css';
import UidProvider from '@/providers/UidProvider';
import ToastProvider from '@/providers/ToastProvider';
import ReduxProvider from '@/providers/ReduxProvider';

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
          <ToastProvider>
            <UidProvider>{children}</UidProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
