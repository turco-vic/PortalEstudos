import type { ReactNode } from 'react'

interface Props {
  titulo: string
  children?: ReactNode
}

export function Vazio({ titulo, children }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-linha px-5 py-10 text-center">
      <p className="font-bold">{titulo}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-apagado">{children}</div>}
    </div>
  )
}
