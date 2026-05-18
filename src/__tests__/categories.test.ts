import { getCategoryMeta } from '@/data/categories';

describe('getCategoryMeta', () => {
  it('returns correct meta for task', () => {
    const m = getCategoryMeta('task');
    expect(m.label).toBe('Задача');
    expect(m.color).toBeTruthy();
    expect(m.icon).toBeTruthy();
  });

  it('returns correct meta for idea', () => {
    const m = getCategoryMeta('idea');
    expect(m.label).toBe('Идея');
  });

  it('returns correct meta for emotion', () => {
    const m = getCategoryMeta('emotion');
    expect(m.label).toBe('Чувство');
  });

  it('returns correct meta for note', () => {
    const m = getCategoryMeta('note');
    expect(m.label).toBe('Заметка');
  });

  it('all categories have bg, border, color, icon, label', () => {
    for (const cat of ['task', 'idea', 'emotion', 'note'] as const) {
      const m = getCategoryMeta(cat);
      expect(m.bg).toBeTruthy();
      expect(m.border).toBeTruthy();
      expect(m.color).toBeTruthy();
      expect(m.icon).toBeTruthy();
      expect(m.label).toBeTruthy();
    }
  });
});
