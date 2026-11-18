import { PageTitle } from '../components/ui'
import { demoExhibitions } from '../lib/demoData'

// ✏️ EDITAR: texto, retrato y exposiciones de Karla.
// Para cambiar el retrato, coloca la foto en /public/retrato.jpg
const bio = [
  'Karla Alvarez es una artista plástica emergente cuya práctica pictórica se desarrolla en torno a la exploración del paisaje, la materia y la experiencia sensible.',
  'Sus obras abordan distintas formas de interpretar y representar el entorno y la naturaleza, encontrando inspiración tanto en los procesos de transformación como en la memoria y la percepción.', 
  'Trabaja principalmente con óleo, acrílico y técnicas mixtas, explorando las posibilidades del color, la textura y la superposición de capas. A través de gestos, transparencias y contrastes, construye composiciones que buscan evocar atmósferas, emociones y espacios de contemplación.',
]

const exhibitions = demoExhibitions

export default function About() {
  return (
    <>
      <PageTitle eyebrow="Biografía" title="Sobre la artista" />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] overflow-hidden bg-hueso">
            <img
              src="/retrato.png"
              alt="Karla Álvarez en su taller"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center')
                e.currentTarget.parentElement.innerHTML =
                  '<span class="label">Retrato · /public/retrato.jpg</span>'
              }}
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <h2 className="label mb-6">Artist statement</h2>
          <div className="space-y-6 font-display text-xl leading-relaxed md:text-2xl">
            {bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
