import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchSeries, fetchWork, removeImage, saveWork, uploadImage } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { compressImage, extractPalette, formatBytes } from './compress'
import { Loading } from '../components/ui'

const empty = {
  title: '',
  series_id: '',
  year: new Date().getFullYear(),
  technique: '',
  dimensions: '',
  description: '',
  colors: [],
  featured: true,
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="label mb-2 block">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export default function WorkForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data: series } = useAsync(fetchSeries)
  const { data: existing, loading } = useAsync(() => (isEdit ? fetchWork(id) : Promise.resolve(null)), [id])

  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null) // archivo comprimido listo para subir
  const [preview, setPreview] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existing) {
      setForm({ ...empty, ...existing, series_id: existing.series_id || '', colors: existing.colors || [] })
      setPreview(existing.image_url)
    }
  }, [existing])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onFile = async (e) => {
    const original = e.target.files?.[0]
    if (!original) return
    setError('')
    setInfo('Optimizando imagen…')
    try {
      const small = await compressImage(original)
      setFile(small)
      setPreview(URL.createObjectURL(small))
      setInfo(`Comprimida: ${formatBytes(original.size)} → ${formatBytes(small.size)}`)
      if (!form.colors.length) {
        const palette = await extractPalette(small)
        setForm((f) => ({ ...f, colors: palette }))
      }
    } catch (err) {
      setInfo('')
      setError('No se pudo procesar la imagen: ' + err.message)
    }
  }

  const setColor = (i, v) =>
    setForm((f) => ({ ...f, colors: f.colors.map((c, j) => (j === i ? v : c)) }))
  const addColor = () => setForm((f) => ({ ...f, colors: [...f.colors, '#B85D36'].slice(0, 6) }))
  const removeColor = (i) => setForm((f) => ({ ...f, colors: f.colors.filter((_, j) => j !== i) }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!file && !isEdit) return setError('Sube una imagen de la obra.')
    setBusy(true)
    try {
      let image = { url: existing?.image_url, path: existing?.image_path }
      if (file) {
        image = await uploadImage(file)
        if (existing?.image_path) await removeImage(existing.image_path)
      }
      await saveWork({
        id: existing?.id,
        title: form.title.trim(),
        series_id: form.series_id || null,
        year: form.year ? Number(form.year) : null,
        technique: form.technique.trim(),
        dimensions: form.dimensions.trim(),
        description: form.description.trim(),
        colors: form.colors,
        featured: form.featured,
        image_url: image.url,
        image_path: image.path,
      })
      navigate('/admin')
    } catch (err) {
      setError('No se pudo guardar: ' + err.message)
      setBusy(false)
    }
  }

  if (isEdit && loading) return <Loading />

  return (
    <form onSubmit={onSubmit} className="grid gap-12 md:grid-cols-5">
      <div className="md:col-span-2">
        <h1 className="title-display mb-8 text-2xl">{isEdit ? 'Editar obra' : 'Nueva obra'}</h1>
        <div className="aspect-[4/5] overflow-hidden border border-dashed border-line bg-paper">
          {preview ? (
            <img src={preview} alt="Vista previa" className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center label">Sin imagen</div>
          )}
        </div>
        <label className="btn-outline mt-4 block cursor-pointer text-center">
          {preview ? 'Cambiar imagen' : 'Subir imagen'}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
        {info && <p className="mt-3 text-xs text-muted">{info}</p>}
      </div>

      <div className="space-y-6 md:col-span-3">
        <Field label="Título *">
          <input required value={form.title} onChange={set('title')} className="field" />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Serie">
            <select value={form.series_id} onChange={set('series_id')} className="field">
              <option value="">— Sin serie —</option>
              {series?.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Año">
            <input type="number" min="1900" max="2100" value={form.year} onChange={set('year')} className="field" />
          </Field>
        </div>

        <Field label="Técnica y soporte" hint="Ej.: Óleo sobre tela">
          <input value={form.technique} onChange={set('technique')} className="field" />
        </Field>
        <Field label="Dimensiones" hint="Ej.: 150 × 120 cm">
          <input value={form.dimensions} onChange={set('dimensions')} className="field" />
        </Field>

        <Field label="Texto conceptual (opcional)">
          <textarea rows={4} value={form.description} onChange={set('description')} className="field" />
        </Field>

        <Field label="Paleta de colores" hint="Se sugiere automáticamente al subir la imagen; puedes ajustarla.">
          <div className="flex flex-wrap items-center gap-3">
            {form.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-1 border border-line bg-hueso p-1">
                <input type="color" value={c} onChange={(e) => setColor(i, e.target.value)}
                  className="h-8 w-8 cursor-pointer border-0 bg-transparent p-0" />
                <span className="label !text-[9px]">{c.toUpperCase()}</span>
                <button type="button" onClick={() => removeColor(i)} className="px-1 text-muted hover:text-red-700" aria-label="Quitar color">✕</button>
              </div>
            ))}
            {form.colors.length < 6 && (
              <button type="button" onClick={addColor} className="link-line">+ Color</button>
            )}
          </div>
        </Field>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          Mostrar en el hero de la página de inicio
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex items-center gap-6 pt-2">
          <button disabled={busy} className="btn-primary disabled:opacity-50">
            {busy ? 'Guardando…' : 'Guardar obra'}
          </button>
          <Link to="/admin" className="link-line">Cancelar</Link>
        </div>
      </div>
    </form>
  )
}
