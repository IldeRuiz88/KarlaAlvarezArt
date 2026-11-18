import { Link } from 'react-router-dom'

export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-14 pt-20 text-center fade-in md:pt-28">
      {eyebrow && <p className="label mb-5">{eyebrow}</p>}
      <h1 className="title-display text-3xl md:text-5xl">{title}</h1>
      {children && <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-muted">{children}</p>}
    </div>
  )
}

export function Loading() {
  return <div className="py-40 text-center label">Cargando…</div>
}

export function ErrorMsg({ error }) {
  return (
    <div className="py-40 text-center text-sm text-muted">
      No se pudo cargar el contenido. <span className="block label mt-2">{error?.message}</span>
    </div>
  )
}

export function WorkCard({ work, serieTitle }) {
  return (
    <Link to={`/obra/${work.id}`} className="group mb-12 block break-inside-avoid">
      <div className="overflow-hidden bg-hueso">
        <img
          src={work.image_url}
          alt={work.title}
          loading="lazy"
          className="w-full transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-base tracking-wide">{work.title}</h3>
        <span className="label">{work.year}</span>
      </div>
      {serieTitle && <p className="label mt-1">{serieTitle}</p>}
    </Link>
  )
}

export function ColorDots({ colors = [], size = 'h-9 w-9' }) {
  if (!colors.length) return null
  return (
    <ul className="flex justify-center gap-4" aria-label="Paleta de colores de la obra">
      {colors.map((c) => (
        <li key={c} className="text-center">
          <span
            className={`block ${size} rounded-full border border-ink/10`}
            style={{ backgroundColor: c }}
            title={c}
          />
          <span className="label mt-2 block !text-[9px]">{c.toUpperCase()}</span>
        </li>
      ))}
    </ul>
  )
}
