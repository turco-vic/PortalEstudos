import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { MateriaPagina } from './pages/MateriaPagina'
import { NaoEncontrada } from './pages/NaoEncontrada'
import { ProgressoPagina } from './pages/ProgressoPagina'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="materia/:id" element={<MateriaPagina />} />
          <Route path="progresso" element={<ProgressoPagina />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
