import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '../actions'
import ChangePasswordForm from './change-password-form'

export default async function MemberPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'member') redirect('/dashboard')

  const { data: member } = await supabase.from('members').select('*').eq('profile_id', user.id).single()

  const { data: contributions } = await supabase
    .from('contributions').select('amount, week_date').eq('member_id', member?.id).order('week_date', { ascending: false })

  const { data: loans } = await supabase
    .from('loans').select('*').eq('member_id', member?.id)

  const totalContributed = contributions?.reduce((s, c) => s + Number(c.amount), 0) || 0

  if (profile.must_change_password) {
    return <ChangePasswordForm />
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Welcome, {profile.full_name}</h1>
        <form action={signOut}><button className="text-neutral-400 hover:text-white text-sm">Sign out</button></form>
      </header>
      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
          <p className="text-neutral-400 text-sm">Your Total Contributions</p>
          <p className="text-2xl font-semibold mt-1">KES {totalContributed.toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">Your Contribution History</h2>
          {contributions?.map((c, i) => (
            <div key={i} className="bg-neutral-900 rounded-lg p-3 border border-neutral-800 flex justify-between mb-2">
              <span className="text-sm">{c.week_date}</span>
              <span className="font-medium">KES {Number(c.amount).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-sm font-medium text-neutral-400 mb-2">Your Loans</h2>
          {loans?.map((l) => (
            <div key={l.id} className="bg-neutral-900 rounded-lg p-3 border border-neutral-800 mb-2">
              <p className="text-sm">KES {Number(l.amount).toLocaleString()} at {l.interest_rate}% ({l.interest_period})</p>
              <p className="text-neutral-500 text-xs">Repaid: KES {Number(l.amount_repaid).toLocaleString()} — {l.status}</p>
            </div>
          ))}
          {loans?.length === 0 && <p className="text-neutral-500 text-sm">No loans.</p>}
        </div>
      </main>
    </div>
  )
}