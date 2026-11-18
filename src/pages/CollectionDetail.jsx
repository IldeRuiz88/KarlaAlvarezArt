import { Link, useParams } from 'react-router-dom'
import { fetchSeries, fetchWorks } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { PageTitle, Loading, ErrorMsg, WorkCard } from '../components/ui'

export default function CollectionDetail() {
  const { slug } = useParams()
  const { data: series, loading, error } = useAsync(fetchSeries)
  const { data: works } = useAsync(fetchWorks)

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  const serie = series.find((s) => s.slug === slug)
  if (!serie)
    return (
      <div className="py-40 text-center">
        <p className="label">Serie no encontrada</p>
        <Link to="/colecciones" className="link-line mt-6 inline-block">Volver a colecciones</Link>
      </div>
    )

  const items = (works || []).filter((w) => w.series_id === serie.id)

  return (
    <>
      <PageTitle eyebrow="Colección" title={serie.title}>
        {serie.description}
      </PageTitle>
      <div className="mx-auto max-w-7xl columns-1 gap-10 px-6 sm:columns-2 md:px-10 lg:columns-3">
        {items.map((w) => (
          <WorkCard key={w.id} work={w} />
        ))}
      </div>
      {!items.length && <p className="text-center label">Esta serie aún no tiene obras publicadas.</p>}
      <div className="mt-10 text-center">
        <Link to="/colecciones" className="link-line">← Todas las colecciones</Link>
      </div>
    </>
  )
}
