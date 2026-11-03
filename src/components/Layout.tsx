import { Link, NavLink, Outlet } from 'react-router'
import { alternarTema, useTema } from '../lib/tema'

function linkClasse({ isActive }: { isActive: boolean }) {
  return `rounded-md px-2.5 py-2 font-bold sm:px-3 transition-colors ${
    isActive ? 'bg-tinta-clara text-tinta' : 'text-apagado hover:text-grafite'
  }`
}

export function Layout() {
  const tema = useTema()
  const proximo = tema === 'escuro' ? 'claro' : 'escuro'

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-linha bg-folha">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <Link to="/" className="mr-auto flex items-center gap-2.5 font-bold">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            <span className="leading-tight whitespace-nowrap">
              <span className="hidden sm:inline">Portal de </span>Estudos
              <span className="hidden text-xs font-normal text-apagado sm:block">ADS SENAI Roberto Mange</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/" end className={linkClasse}>
              Matérias
            </NavLink>
            <NavLink to="/progresso" className={linkClasse}>
              Progresso
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={alternarTema}
            className="ml-1 rounded-md p-2 text-apagado hover:text-grafite"
            aria-label={`Mudar pro tema ${proximo}`}
            title={`Mudar pro tema ${proximo}`}
          >
            {tema === 'escuro' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-linha px-4 py-5 text-center text-sm text-apagado">
        CST em Análise e Desenvolvimento de Sistemas. Seu progresso fica salvo só neste navegador.
      </footer>
    </div>
  )
}
