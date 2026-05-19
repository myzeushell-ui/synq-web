'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/app'); router.refresh() }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5"
      style={{ background: '#0A0A0D' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-2xl mb-3"
            style={{ background: '#7B6EF6' }}>S</div>
          <h1 className="text-2xl font-bold" style={{ color: '#EEECEA' }}>Welcome back</h1>
          <p className="text-sm mt-1" style={{ color: '#888680' }}>Sign in to your Synq account</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }}
          />
          {error && <p className="text-xs px-1" style={{ color: '#E07B62' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white mt-1"
            style={{ background: loading ? '#4A4068' : '#7B6EF6', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#4A4850' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: '#7B6EF6' }}>Create one</Link>
        </p>
        <p className="text-center text-xs mt-2" style={{ color: '#4A4850' }}>
          <Link href="/" style={{ color: '#4A4850' }}>← Try demo without account</Link>
        </p>
      </div>
    </div>
  )
}
