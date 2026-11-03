import type { Materia } from '../../types'
import { automacaoIndustrial } from './automacao-industrial'
import { backend } from './backend'
import { bancoDeDados } from './banco-de-dados'
import { cienciaDeDados } from './ciencia-de-dados'
import { computacaoEmNuvem } from './computacao-em-nuvem'
import { devops } from './devops'
import { engenhariaDeSoftware } from './engenharia-de-software'
import { extensao1 } from './extensao-1'
import { extensao2 } from './extensao-2'
import { frameworkFrontEnd } from './framework-front-end'
import { linguagemDeProgramacao } from './linguagem-de-programacao'
import { projetoIntegrador1 } from './projeto-integrador-1'
import { projetoIntegrador2 } from './projeto-integrador-2'
import { tic } from './tic'
import { webFrontEnd } from './web-front-end'

// A ordem aqui é a ordem em que as matérias aparecem na home.
// Pra adicionar uma matéria: crie o arquivo nesta pasta e inclua na lista.
export const materias: Materia[] = [
  backend,
  frameworkFrontEnd,
  cienciaDeDados,
  automacaoIndustrial,
  computacaoEmNuvem,
  devops,
  projetoIntegrador2,
  extensao2,
  bancoDeDados,
  webFrontEnd,
  engenhariaDeSoftware,
  linguagemDeProgramacao,
  projetoIntegrador1,
  tic,
  extensao1,
]

export function buscarMateria(id: string | undefined): Materia | undefined {
  return materias.find((m) => m.id === id)
}

export function temConteudo(m: Materia): boolean {
  return m.resumo.length + m.perguntas.length + m.flashcards.length + m.questoes.length > 0
}
