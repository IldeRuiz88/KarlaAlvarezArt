import { supabase, isSupabaseConfigured, BUCKET } from './supabase'
import { demoSeries, demoWorks } from './demoData'

// ---------- Lectura pública ----------

export async function fetchSeries() {
  if (!isSupabaseConfigured) return demoSeries
  const { data, error } = await supabase.from('series').select('*').order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchWorks() {
  if (!isSupabaseConfigured) return demoWorks
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchWork(id) {
  if (!isSupabaseConfigured) return demoWorks.find((w) => w.id === id) || null
  const { data, error } = await supabase.from('works').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

// ---------- Administración ----------

// crypto.randomUUID solo existe en contextos seguros (HTTPS); con http://IP-local no está disponible.
function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function uploadImage(file) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${uid()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function removeImage(path) {
  if (!path) return
  await supabase.storage.from(BUCKET).remove([path])
}

export async function saveWork(work) {
  const { id, ...fields } = work
  if (id) {
    const { error } = await supabase.from('works').update(fields).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('works').insert(fields)
    if (error) throw error
  }
}

export async function deleteWork(work) {
  const { error } = await supabase.from('works').delete().eq('id', work.id)
  if (error) throw error
  await removeImage(work.image_path)
}

export async function saveSeries(serie) {
  const { id, ...fields } = serie
  if (id) {
    const { error } = await supabase.from('series').update(fields).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('series').insert(fields)
    if (error) throw error
  }
}

export async function deleteSeries(serie) {
  const { error } = await supabase.from('series').delete().eq('id', serie.id)
  if (error) throw error
  await removeImage(serie.cover_path)
}

export const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')