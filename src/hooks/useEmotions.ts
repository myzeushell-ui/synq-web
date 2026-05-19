'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Emotion } from '@/types'

export function useEmotions(userId?: string) {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/emotions')
      if (res.ok) setEmotions(await res.json())
    } finally { setLoading(false) }
  }, [userId])

  useEffect(() => { refetch() }, [refetch])

  const add = async (e: Omit<Emotion, 'id' | 'loggedAt'>) => {
    const res = await fetch('/api/emotions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(e) })
    if (res.ok) { const saved = await res.json(); setEmotions(p => [saved, ...p]) }
  }

  return { emotions, loading, add, refetch }
}
