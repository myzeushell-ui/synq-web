import { deadlineLabel, deadlineColor, fmtDate, fmtTime, timeAgo } from '@/data/deadlines';

const now = Date.now();
const h = (n: number) => new Date(now + n * 3_600_000).toISOString();
const d = (n: number) => new Date(now + n * 86_400_000).toISOString();

describe('deadlineLabel', () => {
  it('returns "Due very soon" for < 1h in future', () => {
    expect(deadlineLabel(h(0.5))).toBe('Due very soon');
  });

  it('returns "Due today" for 1–24h in future', () => {
    expect(deadlineLabel(h(12))).toBe('Due today');
  });

  it('returns "Due tomorrow" for 24–48h in future', () => {
    expect(deadlineLabel(h(36))).toBe('Due tomorrow');
  });

  it('returns "Due in N days" for 2–7 days', () => {
    // Add 5 days to be safely past the 48h "tomorrow" boundary with time drift
    expect(deadlineLabel(d(5))).toMatch(/^Due in \d+ days$/);
  });

  it('returns supportive message for < 24h overdue', () => {
    expect(deadlineLabel(h(-12))).toBe('Still okay — want to try now?');
  });

  it('returns reschedule message for 24–48h overdue', () => {
    expect(deadlineLabel(h(-36))).toBe('You can reschedule.');
  });

  it('returns gentle message for > 48h overdue', () => {
    expect(deadlineLabel(h(-72))).toBe('One tiny action is enough.');
  });
});

describe('deadlineColor', () => {
  it('returns coral for overdue', () => {
    expect(deadlineColor(h(-1))).toBe('#E07B62');
  });

  it('returns amber for due today (< 24h)', () => {
    expect(deadlineColor(h(12))).toBe('#E8B84B');
  });

  it('returns muted for future (> 24h)', () => {
    expect(deadlineColor(d(3))).toBe('#4A4850');
  });
});

describe('fmtDate', () => {
  it('formats a known date correctly', () => {
    const iso = new Date(2025, 0, 15).toISOString(); // Jan 15
    expect(fmtDate(iso)).toBe('15 Jan');
  });
});

describe('fmtTime', () => {
  it('pads hours and minutes', () => {
    const d = new Date(2025, 5, 1, 9, 5, 0);
    expect(fmtTime(d.toISOString())).toBe('09:05');
  });
});

describe('timeAgo', () => {
  it('returns "just now" for < 1 min', () => {
    expect(timeAgo(new Date(now - 30_000).toISOString())).toBe('just now');
  });

  it('returns minutes ago', () => {
    expect(timeAgo(new Date(now - 5 * 60_000).toISOString())).toBe('5m ago');
  });

  it('returns hours ago', () => {
    expect(timeAgo(new Date(now - 3 * 3_600_000).toISOString())).toBe('3h ago');
  });

  it('returns "yesterday" for ~24h ago', () => {
    expect(timeAgo(new Date(now - 25 * 3_600_000).toISOString())).toBe('yesterday');
  });

  it('returns days ago', () => {
    expect(timeAgo(new Date(now - 3 * 86_400_000).toISOString())).toBe('3d ago');
  });
});
