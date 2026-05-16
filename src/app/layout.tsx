import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Synq — Emotional-safe thought capture',
  description:
    'Synq helps you capture thoughts, emotions, tasks and reminders — safely and without judgment. Investor demo.',
  keywords: ['productivity', 'mental health', 'thought capture', 'emotions', 'tasks'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A0D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ background: '#0A0A0D', color: '#EEECEA' }}
      >
        {children}
      </body>
    </html>
  );
}
