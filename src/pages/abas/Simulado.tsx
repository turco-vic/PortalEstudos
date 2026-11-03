import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  botaoPrimario,
  botaoSecundario,
  coresResultado,
  folha,
  opcoesResultado,
  rolarSeEscondido,
} from '../../components/estilos'
import { Texto } from '../../components/Texto'
import { registrar, registrarSimulado, useProgresso, type Resultado } from '../../lib/progresso'
import { useAgora } from '../../lib/useAgora'
import { embaralhar, formatarData, formatarDuracao } from '../../lib/util'
import type { Materia, PerguntaProva } from '../../types'
import { SemConteudo } from './SemConteudo'

type Fase = 'configurar' | 'respondendo' | 'corrigindo' | 'resultado'

const LIMITES = [
  { minutos: 0, nome: 'Sem limite' },
  { minutos: 10, nome: '10 min' },
  { minutos: 20, nome: '20 min' },
  { minutos: 40, nome: '40 min' },
]

export function Simulado({ materia }: { materia: Materia }) {
  const progresso = useProgresso()
  const total = materia.perguntas.length
  const quantidades = [...new Set([5, 10, total].filter((n) => n <= total))]

  const [fase, setFase] = useState<Fase>('configurar')
  const [quantidade, setQuantidade] = useState(Math.min(10, total))
  const [limite, setLimite] = useState(0)
  const [perguntas, setPerguntas] = useState<PerguntaProva[]>([])
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [notas, setNotas] = useState<Record<string, Resultado>>({})
  const [indice, setIndice] = useState(0)
  const [inicio, setInicio] = useState(0)
  const [fim, setFim] = useState<number | null>(null)
  const agora = useAgora(1000)
  const topo = useRef<HTMLDivElement>(null)

  // Tempo esgotado: entrega sozinho
  useEffect(() => {
    if (fase !== 'respondendo' || !limite) return
    const t = setTimeout(
      () => {
        setFim(Date.now())
        setIndice(0)
        setFase('corrigindo')
      },
      inicio + limite * 60_000 - Date.now(),
    )
    return () => clearTimeout(t)
  }, [fase, limite, inicio])

  if (total === 0) return <SemConteudo materia={materia} oQue="perguntas pro simulado" />

  const segundos = ((fim ?? agora.getTime()) - inicio) / 1000
  const historico = progresso.simulados[materia.id] ?? []
  const atual = perguntas[indice]

  function irPara(i: number) {
    setIndice(i)
    rolarSeEscondido(topo.current)
  }

  function comecar() {
    setPerguntas(embaralhar(materia.perguntas).slice(0, quantidade))
    setRespostas({})
    setNotas({})
    setIndice(0)
    setInicio(Date.now())
    setFim(null)
    setFase('respondendo')
  }

  function entregar() {
    const semResposta = perguntas.filter((p) => !respostas[p.id]?.trim()).length
    if (semResposta > 0 && !confirm(`Você deixou ${semResposta} em branco. Entregar mesmo assim?`)) return
    setFim(Date.now())
    irPara(0)
    setFase('corrigindo')
  }

  function corrigir(r: Resultado) {
    const novas = { ...notas, [atual.id]: r }
    setNotas(novas)
    // Só a primeira correção conta no progresso, pra não duplicar se você mudar de ideia
    if (!notas[atual.id]) registrar(materia.id, 'pergunta', atual.id, r)
    const proxima = perguntas.findIndex((p, i) => i > indice && !novas[p.id])
    const pendente = proxima >= 0 ? proxima : perguntas.findIndex((p) => !novas[p.id])
    if (pendente >= 0) {
      irPara(pendente)
      return
    }
    const valores = Object.values(novas)
    registrarSimulado(materia.id, {
      em: new Date().toISOString(),
      total: perguntas.length,
      acertos: valores.filter((v) => v === 'acertei').length,
      parciais: valores.filter((v) => v === 'parcial').length,
      erros: valores.filter((v) => v === 'errei').length,
      segundos: Math.round(segundos),
    })
    setFase('resultado')
    rolarSeEscondido(topo.current)
  }

  if (fase === 'configurar') {
    return (
      <div className="max-w-2xl" ref={topo}>
        <div className={`${folha} p-5 sm:p-6`}>
          <h2 className="text-xl font-bold">Montar simulado</h2>
          <p className="mt-1 text-apagado">
            As perguntas da prova vêm sorteadas. Você responde todas com o cronômetro rodando e só depois corrige,
            comparando com a resposta modelo.
          </p>

          <fieldset className="mt-5">
            <legend className="font-bold">Quantas perguntas</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {quantidades.map((n) => (
                <Escolha key={n} ativo={quantidade === n} onClick={() => setQuantidade(n)}>
                  {n === total ? `Todas (${n})` : n}
                </Escolha>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="font-bold">Tempo</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {LIMITES.map((l) => (
                <Escolha key={l.minutos} ativo={limite === l.minutos} onClick={() => setLimite(l.minutos)}>
                  {l.nome}
                </Escolha>
              ))}
            </div>
          </fieldset>

          <button type="button" className={`${botaoPrimario} mt-6 w-full sm:w-auto`} onClick={comecar}>
            Começar simulado
          </button>
        </div>

        {historico.length > 0 && (
          <section className="mt-8">
            <h3 className="font-bold">Simulados anteriores</h3>
            <ul className="mt-2 divide-y divide-linha">
              {historico.slice(0, 5).map((s) => (
                <li key={s.em} className="flex justify-between gap-3 py-2 text-sm">
                  <span>{formatarData(s.em)}</span>
                  <span className="text-apagado">
                    {s.acertos} certas, {s.parciais} parciais, {s.erros} erradas de {s.total}
                  </span>
                  <span className="tabular-nums">{formatarDuracao(s.segundos)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    )
  }

  if (fase === 'resultado') {
    const valores = perguntas.map((p) => notas[p.id])
    const pontos = valores.reduce((s, v) => s + (v === 'acertei' ? 1 : v === 'parcial' ? 0.5 : 0), 0)
    return (
      <div className="max-w-2xl" ref={topo}>
        <div className={`${folha} p-5 sm:p-6`}>
          <p className="text-apagado">Nota do simulado</p>
          <p className="mt-1 text-5xl font-bold">
            <span className="marca">{Math.round((pontos / perguntas.length) * 100)}%</span>
          </p>
          <p className="mt-3 text-apagado">
            {valores.filter((v) => v === 'acertei').length} certas, {valores.filter((v) => v === 'parcial').length}{' '}
            parciais e {valores.filter((v) => v === 'errei').length} erradas, em {formatarDuracao(segundos)}.
          </p>

          <ol className="mt-6 space-y-2">
            {perguntas.map((p, i) => (
              <li key={p.id} className={`rounded-md border px-3 py-2 ${coresResultado[notas[p.id]]}`}>
                <span className="font-bold">{i + 1}.</span> <span className="text-grafite">{p.pergunta}</span>
              </li>
            ))}
          </ol>

          <button type="button" className={`${botaoPrimario} mt-6`} onClick={() => setFase('configurar')}>
            Fazer outro simulado
          </button>
        </div>
      </div>
    )
  }

  const corrigindo = fase === 'corrigindo'
  const restante = limite * 60 - segundos

  return (
    <div className="max-w-2xl" ref={topo}>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-linha bg-folha px-4 py-3">
        <span className="font-bold">{corrigindo ? 'Correção' : `Questão ${indice + 1} de ${perguntas.length}`}</span>
        <span
          className={`font-mono text-lg tabular-nums ${!corrigindo && limite && restante < 60 ? 'text-erro' : ''}`}
          aria-label={limite && !corrigindo ? 'Tempo restante' : 'Tempo de prova'}
        >
          {formatarDuracao(limite && !corrigindo ? restante : segundos)}
        </span>
      </div>

      <nav aria-label="Ir pra questão" className="mt-3 flex flex-wrap gap-1.5">
        {perguntas.map((p, i) => {
          const nota = notas[p.id]
          const respondida = !!respostas[p.id]?.trim()
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => irPara(i)}
              aria-current={i === indice ? 'step' : undefined}
              className={`h-9 w-9 rounded-md border text-sm font-bold ${
                nota
                  ? coresResultado[nota]
                  : respondida
                    ? 'border-tinta bg-tinta-clara text-tinta'
                    : 'border-linha bg-folha text-apagado'
              } ${i === indice ? 'ring-2 ring-tinta ring-offset-2 ring-offset-papel' : ''}`}
            >
              {i + 1}
            </button>
          )
        })}
      </nav>

      {atual && (
        <article className={`${folha} mt-4 p-5 sm:p-6`}>
          {corrigindo && <p className="text-sm text-apagado">Questão {indice + 1}</p>}
          <h2 className="text-xl leading-snug font-bold">{atual.pergunta}</h2>

          {!corrigindo ? (
            <>
              <textarea
                key={atual.id}
                value={respostas[atual.id] ?? ''}
                onChange={(e) => setRespostas({ ...respostas, [atual.id]: e.target.value })}
                rows={8}
                aria-label="Sua resposta"
                placeholder="Sua resposta"
                className="mt-4 block w-full resize-y rounded-md border border-linha bg-papel p-3 font-leitura leading-relaxed placeholder:text-apagado/70 focus:border-tinta focus:outline-none"
              />
              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <button type="button" className={botaoSecundario} disabled={indice === 0} onClick={() => irPara(indice - 1)}>
                  Anterior
                </button>
                {indice < perguntas.length - 1 ? (
                  <button type="button" className={botaoPrimario} onClick={() => irPara(indice + 1)}>
                    Próxima
                  </button>
                ) : (
                  <button type="button" className={botaoPrimario} onClick={entregar}>
                    Entregar e corrigir
                  </button>
                )}
              </div>
              {indice < perguntas.length - 1 && (
                <button type="button" className="mt-4 text-sm font-bold text-apagado hover:text-grafite" onClick={entregar}>
                  Entregar agora
                </button>
              )}
            </>
          ) : (
            <>
              <h3 className="mt-5 text-sm font-bold text-apagado">Sua resposta</h3>
              <p className="mt-1 font-leitura whitespace-pre-wrap">
                {respostas[atual.id]?.trim() || <em className="text-apagado">Em branco</em>}
              </p>

              <h3 className="mt-6 mb-2 font-bold text-tinta">Resposta modelo</h3>
              <Texto texto={atual.resposta} />

              <div className="mt-6 rounded-md bg-papel p-4">
                <p className="font-bold">Sua resposta estava:</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {opcoesResultado.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => corrigir(b.id)}
                      className={`rounded-md border px-3 py-2.5 font-bold ${coresResultado[b.id]} ${
                        notas[atual.id] === b.id ? 'ring-2 ring-current' : ''
                      }`}
                    >
                      {b.nome}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </article>
      )}
    </div>
  )
}

function Escolha({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`rounded-md border px-4 py-2 font-bold ${
        ativo ? 'border-tinta bg-tinta-clara text-tinta' : 'border-linha bg-folha text-apagado hover:text-grafite'
      }`}
    >
      {children}
    </button>
  )
}
