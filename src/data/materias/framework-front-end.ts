import type { Materia } from '../../types'

export const frameworkFrontEnd: Materia = {
  id: 'framework-front-end',
  nome: 'Framework Front-End',
  semestre: 2,
  status: 'em andamento',
  provas: [{ titulo: 'Formativa', data: '2026-12-02' }],

  resumo: [
    {
      id: 'visao-geral',
      titulo: 'Como as tecnologias trabalham juntas',
      texto: `
A formativa é **conceitual**: é preciso saber **para que serve cada tecnologia** e **como elas funcionam em conjunto** na aplicação.

- **Vue 3**: cria os **componentes** e a **interface** da aplicação.
- **Vite**: **cria, executa** (servidor de desenvolvimento) e **prepara o projeto para publicação** (build).
- **Vue Router**: decide **qual página aparece** conforme a URL, sem recarregar o navegador.
- **Pinia**: guarda as **informações compartilhadas** entre páginas, como produtos, carrinho e usuário logado.
- **Axios**: faz a **comunicação com APIs** e busca dados externos.
- **Tailwind CSS e responsividade**: **estilizam** a aplicação e deixam as telas **adaptáveis** a celular, tablet e computador.

Exemplo de tudo junto numa loja:

1. O **Vite** roda o projeto (npm run dev).
2. O usuário abre /produtos e o **Vue Router** mostra a ProdutosView.
3. A página chama uma action da **Pinia**, que usa o **Axios** para buscar os produtos na API.
4. Os produtos ficam no state da store e os **componentes Vue** mostram a lista com v-for.
5. O **Tailwind** estiliza os cards num grid que tem 1 coluna no celular e 4 no desktop.
6. Ao clicar em "Adicionar", o produto vai para o **carrinho na Pinia**, e o contador do cabeçalho (outro componente) atualiza sozinho.
`,
    },
    {
      id: 'vue3',
      titulo: 'Vue 3: componentes e reatividade',
      texto: `
**Vue 3** é um framework JavaScript para criar interfaces com **componentes**. Cada componente é um arquivo **.vue** com três partes:

- **<template>**: o HTML
- **<script setup>**: a lógica
- **<style>**: o CSS

**Reatividade:**
- ref() guarda um valor; quando ele muda, **a tela atualiza sozinha**. No script usa-se **.value**; no template, **não**.
- computed() cria um valor **calculado** a partir de outros (ex.: total do carrinho). Recalcula sozinho quando os dados mudam.

**Diretivas:**
- **v-if**: mostra ou não um elemento
- **v-for**: repete um elemento para cada item de uma lista (sempre com **:key**)
- **v-model**: liga um input a um dado (nos dois sentidos)
- @click: escuta um evento (atalho de v-on:click)
- **:atributo**: liga um atributo a um dado (atalho de v-bind)

**Criar projeto:** npm create vue@latest, depois npm install e npm run dev.

~~~vue
<script setup>
import { ref, computed } from 'vue'

const quantidade = ref(1)
const total = computed(() => quantidade.value * 10)
</script>

<template>
  <input v-model="quantidade" type="number" />
  <p>Total: R$ {{ total }}</p>
</template>
~~~
`,
    },
    {
      id: 'vite',
      titulo: 'Vite',
      texto: `
**Vite** é a ferramenta que **cria, executa e prepara o projeto para publicação**.

- **Criar**: npm create vue@latest monta o projeto já usando o Vite.
- **Executar**: npm run dev sobe um **servidor de desenvolvimento** rápido. Ao salvar um arquivo, a tela atualiza na hora, sem perder o estado (**HMR**, Hot Module Replacement).
- **Publicar**: npm run build gera a versão **otimizada** (arquivos minificados) na pasta **dist**, que é o que vai para o servidor. npm run preview testa essa versão localmente.

A configuração fica no **vite.config.js**, onde ficam os **plugins** (ex.: o do Vue e o do Tailwind).

Resumindo: o Vue é o framework com que você escreve a aplicação; o Vite é a ferramenta que **roda e empacota** essa aplicação.
`,
    },
    {
      id: 'vue-router',
      titulo: 'Vue Router',
      texto: `
Biblioteca oficial de **rotas** do Vue. Associa cada **URL a um componente** e troca de página **sem recarregar** o navegador (**SPA**, Single Page Application).

- **Rotas**: lista de objetos { path, name, component } no arquivo src/router/index.js.
- **<RouterLink to="/sobre">**: link de navegação (no lugar do <a>).
- **<RouterView />**: lugar onde a página da rota atual aparece.
- **Rota dinâmica**: /produtos/:id; o componente lê o valor com useRoute().params.id.
- **Navegar pelo código**: useRouter().push('/login').
- **Guarda de rota**: router.beforeEach() bloqueia páginas, por exemplo exigindo login.

~~~js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/produtos/:id', component: () => import('../views/ProdutoView.vue') },
  ],
})
~~~
`,
    },
    {
      id: 'pinia',
      titulo: 'Pinia: estado global',
      texto: `
Biblioteca oficial de **estado global** do Vue. Guarda dados que **várias páginas usam** (usuário logado, carrinho, produtos, filtros) **sem passar props** de componente em componente.

- **state**: os dados da store
- **getters**: valores calculados a partir do state (como um computed)
- **actions**: funções que alteram o state ou chamam APIs

**Uso:** cria-se a store com **defineStore** e usa-se em qualquer componente chamando useNomeStore(). Registra-se no **main.js** com app.use(createPinia()).

~~~js
// src/stores/usuario.js
import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({ nome: '', logado: false }),
  getters: { saudacao: (state) => \`Olá, \${state.nome}\` },
  actions: {
    entrar(nome) { this.nome = nome; this.logado = true },
  },
})
~~~

Diferença para o ref(): um ref() vive **dentro de um componente**; a store da Pinia é **compartilhada** por todos.
`,
    },
    {
      id: 'axios',
      titulo: 'Axios: comunicação com APIs',
      texto: `
Biblioteca para fazer **requisições HTTP** (chamar APIs). Instala-se com npm install axios. A resposta vem em **resposta.data**, já convertida de JSON.

- **Métodos**: **get** (buscar), **post** (criar), **put** (atualizar), **delete** (excluir)
- **async/await**: espera a resposta da API antes de seguir
- **Erros**: use **try/catch** para tratar falhas (API fora do ar, 404, 500)
- **Instância**: axios.create({ baseURL: '...' }) evita repetir o endereço da API em todo lugar

~~~js
import axios from 'axios'
import { ref, onMounted } from 'vue'

const produtos = ref([])
const erro = ref('')

onMounted(async () => {
  try {
    const resposta = await axios.get('https://fakestoreapi.com/products')
    produtos.value = resposta.data
  } catch (e) {
    erro.value = 'Não foi possível carregar os produtos.'
  }
})
~~~

onMounted() roda quando o componente aparece na tela: é o momento comum para buscar os dados.
`,
    },
    {
      id: 'tailwind',
      titulo: 'Tailwind CSS',
      texto: `
Framework CSS **utility-first**: em vez de escrever CSS, você **combina classes prontas** no HTML. Cada classe faz **uma coisa só**.

- **Espaçamento**: p-4 (padding), m-2 (margem), gap-4 (espaço entre itens)
- **Cores e texto**: bg-blue-500 (**fundo**), text-white (**cor do texto**), text-xl (**tamanho**), font-bold
- **Layout**: flex, grid, grid-cols-3, justify-between, items-center
- **Estados**: hover:bg-blue-700, focus:ring, disabled:opacity-50

**Instalação com Vite:**
1. npm install tailwindcss @tailwindcss/vite
2. Adicionar tailwindcss() nos **plugins** do vite.config.js
3. Colocar @import "tailwindcss"; no CSS principal

~~~html
<button class="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
  Salvar
</button>
~~~
`,
    },
    {
      id: 'responsividade',
      titulo: 'Responsividade',
      texto: `
A página **se adapta a qualquer tela**: celular, tablet e desktop. A base é a **meta viewport** no index.html, layout fluido (**Flexbox** ou **Grid**) e regras por tamanho de tela.

- **Meta viewport**: <meta name="viewport" content="width=device-width, initial-scale=1.0">
- **Mobile first**: escreve-se primeiro para o **celular** e depois ajusta-se para telas maiores
- **Breakpoints do Tailwind**: sem prefixo = **todas as telas**; **sm**: 640px, **md**: 768px, **lg**: 1024px, **xl**: 1280px. O prefixo vale **"daquele tamanho para cima"**
- **Testar**: DevTools (F12) e Ctrl+Shift+M para simular celular e tablet

~~~html
<!-- 1 coluna no celular, 2 no tablet, 4 no desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="rounded bg-white p-4 shadow">Card</div>
</div>
~~~
`,
    },
  ],

  perguntas: [
    {
      id: 'p01',
      fonte: 'Formativa (questão 7)',
      pergunta: 'Para que servem o Vue Router e o Pinia em um mesmo projeto?',
      resposta: `
O **Vue Router** decide **qual página aparece** conforme a URL; o **Pinia** guarda **dados que várias páginas usam**, como o usuário logado.

Os dois se complementam: ao trocar de página com o Router, os dados da Pinia **continuam lá**. Ex.: o usuário faz login, o nome fica na store; ele navega para /produtos e o cabeçalho continua mostrando "Olá, Ana". Uma guarda de rota (router.beforeEach) pode até consultar a store para bloquear páginas de quem não está logado.
`,
    },
    {
      id: 'p02',
      fonte: 'Formativa (instruções)',
      pergunta: 'Para que serve cada tecnologia: Vue 3, Vite, Pinia, Axios, Tailwind CSS e responsividade?',
      resposta: `
- **Vue 3**: utilizado para criar os **componentes** e a **interface** da aplicação.
- **Vite**: responsável por **criar, executar** e **preparar o projeto para publicação**.
- **Pinia**: utilizado para controlar **informações compartilhadas**, como produtos e carrinho de compras.
- **Axios**: responsável pela **comunicação com APIs** e pela busca de dados externos.
- **Tailwind CSS e responsividade**: utilizados para **estilizar** a aplicação e criar telas organizadas e **adaptáveis** para celulares, tablets e computadores.

(O guia também cobra o **Vue Router**: associa cada URL a um componente e troca de página sem recarregar.)
`,
    },
    {
      id: 'p03',
      fonte: 'Formativa (instruções)',
      pergunta: 'Como essas tecnologias funcionam em conjunto numa aplicação (ex.: uma loja com carrinho)?',
      resposta: `
1. O **Vite** cria e roda o projeto (npm run dev) e, no fim, gera a versão de publicação (npm run build).
2. O **Vue Router** mostra a página certa para cada URL (/produtos, /carrinho) sem recarregar.
3. A página, feita com **componentes Vue**, chama uma action da **Pinia**.
4. A action usa o **Axios** para buscar os produtos na API (axios.get) e guarda o resultado no state.
5. Os componentes mostram os produtos com v-for e reagem sozinhos quando os dados mudam.
6. Ao adicionar ao carrinho, a **Pinia** atualiza o state e todas as telas que usam o carrinho atualizam juntas (contador no cabeçalho, total na página do carrinho).
7. O **Tailwind** estiliza tudo, e os **breakpoints** (md:, lg:) deixam a tela responsiva.
`,
    },
    {
      id: 'p04',
      fonte: 'Guia (Vue 3)',
      pergunta: 'O que é a reatividade no Vue? Qual a diferença entre ref() e computed()?',
      resposta: `
Reatividade é a tela **atualizar sozinha** quando um dado muda, sem mexer no HTML manualmente.

- **ref()** guarda um valor reativo. No script, lê e altera com **.value** (nome.value = 'Bia'); no template usa direto ({{ nome }}).
- **computed()** cria um valor **calculado** a partir de outros. Ele recalcula sozinho quando os dados de que depende mudam. Ex.: total do carrinho = quantidade x preço.

~~~js
const quantidade = ref(1)
const total = computed(() => quantidade.value * 10)
~~~
`,
    },
    {
      id: 'p05',
      fonte: 'Guia (Vue 3)',
      pergunta: 'Quais são as três partes de um componente .vue e para que servem as diretivas v-if, v-for, v-model, @click e :atributo?',
      resposta: `
Partes do arquivo .vue:
- **<template>**: o HTML do componente
- **<script setup>**: a lógica (dados, funções, imports)
- **<style>**: o CSS

Diretivas:
- **v-if**: mostra ou esconde um elemento conforme uma condição
- **v-for**: repete um elemento para cada item de uma lista, sempre com **:key**
- **v-model**: liga um input a um dado nos dois sentidos (digitou, o dado muda; o dado mudou, o input mostra)
- **@click**: executa uma função quando o elemento é clicado
- **:atributo**: liga um atributo a um dado (ex.: :src="produto.imagem")

~~~vue
<li v-for="p in produtos" :key="p.id">
  {{ p.nome }}
  <button @click="adicionar(p)">Adicionar</button>
</li>
<p v-if="produtos.length === 0">Nenhum produto.</p>
~~~
`,
    },
    {
      id: 'p06',
      fonte: 'Guia (Vite)',
      pergunta: 'Qual é o papel do Vite no projeto?',
      resposta: `
O Vite é responsável por **criar, executar e preparar o projeto para publicação**:

- **Criar**: npm create vue@latest gera o projeto já configurado com o Vite.
- **Executar**: npm run dev sobe o servidor de desenvolvimento, com atualização instantânea ao salvar (HMR).
- **Publicar**: npm run build gera a pasta **dist** com os arquivos otimizados para colocar no servidor.

As configurações e os plugins (Vue, Tailwind) ficam no **vite.config.js**.
`,
    },
    {
      id: 'p07',
      fonte: 'Guia (Vue Router)',
      pergunta: 'Como funciona o Vue Router: rotas, RouterLink, RouterView, rota dinâmica e guarda de rota?',
      resposta: `
- **Rotas**: lista de { path, name, component } em src/router/index.js, criada com createRouter e createWebHistory.
- **<RouterLink to="/sobre">**: link que troca de página sem recarregar.
- **<RouterView />**: onde a página da rota atual aparece.
- **Rota dinâmica**: /produtos/:id; o componente lê o id com useRoute().params.id.
- **Navegar pelo código**: useRouter().push('/login') (ex.: depois de salvar um formulário).
- **Guarda de rota**: router.beforeEach() roda antes de cada troca de página e pode bloquear o acesso (ex.: mandar para /login quem não está logado).

Como tudo acontece sem recarregar a página, a aplicação é uma **SPA** (Single Page Application).
`,
    },
    {
      id: 'p08',
      fonte: 'Guia (Pinia)',
      pergunta: 'O que são state, getters e actions na Pinia? Como criar e usar uma store?',
      resposta: `
- **state**: os dados da store (ex.: itens do carrinho)
- **getters**: valores calculados a partir do state, como um computed (ex.: total do carrinho)
- **actions**: funções que alteram o state ou chamam APIs (ex.: adicionar item, buscar produtos)

Criar com **defineStore**, registrar no main.js com **app.use(createPinia())** e usar em qualquer componente com useNomeStore():

~~~js
// src/stores/carrinho.js
export const useCarrinhoStore = defineStore('carrinho', {
  state: () => ({ itens: [] }),
  getters: { total: (state) => state.itens.reduce((s, i) => s + i.preco, 0) },
  actions: {
    adicionar(produto) { this.itens.push(produto) },
  },
})

// em qualquer componente
const carrinho = useCarrinhoStore()
carrinho.adicionar(produto)
~~~
`,
    },
    {
      id: 'p09',
      fonte: 'Guia (Axios)',
      pergunta: 'Como buscar dados de uma API com Axios e tratar erros?',
      resposta: `
- Instalar com npm install axios.
- Usar o método do verbo HTTP: **get** (buscar), **post** (criar), **put** (atualizar), **delete** (excluir).
- Usar **async/await** para esperar a resposta.
- Os dados vêm em **resposta.data**, já convertidos de JSON.
- Tratar falhas (API fora do ar, 404, 500) com **try/catch**.
- axios.create({ baseURL }) evita repetir o endereço da API.

~~~js
onMounted(async () => {
  try {
    const resposta = await axios.get('https://fakestoreapi.com/products')
    produtos.value = resposta.data
  } catch (e) {
    erro.value = 'Não foi possível carregar os produtos.'
  }
})
~~~
`,
    },
    {
      id: 'p10',
      fonte: 'Guia (Tailwind e responsividade)',
      pergunta: 'O que é o Tailwind CSS (utility-first) e como fazer uma tela responsiva com ele?',
      resposta: `
O Tailwind é um framework CSS **utility-first**: em vez de escrever CSS, você **combina classes prontas** no HTML, cada uma fazendo uma coisa só (p-4, bg-blue-500, text-white, flex, grid-cols-3, hover:bg-blue-700).

Responsividade é a página **se adaptar** a celular, tablet e desktop:
- **Meta viewport** no index.html
- Layout fluido com **Flexbox** ou **Grid**
- **Mobile first**: primeiro o celular, depois as telas maiores
- **Breakpoints**: sem prefixo vale para todas as telas; sm: 640px, md: 768px, lg: 1024px, xl: 1280px, sempre **daquele tamanho para cima**

~~~html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">...</div>
~~~

Celular: 1 coluna. A partir de 768px: 2. A partir de 1024px: 4.
`,
    },
  ],

  flashcards: [
    { id: 'f01', frente: 'Para que serve o Vue 3?', verso: 'Criar os **componentes** e a **interface** da aplicação.' },
    { id: 'f02', frente: 'Para que serve o Vite?', verso: '**Criar, executar** (servidor de desenvolvimento) e **preparar o projeto para publicação** (build).' },
    { id: 'f03', frente: 'Para que serve o Vue Router?', verso: 'Associar cada **URL a um componente** e trocar de página **sem recarregar** (SPA).' },
    { id: 'f04', frente: 'Para que serve a Pinia?', verso: 'Guardar **dados compartilhados** entre componentes e páginas (usuário logado, carrinho, produtos).' },
    { id: 'f05', frente: 'Para que serve o Axios?', verso: 'Fazer **requisições HTTP**: comunicação com APIs e busca de dados externos.' },
    { id: 'f06', frente: 'Para que serve o Tailwind CSS?', verso: '**Estilizar** com classes utilitárias prontas, direto no HTML.' },
    { id: 'f07', frente: 'Três partes de um arquivo .vue', verso: '**<template>** (HTML), **<script setup>** (lógica) e **<style>** (CSS).' },
    { id: 'f08', frente: 'ref(): como alterar o valor no script?', verso: 'Com **.value**: nome.value = "Bia". No template, sem .value.' },
    { id: 'f09', frente: 'computed()', verso: 'Valor **calculado** a partir de outros, que recalcula sozinho (ex.: total do carrinho).' },
    { id: 'f10', frente: 'v-if', verso: '**Mostra ou não** um elemento conforme uma condição.' },
    { id: 'f11', frente: 'v-for', verso: '**Repete** um elemento para cada item da lista. Sempre com **:key**.' },
    { id: 'f12', frente: 'v-model', verso: 'Liga um **input a um dado** nos dois sentidos.' },
    { id: 'f13', frente: '@click e :atributo', verso: '@click escuta o **evento** de clique; :atributo **liga um atributo** a um dado (ex.: :src).' },
    { id: 'f14', frente: 'Comandos para criar e rodar um projeto Vue', verso: '**npm create vue@latest**, npm install e **npm run dev**.' },
    { id: 'f15', frente: 'npm run build', verso: 'Gera a versão **otimizada para publicação** na pasta **dist**.' },
    { id: 'f16', frente: '<RouterLink> x <RouterView>', verso: '**RouterLink**: link de navegação. **RouterView**: lugar onde a **página da rota atual** aparece.' },
    { id: 'f17', frente: 'Rota dinâmica /produtos/:id: como ler o id?', verso: 'useRoute().**params.id**.' },
    { id: 'f18', frente: 'Navegar pelo código no Vue Router', verso: 'useRouter().**push**("/login").' },
    { id: 'f19', frente: 'router.beforeEach()', verso: '**Guarda de rota**: roda antes de cada navegação e pode bloquear páginas (ex.: exigir login).' },
    { id: 'f20', frente: 'Pinia: state, getters e actions', verso: '**state**: dados. **getters**: valores calculados (como computed). **actions**: funções que alteram o state ou chamam APIs.' },
    { id: 'f21', frente: 'Como criar e registrar uma store Pinia?', verso: 'Criar com **defineStore**; registrar no main.js com **app.use(createPinia())**; usar com useNomeStore().' },
    { id: 'f22', frente: 'Onde vêm os dados da resposta do Axios?', verso: 'Em **resposta.data**, já convertidos de JSON.' },
    { id: 'f23', frente: 'Métodos do Axios e o que fazem', verso: '**get** busca, **post** cria, **put** atualiza, **delete** exclui.' },
    { id: 'f24', frente: 'Como tratar erro numa chamada com Axios?', verso: 'Com **try/catch** (API fora do ar, 404, 500).' },
    { id: 'f25', frente: 'axios.create({ baseURL })', verso: 'Cria uma **instância** com o endereço da API, para não repetir a URL em todo lugar.' },
    { id: 'f26', frente: 'O que é utility-first?', verso: 'Em vez de escrever CSS, **combinar classes prontas**, cada uma fazendo uma coisa só.' },
    { id: 'f27', frente: 'bg-blue-500 x text-white x text-xl', verso: '**bg-** muda o **fundo**; **text-white** a **cor** do texto; **text-xl** o **tamanho** do texto.' },
    { id: 'f28', frente: 'Breakpoints do Tailwind', verso: 'Sem prefixo: todas as telas. **sm** 640px, **md** 768px, **lg** 1024px, **xl** 1280px. Valem **daquele tamanho para cima**.' },
    { id: 'f29', frente: 'grid-cols-1 md:grid-cols-3', verso: '**1 coluna** no celular e **3 colunas** a partir de 768px (tablet/desktop).' },
    { id: 'f30', frente: 'O que é mobile first?', verso: 'Escrever primeiro o layout do **celular** e depois ajustar para telas maiores.' },
    { id: 'f31', frente: 'Meta viewport', verso: '<meta name="viewport" content="width=device-width, initial-scale=1.0"> no index.html: base da responsividade.' },
    { id: 'f32', frente: 'Instalar Tailwind com Vite (3 passos)', verso: 'npm install tailwindcss @tailwindcss/vite; **tailwindcss()** nos plugins do vite.config.js; **@import "tailwindcss";** no CSS.' },
    { id: 'f33', frente: 'Como testar responsividade no navegador?', verso: 'DevTools (**F12**) e **Ctrl+Shift+M** para simular celular e tablet.' },
    { id: 'f34', frente: 'Vue Router + Pinia no mesmo projeto', verso: 'O Router decide **qual página** aparece; a Pinia guarda os **dados** que várias páginas usam.' },
  ],

  questoes: [
    {
      id: 'q01',
      tipo: 'multipla',
      enunciado: "Em const nome = ref('Ana'), como mudar o valor dentro do script?",
      opcoes: ["nome.value = 'Bia'", "nome = 'Bia'", "ref.nome = 'Bia'", "this.nome = 'Bia'"],
      correta: 0,
      explicacao: 'No script, o valor de um ref() é acessado e alterado por .value. No template não precisa do .value.',
    },
    {
      id: 'q02',
      tipo: 'multipla',
      enunciado: 'Qual componente mostra a página da rota atual?',
      opcoes: ['<RouterView>', '<RouterLink>', '<App>', '<Router>'],
      correta: 0,
      explicacao: 'O <RouterView /> é o lugar onde a página da rota aparece. O <RouterLink> é só o link de navegação.',
    },
    {
      id: 'q03',
      tipo: 'multipla',
      enunciado: 'O Pinia serve para:',
      opcoes: ['Guardar dados compartilhados entre componentes', 'Criar rotas', 'Estilizar componentes', 'Instalar pacotes'],
      correta: 0,
      explicacao: 'A Pinia é a biblioteca de estado global: guarda dados que várias páginas usam, como usuário logado e carrinho.',
    },
    {
      id: 'q04',
      tipo: 'multipla',
      enunciado: 'Qual comando busca a lista de produtos de uma API?',
      opcoes: ["axios.get('/produtos')", "axios.post('/produtos')", "axios.delete('/produtos')", "axios.put('/produtos')"],
      correta: 0,
      explicacao: 'get busca dados. post cria, put atualiza e delete exclui.',
    },
    {
      id: 'q05',
      tipo: 'multipla',
      enunciado: 'A classe bg-blue-500 deixa:',
      opcoes: ['O fundo azul', 'O texto azul', 'A borda azul', 'A sombra azul'],
      correta: 0,
      explicacao: 'O prefixo bg- é de background (fundo). Texto azul seria text-blue-500 e borda, border-blue-500.',
    },
    {
      id: 'q06',
      tipo: 'multipla',
      enunciado: 'Com grid grid-cols-1 md:grid-cols-3, quantas colunas aparecem no celular e no desktop?',
      opcoes: ['1 e 3', '3 e 1', '1 e 1', '3 e 3'],
      correta: 0,
      explicacao: 'Sem prefixo vale para todas as telas (1 coluna no celular). md: vale de 768px para cima, então no desktop são 3.',
    },
    {
      id: 'q07',
      tipo: 'multipla',
      enunciado: 'Qual ferramenta é responsável por criar, executar e preparar o projeto para publicação?',
      opcoes: ['Vite', 'Pinia', 'Axios', 'Vue Router'],
      correta: 0,
      explicacao: 'O Vite cria o projeto, roda o servidor de desenvolvimento (npm run dev) e gera o build (npm run build).',
    },
    {
      id: 'q08',
      tipo: 'multipla',
      enunciado: 'Qual comando gera a versão do projeto pronta para publicação?',
      opcoes: ['npm run build', 'npm run dev', 'npm install', 'npm create vue@latest'],
      correta: 0,
      explicacao: 'npm run build gera os arquivos otimizados na pasta dist. npm run dev só roda em desenvolvimento.',
    },
    {
      id: 'q09',
      tipo: 'vf',
      enunciado: 'No template de um componente Vue, é preciso usar .value para mostrar o valor de um ref().',
      correta: false,
      explicacao: 'No template o Vue desembrulha o ref sozinho: usa-se {{ nome }}. O .value é só no script.',
    },
    {
      id: 'q10',
      tipo: 'multipla',
      enunciado: 'Qual diretiva liga um campo de input a um dado, nos dois sentidos?',
      opcoes: ['v-model', 'v-if', 'v-for', '@click'],
      correta: 0,
      explicacao: 'v-model faz o input e o dado ficarem sempre iguais: digitou, o dado muda; o dado mudou, o input mostra.',
    },
    {
      id: 'q11',
      tipo: 'multipla',
      enunciado: 'Qual diretiva repete um elemento para cada item de uma lista?',
      opcoes: ['v-for', 'v-if', 'v-model', ':key'],
      correta: 0,
      explicacao: 'v-for repete o elemento. Deve vir sempre acompanhado de :key, que identifica cada item.',
    },
    {
      id: 'q12',
      tipo: 'multipla',
      enunciado: 'Para mostrar o total do carrinho, que muda sempre que a quantidade muda, o mais indicado é usar:',
      opcoes: ['computed()', 'v-for', 'onMounted()', 'axios.get()'],
      correta: 0,
      explicacao: 'computed() cria um valor calculado a partir de outros e recalcula sozinho quando eles mudam.',
    },
    {
      id: 'q13',
      tipo: 'multipla',
      enunciado: 'Numa rota /produtos/:id, como o componente lê o id?',
      opcoes: ['useRoute().params.id', 'useRouter().push(id)', 'props.id.value', 'axios.get(id)'],
      correta: 0,
      explicacao: 'useRoute() dá acesso à rota atual, e params guarda os valores dinâmicos da URL.',
    },
    {
      id: 'q14',
      tipo: 'multipla',
      enunciado: 'Qual recurso do Vue Router pode bloquear uma página para quem não está logado?',
      opcoes: ['router.beforeEach() (guarda de rota)', '<RouterLink>', 'createWebHistory()', 'defineStore()'],
      correta: 0,
      explicacao: 'beforeEach roda antes de cada navegação e pode redirecionar para /login.',
    },
    {
      id: 'q15',
      tipo: 'vf',
      enunciado: 'Com o Vue Router, a troca de página acontece sem recarregar o navegador.',
      correta: true,
      explicacao: 'Por isso a aplicação é uma SPA (Single Page Application): só o componente da rota muda.',
    },
    {
      id: 'q16',
      tipo: 'multipla',
      enunciado: 'Na Pinia, onde fica uma função que adiciona um produto ao carrinho?',
      opcoes: ['actions', 'state', 'getters', 'routes'],
      correta: 0,
      explicacao: 'actions são as funções que alteram o state ou chamam APIs. state guarda os dados e getters calculam valores.',
    },
    {
      id: 'q17',
      tipo: 'multipla',
      enunciado: 'Na Pinia, o total do carrinho calculado a partir dos itens é um:',
      opcoes: ['getter', 'state', 'action', 'plugin'],
      correta: 0,
      explicacao: 'getters são valores calculados a partir do state, como um computed.',
    },
    {
      id: 'q18',
      tipo: 'multipla',
      enunciado: 'Como a Pinia é registrada na aplicação?',
      opcoes: ['app.use(createPinia()) no main.js', 'Em <RouterView />', 'No vite.config.js', 'Com axios.create()'],
      correta: 0,
      explicacao: 'No main.js, app.use(createPinia()). Depois cada store é criada com defineStore.',
    },
    {
      id: 'q19',
      tipo: 'vf',
      enunciado: 'Sem a Pinia, para compartilhar o carrinho entre várias páginas seria preciso passar props de componente em componente.',
      correta: true,
      explicacao: 'É exatamente esse problema que o estado global resolve: qualquer componente acessa a store direto.',
    },
    {
      id: 'q20',
      tipo: 'multipla',
      enunciado: 'Numa chamada com Axios, onde ficam os dados devolvidos pela API?',
      opcoes: ['resposta.data', 'resposta.value', 'resposta.json', 'resposta.body.text'],
      correta: 0,
      explicacao: 'O Axios já converte o JSON e coloca o resultado em resposta.data.',
    },
    {
      id: 'q21',
      tipo: 'multipla',
      enunciado: 'Qual é a forma recomendada de tratar uma falha (API fora do ar, 404, 500) numa chamada com Axios usando await?',
      opcoes: ['try/catch', 'v-if', 'computed()', 'router.push()'],
      correta: 0,
      explicacao: 'O await lança o erro se a requisição falhar; o catch captura e permite mostrar uma mensagem.',
    },
    {
      id: 'q22',
      tipo: 'multipla',
      enunciado: 'Qual método do Axios cria um novo registro na API?',
      opcoes: ['post', 'get', 'put', 'delete'],
      correta: 0,
      explicacao: 'post cria, get busca, put atualiza e delete exclui. São os mesmos verbos HTTP do back-end.',
    },
    {
      id: 'q23',
      tipo: 'vf',
      enunciado: 'axios.create({ baseURL }) serve para não repetir o endereço da API em todas as chamadas.',
      correta: true,
      explicacao: 'A instância guarda a baseURL; depois basta chamar api.get("/produtos").',
    },
    {
      id: 'q24',
      tipo: 'multipla',
      enunciado: 'O que significa o Tailwind ser utility-first?',
      opcoes: [
        'Estilizar combinando classes prontas, cada uma com uma função',
        'Usar só componentes prontos, como botões e modais',
        'Escrever todo o CSS num arquivo separado',
        'Gerar o CSS a partir de uma API',
      ],
      correta: 0,
      explicacao: 'Cada classe faz uma coisa só (p-4, text-white, flex) e você combina no HTML.',
    },
    {
      id: 'q25',
      tipo: 'multipla',
      enunciado: 'No Tailwind, qual classe muda a cor do fundo ao passar o mouse?',
      opcoes: ['hover:bg-blue-700', 'bg-blue-700', 'focus:ring', 'md:bg-blue-700'],
      correta: 0,
      explicacao: 'O prefixo hover: aplica a classe só quando o mouse está em cima. md: é breakpoint, não estado.',
    },
    {
      id: 'q26',
      tipo: 'vf',
      enunciado: 'No Tailwind, o prefixo md: aplica a classe somente em telas de 768px para baixo.',
      correta: false,
      explicacao: 'É ao contrário: md: vale de 768px para cima. Classes sem prefixo valem para todas as telas (mobile first).',
    },
    {
      id: 'q27',
      tipo: 'multipla',
      enunciado: 'O que significa mobile first?',
      opcoes: [
        'Escrever primeiro para o celular e depois ajustar para telas maiores',
        'Fazer uma versão só para celular',
        'Esconder conteúdo no celular',
        'Testar só no celular',
      ],
      correta: 0,
      explicacao: 'As classes sem prefixo são o layout do celular; os breakpoints (md:, lg:) ajustam para telas maiores.',
    },
    {
      id: 'q28',
      tipo: 'multipla',
      enunciado: 'Qual elemento do index.html é a base da responsividade?',
      opcoes: ['A meta viewport', 'O <title>', 'A tag <script>', 'O favicon'],
      correta: 0,
      explicacao: 'Sem a meta viewport (width=device-width, initial-scale=1.0), o celular mostra a página como se fosse um desktop encolhido.',
    },
    {
      id: 'q29',
      tipo: 'multipla',
      enunciado: 'Quais são as três partes de um arquivo .vue?',
      opcoes: ['<template>, <script setup> e <style>', '<html>, <head> e <body>', 'state, getters e actions', 'routes, history e path'],
      correta: 0,
      explicacao: 'template é o HTML, script setup é a lógica e style é o CSS do componente.',
    },
    {
      id: 'q30',
      tipo: 'multipla',
      enunciado: 'Numa loja, qual tecnologia busca os produtos na API e qual guarda o carrinho para todas as páginas?',
      opcoes: ['Axios e Pinia', 'Pinia e Axios', 'Vite e Vue Router', 'Tailwind e Vite'],
      correta: 0,
      explicacao: 'O Axios faz a requisição à API; a Pinia guarda os dados compartilhados, como o carrinho.',
    },
  ],
}
