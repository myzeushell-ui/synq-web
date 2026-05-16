import { Shell } from '@/components/layout/Shell';

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0A0A0D' }}
    >
      <div className="w-full" style={{ maxWidth: 430 }}>
        <Shell />
      </div>
    </main>
  );
}
