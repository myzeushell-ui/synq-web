import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase
    .from('thoughts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Map snake_case to camelCase
  const mapped = (data ?? []).map((t: Record<string, unknown>) => ({
    id: t.id,
    text: t.text,
    category: t.category,
    state: t.state,
    priority: t.priority,
    createdAt: t.created_at,
    deadline: t.deadline,
    reminderAt: t.reminder_at,
    tags: t.tags,
  }))
  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase
    .from('thoughts')
    .insert({
      user_id: user.id,
      text: body.text,
      category: body.category ?? 'task',
      state: body.state ?? 'active',
      priority: body.priority ?? 'normal',
      deadline: body.deadline ?? null,
      reminder_at: body.reminderAt ?? null,
      tags: body.tags ?? null,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const t = data as Record<string, unknown>
  return NextResponse.json({ id: t.id, text: t.text, category: t.category, state: t.state, priority: t.priority, createdAt: t.created_at, deadline: t.deadline, reminderAt: t.reminder_at, tags: t.tags })
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
  if (body.state !== undefined) patch.state = body.state
  if (body.priority !== undefined) patch.priority = body.priority
  if (body.text !== undefined) patch.text = body.text
  if (body.deadline !== undefined) patch.deadline = body.deadline
  const { error } = await supabase.from('thoughts').update(patch).eq('id', id).eq('user_id', user.id)
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
  const { error } = await supabase.from('thoughts').delete().eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
