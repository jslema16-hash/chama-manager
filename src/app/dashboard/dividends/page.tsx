import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DividendsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*, chamas(*)').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const chama = profile.chamas

  const { data: members } = await supabase.from('members').select('id, full_name').eq('chama_id', chama.id)
  const { data: contributions } = await supabase.from('contributions').select('member_id, amount').eq('chama_id', chama.id)
  const { data: loans } = await supabase.from('loans').select('amount_repaid').eq('chama_id', chama.id)

  const contribByMember = new Map()
  for (const c of contributions || []) {
    contribByMember.set(c.member_id, (contribByMember.get(c.member_id) || 0) + Number(c.amount))
  }
  const totalContributions = [...contribByMember.values()].reduce((a, b) => a + b, 0)
  const totalInterestCollected = (loans || []).reduce((sum, l) => sum + Number(l.amount_repaid), 0)

  const method = chama.dividend_method
  const dividendPool = method === 'contribution_plus_interest' ? totalContributions + totalInterestCollected : totalContributions
  const memberCount = members?.length || 0

  const rows = (members || []).map((m) => {
    const contributed = contribByMember.get(m.id) || 0
    let share = 0
    if (method === 'equal') {
      share = memberCount > 0 ? dividendPool / memberCount : 0
    } else {
      share = totalContributions > 0 ? (contributed / totalContributions) * dividendPool : 0
    }
    return { ...m, contributed, share }
  })

  const methodLabel = method === 'contribution_only' ? 'By contribution amount' : method === 'contribution_plus_interest' ? 'By contribution + interest share' : 'Equal split'

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <a href="/dashboard" className="text-neutral-400 hover:text-white text-sm">Back to dashboard</a>
        <h1 className="text-lg font-semibold mt-2">Dividends</h1>
        <p className="text-neutral-500 text-sm">Method: {methodLabel}</p>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-neutral-400 text-sm">Total Pool</p>
            <p className="text-2xl font-semibold mt-1">KES {dividendPool.toLocaleString()}</p>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-neutral-400 text-sm">Interest Collected</p>
            <p className="text-2xl font-semibold mt-1">KES {totalInterestCollected.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-400">Member breakdown</h2>
          {rows.map((r) => (
            <div key={r.id} className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 flex justify-between items-center">
              <div>
                <p className="font-medium">{r.full_name}</p>
                <p className="text-neutral-500 text-xs">Contributed: KES {r.contributed.toLocaleString()}</p>
              </div>
              <p className="font-semibold text-emerald-400">KES {r.share.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          ))}
          {rows.length === 0 && <p className="text-neutral-500 text-sm">No members yet.</p>}
        </div>
      </main>
    </div>
  )
}
