import { Link } from 'react-router-dom'
import { fetchSeries, fetchWorks } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { PageTitle, Loading, ErrorMsg } from '../components/ui'

export default function Collections() {
  const { data: series, loading, error } = useAsync(fetchSeries)
  const { data: works } = useAsync(fetchWorks)

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  return (
    <>
      <PageTitle eyebrow="Series pictóricas" title="Colecciones">
        Cada serie es un diálogo entre la materia, el color y la emoción.
      </PageTitle>

      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-20 px-6 md:grid-cols-2 md:px-10">
        {series.map((s) => {
          const count = works?.filter((w) => w.series_id === s.id).length
          return (
            <Link key={s.id} to={`/colecciones/${s.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-hueso">
                <img
                  src={s.cover_url}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  style={{ objectPosition: s.cover_position || '50% 50%' }}
                />
              </div>
              <div className="mt-6">
                <h2 className="font-display text-2xl">{s.title}</h2>
                {count != null && <p className="label mt-2">{count} {count === 1 ? 'obra' : 'obras'}</p>}
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{s.description}</p>
                <span className="link-line mt-6 inline-block">Explorar serie</span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
