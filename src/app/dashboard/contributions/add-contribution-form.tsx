'use client'

import { useState } from 'react'
import { addContribution } from './actions'

function thisWeekMonday() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff)).toISOString().split('T')[0]
}

export default function AddContributionForm({
  chamaId, members
}: { chamaId: string; members: { id: string; full_name: string }[] }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await addContribution(formData, chamaId)
    setLoading(false)
    if (result?.error) setError(result.error)
    else (document.getElementById('add-contribution-form') as HTMLFormElement)?.reset()
  }

  return (
    <form id="add-contribution-form" action={handleSubmit} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-3">
      <h2 className="text-sm font-medium">Record a contribution</h2>
      <div className="grid grid-cols-3 gap-3">
        <select name="memberId" required className="col-span-1 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm">
          <option value="">Member</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
        </select>
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount (KES)" required
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
        <input name="weekDate" type="date" defaultValue={thisWeekMonday()} required
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium">
        {loading ? 'Saving...' : 'Save contribution'}
      </button>
      <p className="text-neutral-600 text-xs">Re-submitting the same member + week updates the existing entry instead of duplicating it.</p>
    </form>
  )
}