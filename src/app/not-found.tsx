import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0A0A0D' }}
    >
      <div className="max-w-sm w-full">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
        >
          <span className="text-3xl">◎</span>
        </div>

        <p
          className="text-6xl font-bold mb-4 tabular-nums"
          style={{ color: '#7B6EF6', letterSpacing: '-2px' }}
        >
          404
        </p>

        <h1 className="text-xl font-bold mb-2" style={{ color: '#EEECEA' }}>
          Page not found
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: '#888680' }}>
          This page doesn&apos;t exist. Maybe it was captured as a thought?
        </p>

        <Link
          href="/"
          className="block w-full py-3 rounded-2xl text-sm font-semibold text-white text-center"
          style={{ background: '#7B6EF6' }}
        >
          Back to Synq
        </Link>
      </div>
    </div>
  );
}
