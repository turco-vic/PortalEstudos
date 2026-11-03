export type Status = 'em andamento' | 'concluída'

export interface Prova {
  titulo: string
  /** Formato AAAA-MM-DD */
  data: string
  /** Formato HH:MM. Sem hora, a contagem mostra só os dias. */
  hora?: string
}

/**
 * Os campos de texto aceitam uma marcação simples:
 * - **negrito** vira marca-texto
 * - linhas começando com "- " viram lista, "1. " vira lista numerada
 * - blocos de código entre ~~~java e ~~~
 * - @Anotacoes e metodos() ficam com fonte de código automaticamente
 */
export interface Topico {
  id: string
  titulo: string
  texto: string
}

export interface PerguntaProva {
  id: string
  pergunta: string
  resposta: string
  /** De onde veio a pergunta (ex.: "Exercícios 4") */
  fonte?: string
}

export interface Flashcard {
  id: string
  frente: string
  verso: string
}

export type Questao =
  | {
      id: string
      tipo: 'multipla'
      enunciado: string
      opcoes: string[]
      /** Índice da opção correta (começa em 0) */
      correta: number
      explicacao: string
    }
  | {
      id: string
      tipo: 'vf'
      enunciado: string
      correta: boolean
      explicacao: string
    }

export interface Materia {
  id: string
  nome: string
  semestre: 1 | 2
  status: Status
  provas: Prova[]
  resumo: Topico[]
  perguntas: PerguntaProva[]
  flashcards: Flashcard[]
  questoes: Questao[]
}
