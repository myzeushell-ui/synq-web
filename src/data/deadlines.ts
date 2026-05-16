// Deadline helper utilities for the demo

export function deadlineLabel(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const hours = diff / 3_600_000;
  if (diff < 0) {
    if (-hours < 24) return 'Still okay — want to try now?';
    if (-hours < 48) return 'You can reschedule.';
    return 'One tiny action is enough.';
  }
  if (hours < 1)  return 'Due very soon';
  if (hours < 24) return 'Due today';
  if (hours < 48) return 'Due tomorrow';
  const days = Math.floor(diff / 86_400_000);
  if (days < 7)   return `Due in ${days} days`;
  return `Due ${fmtDate(iso)}`;
}

export function deadlineColor(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0)          return '#E07B62'; // coral — overdue
  if (diff < 86_400_000) return '#E8B84B'; // amber — today
  return '#4A4850';                         // muted — future
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = diff / 60_000;
  if (mins < 1)    return 'just now';
  if (mins < 60)   return `${Math.floor(mins)}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  const days = Math.floor(mins / 1440);
  if (days === 1)  return 'yesterday';
  return `${days}d ago`;
}
