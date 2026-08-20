'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function generateTempPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  const rest = 'abcdefghjkmnpqrstuvwxyz23456789'
  let pw = upper[Math.floor(Math.random() * upper.length)] + digits[Math.floor(Math.random() * digits.length)]
  for (let i = 0; i < 6; i++) pw += rest[Math.floor(Math.random() * rest.length)]
  return pw
}

export async function addMember(formData: FormData, chamaId: string) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const fullName = formData.get('fullName') as string
  const idNumber = formData.get('idNumber') as string
  const email = formData.get('email') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, chama_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin' || profile.chama_id !== chamaId) {
    return { error: 'Not authorized' }
  }

  const tempPassword = generateTempPassword()

  const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  })

  if (authError || !newUser.user) {
    return { error: authError?.message || 'Could not create member login' }
  }

  const { error: profileError } = await adminClient.from('profiles').insert({
    id: newUser.user.id,
    chama_id: chamaId,
    role: 'member',
    full_name: fullName,
    must_change_password: true,
  })

  if (profileError) {
    return { error: profileError.message }
  }

  const { error: memberError } = await supabase.from('members').insert({
    chama_id: chamaId,
    profile_id: newUser.user.id,
    full_name: fullName,
    id_number: idNumber,
  })

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/dashboard/members')
  return { success: true, tempPassword, email }
}