'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateSettings(formData: FormData, chamaId: string) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const dividendMethod = formData.get('dividendMethod') as string
  const defaultInterestRate = Number(formData.get('defaultInterestRate'))

  if (!name.trim()) return { error: 'Chama name cannot be empty' }
  if (!Number.isFinite(defaultInterestRate) || defaultInterestRate < 0) {
    return { error: 'Enter a valid interest rate' }
  }

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

  const { error } = await supabase
    .from('chamas')
    .update({ name, dividend_method: dividendMethod, default_interest_rate: defaultInterestRate })
    .eq('id', chamaId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}