import { Texto } from '../../components/Texto'
import type { Materia } from '../../types'
import { SemConteudo } from './SemConteudo'

export function Resumo({ materia }: { materia: Materia }) {
  if (materia.resumo.length === 0) return <SemConteudo materia={materia} oQue="resumo" />

  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Tópicos do resumo" className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-sm text-apagado">{materia.resumo.length} tópicos</p>
        <ol className="space-y-1 border-l border-linha">
          {materia.resumo.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="-ml-px block border-l-2 border-transparent py-1 pl-3 text-[0.95rem] leading-snug text-apagado hover:border-tinta hover:text-grafite"
              >
                {t.titulo}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-2xl space-y-12">
        {materia.resumo.map((t) => (
          <section key={t.id} id={t.id} className="scroll-mt-6">
            <h2 className="mb-4 text-2xl font-bold">{t.titulo}</h2>
            <Texto texto={t.texto} />
          </section>
        ))}
      </div>
    </div>
  )
}
