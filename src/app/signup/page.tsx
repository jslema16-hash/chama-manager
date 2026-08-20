'use client'

import { useState } from 'react'
import { signUp } from '../actions'

export default function SignupPage() {
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await signUp(formData)
    } catch {
      // redirect() throws internally on success — ignore
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-1">Create your chama</h1>
        <p className="text-neutral-400 mb-8">Set up your group as the admin</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Chama name</label>
            <input
              name="chamaName"
              type="text"
              required
              placeholder="e.g. Umoja Investment Group"
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Your full name</label>
            <input
              name="fullName"
              type="text"
              required
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@gmail.com"
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={show ? 'text' : 'password'}
                required
                minLength={6}
                pattern="(?=.*[A-Z])(?=.*[0-9]).{6,}"
                title="At least 6 characters, one uppercase letter, one number"
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white pr-16 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-white"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-neutral-600 text-xs mt-1">At least 6 characters, one uppercase letter, one number.</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 font-medium transition"
          >
            Create chama
          </button>
        </form>

        <p className="text-neutral-500 text-sm mt-6 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}