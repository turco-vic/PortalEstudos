import { Vazio } from '../../components/Vazio'
import type { Materia } from '../../types'

export function SemConteudo({ materia, oQue }: { materia: Materia; oQue: string }) {
  return (
    <Vazio titulo={`Ainda não tem ${oQue} em ${materia.nome}`}>
      Pra adicionar, edite o arquivo{' '}
      <code className="font-mono text-sm text-tinta">src/data/materias/{materia.id}.ts</code>.
    </Vazio>
  )
}
