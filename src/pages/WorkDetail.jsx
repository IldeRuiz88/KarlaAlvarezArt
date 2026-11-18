import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { fetchSeries, fetchWork } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { Loading, ErrorMsg, ColorDots } from '../components/ui'

// Visor con zoom: clic para ampliar a pantalla completa; en ampliado, mover el cursor desplaza la imagen.
function Viewer({ src, alt, onClose }) {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [zoom, setZoom] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const onMove = (e) => {
    if (!zoom) return
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  // Se renderiza en <body> (portal) para que cubra TODA la pantalla,
  // sin quedar atrapado dentro del contenedor animado de la página.
  return createPortal(
    // Clic en el fondo oscuro (fuera de la pintura) = cerrar.
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 p-2 label !text-hueso"
        aria-label="Cerrar"
      >
        Cerrar ✕
      </button>

      {/* El recuadro se ajusta exactamente a la pintura. Clic dentro = zoom; salir con el cursor estando ampliada = cerrar. */}
      <div
        className={`overflow-hidden ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={(e) => {
          e.stopPropagation()
          setZoom((z) => !z)
        }}
        onMouseMove={onMove}
        onMouseLeave={() => zoom && onClose()}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="block max-h-[88vh] max-w-[92vw] transition-transform duration-300"
          style={{
            transform: zoom ? 'scale(2.4)' : 'scale(1)',
            transformOrigin: `${pos.x}% ${pos.y}%`,
          }}
        />
      </div>

      <p className="label pointer-events-none absolute bottom-5 !text-hueso/60">
        {zoom
          ? 'Mueve el cursor para inspeccionar · clic para reducir · sal de la pintura para cerrar'
          : 'Clic en la pintura para inspeccionar · clic fuera para cerrar'}
      </p>
    </div>,
    document.body
  )
}

function Row({ label, children }) {
  if (!children) return null
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-line py-4 text-sm">
      <dt className="label self-center">{label}</dt>
      <dd className="col-span-2">{children}</dd>
    </div>
  )
}

export default function WorkDetail() {
  const { id } = useParams()
  const { data: work, loading, error } = useAsync(() => fetchWork(id), [id])
  const { data: series } = useAsync(fetchSeries)
  const [open, setOpen] = useState(false)

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />
  if (!work)
    return (
      <div className="py-40 text-center">
        <p className="label">Obra no encontrada</p>
        <Link to="/catalogo" className="link-line mt-6 inline-block">Volver al catálogo</Link>
      </div>
    )

  const serie = series?.find((s) => s.id === work.series_id)

  return (
    <article className="fade-in mx-auto max-w-5xl px-6 pt-16 text-center md:pt-24">
      {serie && (
        <Link to={`/colecciones/${serie.slug}`} className="label hover:text-terracota">
          Colección: {serie.title}
        </Link>
      )}
      <h1 className="title-display mx-auto mt-6 max-w-2xl text-3xl leading-snug md:text-5xl">{work.title}</h1>

      <button
        onClick={() => setOpen(true)}
        className="group mx-auto mt-14 block cursor-zoom-in bg-white p-3 shadow-[0_10px_40px_-15px_rgba(18,18,18,0.25)] md:p-4"
        aria-label="Ampliar imagen"
      >
        <img src={work.image_url} alt={work.title} className="max-h-[75vh] w-auto" />
      </button>
      <p className="label mt-4">Clic en la imagen para inspeccionar</p>

      {work.description && (
        <blockquote className="mx-auto mt-16 max-w-md whitespace-pre-line font-display text-lg italic leading-relaxed">
          {work.description}
        </blockquote>
      )}

      <div className="mt-14">
        <ColorDots colors={work.colors} />
      </div>

      <dl className="mx-auto mt-16 max-w-md text-left">
        <Row label="Año">{work.year}</Row>
        <Row label="Técnica">{work.technique}</Row>
        <Row label="Dimensiones">{work.dimensions}</Row>
        <Row label="Serie">{serie?.title}</Row>
      </dl>

      <div className="mt-14 flex flex-wrap justify-center gap-6">
        <Link to={`/contacto?obra=${encodeURIComponent(work.title)}`} className="btn-primary">
          Consultar disponibilidad
        </Link>
        <Link to="/catalogo" className="link-line self-center">← Volver al catálogo</Link>
      </div>

      {open && <Viewer src={work.image_url} alt={work.title} onClose={() => setOpen(false)} />}
    </article>
  )
}
