// Classes reaproveitadas pelos botões e blocos do portal

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-[0.95rem] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export const botaoPrimario = `${base} bg-tinta text-white hover:brightness-110 dark:text-papel`
export const botaoSecundario = `${base} border border-linha bg-folha text-grafite hover:border-tinta hover:text-tinta`
export const botaoTexto = 'font-bold text-tinta underline-offset-4 hover:underline'

export const folha = 'rounded-lg border border-linha bg-folha'

export const coresResultado = {
  acertei: 'bg-certo-fundo text-certo border-certo/40',
  parcial: 'bg-parcial-fundo text-parcial border-parcial/40',
  errei: 'bg-erro-fundo text-erro border-erro/40',
} as const

export const opcoesResultado = [
  { id: 'acertei', nome: 'Acertei' },
  { id: 'parcial', nome: 'Parcial' },
  { id: 'errei', nome: 'Errei' },
] as const

/** Rola até o elemento só se o topo dele estiver fora da tela */
export function rolarSeEscondido(el: HTMLElement | null) {
  if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' })
}
