'use client'

import { useState } from 'react'
import { addLoan } from './actions'

export default function AddLoanForm({
  chamaId, defaultRate, members
}: { chamaId: string; defaultRate: number; members: { id: string; full_name: string }[] }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await addLoan(formData, chamaId)
    setLoading(false)
    if (result?.error) setError(result.error)
    else (document.getElementById('add-loan-form') as HTMLFormElement)?.reset()
  }

  return (
    <form id="add-loan-form" action={handleSubmit} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-3">
      <h2 className="text-sm font-medium">Give a loan</h2>
      <select name="memberId" required className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm">
        <option value="">Select member</option>
        {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input name="amount" type="number" step="0.01" placeholder="Amount (KES)" required
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
        <input name="interestRate" type="number" step="0.01" defaultValue={defaultRate} placeholder="Interest %"
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium">
        {loading ? 'Adding...' : 'Add loan'}
      </button>
    </form>
  )
}