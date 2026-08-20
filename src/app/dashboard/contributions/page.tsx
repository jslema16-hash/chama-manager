import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddContributionForm from './add-contribution-form'

export default async function ContributionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, chama_id')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: members } = await supabase
    .from('members')
    .select('id, full_name')
    .eq('chama_id', profile.chama_id)
    .order('full_name')

  const { data: contributions } = await supabase
    .from('contributions')
    .select('*, members(full_name)')
    .eq('chama_id', profile.chama_id)
    .order('week_date', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <a href="/dashboard" className="text-neutral-400 hover:text-white text-sm">← Back to dashboard</a>
        <h1 className="text-lg font-semibold mt-2">Weekly Contributions</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <AddContributionForm chamaId={profile.chama_id} members={members || []} />

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-400">Recent entries</h2>
          {contributions?.map((c) => (
            <div key={c.id} className="bg-neutral-900 rounded-lg p-3 border border-neutral-800 flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{c.members?.full_name}</p>
                <p className="text-neutral-500 text-xs">{c.week_date}</p>
              </div>
              <p className="font-medium">KES {Number(c.amount).toLocaleString()}</p>
            </div>
          ))}
          {contributions?.length === 0 && <p className="text-neutral-500 text-sm">No contributions recorded yet.</p>}
        </div>
      </main>
    </div>
  )
}