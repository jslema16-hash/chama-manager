'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  const newPassword = formData.get('newPassword') as string
  if (!newPassword || newPassword.length < 6) return { error: 'Password must be at least 6 characters' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error: pwError } = await supabase.auth.updateUser({ password: newPassword })
  if (pwError) return { error: pwError.message }

  await supabase.from('profiles').update({ must_change_password: false }).eq('id', user.id)
  revalidatePath('/member')
  redirect('/member')
}
