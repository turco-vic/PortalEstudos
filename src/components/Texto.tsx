import type { ReactNode } from 'react'

type Bloco =
  | { tipo: 'p'; linhas: string[] }
  | { tipo: 'ul' | 'ol'; itens: string[] }
  | { tipo: 'codigo'; linguagem: string; codigo: string }

const ITEM_UL = /^- /
const ITEM_OL = /^\d+\. /

function separarBlocos(texto: string): Bloco[] {
  const linhas = texto.trim().split('\n')
  const blocos: Bloco[] = []
  let i = 0

  while (i < linhas.length) {
    const linha = linhas[i]

    if (linha.startsWith('~~~')) {
      const linguagem = linha.slice(3).trim()
      const codigo: string[] = []
      i++
      while (i < linhas.length && !linhas[i].startsWith('~~~')) codigo.push(linhas[i++])
      i++
      blocos.push({ tipo: 'codigo', linguagem, codigo: codigo.join('\n') })
      continue
    }

    if (!linha.trim()) {
      i++
      continue
    }

    const lista = ITEM_UL.test(linha) ? ITEM_UL : ITEM_OL.test(linha) ? ITEM_OL : null
    if (lista) {
      const itens: string[] = []
      while (i < linhas.length && lista.test(linhas[i])) itens.push(linhas[i++].replace(lista, ''))
      blocos.push({ tipo: lista === ITEM_UL ? 'ul' : 'ol', itens })
      continue
    }

    const paragrafo: string[] = []
    while (
      i < linhas.length &&
      linhas[i].trim() &&
      !linhas[i].startsWith('~~~') &&
      !ITEM_UL.test(linhas[i]) &&
      !ITEM_OL.test(linhas[i])
    ) {
      paragrafo.push(linhas[i++])
    }
    blocos.push({ tipo: 'p', linhas: paragrafo })
  }

  return blocos
}

// **negrito**, `código`, @Anotacao(...) e metodo()
const INLINE = /(\*\*.+?\*\*|`[^`]+`|(?<![\w.])@[A-Z][A-Za-z]*(?:\([^)\n]*\))?|\b[a-z][A-Za-z]*\(\))/g

function inline(texto: string): ReactNode[] {
  return texto.split(INLINE).map((parte, i) => {
    if (i % 2 === 0) return parte
    if (parte.startsWith('**')) {
      return (
        <mark key={i} className="marca">
          {parte.slice(2, -2)}
        </mark>
      )
    }
    const codigo = parte.startsWith('`') ? parte.slice(1, -1) : parte
    return (
      <code key={i} className="rounded bg-tinta-clara/70 px-1 py-px font-mono text-[0.86em] text-tinta">
        {codigo}
      </code>
    )
  })
}

interface Props {
  texto: string
  /** "leitura" usa a fonte serifada pra textos longos; "destaque" é pra frente de flashcard */
  estilo?: keyof typeof ESTILOS
  className?: string
}

const ESTILOS = {
  leitura: 'font-leitura text-[1.04rem] leading-[1.75]',
  interface: 'text-base leading-relaxed',
  destaque: 'font-leitura text-2xl leading-snug font-semibold',
}

export function Texto({ texto, estilo = 'leitura', className = '' }: Props) {
  const fonte = ESTILOS[estilo]

  return (
    <div className={`space-y-4 ${fonte} ${className}`}>
      {separarBlocos(texto).map((bloco, i) => {
        if (bloco.tipo === 'codigo') {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-md border border-linha bg-papel p-3 font-mono text-[0.8rem] leading-relaxed text-grafite sm:text-sm"
              aria-label={bloco.linguagem ? `Código ${bloco.linguagem}` : 'Código'}
            >
              <code>{bloco.codigo}</code>
            </pre>
          )
        }
        if (bloco.tipo === 'p') {
          return (
            <p key={i}>
              {bloco.linhas.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {inline(l)}
                </span>
              ))}
            </p>
          )
        }
        const Lista = bloco.tipo
        return (
          <Lista
            key={i}
            className={`space-y-1.5 pl-5 ${Lista === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-apagado`}
          >
            {bloco.itens.map((item, j) => (
              <li key={j} className="pl-1">
                {inline(item)}
              </li>
            ))}
          </Lista>
        )
      })}
    </div>
  )
}
