'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=' + encodeURIComponent(error.message))

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()

  revalidatePath('/', 'layout')
  redirect(profile?.role === 'admin' ? '/dashboard' : '/member')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const chamaName = formData.get('chamaName') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
  if (authError || !authData.user) redirect('/signup?error=' + encodeURIComponent(authError?.message || 'Signup failed'))

  const { data: chama, error: chamaError } = await supabase
    .from('chamas').insert({ name: chamaName, created_by: authData.user!.id }).select().single()
  if (chamaError || !chama) redirect('/signup?error=' + encodeURIComponent(chamaError?.message || 'Could not create chama'))

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user!.id, chama_id: chama!.id, role: 'admin', full_name: fullName,
  })
  if (profileError) redirect('/signup?error=' + encodeURIComponent(profileError.message))

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}