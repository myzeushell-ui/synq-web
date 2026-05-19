import { Shell } from '@/components/layout/Shell'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  return (
    <div className="h-[100dvh] flex flex-col">
      <Shell
        userId={user.id}
        userName={user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'You'}
      />
    </div>
  )
}
