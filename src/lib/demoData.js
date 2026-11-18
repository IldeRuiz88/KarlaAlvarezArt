// Datos de ejemplo para el modo demo (sin Supabase).
// Las imágenes son placeholders generados en SVG con la paleta terrosa; se reemplazan
// automáticamente por las obras reales cuando se conecta Supabase.

function placeholder(c1, c2, c3, w = 800, h = 1000) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
  <defs>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.012 0.02' numOctaves='4' seed='${(c1.length * 7) % 20}'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='.55' stop-color='${c2}'/><stop offset='1' stop-color='${c3}'/></linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <rect width='100%' height='100%' filter='url(#n)' opacity='.6'/>
  <ellipse cx='${w * 0.35}' cy='${h * 0.6}' rx='${w * 0.4}' ry='${h * 0.13}' fill='${c3}' opacity='.45' transform='rotate(-12 ${w / 2} ${h / 2})'/>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const demoSeries = [
  {
    id: 's1',
    slug: 'territorio-mineral',
    title: 'Territorio Mineral',
    description:
      'Superficies de óleo y pigmento natural que evocan la erosión, la ceniza y la arcilla. Una geografía íntima trabajada capa sobre capa.',
    cover_url: placeholder('#B85D36', '#7A3B22', '#1C1C1C'),
  },
  {
    id: 's2',
    slug: 'umbral',
    title: 'Umbral',
    description:
      'Paisajes de transición entre la luz y la sombra. Pinturas de gran formato sobre la espera y el silencio.',
    cover_url: placeholder('#E8D9C3', '#C98A63', '#8F4526'),
  },
  {
    id: 's3',
    slug: 'memoria-de-agua',
    title: 'Memoria de Agua',
    description:
      'Veladuras y transparencias que registran el paso del tiempo: lo que permanece cuando todo fluye.',
    cover_url: placeholder('#9DB5AE', '#5F8579', '#1C1C1C'),
  },
]

const mk = (i, serie, title, year, technique, dims, colors, desc, grad) => ({
  id: `w${i}`,
  title,
  series_id: serie,
  year,
  technique,
  dimensions: dims,
  colors,
  description: desc,
  image_url: placeholder(...grad, 800, i % 3 === 0 ? 800 : 1000),
})

export const demoWorks = [
  mk(1, 's1', 'Equilibrio Divino', 2025, 'Óleo sobre tela', '150 × 120 cm', ['#B85D36', '#2A2522', '#D9C7AE'],
    'El equilibrio habita en el silencio, y en el silencio, la absoluta paz.', ['#B85D36', '#7A3B22', '#1C1C1C']),
  mk(2, 's1', 'Ecos de Arcilla', 2024, 'Técnica mixta sobre lino', '100 × 80 cm', ['#C98A63', '#5C3A2A', '#EFE3D0'],
    'Una exploración de la belleza efímera de la tierra y sus huellas.', ['#D9A47C', '#A9552F', '#3A2A22']),
  mk(3, 's2', 'Primer Umbral', 2025, 'Óleo sobre tela', '180 × 140 cm', ['#E8D9C3', '#B85D36', '#121212'],
    '', ['#E8D9C3', '#C98A63', '#8F4526']),
  mk(4, 's3', 'Memoria I', 2023, 'Acrílico y veladuras sobre lienzo', '90 × 90 cm', ['#5F8579', '#9DB5AE', '#1C1C1C'],
    'Capas translúcidas que guardan el rastro del agua.', ['#9DB5AE', '#5F8579', '#243530']),
  mk(5, 's2', 'Hora Azul', 2024, 'Óleo sobre tela', '120 × 100 cm', ['#3E5C76', '#B85D36', '#F5F2EB'],
    '', ['#C9D3DC', '#6E8CA6', '#2C3E50']),
  mk(6, 's1', 'Ceniza y Ocre', 2023, 'Óleo y pigmento natural sobre tela', '70 × 70 cm', ['#8C6B4F', '#2A2522', '#D8B98E'],
    '', ['#D8B98E', '#8C6B4F', '#2A2522']),
]

export const demoExhibitions = [
  { year: '2026', text: 'Territorio Mineral — Exposición individual, Galería (ciudad)' },
  { year: '2025', text: 'Residencia artística, Taller de pintura contemporánea' },
  { year: '2024', text: 'Muestra colectiva «Umbrales», Centro Cultural' },
]
