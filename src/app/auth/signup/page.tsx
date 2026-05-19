'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setDone(true); setTimeout(() => router.push('/app'), 1500) }
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0D' }}>
      <div className="text-center">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-lg font-semibold" style={{ color: '#EEECEA' }}>Account created!</p>
        <p className="text-sm mt-1" style={{ color: '#888680' }}>Taking you to Synq…</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-5"
      style={{ background: '#0A0A0D' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-2xl mb-3"
            style={{ background: '#7B6EF6' }}>S</div>
          <h1 className="text-2xl font-bold" style={{ color: '#EEECEA' }}>Create account</h1>
          <p className="text-sm mt-1" style={{ color: '#888680' }}>Start capturing your thoughts</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input type="text" placeholder="Your name" value={name}
            onChange={e => setName(e.target.value)} required
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }} />
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }} />
          <input type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#141417', border: '0.5px solid #2C2C32', color: '#EEECEA' }} />
          {error && <p className="text-xs px-1" style={{ color: '#E07B62' }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white mt-1"
            style={{ background: loading ? '#4A4068' : '#7B6EF6', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#4A4850' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#7B6EF6' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
