import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, chamas(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <a href="/dashboard" className="text-neutral-400 hover:text-white text-sm">← Back to dashboard</a>
        <h1 className="text-lg font-semibold mt-2">Chama Settings</h1>
      </header>
      <main className="p-6 max-w-md mx-auto">
        <SettingsForm chama={profile.chamas} />
      </main>
    </div>
  )
}