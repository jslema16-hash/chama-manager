'use client'

import { useState } from 'react'
import { updateSettings } from './actions'

export default function SettingsForm({ chama }: { chama: any }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    setLoading(true)
    const result = await updateSettings(formData, chama.id)
    setLoading(false)
    if (result?.error) setError(result.error)
    else setSuccess(true)
  }

  return (
    <form action={handleSubmit} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-4">
      <div>
        <label className="block text-sm text-neutral-300 mb-1">Chama name</label>
        <input name="name" defaultValue={chama.name} required
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Dividend splitting method</label>
        <select name="dividendMethod" defaultValue={chama.dividend_method}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm">
          <option value="contribution_only">By contribution amount only</option>
          <option value="contribution_plus_interest">By contribution + share of loan interest</option>
          <option value="equal">Equal split among all members</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Default loan interest rate (%)</label>
        <input name="defaultInterestRate" type="number" step="0.01" defaultValue={chama.default_interest_rate} required
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm" />
        <p className="text-neutral-600 text-xs mt-1">This pre-fills new loans, but admin can override it per loan.</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-emerald-400 text-sm">Saved.</p>}

      <button type="submit" disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium">
        {loading ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  )
}