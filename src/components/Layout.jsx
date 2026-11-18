import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/colecciones', label: 'Colecciones' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sobre-la-artista', label: 'Sobre la artista' },
  { to: '/contacto', label: 'Contacto' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  const linkClass = ({ isActive }) =>
    `text-[10px] uppercase tracking-[0.22em] transition hover:text-terracota ${
      isActive ? 'text-ink border-b border-terracota pb-1' : 'text-muted'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="font-display text-sm uppercase tracking-[0.25em] text-ink">
          Karla Alvarez
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span className="block h-px w-6 bg-ink" />
          <span className="mt-2 block h-px w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-6 border-t border-line/60 bg-paper px-6 py-8 md:hidden" aria-label="Móvil">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-line/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-[10px] uppercase tracking-[0.2em] text-muted md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} Karla Alvarez · Obra única</span>
        <div className="flex gap-8">
          <a href="https://www.instagram.com/karlalvrezzz/" target="_blank" rel="noreferrer" className="hover:text-terracota">
            Instagram
          </a>
          <Link to="/contacto" className="hover:text-terracota">
            Contacto
          </Link>
          <Link to="/admin" className="opacity-40 hover:opacity-100 hover:text-terracota">
            Acceso
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
