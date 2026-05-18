'use client';

interface Props {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function DemoBanner({ darkMode, onToggleTheme }: Props) {
  return (
    <div
      className="flex items-center shrink-0 px-4 py-1.5"
      style={{
        background: darkMode ? '#1E1A3A' : '#EAE8F8',
        borderBottom: `0.5px solid ${darkMode ? '#2E2B4A' : '#D0CCF0'}`,
      }}
    >
      <p
        className="text-xs font-medium tracking-wide flex-1 text-center"
        style={{ color: '#7B6EF6' }}
      >
        ✦ INVESTOR DEMO MODE — all data is simulated
      </p>
      <button
        onClick={onToggleTheme}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
        style={{
          background: darkMode ? '#2E2B4A' : '#D0CCF0',
          color: '#7B6EF6',
          fontSize: 13,
        }}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
