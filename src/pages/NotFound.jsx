import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-40 text-center">
      <p className="label">Error 404</p>
      <h1 className="title-display mt-4 text-3xl">Página no encontrada</h1>
      <Link to="/" className="link-line mt-10 inline-block">Volver al inicio</Link>
    </div>
  )
}
