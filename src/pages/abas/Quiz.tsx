import { useRef, useState } from 'react'
import { botaoPrimario, botaoSecundario, folha, rolarSeEscondido } from '../../components/estilos'
import { Texto } from '../../components/Texto'
import { Vazio } from '../../components/Vazio'
import { registrar, registroDe, useProgresso, type Progresso } from '../../lib/progresso'
import { embaralhar } from '../../lib/util'
import type { Materia, Questao } from '../../types'
import { SemConteudo } from './SemConteudo'

type Filtro = 'todas' | 'multipla' | 'vf' | 'revisar'

const FILTROS: { id: Filtro; nome: string }[] = [
  { id: 'todas', nome: 'Todas' },
  { id: 'multipla', nome: 'Múltipla escolha' },
  { id: 'vf', nome: 'Verdadeiro ou falso' },
  { id: 'revisar', nome: 'Que errei' },
]

interface Opcao {
  texto: string
  certa: boolean
}

interface Item {
  questao: Questao
  opcoes: Opcao[]
}

function opcoesDe(q: Questao): Opcao[] {
  if (q.tipo === 'vf') {
    return [
      { texto: 'Verdadeiro', certa: q.correta },
      { texto: 'Falso', certa: !q.correta },
    ]
  }
  return embaralhar(q.opcoes.map((texto, i) => ({ texto, certa: i === q.correta })))
}

function montarRodada(materia: Materia, progresso: Progresso, filtro: Filtro, somenteIds?: string[]): Item[] {
  const questoes = materia.questoes.filter((q) => {
    if (somenteIds) return somenteIds.includes(q.id)
    if (filtro === 'multipla' || filtro === 'vf') return q.tipo === filtro
    if (filtro === 'revisar') return registroDe(progresso, materia.id, 'questao', q.id)?.ultimo === 'errei'
    return true
  })
  return embaralhar(questoes).map((questao) => ({ questao, opcoes: opcoesDe(questao) }))
}

const LETRAS = 'ABCDEFGH'

export function Quiz({ materia }: { materia: Materia }) {
  const progresso = useProgresso()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [rodada, setRodada] = useState(() => montarRodada(materia, progresso, 'todas'))
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState<number | null>(null)
  const [acertos, setAcertos] = useState<Record<string, boolean>>({})
  const topo = useRef<HTMLDivElement>(null)

  if (materia.questoes.length === 0) return <SemConteudo materia={materia} oQue="questões de quiz" />

  function comecar(f: Filtro, somenteIds?: string[]) {
    setFiltro(f)
    setRodada(montarRodada(materia, progresso, f, somenteIds))
    setIndice(0)
    setEscolha(null)
    setAcertos({})
  }

  function escolher(i: number) {
    if (escolha !== null) return
    const certa = item.opcoes[i].certa
    setEscolha(i)
    setAcertos({ ...acertos, [item.questao.id]: certa })
    registrar(materia.id, 'questao', item.questao.id, certa ? 'acertei' : 'errei')
  }

  function proxima() {
    setIndice(indice + 1)
    setEscolha(null)
    rolarSeEscondido(topo.current)
  }

  const item = rodada[indice]
  const total = rodada.length
  const certas = Object.values(acertos).filter(Boolean).length
  const erradas = rodada.filter((r) => acertos[r.questao.id] === false)

  return (
    <div className="max-w-2xl" ref={topo}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de questão">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => comecar(f.id)}
            className={`rounded-full border px-3 py-1 text-sm font-bold ${
              filtro === f.id ? 'border-tinta bg-tinta-clara text-tinta' : 'border-linha text-apagado hover:text-grafite'
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      {total === 0 ? (
        <div className="mt-6">
          <Vazio titulo={filtro === 'revisar' ? 'Nenhuma questão errada' : 'Nenhuma questão desse tipo'}>
            {filtro === 'revisar' && 'Na última tentativa você acertou todas que respondeu.'}
          </Vazio>
        </div>
      ) : !item ? (
        <div className={`${folha} mt-6 p-6`}>
          <p className="text-apagado">Resultado</p>
          <p className="mt-1 text-4xl font-bold">
            <span className="marca">
              {certas} de {total}
            </span>
          </p>
          <p className="mt-2 text-apagado">{Math.round((certas / total) * 100)}% de acerto nesta rodada.</p>

          {erradas.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold">Pra revisar</h3>
              <ul className="mt-2 space-y-3">
                {erradas.map((r) => (
                  <li key={r.questao.id} className="border-l-2 border-erro pl-3">
                    <p>{r.questao.enunciado}</p>
                    <p className="mt-1 text-sm text-apagado">
                      Resposta certa: {r.opcoes.find((o) => o.certa)?.texto}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {erradas.length > 0 && (
              <button
                type="button"
                className={botaoPrimario}
                onClick={() => comecar(filtro, erradas.map((r) => r.questao.id))}
              >
                Refazer as que errei
              </button>
            )}
            <button type="button" className={erradas.length ? botaoSecundario : botaoPrimario} onClick={() => comecar(filtro)}>
              Nova rodada
            </button>
          </div>
        </div>
      ) : (
        <article className={`${folha} mt-5 p-5 sm:p-6`}>
          <p className="text-sm text-apagado">
            Questão {indice + 1} de {total}, {item.questao.tipo === 'vf' ? 'verdadeiro ou falso' : 'múltipla escolha'}
          </p>
          <h2 className="mt-2 text-xl leading-snug font-bold">{item.questao.enunciado}</h2>

          <div className={`mt-5 grid gap-2 ${item.questao.tipo === 'vf' ? 'grid-cols-2' : ''}`}>
            {item.opcoes.map((o, i) => {
              const respondida = escolha !== null
              let cor = 'border-linha bg-folha hover:border-tinta'
              if (respondida && o.certa) cor = 'border-certo bg-certo-fundo text-certo'
              else if (respondida && i === escolha) cor = 'border-erro bg-erro-fundo text-erro'
              else if (respondida) cor = 'border-linha opacity-60'
              return (
                <button
                  key={o.texto}
                  type="button"
                  disabled={respondida}
                  onClick={() => escolher(i)}
                  className={`flex items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors disabled:cursor-default ${cor}`}
                >
                  {item.questao.tipo === 'multipla' && <span className="font-bold">{LETRAS[i]})</span>}
                  <span className={item.questao.tipo === 'vf' ? 'w-full text-center font-bold' : ''}>{o.texto}</span>
                </button>
              )
            })}
          </div>

          {escolha !== null && (
            <div className="mt-5" aria-live="polite">
              <p className={`font-bold ${item.opcoes[escolha].certa ? 'text-certo' : 'text-erro'}`}>
                {item.opcoes[escolha].certa ? 'Certo' : 'Não foi dessa vez'}
              </p>
              <Texto texto={item.questao.explicacao} estilo="interface" className="mt-1" />
              <button type="button" className={`${botaoPrimario} mt-5 w-full sm:w-auto`} onClick={proxima} autoFocus>
                {indice + 1 < total ? 'Próxima questão' : 'Ver resultado'}
              </button>
            </div>
          )}
        </article>
      )}
    </div>
  )
}
