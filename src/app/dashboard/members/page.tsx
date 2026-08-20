import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AddMemberForm from './add-member-form'

export default async function MembersPage() {
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
    .select('*')
    .eq('chama_id', profile.chama_id)
    .order('joined_at', { ascending: false })

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4">
        <a href="/dashboard" className="text-neutral-400 hover:text-white text-sm">← Back to dashboard</a>
        <h1 className="text-lg font-semibold mt-2">Manage Members</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <AddMemberForm chamaId={profile.chama_id} />

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-neutral-400">
            {members?.length || 0} Member{members?.length === 1 ? '' : 's'}
          </h2>
          {members?.map((m) => (
            <div key={m.id} className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 flex justify-between items-center">
              <div>
                <p className="font-medium">{m.full_name}</p>
                <p className="text-neutral-500 text-sm">ID: {m.id_number}</p>
              </div>
            </div>
          ))}
          {members?.length === 0 && (
            <p className="text-neutral-500 text-sm">No members yet. Add the first one above.</p>
          )}
        </div>
      </main>
    </div>
  )
}