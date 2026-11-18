import { useMemo, useState } from 'react'
import { fetchSeries, fetchWorks } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { PageTitle, Loading, ErrorMsg, WorkCard } from '../components/ui'

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b pb-1 text-[10px] uppercase tracking-[0.22em] transition ${
        active ? 'border-terracota text-ink' : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function Catalog() {
  const { data: works, loading, error } = useAsync(fetchWorks)
  const { data: series } = useAsync(fetchSeries)
  const [serieId, setSerieId] = useState('all')
  const [year, setYear] = useState('all')

  const years = useMemo(
    () => [...new Set((works || []).map((w) => w.year).filter(Boolean))].sort((a, b) => b - a),
    [works]
  )

  const filtered = useMemo(
    () =>
      (works || []).filter(
        (w) => (serieId === 'all' || w.series_id === serieId) && (year === 'all' || String(w.year) === String(year))
      ),
    [works, serieId, year]
  )

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const serieTitle = (id) => series?.find((s) => s.id === id)?.title

  return (
    <>
      <PageTitle eyebrow="Obra completa" title="Catálogo" />

      <div className="mx-auto mb-14 flex max-w-7xl flex-col gap-6 px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="label !text-ink">Serie</span>
          <Chip active={serieId === 'all'} onClick={() => setSerieId('all')}>Todas</Chip>
          {series?.map((s) => (
            <Chip key={s.id} active={serieId === s.id} onClick={() => setSerieId(s.id)}>
              {s.title}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="label !text-ink">Año</span>
          <Chip active={year === 'all'} onClick={() => setYear('all')}>Todos</Chip>
          {years.map((y) => (
            <Chip key={y} active={String(year) === String(y)} onClick={() => setYear(y)}>
              {y}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl columns-1 gap-10 px-6 sm:columns-2 md:px-10 lg:columns-3">
        {filtered.map((w) => (
          <WorkCard key={w.id} work={w} serieTitle={serieTitle(w.series_id)} />
        ))}
      </div>
      {!filtered.length && <p className="py-20 text-center label">No hay obras con estos filtros.</p>}
    </>
  )
}
