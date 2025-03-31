import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/components/redux/ReduxProvider';

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
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
