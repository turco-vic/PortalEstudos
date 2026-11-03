import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { BarraProgresso } from '../components/BarraProgresso'
import { ContagemLinha } from '../components/Contagem'
import { buscarMateria } from '../data/materias'
import { calcularDominio, registrarVisita, useProgresso } from '../lib/progresso'
import { diasAte } from '../lib/util'
import { Flashcards } from './abas/Flashcards'
import { PerguntasProva } from './abas/PerguntasProva'
import { Quiz } from './abas/Quiz'
import { Resumo } from './abas/Resumo'
import { Simulado } from './abas/Simulado'
import { NaoEncontrada } from './NaoEncontrada'

const ABAS = ['resumo', 'perguntas', 'flashcards', 'quiz', 'simulado'] as const
type Aba = (typeof ABAS)[number]

export function MateriaPagina() {
  const { id } = useParams()
  const materia = buscarMateria(id)
  const [busca, setBusca] = useSearchParams()
  const progresso = useProgresso()

  useEffect(() => {
    if (materia) registrarVisita(materia.id)
  }, [materia])

  if (!materia) return <NaoEncontrada />

  const pedida = busca.get('aba')
  const aba: Aba = ABAS.includes(pedida as Aba) ? (pedida as Aba) : 'resumo'
  const dominio = calcularDominio(progresso, materia)
  const provasFuturas = materia.provas.filter((p) => diasAte(p) >= 0)

  const nomes: Record<Aba, { nome: string; qtd: number }> = {
    resumo: { nome: 'Resumo', qtd: materia.resumo.length },
    perguntas: { nome: 'Perguntas da prova', qtd: materia.perguntas.length },
    flashcards: { nome: 'Flashcards', qtd: materia.flashcards.length },
    quiz: { nome: 'Quiz', qtd: materia.questoes.length },
    simulado: { nome: 'Simulado', qtd: materia.perguntas.length },
  }

  function trocarAba(nova: Aba) {
    setBusca(nova === 'resumo' ? {} : { aba: nova }, { replace: true })
  }

  return (
    <div>
      <Link to="/" className="text-sm font-bold text-apagado hover:text-grafite">
        Voltar pras matérias
      </Link>

      <header className="mt-3">
        <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{materia.nome}</h1>
        <p className="mt-2 text-apagado">
          {materia.semestre}º semestre, {materia.status}
        </p>
        {provasFuturas.map((p) => (
          <p key={`${p.titulo}-${p.data}`} className="mt-1">
            <ContagemLinha prova={p} />
          </p>
        ))}
        {dominio.perguntas.total + dominio.flashcards.total + dominio.questoes.total > 0 && (
          <div className="mt-4 flex max-w-sm items-center gap-3 text-sm">
            <BarraProgresso porcentagem={dominio.porcentagem} rotulo="Domínio da matéria" />
            <span className="shrink-0 font-bold">{dominio.porcentagem}% dominado</span>
          </div>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Seções da matéria"
        className="-mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-linha px-4 [scrollbar-width:none]"
      >
        {ABAS.map((a) => (
          <button
            key={a}
            type="button"
            role="tab"
            id={`aba-${a}`}
            aria-selected={aba === a}
            aria-controls="painel-aba"
            onClick={() => trocarAba(a)}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 font-bold whitespace-nowrap transition-colors ${
              aba === a ? 'border-tinta text-tinta' : 'border-transparent text-apagado hover:text-grafite'
            }`}
          >
            {nomes[a].nome}
            {nomes[a].qtd > 0 && <span className="ml-1.5 text-sm font-normal text-apagado">{nomes[a].qtd}</span>}
          </button>
        ))}
      </div>

      <div id="painel-aba" role="tabpanel" aria-labelledby={`aba-${aba}`} className="pt-6">
        {aba === 'resumo' && <Resumo key={materia.id} materia={materia} />}
        {aba === 'perguntas' && <PerguntasProva key={materia.id} materia={materia} />}
        {aba === 'flashcards' && <Flashcards key={materia.id} materia={materia} />}
        {aba === 'quiz' && <Quiz key={materia.id} materia={materia} />}
        {aba === 'simulado' && <Simulado key={materia.id} materia={materia} />}
      </div>
    </div>
  )
}
