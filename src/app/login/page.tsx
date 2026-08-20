'use client'
import { useState } from 'react'
import { login } from '../actions'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    await login(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-1">Chama Manager</h1>
        <p className="text-neutral-400 mb-8">Sign in with your email</p>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Email</label>
            <input name="email" type="email" required placeholder="you@gmail.com"
              className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white" />
            <p className="text-neutral-600 text-xs mt-1">A Gmail address works great here.</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Password</label>
            <div className="relative">
              <input name="password" type={show ? 'text' : 'password'} required
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 text-white pr-16" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-2 top-2 text-xs text-neutral-400 hover:text-white">
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 font-medium">
            Sign in
          </button>
        </form>
        <p className="text-neutral-500 text-sm mt-6 text-center">
          Setting up a new chama? <a href="/signup" className="text-emerald-400 hover:underline">Create one here</a>
        </p>
      </div>
    </div>
  )
}