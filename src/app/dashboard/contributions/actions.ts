'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addContribution(formData: FormData, chamaId: string) {
  const supabase = await createClient()

  const memberId = formData.get('memberId') as string
  const amountRaw = formData.get('amount') as string
  const weekDate = formData.get('weekDate') as string

  const amount = Number(amountRaw)
  if (!memberId) return { error: 'Select a member' }
  if (!Number.isFinite(amount) || amount <= 0) return { error: 'Enter a valid amount greater than 0' }
  if (!weekDate) return { error: 'Select a week date' }

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

  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('id', memberId)
    .eq('chama_id', chamaId)
    .single()

  if (!member) return { error: 'Member not found in this chama' }

  const { error } = await supabase
    .from('contributions')
    .upsert(
      { chama_id: chamaId, member_id: memberId, amount, week_date: weekDate },
      { onConflict: 'member_id,week_date' }
    )

  if (error) return { error: error.message }

  revalidatePath('/dashboard/contributions')
  return { success: true }
}