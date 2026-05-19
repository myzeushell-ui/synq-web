'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Thought } from '@/types'

export function useThoughts(userId?: string) {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/thoughts')
      if (res.ok) setThoughts(await res.json())
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refetch() }, [refetch])

  const add = async (t: Omit<Thought, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/thoughts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) })
    if (res.ok) { const saved = await res.json(); setThoughts(p => [saved, ...p]) }
  }

  const update = async (id: string, patch: Partial<Thought>) => {
    await fetch(`/api/thoughts?id=${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    setThoughts(p => p.map(t => t.id === id ? { ...t, ...patch } : t))
  }

  const remove = async (id: string) => {
    await fetch(`/api/thoughts?id=${id}`, { method: 'DELETE' })
    setThoughts(p => p.filter(t => t.id !== id))
  }

  return { thoughts, loading, add, update, remove, refetch }
}
