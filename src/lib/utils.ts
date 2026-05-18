import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Ещё не спите?';
  if (h < 12) return 'Доброе утро';
  if (h < 17) return 'Добрый день';
  if (h < 21) return 'Добрый вечер';
  return 'Доброй ночи';
}

export const PALETTE = {
  bg: '#0A0A0D',
  surface: '#141417',
  surf2: '#1C1C21',
  surf3: '#242428',
  border: '#2C2C32',
  text: '#EEECEA',
  text2: '#888680',
  text3: '#4A4850',
  purple: '#7B6EF6',
  purpleD: '#1E1A3A',
  purpleB: '#2E2B4A',
  coral: '#E07B62',
  coralD: '#2A1510',
  coralB: '#3A2020',
  green: '#4ECBA0',
  greenD: '#0A2820',
  amber: '#E8B84B',
  amberD: '#261E0A',
  amberB: '#3A2E10',
  blue: '#5BA4F5',
  blueD: '#0A1828',
  blueB: '#102040',
} as const;
