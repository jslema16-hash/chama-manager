'use client'

import { useState } from 'react'
import { addMember } from './actions'

export default function AddMemberForm({ chamaId }: { chamaId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(null)
    setLoading(true)
    const result = await addMember(formData, chamaId)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(`Member added. Temp password: ${result.tempPassword} — share this with them securely.`)
      const form = document.getElementById('add-member-form') as HTMLFormElement
      form?.reset()
    }
  }

  return (
    <form id="add-member-form" action={handleSubmit} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 space-y-3">
      <h2 className="text-sm font-medium">Add a member</h2>
      <div className="grid grid-cols-2 gap-3">
        <input
          name="fullName"
          placeholder="Full name"
          required
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Member's Gmail"
          required
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
        <input
          name="idNumber"
          placeholder="ID number"
          required
          className="col-span-2 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {success && <p className="text-emerald-400 text-sm">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium"
      >
        {loading ? 'Adding...' : 'Add member'}
      </button>
    </form>
  )
}