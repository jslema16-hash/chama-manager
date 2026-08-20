import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '../actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, chamas(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const chama = profile.chamas

  // Fetch summary stats
  const { data: members } = await supabase
    .from('members')
    .select('id')
    .eq('chama_id', chama.id)

  const { data: contributions } = await supabase
    .from('contributions')
    .select('amount')
    .eq('chama_id', chama.id)

  const { data: loans } = await supabase
    .from('loans')
    .select('amount, status')
    .eq('chama_id', chama.id)

  const totalContributions = contributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
  const activeLoans = loans?.filter(l => l.status === 'active').length || 0
  const totalLoaned = loans?.reduce((sum, l) => sum + Number(l.amount), 0) || 0

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">{chama.name}</h1>
          <p className="text-neutral-400 text-sm">Welcome, {profile.full_name}</p>
        </div>
        <form action={signOut}>
          <button className="text-neutral-400 hover:text-white text-sm">Sign out</button>
        </form>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-neutral-400 text-sm">Total Contributions</p>
            <p className="text-2xl font-semibold mt-1">KES {totalContributions.toLocaleString()}</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-neutral-400 text-sm">Members</p>
            <p className="text-2xl font-semibold mt-1">{members?.length || 0}</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-neutral-400 text-sm">Active Loans</p>
            <p className="text-2xl font-semibold mt-1">{activeLoans}</p>
            <p className="text-neutral-500 text-xs mt-1">KES {totalLoaned.toLocaleString()} loaned total</p>
          </div>
        </div>

        <div className="flex gap-3">
          <a href="/dashboard/members" className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 text-sm font-medium">
            Manage Members
          </a>
          <a href="/dashboard/loans" className="bg-neutral-800 hover:bg-neutral-700 rounded-lg px-4 py-2 text-sm font-medium">
            Manage Loans
          </a>
          <a href="/dashboard/settings" className="bg-neutral-800 hover:bg-neutral-700 rounded-lg px-4 py-2 text-sm font-medium">
            Settings
          </a>
        </div>
      </main>
    </div>
  )
}