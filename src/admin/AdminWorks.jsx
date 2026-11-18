import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteWork, fetchSeries, fetchWorks } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { Loading, ErrorMsg } from '../components/ui'

export default function AdminWorks() {
  const { data: works, loading, error, reload } = useAsync(fetchWorks)
  const { data: series } = useAsync(fetchSeries)
  const [busyId, setBusyId] = useState(null)

  const onDelete = async (w) => {
    if (!window.confirm(`¿Eliminar «${w.title}»? Esta acción no se puede deshacer.`)) return
    setBusyId(w.id)
    try {
      await deleteWork(w)
      reload()
    } catch (e) {
      alert('No se pudo eliminar: ' + e.message)
    }
    setBusyId(null)
  }

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="title-display text-2xl">Obras ({works.length})</h1>
        <Link to="/admin/obras/nueva" className="btn-primary">+ Nueva obra</Link>
      </div>

      {!works.length && (
        <p className="border border-dashed border-line py-20 text-center label">
          Aún no hay obras. Agrega la primera.
        </p>
      )}

      <ul className="divide-y divide-line border-y border-line bg-paper">
        {works.map((w) => (
          <li key={w.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 p-4">
            <img src={w.image_url} alt="" className="h-20 w-20 flex-none object-cover" />
            <div className="min-w-0 flex-1 basis-40">
              <p className="font-display text-lg leading-snug sm:truncate">{w.title}</p>
              <p className="label mt-1">
                {series?.find((s) => s.id === w.series_id)?.title || 'Sin serie'} · {w.year || '—'}
              </p>
            </div>
            {/* En móvil las acciones bajan a su propia línea para no salirse del recuadro */}
            <div className="flex w-full items-center gap-6 border-t border-line/60 pt-3 sm:w-auto sm:border-0 sm:pt-0">
              <Link to={`/admin/obras/${w.id}`} className="link-line">Editar</Link>
              <button
                onClick={() => onDelete(w)}
                disabled={busyId === w.id}
                className="text-[11px] uppercase tracking-[0.2em] text-red-700 hover:underline disabled:opacity-40"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
