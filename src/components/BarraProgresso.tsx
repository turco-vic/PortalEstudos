interface Props {
  porcentagem: number
  rotulo: string
  className?: string
}

export function BarraProgresso({ porcentagem, rotulo, className = '' }: Props) {
  const valor = Math.max(0, Math.min(100, porcentagem))
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-linha ${className}`}
      role="progressbar"
      aria-label={rotulo}
      aria-valuenow={valor}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-tinta" style={{ width: `${valor}%` }} />
    </div>
  )
}
