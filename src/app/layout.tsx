import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import ProfileSelector from '@/components/layout/ProfileSelector';

export const metadata: Metadata = {
  title: 'New Sunshine',
  description: 'Still got it',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-900 pb-20 selection:bg-amber-500/30">
        <div className="border-b border-neutral-800 bg-neutral-900/80 sticky top-0 z-40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end">
            <ProfileSelector />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </div>
        <Navigation />
      </body>
    </html>
  );
}
