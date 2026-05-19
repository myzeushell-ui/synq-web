'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Reminder } from '@/types'

export function useReminders(userId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/reminders')
      if (res.ok) setReminders(await res.json())
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refetch() }, [refetch])

  const add = async (r: Omit<Reminder, 'id' | 'done'>) => {
    const res = await fetch('/api/reminders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
    if (res.ok) { const saved = await res.json(); setReminders(p => [...p, saved]) }
  }

  const toggle = async (id: string, done: boolean) => {
    await fetch(`/api/reminders?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done }) })
    setReminders(p => p.map(r => r.id === id ? { ...r, done } : r))
  }

  const remove = async (id: string) => {
    await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' })
    setReminders(p => p.filter(r => r.id !== id))
  }

  return { reminders, loading, add, toggle, remove, refetch }
}
