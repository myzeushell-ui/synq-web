import type { Category } from '@/types';

export interface CategoryMeta {
  id: Category;
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'task',
    label: 'Задача',
    icon: '✓',
    color: '#7B6EF6',
    bg: '#1E1A3A',
    border: '#2E2B4A',
    description: 'То, что нужно сделать',
  },
  {
    id: 'idea',
    label: 'Идея',
    icon: '💡',
    color: '#E8B84B',
    bg: '#261E0A',
    border: '#3A2E10',
    description: 'Искры, которые стоит сохранить',
  },
  {
    id: 'emotion',
    label: 'Чувство',
    icon: '♡',
    color: '#E07B62',
    bg: '#2A1510',
    border: '#3A2020',
    description: 'Как вы себя чувствуете',
  },
  {
    id: 'note',
    label: 'Заметка',
    icon: '📝',
    color: '#5BA4F5',
    bg: '#0A1828',
    border: '#102040',
    description: 'Всё остальное',
  },
];

export const getCategoryMeta = (id: Category): CategoryMeta =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
