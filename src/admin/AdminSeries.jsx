import { useEffect, useState } from 'react'
import { deleteSeries, fetchSeries, removeImage, saveSeries, slugify, uploadImage } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { compressImage } from './compress'
import FocalPicker, { DEFAULT_POSITION } from './FocalPicker'
import { Loading, ErrorMsg } from '../components/ui'

const empty = { title: '', description: '', cover_url: '', cover_path: '', cover_position: DEFAULT_POSITION }

export default function AdminSeries() {
  const { data: series, loading, error, reload } = useAsync(fetchSeries)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  // Vista previa estable del archivo elegido (y liberación de memoria al cambiar).
  useEffect(() => {
    if (!file) return setPreview('')
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const coverSrc = preview || form.cover_url

  const reset = () => {
    setForm(empty)
    setEditing(null)
    setFile(null)
  }

  const startEdit = (s) => {
    setEditing(s)
    setForm({
      title: s.title,
      description: s.description || '',
      cover_url: s.cover_url || '',
      cover_path: s.cover_path || '',
      cover_position: s.cover_position || DEFAULT_POSITION,
    })
    setFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Al elegir una foto nueva, el punto de enfoque vuelve al centro.
  const onFile = (e) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) setForm((prev) => ({ ...prev, cover_position: DEFAULT_POSITION }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    try {
      let cover = { url: form.cover_url, path: form.cover_path }
      if (file) {
        cover = await uploadImage(await compressImage(file, { maxWidthOrHeight: 1800 }))
        if (editing?.cover_path) await removeImage(editing.cover_path)
      }
      await saveSeries({
        id: editing?.id,
        title: form.title.trim(),
        slug: editing?.slug || slugify(form.title),
        description: form.description.trim(),
        cover_url: cover.url,
        cover_path: cover.path,
        cover_position: form.cover_position,
      })
      reset()
      reload()
    } catch (err) {
      setMsg('No se pudo guardar: ' + err.message)
    }
    setBusy(false)
  }

  const onDelete = async (s) => {
    if (!window.confirm(`¿Eliminar la serie «${s.title}»? Sus obras no se borran, solo quedarán sin serie.`)) return
    try {
      await deleteSeries(s)
      reload()
    } catch (err) {
      alert('No se pudo eliminar: ' + err.message)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMsg error={error} />

  return (
    <div className="grid gap-12 md:grid-cols-5">
      <form onSubmit={onSubmit} className="space-y-5 md:col-span-2">
        <h1 className="title-display text-2xl">{editing ? 'Editar serie' : 'Nueva serie'}</h1>
        <div>
          <label className="label mb-2 block">Título *</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="field" />
        </div>
        <div>
          <label className="label mb-2 block">Descripción conceptual</label>
          <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="field" />
        </div>
        <div>
          <label className="label mb-2 block">Imagen representativa</label>
          <input type="file" accept="image/*" onChange={onFile} className="mb-4 text-sm" />
          {coverSrc && (
            <FocalPicker
              src={coverSrc}
              value={form.cover_position}
              onChange={(pos) => setForm((prev) => ({ ...prev, cover_position: pos }))}
            />
          )}
        </div>
        {msg && <p className="text-sm text-red-700">{msg}</p>}
        <div className="flex items-center gap-6">
          <button disabled={busy} className="btn-primary disabled:opacity-50">{busy ? 'Guardando…' : 'Guardar'}</button>
          {editing && <button type="button" onClick={reset} className="link-line">Cancelar</button>}
        </div>
      </form>

      <div className="md:col-span-3">
        <h2 className="label mb-4">Series existentes</h2>
        <ul className="divide-y divide-line border-y border-line bg-paper">
          {series.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
              {s.cover_url && (
                <img
                  src={s.cover_url}
                  alt=""
                  className="h-16 w-16 flex-none object-cover"
                  style={{ objectPosition: s.cover_position || DEFAULT_POSITION }}
                />
              )}
              <p className="min-w-0 flex-1 basis-40 font-display text-lg leading-snug">{s.title}</p>
              {/* En móvil las acciones bajan a su propia línea para no salirse del recuadro */}
              <div className="flex w-full items-center gap-6 border-t border-line/60 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                <button onClick={() => startEdit(s)} className="link-line">Editar</button>
                <button onClick={() => onDelete(s)} className="text-[11px] uppercase tracking-[0.2em] text-red-700 hover:underline">Eliminar</button>
              </div>
            </li>
          ))}
          {!series.length && <li className="p-8 text-center label">Aún no hay series.</li>}
        </ul>
      </div>
    </div>
  )
}
