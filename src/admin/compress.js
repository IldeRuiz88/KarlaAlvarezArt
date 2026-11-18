import imageCompression from 'browser-image-compression'

// Compresión en el cliente antes de subir a Supabase Storage:
// máx. 2400px de lado largo, ~1.5 MB, convertida a JPEG
// (JPEG y no WebP: Safari en iPhone no sabe generar WebP y devolvería un PNG enorme).
export async function compressImage(file, { maxSizeMB = 1.5, maxWidthOrHeight = 2400 } = {}) {
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.88,
  })
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([compressed], name, { type: 'image/jpeg' })
}

export const formatBytes = (b) =>
  b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${Math.round(b / 1024)} KB`

// Extrae los colores dominantes de una imagen (cuantización simple) para sugerir la paleta.
export async function extractPalette(file, count = 4) {
  const bmp = await createImageBitmap(file)
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(bmp, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  const buckets = new Map()
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue
    const r = data[i] >> 5, g = data[i + 1] >> 5, b = data[i + 2] >> 5
    const key = (r << 6) | (g << 3) | b
    const e = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 }
    e.n++; e.r += data[i]; e.g += data[i + 1]; e.b += data[i + 2]
    buckets.set(key, e)
  }

  const toHex = (e) =>
    '#' + [e.r, e.g, e.b].map((v) => Math.round(v / e.n).toString(16).padStart(2, '0')).join('')

  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n)
  const picked = []
  for (const e of sorted) {
    const c = [e.r / e.n, e.g / e.n, e.b / e.n]
    const far = picked.every((p) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) > 60)
    if (far) picked.push(c)
    if (picked.length === count) break
  }
  return picked.map((c) => toHex({ n: 1, r: c[0], g: c[1], b: c[2] }))
}