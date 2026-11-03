import { useEffect, useState } from 'react'
import { BarraProgresso } from '../../components/BarraProgresso'
import { botaoPrimario, botaoSecundario } from '../../components/estilos'
import { Texto } from '../../components/Texto'
import { Vazio } from '../../components/Vazio'
import { registrar, registroDe, useProgresso, type Progresso } from '../../lib/progresso'
import { embaralhar, plural } from '../../lib/util'
import type { Materia } from '../../types'
import { SemConteudo } from './SemConteudo'

type Modo = 'todos' | 'pendentes'

/** Quantos cartões passam antes de um "não sei" voltar */
const DISTANCIA_REPETICAO = 2

function montarFila(materia: Materia, progresso: Progresso, modo: Modo): string[] {
  const dados = materia.flashcards.map((c) => {
    const r = registroDe(progresso, materia.id, 'flashcard', c.id)
    return { id: c.id, dominado: r?.ultimo === 'acertei', erros: r?.erros ?? 0 }
  })
  // Embaralha e depois ordena: os não dominados e os mais errados vêm primeiro
  return embaralhar(dados)
    .filter((d) => modo === 'todos' || !d.dominado)
    .sort((a, b) => Number(a.dominado) - Number(b.dominado) || b.erros - a.erros)
    .map((d) => d.id)
}

export function Flashcards({ materia }: { materia: Materia }) {
  const progresso = useProgresso()
  const [modo, setModo] = useState<Modo>('todos')
  const [fila, setFila] = useState(() => montarFila(materia, progresso, 'todos'))
  const [totalRodada, setTotalRodada] = useState(fila.length)
  const [repetidos, setRepetidos] = useState<Set<string>>(() => new Set())
  const [virado, setVirado] = useState(false)

  const atual = materia.flashcards.find((c) => c.id === fila[0])
  const dominados = materia.flashcards.filter(
    (c) => registroDe(progresso, materia.id, 'flashcard', c.id)?.ultimo === 'acertei',
  ).length

  function comecar(novoModo: Modo) {
    const nova = montarFila(materia, progresso, novoModo)
    setModo(novoModo)
    setFila(nova)
    setTotalRodada(nova.length)
    setRepetidos(new Set())
    setVirado(false)
  }

  function responder(sabia: boolean) {
    if (!atual) return
    registrar(materia.id, 'flashcard', atual.id, sabia ? 'acertei' : 'errei')
    setVirado(false)
    if (sabia) {
      setFila(fila.slice(1))
    } else {
      const resto = fila.slice(1)
      const pos = Math.min(DISTANCIA_REPETICAO, resto.length)
      setFila([...resto.slice(0, pos), atual.id, ...resto.slice(pos)])
      setRepetidos(new Set(repetidos).add(atual.id))
    }
  }

  // Atalhos: espaço vira, seta esquerda "não sei", seta direita "sei"
  useEffect(() => {
    function tecla(e: KeyboardEvent) {
      const alvo = e.target as HTMLElement
      if (alvo.closest('input, textarea, select, button, [role="tab"]')) return
      if (e.key === ' ') {
        e.preventDefault()
        setVirado((v) => !v)
      } else if (virado && e.key === 'ArrowRight') {
        responder(true)
      } else if (virado && e.key === 'ArrowLeft') {
        responder(false)
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  if (materia.flashcards.length === 0) return <SemConteudo materia={materia} oQue="flashcards" />

  const concluidos = totalRodada - fila.length

  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-apagado">
          {dominados} de {materia.flashcards.length} dominados no total
        </p>
        <div className="flex gap-2" role="group" aria-label="Quais cartões estudar">
          {(
            [
              ['todos', 'Todos'],
              ['pendentes', 'Só os que não domino'],
            ] as const
          ).map(([id, nome]) => (
            <button
              key={id}
              type="button"
              aria-pressed={modo === id}
              onClick={() => comecar(id)}
              className={`rounded-full border px-3 py-1 text-sm font-bold ${
                modo === id ? 'border-tinta bg-tinta-clara text-tinta' : 'border-linha text-apagado hover:text-grafite'
              }`}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      {totalRodada === 0 ? (
        <div className="mt-6">
          <Vazio titulo="Você domina todos os cartões">Escolha "Todos" pra revisar mesmo assim.</Vazio>
        </div>
      ) : !atual ? (
        <div className="mt-6 rounded-lg border border-linha bg-folha p-6 text-center">
          <p className="text-2xl font-bold">Rodada concluída</p>
          <p className="mt-2 text-apagado">
            {plural(totalRodada - repetidos.size, 'cartão', 'cartões')} de primeira
            {repetidos.size > 0 && `, ${plural(repetidos.size, 'precisou', 'precisaram')} de repetição`}.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" className={botaoPrimario} onClick={() => comecar('todos')}>
              Começar de novo
            </button>
            {dominados < materia.flashcards.length && (
              <button type="button" className={botaoSecundario} onClick={() => comecar('pendentes')}>
                Só os que não domino
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-center gap-3 text-sm text-apagado">
            <BarraProgresso porcentagem={(concluidos / totalRodada) * 100} rotulo="Progresso da rodada" />
            <span className="shrink-0">
              {concluidos}/{totalRodada}
            </span>
          </div>

          <div className="cartao mt-4">
            <div
              className={`cartao-miolo cursor-pointer select-none ${virado ? 'virado' : ''}`}
              onClick={() => setVirado(!virado)}
              aria-live="polite"
            >
              <div
                className="cartao-face flex min-h-64 flex-col items-center justify-center rounded-xl border border-linha bg-folha p-6 text-center"
                aria-hidden={virado}
              >
                {repetidos.has(atual.id) && <p className="mb-3 text-sm text-erro">Voltou pra você revisar</p>}
                <Texto texto={atual.frente} estilo="destaque" />
                <p className="mt-6 text-sm text-apagado">Toque pra ver a resposta</p>
              </div>
              <div
                className="cartao-face cartao-verso flex min-h-64 flex-col justify-center rounded-xl border-2 border-tinta bg-folha p-6"
                aria-hidden={!virado}
              >
                <Texto texto={atual.verso} />
              </div>
            </div>
          </div>

          {virado ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-md border border-erro/40 bg-erro-fundo px-4 py-3 font-bold text-erro"
                onClick={() => responder(false)}
              >
                Não sei
              </button>
              <button
                type="button"
                className="rounded-md border border-certo/40 bg-certo-fundo px-4 py-3 font-bold text-certo"
                onClick={() => responder(true)}
              >
                Sei
              </button>
            </div>
          ) : (
            <button type="button" className={`${botaoPrimario} mt-4 w-full`} onClick={() => setVirado(true)}>
              Virar cartão
            </button>
          )}
          <p className="mt-3 hidden text-center text-sm text-apagado sm:block">
            Atalhos: espaço vira, seta pra esquerda é "não sei", seta pra direita é "sei".
          </p>
        </>
      )}
    </div>
  )
}
