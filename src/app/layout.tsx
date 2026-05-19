import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Synq — Emotional-safe thought capture',
  description:
    'Synq helps you capture thoughts, emotions, tasks and reminders — safely and without judgment.',
  keywords: ['productivity', 'mental health', 'thought capture', 'emotions', 'tasks'],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Synq',
  },
  openGraph: {
    title: 'Synq — Emotional-safe thought capture',
    description:
      'Capture thoughts, log emotions, set reminders — in one calm, judgment-free space.',
    type: 'website',
    siteName: 'Synq',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Synq — Emotional-safe thought capture',
    description:
      'Capture thoughts, log emotions, set reminders — in one calm, judgment-free space.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#7B6EF6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full`}>
      <body className="min-h-full antialiased" style={{ background: '#0A0A0D', color: '#EEECEA' }}>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
