import { Link } from 'react-router'
import { botaoPrimario } from '../components/estilos'

export function NaoEncontrada() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Essa página não existe</h1>
      <p className="mt-2 text-apagado">O endereço pode estar errado ou a matéria mudou de nome.</p>
      <Link to="/" className={`${botaoPrimario} mt-6`}>
        Ver todas as matérias
      </Link>
    </div>
  )
}
