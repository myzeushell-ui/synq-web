'use client';

const STORAGE_KEY = 'synq_notifications';

interface StoredNotif {
  id: string;
  title: string;
  body: string;
  dueAt: string; // ISO
}

// ─── Permission ───────────────────────────────────────────────────────────────

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermission(): NotificationPermission {
  if (!notificationsSupported()) return 'denied';
  return Notification.permission;
}

export async function requestPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function load(): StoredNotif[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(list: StoredNotif[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function scheduleNotification(id: string, title: string, body: string, dueAt: string): void {
  const delay = new Date(dueAt).getTime() - Date.now();
  if (delay <= 0) return; // already past

  // Persist so we can restore after reload
  const list = load().filter((n) => n.id !== id);
  list.push({ id, title, body, dueAt });
  save(list);

  // In-session timer
  setTimeout(() => {
    fire(id, title, body);
  }, delay);
}

function fire(id: string, title: string, body: string) {
  if (getPermission() !== 'granted') return;
  try {
    new Notification(`⏰  ${title}`, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: id,
      requireInteraction: false,
    });
  } catch (e) {
    console.warn('[notifications] fire failed', e);
  }
  // Remove from store
  save(load().filter((n) => n.id !== id));
}

export function cancelNotification(id: string): void {
  save(load().filter((n) => n.id !== id));
}

/** Call once on app boot — re-arms any reminders that survive a page reload */
export function restoreNotifications(): number {
  const now = Date.now();
  const valid = load().filter((n) => new Date(n.dueAt).getTime() > now);
  save(valid); // prune expired
  valid.forEach((n) => {
    const delay = new Date(n.dueAt).getTime() - now;
    setTimeout(() => fire(n.id, n.title, n.body), delay);
  });
  return valid.length;
}

/** Human-readable status string shown in UI */
export function permissionLabel(): string {
  const p = getPermission();
  if (p === 'granted') return 'Notifications on';
  if (p === 'denied') return 'Blocked by browser';
  return 'Tap to enable';
}
