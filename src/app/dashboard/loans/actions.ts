'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addLoan(formData: FormData, chamaId: string) {
  const supabase = await createClient()

  const memberId = formData.get('memberId') as string
  const amount = formData.get('amount') as string
  const interestRate = formData.get('interestRate') as string

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

  const { error } = await supabase.from('loans').insert({
    chama_id: chamaId,
    member_id: memberId,
    amount: Number(amount),
    interest_rate: Number(interestRate),
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/loans')
  return { success: true }
}