import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Synq — Thought Capture',
    short_name: 'Synq',
    description: 'Capture thoughts, emotions and reminders — calmly and without judgment.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0D',
    theme_color: '#7B6EF6',
    orientation: 'portrait',
    categories: ['productivity', 'lifestyle', 'health'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Capture thought',
        short_name: 'Capture',
        description: 'Quickly capture a new thought',
        url: '/?capture=1',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
