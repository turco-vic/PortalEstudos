import { Link } from 'react-router'
import { BarraProgresso } from '../components/BarraProgresso'
import { ContagemGrande } from '../components/Contagem'
import { botaoPrimario, botaoSecundario, folha } from '../components/estilos'
import { materias, temConteudo } from '../data/materias'
import { calcularDominio, useProgresso, type Progresso } from '../lib/progresso'
import { useAgora } from '../lib/useAgora'
import { diasAte, formatarData, formatarDataLonga, proximasProvas } from '../lib/util'
import type { Materia } from '../types'

export function Home() {
  const progresso = useProgresso()
  const agora = useAgora()
  const [proxima, ...outras] = proximasProvas(materias, agora)
  const dominioProxima = proxima ? calcularDominio(progresso, proxima.materia) : null

  return (
    <div className="space-y-12">
      {proxima && dominioProxima ? (
        <section className={`${folha} overflow-hidden`} aria-labelledby="proxima-prova">
          <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-apagado">Próxima prova</p>
              <h1 id="proxima-prova" className="mt-1 text-3xl leading-tight font-bold sm:text-4xl">
                {proxima.materia.nome}
              </h1>
              <p className="mt-2 text-apagado first-letter:uppercase">{formatarDataLonga(proxima.prova)}</p>

              <div className="mt-6 max-w-sm">
                <div className="flex justify-between text-sm">
                  <span>Quanto você já domina</span>
                  <span className="font-bold">{dominioProxima.porcentagem}%</span>
                </div>
                <BarraProgresso
                  porcentagem={dominioProxima.porcentagem}
                  rotulo={`Domínio de ${proxima.materia.nome}`}
                  className="mt-2"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link to={`/materia/${proxima.materia.id}?aba=perguntas`} className={botaoPrimario}>
                  Treinar perguntas da prova
                </Link>
                <Link to={`/materia/${proxima.materia.id}?aba=simulado`} className={botaoSecundario}>
                  Fazer simulado
                </Link>
              </div>
            </div>
            <div className="order-first md:order-none">
              <ContagemGrande prova={proxima.prova} />
            </div>
          </div>

          {outras.length > 0 && (
            <div className="border-t border-linha bg-papel/60 px-5 py-3 text-sm sm:px-8">
              Depois:{' '}
              {outras.slice(0, 3).map((p, i) => (
                <span key={`${p.materia.id}-${p.prova.data}`}>
                  {i > 0 && ', '}
                  <Link to={`/materia/${p.materia.id}`} className="font-bold hover:underline">
                    {p.materia.nome}
                  </Link>{' '}
                  em {formatarData(p.prova.data)}
                </span>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          <h1 className="text-3xl font-bold">Bons estudos</h1>
          <p className="mt-2 text-apagado">Nenhuma prova marcada por enquanto.</p>
        </section>
      )}

      <Semestre
        titulo="2º semestre"
        descricao="Em andamento"
        lista={materias.filter((m) => m.semestre === 2)}
        progresso={progresso}
        agora={agora}
      />
      <Semestre
        titulo="1º semestre"
        descricao="Concluído. Continua aberto pra consulta."
        lista={materias.filter((m) => m.semestre === 1)}
        progresso={progresso}
        agora={agora}
      />
    </div>
  )
}

interface SemestreProps {
  titulo: string
  descricao: string
  lista: Materia[]
  progresso: Progresso
  agora: Date
}

function Semestre({ titulo, descricao, lista, progresso, agora }: SemestreProps) {
  if (lista.length === 0) return null
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-xl font-bold">{titulo}</h2>
        <p className="text-sm text-apagado">{descricao}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((m) => (
          <li key={m.id}>
            <CartaoMateria materia={m} progresso={progresso} agora={agora} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartaoMateria({ materia, progresso, agora }: { materia: Materia; progresso: Progresso; agora: Date }) {
  const concluida = materia.status === 'concluída'
  const comConteudo = temConteudo(materia)
  const dominio = calcularDominio(progresso, materia)
  const visita = progresso.visitas[materia.id]
  const prova = materia.provas
    .map((p) => ({ p, dias: diasAte(p, agora) }))
    .filter((x) => x.dias >= 0)
    .sort((a, b) => a.dias - b.dias)[0]

  return (
    <Link
      to={`/materia/${materia.id}`}
      className={`flex h-full flex-col rounded-lg border bg-folha p-4 transition-colors hover:border-tinta ${
        concluida ? 'border-linha opacity-60 grayscale hover:opacity-100' : 'border-linha'
      } ${prova && !concluida ? 'border-l-4 border-l-tinta' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="leading-snug font-bold">{materia.nome}</h3>
        {concluida && (
          <span className="shrink-0 rounded-full border border-linha px-2 py-0.5 text-xs text-apagado">Concluída</span>
        )}
      </div>

      {prova && !concluida && (
        <p className="mt-1 text-sm">
          {prova.p.titulo} em {formatarData(prova.p.data)}
          {prova.dias <= 7 && <span className="marca ml-1">{prova.dias === 0 ? 'hoje' : `${prova.dias}d`}</span>}
        </p>
      )}

      <div className="mt-auto pt-4 text-sm">
        {comConteudo ? (
          <>
            <div className="flex justify-between text-apagado">
              <span>{dominio.porcentagem}% dominado</span>
              {visita && <span>Visitada em {formatarData(visita)}</span>}
            </div>
            <BarraProgresso porcentagem={dominio.porcentagem} rotulo={`Domínio de ${materia.nome}`} className="mt-2" />
          </>
        ) : (
          <span className="text-apagado">Sem conteúdo ainda</span>
        )}
      </div>
    </Link>
  )
}
