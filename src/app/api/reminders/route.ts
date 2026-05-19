import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', user.id)
    .order('due_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const mapped = (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id, title: r.title, description: r.description, dueAt: r.due_at,
    category: r.category, done: r.done, repeat: r.repeat,
  }))
  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase
    .from('reminders')
    .insert({ user_id: user.id, title: body.title, description: body.description ?? null, due_at: body.dueAt, category: body.category ?? 'task', done: false, repeat: body.repeat ?? 'none' })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const r = data as Record<string, unknown>
  return NextResponse.json({ id: r.id, title: r.title, description: r.description, dueAt: r.due_at, category: r.category, done: r.done, repeat: r.repeat })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const body = await request.json()
  const patch: Record<string, unknown> = {}
  if (body.done !== undefined) patch.done = body.done
  if (body.title !== undefined) patch.title = body.title
  const { error } = await supabase.from('reminders').update(patch).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const { error } = await supabase.from('reminders').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
