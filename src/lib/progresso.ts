import { useSyncExternalStore } from 'react'
import type { Materia } from '../types'

export type Resultado = 'acertei' | 'parcial' | 'errei'
export type TipoItem = 'pergunta' | 'flashcard' | 'questao'

export interface Registro {
  acertos: number
  parciais: number
  erros: number
  ultimo: Resultado
  /** Data ISO da última tentativa */
  em: string
}

export interface SimuladoFeito {
  em: string
  total: number
  acertos: number
  parciais: number
  erros: number
  segundos: number
}

export interface Progresso {
  versao: 1
  /** Chave: materiaId:tipo:itemId */
  itens: Record<string, Registro>
  /** Última visita por matéria (data ISO) */
  visitas: Record<string, string>
  simulados: Record<string, SimuladoFeito[]>
}

const CHAVE = 'portal-estudos:progresso'
const vazio: Progresso = { versao: 1, itens: {}, visitas: {}, simulados: {} }

function ler(): Progresso {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return vazio
    const dados = JSON.parse(bruto) as Progresso
    return dados.versao === 1 ? { ...vazio, ...dados } : vazio
  } catch {
    return vazio
  }
}

let estado = ler()
const ouvintes = new Set<() => void>()

function salvar(novo: Progresso) {
  estado = novo
  try {
    localStorage.setItem(CHAVE, JSON.stringify(novo))
  } catch {
    // Sem espaço ou modo privado: segue só em memória
  }
  ouvintes.forEach((f) => f())
}

function assinar(f: () => void) {
  ouvintes.add(f)
  // Mantém abas diferentes sincronizadas
  const aoMudarStorage = (e: StorageEvent) => {
    if (e.key === CHAVE) {
      estado = ler()
      f()
    }
  }
  window.addEventListener('storage', aoMudarStorage)
  return () => {
    ouvintes.delete(f)
    window.removeEventListener('storage', aoMudarStorage)
  }
}

export function useProgresso(): Progresso {
  return useSyncExternalStore(assinar, () => estado)
}

export function chaveItem(materiaId: string, tipo: TipoItem, itemId: string): string {
  return `${materiaId}:${tipo}:${itemId}`
}

export function registrar(materiaId: string, tipo: TipoItem, itemId: string, resultado: Resultado) {
  const chave = chaveItem(materiaId, tipo, itemId)
  const atual = estado.itens[chave] ?? { acertos: 0, parciais: 0, erros: 0, ultimo: resultado, em: '' }
  const novo: Registro = {
    acertos: atual.acertos + (resultado === 'acertei' ? 1 : 0),
    parciais: atual.parciais + (resultado === 'parcial' ? 1 : 0),
    erros: atual.erros + (resultado === 'errei' ? 1 : 0),
    ultimo: resultado,
    em: new Date().toISOString(),
  }
  salvar({ ...estado, itens: { ...estado.itens, [chave]: novo } })
}

export function registrarVisita(materiaId: string) {
  salvar({ ...estado, visitas: { ...estado.visitas, [materiaId]: new Date().toISOString() } })
}

export function registrarSimulado(materiaId: string, simulado: SimuladoFeito) {
  const anteriores = estado.simulados[materiaId] ?? []
  salvar({ ...estado, simulados: { ...estado.simulados, [materiaId]: [simulado, ...anteriores].slice(0, 20) } })
}

export function apagarProgressoDaMateria(materiaId: string) {
  const itens = Object.fromEntries(Object.entries(estado.itens).filter(([k]) => !k.startsWith(`${materiaId}:`)))
  const simulados = { ...estado.simulados }
  delete simulados[materiaId]
  salvar({ ...estado, itens, simulados })
}

export function registroDe(p: Progresso, materiaId: string, tipo: TipoItem, itemId: string): Registro | undefined {
  return p.itens[chaveItem(materiaId, tipo, itemId)]
}

const pontos: Record<Resultado, number> = { acertei: 1, parcial: 0.5, errei: 0 }

export interface Parcial {
  total: number
  /** Itens já tentados pelo menos uma vez */
  feitos: number
  /** Itens cuja última tentativa foi "acertei" */
  dominados: number
  pontos: number
}

export interface Dominio {
  /** 0 a 100, considerando a última tentativa de cada item */
  porcentagem: number
  perguntas: Parcial
  flashcards: Parcial
  questoes: Parcial
}

function parcial(p: Progresso, materiaId: string, tipo: TipoItem, ids: string[]): Parcial {
  let feitos = 0
  let dominados = 0
  let soma = 0
  for (const id of ids) {
    const r = registroDe(p, materiaId, tipo, id)
    if (!r) continue
    feitos++
    if (r.ultimo === 'acertei') dominados++
    soma += pontos[r.ultimo]
  }
  return { total: ids.length, feitos, dominados, pontos: soma }
}

export function calcularDominio(p: Progresso, m: Materia): Dominio {
  const perguntas = parcial(p, m.id, 'pergunta', m.perguntas.map((x) => x.id))
  const flashcards = parcial(p, m.id, 'flashcard', m.flashcards.map((x) => x.id))
  const questoes = parcial(p, m.id, 'questao', m.questoes.map((x) => x.id))
  const total = perguntas.total + flashcards.total + questoes.total
  const soma = perguntas.pontos + flashcards.pontos + questoes.pontos
  return { porcentagem: total ? Math.round((soma / total) * 100) : 0, perguntas, flashcards, questoes }
}

export interface ItemErrado {
  materia: Materia
  tipo: TipoItem
  id: string
  texto: string
  registro: Registro
  peso: number
}

/** Itens com mais erros (parcial conta meio erro), do mais errado pro menos */
export function maisErrados(p: Progresso, materias: Materia[], limite = 15): ItemErrado[] {
  const lista: ItemErrado[] = []
  for (const materia of materias) {
    const candidatos: { tipo: TipoItem; id: string; texto: string }[] = [
      ...materia.perguntas.map((x) => ({ tipo: 'pergunta' as const, id: x.id, texto: x.pergunta })),
      ...materia.questoes.map((x) => ({ tipo: 'questao' as const, id: x.id, texto: x.enunciado })),
      ...materia.flashcards.map((x) => ({ tipo: 'flashcard' as const, id: x.id, texto: x.frente })),
    ]
    for (const c of candidatos) {
      const registro = registroDe(p, materia.id, c.tipo, c.id)
      if (!registro) continue
      const peso = registro.erros + registro.parciais * 0.5
      if (peso > 0) lista.push({ materia, ...c, registro, peso })
    }
  }
  // Empate: quem ainda não foi acertado da última vez vem antes
  return lista
    .sort((a, b) => b.peso - a.peso || Number(a.registro.ultimo === 'acertei') - Number(b.registro.ultimo === 'acertei'))
    .slice(0, limite)
}
