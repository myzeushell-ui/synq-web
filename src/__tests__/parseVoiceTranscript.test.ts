import { parseVoiceTranscript, parseTimeFromClause } from '@/lib/parseVoiceTranscript';

// ─── parseTimeFromClause ──────────────────────────────────────────────────────

describe('parseTimeFromClause', () => {
  it('parses "в 5 часов" as 17:00 today (PM assumption for 1-6)', () => {
    const iso = parseTimeFromClause('позвонить маме в 5 часов');
    expect(iso).not.toBeNull();
    const d = new Date(iso!);
    expect(d.getHours()).toBe(17);
    expect(d.getMinutes()).toBe(0);
  });

  it('parses "в 9 утра" as 09:00 (AM)', () => {
    const iso = parseTimeFromClause('встреча в 9 утра');
    expect(iso).not.toBeNull();
    const d = new Date(iso!);
    expect(d.getHours()).toBe(9);
  });

  it('parses "в 21:30" as 21:30', () => {
    const iso = parseTimeFromClause('позвонить в 21:30');
    expect(iso).not.toBeNull();
    const d = new Date(iso!);
    expect(d.getHours()).toBe(21);
    expect(d.getMinutes()).toBe(30);
  });

  it('parses "tomorrow at 9" with +1 day offset', () => {
    const iso = parseTimeFromClause('call Mom tomorrow at 9');
    expect(iso).not.toBeNull();
    const due = new Date(iso!);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(due.getDate()).toBe(tomorrow.getDate());
    expect(due.getHours()).toBe(9);
  });

  it('returns null when no time reference', () => {
    expect(parseTimeFromClause('купить хлеб')).toBeNull();
    expect(parseTimeFromClause('позвонить маме')).toBeNull();
  });
});

// ─── parseVoiceTranscript ─────────────────────────────────────────────────────

describe('parseVoiceTranscript — Russian scenario', () => {
  const text =
    'Блин, я сейчас плохо себя чувствую, но мне нужно сходить за хлебом, ' +
    'составить отчёт, нужно позвонить маме сегодня в 5 часов';

  let result: ReturnType<typeof parseVoiceTranscript>;
  beforeAll(() => {
    result = parseVoiceTranscript(text);
  });

  it('detects an emotion (feeling bad)', () => {
    expect(result.emotions.length).toBeGreaterThanOrEqual(1);
    expect(result.emotions[0].mood).toBe('sad');
  });

  it('extracts at least one task thought', () => {
    expect(result.thoughts.length).toBeGreaterThanOrEqual(1);
  });

  it('creates a reminder for "позвонить маме сегодня в 5 часов"', () => {
    expect(result.reminders.length).toBeGreaterThanOrEqual(1);
    const r = result.reminders[0];
    expect(r.title.toLowerCase()).toContain('позвонить');
    const d = new Date(r.dueAt);
    expect(d.getHours()).toBe(17); // 5 → 17 PM
  });
});

describe('parseVoiceTranscript — English scenario', () => {
  const text =
    'I am feeling anxious today. ' +
    'Need to buy groceries, finish the report, ' +
    'and call Mom today at 5pm.';

  let result: ReturnType<typeof parseVoiceTranscript>;
  beforeAll(() => {
    result = parseVoiceTranscript(text);
  });

  it('detects anxiety emotion', () => {
    expect(result.emotions.length).toBeGreaterThanOrEqual(1);
    expect(result.emotions[0].mood).toBe('anxious');
  });

  it('extracts task thoughts', () => {
    expect(result.thoughts.length).toBeGreaterThanOrEqual(1);
  });

  it('creates reminder for "call Mom at 5pm"', () => {
    expect(result.reminders.length).toBeGreaterThanOrEqual(1);
    const d = new Date(result.reminders[0].dueAt);
    expect(d.getHours()).toBe(17);
  });
});
