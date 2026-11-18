import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWorks, fetchSeries } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { Loading, ErrorMsg } from '../components/ui'

export default function Home() {
  const { data: works, loading, error } = useAsync(fetchWorks)
  const { data: series } = useAsync(fetchSeries)
  const [idx, setIdx] = useState(0)

  const featured = (works || []).filter((w) => w.featured !== false).slice(0, 5)

  useEffect(() => {
    if (featured.length < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 6000)
    return () => clearInterval(t)
  }, [featured.length])

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />
  if (!featured.length)
    return (
      <div className="py-40 text-center">
        <h1 className="title-display text-4xl">Karla Alvarez</h1>
        <p className="label mt-4">Próximamente</p>
      </div>
    )

  const current = featured[idx]
  const serieTitle = series?.find((s) => s.id === current.series_id)?.title

  return (
    <>
      <section className="relative grid min-h-[calc(100vh-70px)] items-center md:grid-cols-12">
        <div className="order-2 px-6 py-12 md:order-1 md:col-span-5 md:px-10 lg:px-16">
          <p className="label fade-in">Artista plástica</p>
          <h1 className="title-display fade-in mt-6 text-4xl leading-tight md:text-6xl">
            Karla
            <br />
            Álvarez
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted">
            Paisajes y atmósferas que nacen de la contemplación, donde la pintura se convierte en un lenguaje del sentir. 
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/colecciones" className="btn-primary">
              Ver colecciones
            </Link>
            <Link to="/catalogo" className="btn-outline">
              Catálogo
            </Link>
          </div>
        </div>

        <div className="relative order-1 md:order-2 md:col-span-7">
          <Link to={`/obra/${current.id}`} className="block">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-hueso md:aspect-auto md:h-[calc(100vh-70px)]">
              {featured.map((w, i) => (
                <img
                  key={w.id}
                  src={w.image_url}
                  alt={w.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
                    i === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          </Link>
          <div className="absolute bottom-5 left-5 bg-paper/90 px-4 py-3 backdrop-blur">
            <p className="font-display text-sm">{current.title}</p>
            <p className="label mt-1">
              {serieTitle ? `${serieTitle} · ` : ''}
              {current.year}
            </p>
          </div>
          {featured.length > 1 && (
            <div className="absolute bottom-5 right-5 hidden gap-2 md:flex">
              {featured.map((w, i) => (
                <button
                  key={w.id}
                  onClick={() => setIdx(i)}
                  aria-label={`Ver ${w.title}`}
                  className={`h-px w-8 transition ${i === idx ? 'bg-paper' : 'bg-paper/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {series?.length > 0 && (
        <section className="mx-auto mt-32 max-w-7xl px-6 md:px-10">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="title-display text-2xl">Colecciones</h2>
            <Link to="/colecciones" className="link-line">
              Ver todas
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {series.slice(0, 3).map((s) => (
              <Link key={s.id} to={`/colecciones/${s.slug}`} className="group">
                <div className="aspect-[4/5] overflow-hidden bg-hueso">
                  <img
                    src={s.cover_url}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: s.cover_position || '50% 50%' }}
                  />
                </div>
                <h3 className="mt-5 font-display text-lg">{s.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
