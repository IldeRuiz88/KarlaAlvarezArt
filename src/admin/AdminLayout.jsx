import { Link, NavLink, Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from './useSession'
import { Loading } from '../components/ui'

export default function AdminLayout() {
  const { session, loading } = useSession()

  if (loading) return <Loading />
  if (!session) return <Navigate to="/admin/login" replace />

  const tab = ({ isActive }) =>
    `border-b pb-1 text-[10px] uppercase tracking-[0.22em] ${
      isActive ? 'border-terracota text-ink' : 'border-transparent text-muted hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-hueso">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-8">
            <span className="font-display text-sm uppercase tracking-[0.25em]">Panel</span>
            <nav className="flex gap-6">
              <NavLink to="/admin" end className={tab}>Obras</NavLink>
              <NavLink to="/admin/series" className={tab}>Series</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="link-line">Ver sitio</Link>
            <button onClick={() => supabase.auth.signOut()} className="label hover:text-terracota">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
