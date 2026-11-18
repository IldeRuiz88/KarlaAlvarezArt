import { useSearchParams } from 'react-router-dom'
import { PageTitle } from '../components/ui'

// ✏️ EDITAR: correo de contacto de Karla.
const EMAIL = 'karla.alvareza2017@gmail.com'

export default function Contact() {
  const [params] = useSearchParams()
  const obra = params.get('obra')

  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = obra ? `Consulta sobre la obra «${obra}»` : 'Consulta desde el portafolio'
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <PageTitle eyebrow="Escribe a la artista" title="Contacto">
        Para consultas sobre obra disponible, encargos, exposiciones o prensa.
      </PageTitle>

      <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-6 px-6">
        {obra && (
          <p className="label text-center">
            Obra de interés: <span className="text-terracota">{obra}</span>
          </p>
        )}
        <div>
          <label className="label mb-2 block" htmlFor="name">Nombre</label>
          <input id="name" name="name" required className="field" />
        </div>
        <div>
          <label className="label mb-2 block" htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" required className="field" />
        </div>
        <div>
          <label className="label mb-2 block" htmlFor="message">Mensaje</label>
          <textarea id="message" name="message" rows={6} required className="field" />
        </div>
        <div className="text-center">
          <button type="submit" className="btn-primary">Enviar mensaje</button>
          <p className="label mt-6">O escribe directamente a {EMAIL}</p>
        </div>
      </form>
    </>
  )
}
