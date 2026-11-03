import { useRef, useState } from 'react'
import {
  botaoPrimario,
  botaoSecundario,
  coresResultado,
  folha,
  opcoesResultado,
  rolarSeEscondido,
} from '../../components/estilos'
import { Texto } from '../../components/Texto'
import { Vazio } from '../../components/Vazio'
import { registrar, registroDe, useProgresso, type Progresso, type Resultado } from '../../lib/progresso'
import { lerRascunho, salvarRascunho } from '../../lib/rascunho'
import type { Materia, PerguntaProva } from '../../types'
import { SemConteudo } from './SemConteudo'

type Filtro = 'todas' | 'revisar' | 'nunca'

const FILTROS: { id: Filtro; nome: string }[] = [
  { id: 'todas', nome: 'Todas' },
  { id: 'revisar', nome: 'Pra revisar' },
  { id: 'nunca', nome: 'Nunca respondidas' },
]

function filtrar(materia: Materia, progresso: Progresso, filtro: Filtro): string[] {
  return materia.perguntas
    .filter((p) => {
      const r = registroDe(progresso, materia.id, 'pergunta', p.id)
      if (filtro === 'revisar') return r && r.ultimo !== 'acertei'
      if (filtro === 'nunca') return !r
      return true
    })
    .map((p) => p.id)
}

export function PerguntasProva({ materia }: { materia: Materia }) {
  const progresso = useProgresso()
  const [filtro, setFiltro] = useState<Filtro>('todas')
  // A lista é congelada ao escolher o filtro, pra não pular perguntas enquanto você marca
  const [ids, setIds] = useState(() => filtrar(materia, progresso, 'todas'))
  const [indice, setIndice] = useState(0)
  const topo = useRef<HTMLElement>(null)

  if (materia.perguntas.length === 0) return <SemConteudo materia={materia} oQue="perguntas da prova" />

  function escolherFiltro(f: Filtro) {
    setFiltro(f)
    setIds(filtrar(materia, progresso, f))
    setIndice(0)
  }

  function irPara(i: number) {
    setIndice(i)
    rolarSeEscondido(topo.current)
  }

  const pergunta = materia.perguntas.find((p) => p.id === ids[indice])

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar perguntas">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => escolherFiltro(f.id)}
            className={`rounded-full border px-3 py-1 text-sm font-bold transition-colors ${
              filtro === f.id ? 'border-tinta bg-tinta-clara text-tinta' : 'border-linha text-apagado hover:text-grafite'
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      {ids.length === 0 ? (
        <div className="mt-6">
          <Vazio titulo={filtro === 'revisar' ? 'Nada pra revisar' : 'Você já respondeu todas'}>
            {filtro === 'revisar'
              ? 'Todas as perguntas que você respondeu estão marcadas como certas.'
              : 'Escolha "Todas" pra treinar de novo.'}
          </Vazio>
        </div>
      ) : (
        <>
          <nav ref={topo} aria-label="Ir pra pergunta" className="mt-4 flex scroll-mt-4 flex-wrap gap-1.5">
            {ids.map((id, i) => {
              const r = registroDe(progresso, materia.id, 'pergunta', id)
              const numero = materia.perguntas.findIndex((p) => p.id === id) + 1
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => irPara(i)}
                  aria-current={i === indice ? 'step' : undefined}
                  aria-label={`Pergunta ${numero}${r ? `, última vez: ${r.ultimo}` : ''}`}
                  className={`h-9 w-9 rounded-md border text-sm font-bold ${
                    r ? coresResultado[r.ultimo] : 'border-linha bg-folha text-apagado'
                  } ${i === indice ? 'ring-2 ring-tinta ring-offset-2 ring-offset-papel' : ''}`}
                >
                  {numero}
                </button>
              )
            })}
          </nav>

          {pergunta && (
            <CartaoPergunta
              key={pergunta.id}
              materia={materia}
              pergunta={pergunta}
              numero={materia.perguntas.indexOf(pergunta) + 1}
              ultimo={registroDe(progresso, materia.id, 'pergunta', pergunta.id)?.ultimo}
              temAnterior={indice > 0}
              temProxima={indice < ids.length - 1}
              onAnterior={() => irPara(indice - 1)}
              onProxima={() => irPara(indice + 1)}
            />
          )}
        </>
      )}
    </div>
  )
}

interface CartaoProps {
  materia: Materia
  pergunta: PerguntaProva
  numero: number
  ultimo?: Resultado
  temAnterior: boolean
  temProxima: boolean
  onAnterior: () => void
  onProxima: () => void
}

function CartaoPergunta({ materia, pergunta, numero, ultimo, temAnterior, temProxima, onAnterior, onProxima }: CartaoProps) {
  const chaveRascunho = `${materia.id}:${pergunta.id}`
  const [resposta, setResposta] = useState(() => lerRascunho(chaveRascunho))
  const [revelada, setRevelada] = useState(false)
  const [marcado, setMarcado] = useState<Resultado | null>(null)

  function marcar(r: Resultado) {
    registrar(materia.id, 'pergunta', pergunta.id, r)
    setMarcado(r)
    if (temProxima) onProxima()
  }

  return (
    <article className={`${folha} mt-5 p-5 sm:p-6`}>
      <p className="text-sm text-apagado">
        Pergunta {numero} de {materia.perguntas.length}
        {pergunta.fonte && `, ${pergunta.fonte}`}
        {ultimo && !marcado && `. Última vez: ${ultimo}`}
      </p>
      <h2 className="mt-2 text-xl leading-snug font-bold sm:text-2xl">{pergunta.pergunta}</h2>

      <label className="mt-5 block">
        <span className="text-sm font-bold">Sua resposta</span>
        <textarea
          value={resposta}
          onChange={(e) => {
            setResposta(e.target.value)
            salvarRascunho(chaveRascunho, e.target.value)
          }}
          rows={5}
          placeholder="Escreva como se fosse na prova. Ninguém vai corrigir além de você."
          className="mt-1.5 block w-full resize-y rounded-md border border-linha bg-papel p-3 font-leitura leading-relaxed placeholder:text-apagado/70 focus:border-tinta focus:outline-none"
        />
      </label>

      {!revelada ? (
        <button type="button" className={`${botaoPrimario} mt-4 w-full sm:w-auto`} onClick={() => setRevelada(true)}>
          Revelar resposta modelo
        </button>
      ) : (
        <div className="mt-6 border-t border-linha pt-5">
          <h3 className="mb-3 font-bold text-tinta">Resposta modelo</h3>
          <Texto texto={pergunta.resposta} />

          <div className="mt-6 rounded-md bg-papel p-4">
            <p className="font-bold">Como foi a sua resposta?</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {opcoesResultado.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => marcar(b.id)}
                  className={`rounded-md border px-3 py-2.5 font-bold ${coresResultado[b.id]} ${
                    marcado === b.id ? 'ring-2 ring-current' : ''
                  }`}
                >
                  {b.nome}
                </button>
              ))}
            </div>
            {marcado && !temProxima && (
              <p className="mt-3 text-sm text-apagado">
                Essa era a última da lista. Use o filtro "Pra revisar" pra treinar só as que você errou.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between gap-2">
        <button type="button" className={botaoSecundario} onClick={onAnterior} disabled={!temAnterior}>
          Anterior
        </button>
        <button type="button" className={botaoSecundario} onClick={onProxima} disabled={!temProxima}>
          Próxima
        </button>
      </div>
    </article>
  )
}
