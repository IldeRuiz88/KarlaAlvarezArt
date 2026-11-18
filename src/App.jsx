import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Catalog from './pages/Catalog'
import WorkDetail from './pages/WorkDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminWorks from './admin/AdminWorks'
import WorkForm from './admin/WorkForm'
import AdminSeries from './admin/AdminSeries'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/colecciones" element={<Collections />} />
        <Route path="/colecciones/:slug" element={<CollectionDetail />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/obra/:id" element={<WorkDetail />} />
        <Route path="/sobre-la-artista" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminWorks />} />
        <Route path="obras/nueva" element={<WorkForm />} />
        <Route path="obras/:id" element={<WorkForm />} />
        <Route path="series" element={<AdminSeries />} />
      </Route>
    </Routes>
  )
}
