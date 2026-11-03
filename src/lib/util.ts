import type { Materia, Prova } from '../types'

export function embaralhar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function dataDaProva(prova: Prova): Date {
  return new Date(`${prova.data}T${prova.hora ?? '00:00'}:00`)
}

/** Diferença em dias de calendário entre hoje e a data (0 = hoje, negativo = passou) */
export function diasAte(prova: Prova, agora = new Date()): number {
  const alvo = dataDaProva(prova)
  const a = Date.UTC(alvo.getFullYear(), alvo.getMonth(), alvo.getDate())
  const b = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate())
  return Math.round((a - b) / 86_400_000)
}

/** Aceita AAAA-MM-DD ou uma data ISO completa (convertida pro fuso local) */
export function formatarData(iso: string): string {
  if (iso.length > 10) {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  }
  const [ano, mes, dia] = iso.split('-')
  return `${dia}/${mes}/${ano}`
}

const diasDaSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export function formatarDataLonga(prova: Prova): string {
  const d = dataDaProva(prova)
  const base = `${diasDaSemana[d.getDay()]}, ${formatarData(prova.data)}`
  return prova.hora ? `${base} às ${prova.hora}` : base
}

export function formatarDuracao(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const resto = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${resto}` : `${m}:${resto}`
}

export interface ProximaProva {
  materia: Materia
  prova: Prova
  dias: number
}

/** Próximas provas (de hoje em diante) das matérias em andamento, da mais perto pra mais longe */
export function proximasProvas(materias: Materia[], agora = new Date()): ProximaProva[] {
  return materias
    .filter((m) => m.status === 'em andamento')
    .flatMap((materia) => materia.provas.map((prova) => ({ materia, prova, dias: diasAte(prova, agora) })))
    .filter((p) => p.dias >= 0)
    .sort((a, b) => dataDaProva(a.prova).getTime() - dataDaProva(b.prova).getTime())
}

export function plural(n: number, singular: string, pluralForma: string): string {
  return `${n} ${n === 1 ? singular : pluralForma}`
}
