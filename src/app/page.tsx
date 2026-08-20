export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Chama Manager</h1>
          <p className="text-neutral-400">Choose how you'd like to continue</p>
        </div>

        <div className="space-y-3">
          <a href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-3 font-medium">
            Login as Admin
          </a>
          <a href="/login" className="block w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 font-medium">
            Login as Member
          </a>
          <a href="/signup" className="block w-full border border-neutral-700 hover:border-neutral-500 text-white rounded-lg py-3 font-medium">
            Sign up a new chama
          </a>
        </div>
      </div>
    </div>
  )
}