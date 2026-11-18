import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useSession } from './useSession'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) setError(error.message)
    else navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hueso px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-display text-sm uppercase tracking-[0.25em]">
          Karla Álvarez
        </Link>
        <p className="label mt-3 text-center">Panel de la artista</p>

        {!isSupabaseConfigured ? (
          <p className="mt-10 border border-line bg-paper p-5 text-sm leading-relaxed text-muted">
            Supabase no está configurado. Crea el archivo <code>.env</code> con
            <code> VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> (ver README).
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <label htmlFor="email" className="label mb-2 block">Correo</label>
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} className="field !bg-paper" />
            </div>
            <div>
              <label htmlFor="password" className="label mb-2 block">Contraseña</label>
              <input id="password" type="password" required autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="field !bg-paper" />
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
