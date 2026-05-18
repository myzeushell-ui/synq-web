import { Shell } from '@/components/layout/Shell';

const FEATURES = [
  {
    icon: '⚡',
    label: 'Мгновенная запись',
    desc: 'Мысль пришла в дороге? Один тап — и она в безопасности.',
  },
  {
    icon: '♡',
    label: 'Эмоциональный интеллект',
    desc: 'Отслеживайте настроение, видите паттерны, дышите через перегрузку.',
  },
  {
    icon: '◷',
    label: 'Умные напоминания',
    desc: 'Поставьте один раз. Synq помнит — голова отдыхает.',
  },
  { icon: '🧠', label: 'ИИ-собеседник', desc: 'Говорите с Synq, когда нужно место без осуждения.' },
];

const STATS = [
  { value: '2.4×', label: 'меньше ментальной нагрузки' },
  { value: '87%', label: 'пользователей спят лучше' },
  { value: '< 3с', label: 'чтобы записать мысль' },
];

export default function Home() {
  return (
    <>
      {/* ── Mobile: app fills the screen ─────────────────────────────── */}
      <div className="md:hidden h-[100dvh] flex flex-col">
        <Shell />
      </div>

      {/* ── Desktop: marketing layout + live phone mockup ────────────── */}
      <div
        className="hidden md:flex min-h-screen items-center justify-center gap-16 px-12 py-12"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 50%, #13102A 0%, #0A0A0D 60%)',
        }}
      >
        {/* Left: marketing copy */}
        <div className="flex flex-col gap-8 max-w-sm flex-shrink-0">
          {/* Logo + badge */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
                style={{ background: '#7B6EF6' }}
              >
                S
              </div>
              <span className="text-xl font-bold" style={{ color: '#EEECEA' }}>
                Synq
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: '#1E1A3A', color: '#9B8EFF', border: '1px solid #2E2B4A' }}
              >
                ДЕМО ДЛЯ ИНВЕСТОРОВ
              </span>
            </div>
            <h1
              className="text-4xl font-bold leading-tight tracking-tight"
              style={{ color: '#EEECEA' }}
            >
              Эмоционально безопасная
              <br />
              <span style={{ color: '#7B6EF6' }}>запись мыслей</span>
            </h1>
            <p className="text-base mt-3 leading-relaxed" style={{ color: '#888680' }}>
              Единственное приложение для продуктивности, которое спрашивает{' '}
              <em style={{ color: '#EEECEA' }}>«как ты себя чувствуешь?»</em> прежде чем спросить,
              что нужно сделать.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex-1 rounded-2xl p-3 text-center"
                style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
              >
                <p className="text-xl font-bold" style={{ color: '#7B6EF6' }}>
                  {s.value}
                </p>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: '#888680' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm"
                  style={{ background: '#1C1C21', border: '0.5px solid #2C2C32' }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#EEECEA' }}>
                    {f.label}
                  </p>
                  <p className="text-xs" style={{ color: '#888680' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2">
            <button
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{ background: '#7B6EF6' }}
            >
              Запросить ранний доступ →
            </button>
            <p className="text-[11px] text-center" style={{ color: '#4A4850' }}>
              Все данные в демо симулированы · Регистрация не нужна
            </p>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="relative flex-shrink-0" style={{ width: 375, height: 812 }}>
          {/* Device shadow */}
          <div
            className="absolute inset-0 rounded-[52px]"
            style={{
              boxShadow: '0 40px 120px rgba(123,110,246,0.25), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          />

          {/* Device frame */}
          <div
            className="absolute inset-0 rounded-[52px] overflow-hidden"
            style={{
              background: '#141417',
              border: '1px solid #2C2C32',
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
              style={{
                width: 120,
                height: 34,
                background: '#141417',
                borderRadius: '0 0 20px 20px',
              }}
            >
              <div
                className="absolute top-2.5 left-1/2 -translate-x-1/2 rounded-full"
                style={{ width: 10, height: 10, background: '#0A0A0D' }}
              />
            </div>

            {/* Side button glints */}
            <div
              className="absolute right-0 top-[140px] rounded-l-full"
              style={{ width: 3, height: 60, background: '#2C2C32' }}
            />
            <div
              className="absolute left-0 top-[120px] rounded-r-full"
              style={{ width: 3, height: 36, background: '#2C2C32' }}
            />
            <div
              className="absolute left-0 top-[170px] rounded-r-full"
              style={{ width: 3, height: 36, background: '#2C2C32' }}
            />
            <div
              className="absolute left-0 top-[220px] rounded-r-full"
              style={{ width: 3, height: 52, background: '#2C2C32' }}
            />

            {/* Screen content — Shell takes full space */}
            <div className="absolute inset-0 rounded-[52px] overflow-hidden flex flex-col">
              <Shell />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
