import { useRef } from 'react'

export const DEFAULT_POSITION = '50% 50%'

const clamp = (n) => Math.min(100, Math.max(0, n))

export function parsePosition(value) {
  const [x, y] = String(value || DEFAULT_POSITION)
    .split(' ')
    .map((v) => parseFloat(v))
  return [Number.isFinite(x) ? x : 50, Number.isFinite(y) ? y : 50]
}

// Selector de punto de enfoque: se toca o arrastra sobre la foto para elegir qué zona debe verse
// cuando la imagen se muestra recortada en las tarjetas del sitio.
export default function FocalPicker({ src, value, onChange }) {
  const ref = useRef(null)
  const [x, y] = parsePosition(value)

  const setFrom = (e) => {
    const r = ref.current.getBoundingClientRect()
    const px = clamp(((e.clientX - r.left) / r.width) * 100)
    const py = clamp(((e.clientY - r.top) / r.height) * 100)
    onChange(`${Math.round(px)}% ${Math.round(py)}%`)
  }

  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        Toca o arrastra sobre la foto para elegir qué parte debe verse en las tarjetas.
      </p>

      <div className="flex justify-center bg-hueso p-2">
        <div
          ref={ref}
          className="relative inline-block max-w-full cursor-crosshair touch-none select-none"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setFrom(e)
          }}
          onPointerMove={(e) => e.buttons && setFrom(e)}
        >
          <img src={src} alt="Elegir zona" draggable={false} className="block max-h-72 max-w-full" />
          <span
            className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1.5px_rgba(18,18,18,0.7)]"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-5">
        <figure>
          <div className="aspect-[4/5] w-20 overflow-hidden bg-hueso">
            <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: value || DEFAULT_POSITION }} />
          </div>
          <figcaption className="label mt-1 !text-[9px]">Inicio</figcaption>
        </figure>
        <figure>
          <div className="aspect-[4/3] w-32 overflow-hidden bg-hueso">
            <img src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: value || DEFAULT_POSITION }} />
          </div>
          <figcaption className="label mt-1 !text-[9px]">Colecciones</figcaption>
        </figure>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_POSITION)}
          className="link-line mb-5 ml-auto self-end"
        >
          Centrar
        </button>
      </div>
    </div>
  )
}
