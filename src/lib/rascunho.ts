// Rascunhos das respostas digitadas. Ficam só nesta aba do navegador (sessionStorage).

const PREFIXO = 'portal-estudos:rascunho:'

export function lerRascunho(chave: string): string {
  try {
    return sessionStorage.getItem(PREFIXO + chave) ?? ''
  } catch {
    return ''
  }
}

export function salvarRascunho(chave: string, texto: string) {
  try {
    if (texto) sessionStorage.setItem(PREFIXO + chave, texto)
    else sessionStorage.removeItem(PREFIXO + chave)
  } catch {
    // ignora
  }
}
