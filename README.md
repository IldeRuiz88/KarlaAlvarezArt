# Karla Álvarez — Portafolio web

React + Vite + Tailwind · Supabase (Postgres, Storage, Auth) · Vercel/Netlify.

Paleta y tipografía: Primary `#121212`, Secondary `#B85D36`, Tertiary `#F5F2EB`, Neutral `#1C1C1C`; Playfair Display (títulos) e Inter (texto). Definidas en `tailwind.config.js`.

## Probar en local (modo demo)

```bash
npm install
npm run dev
```

Sin variables de entorno, la web muestra obras de ejemplo (imágenes placeholder).

## Conectar Supabase

1. Crea un proyecto en https://supabase.com.
2. **SQL Editor** → pega y ejecuta `supabase/schema.sql` (tablas, RLS y bucket `obras`).
3. **Authentication → Users → Add user**: crea el usuario de Karla (correo + contraseña).
4. **Authentication → Sign In / Providers → Email**: desactiva *Allow new users to sign up*. Esto es importante: las políticas permiten escribir a cualquier usuario autenticado, así que solo Karla debe existir.
5. Copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
6. `npm run dev` → entra a `/admin`, crea primero las **Series** y luego las **Obras**.

## Despliegue

1. Sube el proyecto a GitHub.
2. Importa el repo en Vercel o Netlify (build: `npm run build`, salida: `dist`).
3. Agrega las dos variables `VITE_SUPABASE_*` en el panel del hosting.
4. Los archivos `vercel.json` y `public/_redirects` ya resuelven las rutas de la SPA.

## Contenido a personalizar

- `src/pages/About.jsx`: biografía, exposiciones y retrato (`public/retrato.jpg`).
- `src/pages/Contact.jsx`: correo de contacto (`EMAIL`).
- `src/components/Layout.jsx`: enlace de Instagram.

## Estructura

```
src/
  components/   Layout (header/footer), ui (tarjetas, paleta)
  pages/        Home, Collections, CollectionDetail, Catalog, WorkDetail, About, Contact
  admin/        Login, listado de obras, formulario CRUD, series, compresión de imágenes
  lib/          cliente Supabase, API, datos demo
supabase/schema.sql
```

## Panel privado

- Acceso en `/admin` (enlace discreto «Acceso» en el pie).
- Al subir una imagen se comprime en el navegador (WebP, máx. 2400 px, ~1.5 MB) y se sugiere la paleta de colores a partir de la obra.
