import { useAgora } from '../lib/useAgora'
import { dataDaProva, diasAte, formatarDataLonga } from '../lib/util'
import type { Prova } from '../types'

function textoCurto(dias: number): string {
  if (dias < 0) return 'Já passou'
  if (dias === 0) return 'É hoje'
  if (dias === 1) return 'É amanhã'
  return `Faltam ${dias} dias`
}

/** Contagem em uma linha, pra usar junto de outros textos */
export function ContagemLinha({ prova }: { prova: Prova }) {
  const agora = useAgora()
  const dias = diasAte(prova, agora)
  return (
    <span>
      {prova.titulo}: {formatarDataLonga(prova)}.{' '}
      <strong className={dias >= 0 && dias <= 7 ? 'marca' : 'font-bold'}>{textoCurto(dias)}</strong>
    </span>
  )
}

/** Contagem grande da home */
export function ContagemGrande({ prova }: { prova: Prova }) {
  const agora = useAgora(prova.hora ? 1000 : 60_000)
  const dias = diasAte(prova, agora)
  const restanteMs = dataDaProva(prova).getTime() - agora.getTime()
  const horas = Math.floor(restanteMs / 3_600_000)
  const minutos = Math.floor((restanteMs % 3_600_000) / 60_000)

  let numero: string
  let legenda: string
  if (dias === 0 && prova.hora && restanteMs > 0) {
    numero = `${horas}h${String(minutos).padStart(2, '0')}`
    legenda = 'pra começar'
  } else if (dias === 0) {
    numero = 'Hoje'
    legenda = 'é dia de prova'
  } else {
    numero = String(dias)
    legenda = dias === 1 ? 'dia pra prova' : 'dias pra prova'
  }

  return (
    <div className="flex items-end gap-3" role="timer" aria-live="off">
      <span className="marca font-leitura text-7xl leading-none font-semibold tracking-tight sm:text-8xl">{numero}</span>
      <span className="pb-2 text-lg leading-tight text-apagado">{legenda}</span>
    </div>
  )
}
