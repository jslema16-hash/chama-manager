'use client'
import { useState } from 'react'
import { changePassword } from './actions'

export default function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  async function handleSubmit(formData: FormData) {
    const result = await changePassword(formData)
    if (result?.error) setError(result.error)
  }
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <form action={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <p className="text-neutral-400 text-sm">For your security, please set your own password.</p>
        <input name="newPassword" type="password" minLength={6} required placeholder="New password" className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-lg py-2 font-medium">Set password</button>
      </form>
    </div>
  )
}
