import { useSyncExternalStore } from 'react'

export type Tema = 'claro' | 'escuro'

const CHAVE = 'portal-estudos:tema'
const ouvintes = new Set<() => void>()

function temaAtual(): Tema {
  return document.documentElement.classList.contains('dark') ? 'escuro' : 'claro'
}

export function useTema(): Tema {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f)
      return () => ouvintes.delete(f)
    },
    temaAtual,
  )
}

export function alternarTema() {
  const novo: Tema = temaAtual() === 'escuro' ? 'claro' : 'escuro'
  document.documentElement.classList.toggle('dark', novo === 'escuro')
  try {
    localStorage.setItem(CHAVE, novo)
  } catch {
    // ignora
  }
  ouvintes.forEach((f) => f())
}
