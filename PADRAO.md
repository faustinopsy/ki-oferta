# Padrão das aplicações da disciplina

Todo app da disciplina segue este molde: o KiOferta é o exemplo completo.
Quem abre um projeto novo deve encontrar as mesmas pastas, o mesmo roteador,
a mesma navbar e telas escritas do mesmo jeito.

---

## 1. Pastas

```
src/
├── index.html            #app (telas) e #navbar (menu)
├── css/
│   ├── style.css         só importa a base
│   └── base.css          tokens (cores, texto, espaço) e peças globais
└── js/
    ├── main.js           o roteador
    ├── rotas/rotas.js    o mapa de rotas
    ├── navbar/           o menu (js + css)
    ├── paginas/          uma pasta por tela: nome.js + nome.css
    ├── componentes/      pedaços que se repetem: nome.js + nome.css
    ├── servicos/         de onde vêm os dados (mock, API, serviços externos)
    ├── sessao/           quem está usando o app agora
    ├── armazenamento/    o que fica salvo no aparelho (localStorage)
    ├── dadosMockados/    dados de exemplo
    └── util/             formatação (preço, distância, tempo, escapar)
```

Regra: **o CSS mora ao lado do JS que o usa** e é importado por ele
(`import './buscar.css'`). Em `css/` fica só o que vale para o app inteiro.

---

## 2. O roteador (main.js)

```js
function renderizarPagina() {
    const hash = window.location.hash || '#buscar'
    const [url, query] = hash.split('?')            // "#produto", "id=3"
    const parametros = new URLSearchParams(query)   // .get("id") -> "3"
    const rota = mapaderotas.find(tela => tela.url === url)

    // telas fora do menu dizem, em "aba", qual item do menu fica aceso
    navbar(mapaderotas, rota ? (rota.aba || rota.url) : '')
    window.scrollTo(0, 0)

    if (!rota) {
        naoEncontrada.pagina(app, parametros)
    } else {
        rota.pagina(app, parametros)
    }
    createIcons({ icons })                          // depois de cada tela
}
```

- A rota é o que vem **antes** do `?`; os parâmetros, o que vem **depois**.
- `createIcons` roda depois de **toda** tela desenhada.
- Endereço que não existe cai na tela `naoEncontrada`.

---

## 3. O mapa de rotas e a navbar

Toda tela exporta o mesmo objeto:

```js
export default {
  url: '#produto',      // o endereço
  label: '',            // com texto, entra no menu; vazio, só por link
  icon: 'package',      // nome do ícone no lucide
  aba: '#buscar',       // (opcional) item do menu aceso quando a tela está aberta
  pagina: produto,      // a função que desenha
}
```

`rotas.js` lista todas as telas. As que têm `label` aparecem no menu,
**na ordem da lista**: por isso as cinco do menu vêm primeiro.

A navbar não tem lista própria: ela lê o mesmo `mapaderotas`.

```js
item_menu.filter(menu => menu.label !== '').map(...).join('')
```

---

## 4. Como escrever uma tela

```js
import './exemplo.css'
import { algumaConsulta } from '../../servicos/catalogo.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'

// Tela N. Parâmetros: id.
function exemplo(app, parametros) {
  const item = algumaConsulta(parametros.get('id'))

  // 1. caso sem dados primeiro
  if (!item) {
    app.innerHTML = `...vazio(...)...`
    return
  }

  // 2. desenha
  app.innerHTML = `
    ${cabecalho({ titulo: 'Exemplo', voltar: '#buscar' })}
    <section class="tela exemplo">...</section>`

  // 3. liga os eventos
  adicionarEvento(app, parametros)
}

function adicionarEvento(app, parametros) {
  document.getElementById('btn-x').addEventListener('click', () => { ... })
}

export default { url: '#exemplo', label: '', icon: 'circle', pagina: exemplo }
```

Regras:

1. Toda tela recebe `(app, parametros)`.
2. **Navegar é trocar o hash**: links com `href="#produto?id=3"` ou
   `window.location.hash = ...`. Nunca chamar a função de outra tela.
3. Montar parâmetros com `URLSearchParams` e `encodeURIComponent`.
4. **Desvio** (tela que exige login, por exemplo) usa `window.location.replace(...)`
   e `return`: o "voltar" do aparelho não cai de novo na tela barrada.
5. Tela que se redesenha sozinha (depois de salvar, confirmar...) chama
   `createIcons({ icons })` logo depois.
6. Texto que veio de fora (endereço, formulário, API) entra no HTML com `escapar()`.

---

## 5. Componentes

Funções que **devolvem HTML** (texto). A tela encaixa no template.

| Componente | Uso |
|---|---|
| `cabecalho({ titulo, voltar, acoes, meio, icone })` | topo das telas internas |
| `cartaoProduto(resumo)` | linha da busca |
| `linhaOferta(oferta, { maior, menorPreco })` | oferta com sinais de confiança |
| `selo(status)` | Em votação, Aprovada, Rejeitada, Expirada, Conta em análise |
| `reputacao(pontos)` | pílula azul ao lado do nome |
| `miniatura({ imagem, icone, rotulo, pequena })` | foto ou ícone no lugar |
| `vazio({ icone, titulo, texto, acao })` | estado vazio: o que faltou + uma saída |
| `mostrarEstado(elemento, tipo, texto)` | carregando, sucesso, vazio, erro |

---

## 6. Serviços

- A **tela nunca importa `dadosMockados`**: pede ao serviço.
  Quando a API ficar pronta, só o serviço muda.
- `http.js` é o **único** arquivo com `fetch`.
- Contrato de todo serviço: devolve o **objeto**, `null` quando não achou,
  ou **lança** `Error` com a mensagem que a tela vai mostrar.
- O serviço valida o formato **antes** da rede e traduz os nomes de fora
  para os nomes do app.

```js
try {
  const endereco = await buscarCep(campo.value)
  if (endereco === null) { mostrarEstado(estado, 'vazio', '...'); return }
  mostrarEstado(estado, 'sucesso', '...')
} catch (erro) {
  mostrarEstado(estado, 'erro', erro.message)
}
```

---

## 7. CSS

- Classes **BEM**: `bloco__elemento--variacao` (`linha-oferta__barra`, `botao--destaque`).
- Valores vêm dos **tokens** de `base.css`: `var(--cor-primaria)`, `var(--txt-lg)`,
  `var(--margem)`. Nada de cor ou tamanho solto no CSS da tela.
- Grade de 4px: 16 na margem, 12 dentro do cartão, 8 entre cartões, 24 entre seções.
- Preço: sempre `.preco` (vermelho, 700, números tabulares, sem quebra).
- **Uma única ação em destaque** (`botao--destaque`) por tela.

---

## 8. Checklist de uma tela nova

- [ ] pasta `paginas/nome/` com `nome.js` e `nome.css`
- [ ] `export default { url, label, icon, pagina }` (+ `aba` se ficar fora do menu)
- [ ] importada e listada em `rotas/rotas.js`
- [ ] parâmetros lidos com `parametros.get(...)`
- [ ] caso sem dados tratado com `vazio(...)`
- [ ] eventos em `adicionarEvento`
- [ ] dados pedidos a um serviço, nunca ao mock direto
- [ ] classes BEM e tokens no CSS
