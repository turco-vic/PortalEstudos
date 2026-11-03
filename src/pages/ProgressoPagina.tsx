import { Link } from 'react-router'
import { BarraProgresso } from '../components/BarraProgresso'
import { botaoPrimario, coresResultado, folha } from '../components/estilos'
import { Vazio } from '../components/Vazio'
import { materias, temConteudo } from '../data/materias'
import {
  apagarProgressoDaMateria,
  calcularDominio,
  maisErrados,
  useProgresso,
  type Parcial,
  type TipoItem,
} from '../lib/progresso'
import { formatarData, plural } from '../lib/util'

const NOMES_TIPO: Record<TipoItem, { nome: string; aba: string }> = {
  pergunta: { nome: 'Pergunta da prova', aba: 'perguntas' },
  questao: { nome: 'Quiz', aba: 'quiz' },
  flashcard: { nome: 'Flashcard', aba: 'flashcards' },
}

export function ProgressoPagina() {
  const progresso = useProgresso()
  const comConteudo = materias.filter(temConteudo)
  const semConteudo = materias.filter((m) => !temConteudo(m))
  const errados = maisErrados(progresso, materias)

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Seu progresso</h1>
        <p className="mt-2 max-w-2xl text-apagado">
          A porcentagem considera a última vez que você respondeu cada item: acertou conta inteiro, parcial conta
          metade.
        </p>
      </header>

      <section aria-labelledby="por-materia">
        <h2 id="por-materia" className="text-xl font-bold">
          Por matéria
        </h2>
        <ul className="mt-4 space-y-3">
          {comConteudo.map((m) => {
            const d = calcularDominio(progresso, m)
            const visita = progresso.visitas[m.id]
            const temProgresso = d.perguntas.feitos + d.flashcards.feitos + d.questoes.feitos > 0
            return (
              <li key={m.id} className={`${folha} p-5`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link to={`/materia/${m.id}`} className="text-lg font-bold hover:underline">
                    {m.nome}
                  </Link>
                  <span className="text-2xl font-bold tabular-nums">{d.porcentagem}%</span>
                </div>
                <BarraProgresso porcentagem={d.porcentagem} rotulo={`Domínio de ${m.nome}`} className="mt-3" />

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <Linha nome="Perguntas da prova" parcial={d.perguntas} />
                  <Linha nome="Flashcards" parcial={d.flashcards} />
                  <Linha nome="Quiz" parcial={d.questoes} />
                </dl>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-linha pt-3 text-sm text-apagado">
                  <span>{visita ? `Última visita em ${formatarData(visita)}` : 'Ainda não visitada'}</span>
                  {temProgresso && (
                    <button
                      type="button"
                      className="font-bold text-erro hover:underline"
                      onClick={() => {
                        if (confirm(`Apagar todo o progresso de ${m.nome}? Não dá pra desfazer.`)) {
                          apagarProgressoDaMateria(m.id)
                        }
                      }}
                    >
                      Apagar progresso
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {semConteudo.length > 0 && (
          <p className="mt-4 text-sm text-apagado">
            {plural(semConteudo.length, 'matéria ainda está', 'matérias ainda estão')} sem conteúdo.
          </p>
        )}
      </section>

      <section aria-labelledby="mais-errei">
        <h2 id="mais-errei" className="text-xl font-bold">
          O que você mais errou
        </h2>
        {errados.length === 0 ? (
          <div className="mt-4">
            <Vazio titulo="Nenhum erro registrado ainda">
              Conforme você treina, o que você errar ou acertar só em parte aparece aqui, do mais pro menos errado.
            </Vazio>
            <Link to="/materia/backend?aba=perguntas" className={`${botaoPrimario} mt-4`}>
              Treinar perguntas de Back-End
            </Link>
          </div>
        ) : (
          <ol className="mt-4 space-y-2">
            {errados.map((e) => (
              <li key={`${e.materia.id}:${e.tipo}:${e.id}`}>
                <Link
                  to={`/materia/${e.materia.id}?aba=${NOMES_TIPO[e.tipo].aba}`}
                  className="flex gap-3 rounded-lg border border-linha bg-folha p-4 hover:border-tinta"
                >
                  <span
                    className={`mt-0.5 h-fit shrink-0 rounded border px-2 py-0.5 text-xs font-bold ${coresResultado[e.registro.ultimo]}`}
                    title="Resultado da última tentativa"
                  >
                    {e.registro.ultimo}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">{e.texto}</span>
                    <span className="mt-1 block text-sm text-apagado">
                      {NOMES_TIPO[e.tipo].nome} de {e.materia.nome}. {plural(e.registro.erros, 'erro', 'erros')}
                      {e.registro.parciais > 0 && `, ${plural(e.registro.parciais, 'parcial', 'parciais')}`}
                      {e.registro.acertos > 0 && `, ${plural(e.registro.acertos, 'acerto', 'acertos')}`}.
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

function Linha({ nome, parcial }: { nome: string; parcial: Parcial }) {
  if (parcial.total === 0) return null
  return (
    <div>
      <dt className="text-apagado">{nome}</dt>
      <dd className="mt-0.5">
        <span className="font-bold">
          {parcial.dominados} de {parcial.total}
        </span>{' '}
        dominados, {plural(parcial.feitos, 'já treinado', 'já treinados')}
      </dd>
    </div>
  )
}
