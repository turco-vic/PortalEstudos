# Portal de Estudos - ADS SENAI Roberto Mange

Portal estático pra revisar as matérias do CST em Análise e Desenvolvimento de Sistemas e treinar pras provas.
Sem backend: o conteúdo fica em arquivos TypeScript no repositório e o progresso fica no `localStorage` do navegador.

Stack: Vite, React, TypeScript, Tailwind CSS e React Router.

## Rodando

```bash
npm install
npm run dev      # desenvolvimento
npm run lint     # oxlint
npm run build    # tsc + build de produção em dist/
```

## Deploy na Vercel

Importe o repositório na Vercel. Ela detecta o Vite sozinha (build `npm run build`, saída `dist`).
O `vercel.json` redireciona todas as rotas pro `index.html`, pra que links como `/materia/backend` funcionem ao recarregar a página.

## Como adicionar conteúdo

Cada matéria é um arquivo em `src/data/materias/`. Pra preencher uma matéria, edite o arquivo dela.
Pra criar uma matéria nova, copie um arquivo vazio, mude o `id` e o `nome` e adicione na lista de `src/data/materias/index.ts`.

O formato está em `src/types.ts`. Resumo:

```ts
export const devops: Materia = {
  id: 'devops',                 // aparece na URL: /materia/devops
  nome: 'DevOps',
  semestre: 2,
  status: 'em andamento',       // ou 'concluída' (fica acinzentada na home)
  provas: [{ titulo: 'Prova', data: '2026-12-02', hora: '19:00' }], // hora é opcional
  resumo: [{ id: 'ci-cd', titulo: 'CI/CD', texto: `...` }],
  perguntas: [{ id: 'p01', pergunta: '...', resposta: `...`, fonte: 'Lista 1' }],
  flashcards: [{ id: 'f01', frente: '...', verso: '...' }],
  questoes: [
    { id: 'q01', tipo: 'multipla', enunciado: '...', opcoes: ['certa', 'errada', 'errada'], correta: 0, explicacao: '...' },
    { id: 'q02', tipo: 'vf', enunciado: '...', correta: true, explicacao: '...' },
  ],
}
```

- Os `id` precisam ser únicos dentro da matéria. O progresso é salvo por `id`, então evite trocar o `id` de um item que você já treinou.
- Nas questões de múltipla escolha, as opções são embaralhadas na tela. Pode deixar a certa sempre na posição 0.

### Formatação dos textos

Os campos de texto (resumo, respostas, versos e explicações) aceitam uma marcação simples:

| Escreva                         | Aparece como                         |
| ------------------------------- | ------------------------------------ |
| `**importante**`                | marca-texto amarelo                  |
| linha começando com `- `        | lista                                |
| linha começando com `1. `       | lista numerada                       |
| bloco entre `~~~java` e `~~~`   | bloco de código                      |
| `@RestController`, `findAll()`  | fonte de código (automático)         |

Use `~~~` em vez de três crases nos blocos de código, porque os textos ficam dentro de template strings do TypeScript.

## Progresso

Fica salvo no `localStorage` do navegador (chave `portal-estudos:progresso`): resultado de cada pergunta, flashcard e questão, histórico de simulados e última visita de cada matéria.
Não sincroniza entre aparelhos. Dá pra apagar o progresso de uma matéria na página Progresso.
