import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddLoanForm from './add-loan-form'

export default async function LoansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, chamas(*)')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { data: members } = await supabase
    .from('members')
    .select('id, full_name')
    .eq('chama_id', profile.chama_id)
    .order('full_name')

  const { data: loans } = await supabase
    .from('loans')
    .select('*, members(full_name)')
    .eq('chama_id', profile.chama_id)
    .order('date_given', { ascending: false })

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <a href="/dashboard" className="text-neutral-400 hover:text-white text-sm">← Back to dashboard</a>
        <h1 className="text-lg font-semibold mt-2">Manage Loans</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <AddLoanForm
          chamaId={profile.chama_id}
          defaultRate={profile.chamas.default_interest_rate}
          members={members || []}
        />

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-400">{loans?.length || 0} Loan(s)</h2>
          {loans?.map((l) => (
            <div key={l.id} className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{l.members?.full_name || l.borrower_name}</p>
                  <p className="text-neutral-500 text-sm">
                    KES {Number(l.amount).toLocaleString()} at {l.interest_rate}% interest ({l.interest_period})
                  </p>
                  <p className="text-neutral-500 text-xs">Repaid: KES {Number(l.amount_repaid).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${l.status === 'active' ? 'bg-amber-900 text-amber-300' : 'bg-emerald-900 text-emerald-300'}`}>
                  {l.status}
                </span>
              </div>
            </div>
          ))}
          {loans?.length === 0 && <p className="text-neutral-500 text-sm">No loans yet.</p>}
        </div>
      </main>
    </div>
  )
}