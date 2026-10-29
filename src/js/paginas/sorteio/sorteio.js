import './sorteio.css'


const TEMAS = [
  'Carona universitária',
  'Docerias',
  'Achados e perdidos',
  'Adoção de animais',
  'Feira do bairro',
  'Troca de livros',
  'Vagas de estágio',
  'Aulas particulares',
  'Serviços do bairro',
  'Quadras e campos',
  'Agenda cultural',
  'Marmitas do dia',
  'Mutirões e voluntariado',
]

const CHAVE_GRUPOS = 'sorteio:grupos'
const CHAVE_SEMENTE = 'sorteio:semente'


let grupos = carregar(CHAVE_GRUPOS, [])
let semente = carregar(CHAVE_SEMENTE, 'pdm-2026')
let resultado = []

function carregar(chave, padrao) {
  try {
    const salvo = localStorage.getItem(chave)
    return salvo ? JSON.parse(salvo) : padrao
  } catch (erro) {
    return padrao
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch (erro) {
  }
}

function numeroDaSemente(texto) {
  let valor = 2166136261
  for (const letra of texto.trim().toLowerCase()) {
    valor = valor ^ letra.charCodeAt(0)
    valor = Math.imul(valor, 16777619)
  }
  return valor >>> 0
}

function geradorDeNumeros(sementeNumerica) {
  let estado = sementeNumerica
  return function proximo() {
    estado = (estado + 0x6d2b79f5) | 0
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}


function normalizar(nome) {
  return nome.trim().replace(/\s+/g, ' ')
}

function sortear(listaDeGrupos, textoDaSemente) {
  const proximo = geradorDeNumeros(numeroDaSemente(textoDaSemente))

  const ordenados = listaDeGrupos
    .map(normalizar)
    .filter(nome => nome !== '')
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const embaralhados = TEMAS
    .map(tema => ({ tema, chave: proximo() }))
    .sort((a, b) => a.chave - b.chave)
    .map(item => item.tema)

  return ordenados.map((grupo, posicao) => ({
    grupo,
    tema: embaralhados[posicao],
  }))
}

function temasSobrando(quantosGrupos) {
  return TEMAS.filter((tema, posicao) => posicao >= quantosGrupos)
}


function sorteio(app) {
  const excedente = grupos.length - TEMAS.length

  app.innerHTML = `
    <section class="sorteio">
      <header class="sorteio__topo">
        <h1>Sorteio dos temas</h1>
        <p class="sorteio__apoio">
          ${grupos.length} de ${TEMAS.length} temas usados.
          A mesma semente devolve sempre o mesmo resultado.
        </p>
      </header>
      <form class="sorteio__form" id="form-grupo">
        <input id="campo-grupo" type="text" placeholder="Nome do grupo"
               aria-label="Nome do grupo" autocomplete="off" required>
        <button type="submit" class="sorteio__botao">Adicionar</button>
      </form>
      <p class="sorteio__aviso" id="aviso"></p>

      ${excedente > 0
        ? `<p class="sorteio__alerta">Há ${excedente} grupo(s) a mais do que temas.
           Acrescente temas na constante TEMAS antes de sortear.</p>`
        : ''}

      <ul class="sorteio__lista">
        ${grupos.length === 0
          ? '<li class="sorteio__vazio">Nenhum grupo cadastrado ainda.</li>'
          : grupos
              .map((grupo, posicao) => `
                <li class="sorteio__item">
                  <span>${grupo}</span>
                  <button class="sorteio__remover" data-posicao="${posicao}"
                          aria-label="Remover ${grupo}">remover</button>
                </li>`)
              .join('')}
      </ul>

      <div class="sorteio__semente">
        <label for="campo-semente">Semente</label>
        <input id="campo-semente" type="text" value="${semente}">
      </div>

      <div class="sorteio__acoes">
        <button class="sorteio__botao" id="btn-sortear"
                ${grupos.length === 0 ? 'disabled' : ''}>Sortear</button>
        <button class="sorteio__botao sorteio__botao--vazado" id="btn-limpar">Limpar tudo</button>
      </div>

      ${resultado.length === 0 ? '' : `
        <h2 class="sorteio__titulo">Resultado</h2>
        <ol class="sorteio__resultado">
          ${resultado
            .map(linha => `
              <li class="sorteio__linha">
                <span class="sorteio__grupo">${linha.grupo}</span>
                <span class="sorteio__tema">${linha.tema}</span>
              </li>`)
            .join('')}
        </ol>
        <p class="sorteio__apoio">
          Semente usada: <strong>${semente}</strong>.
          Temas não sorteados: ${temasSobrando(resultado.length).join(', ') || 'nenhum'}.
        </p>`}
    </section>`

  ligarEventos(app)
}

function ligarEventos(app) {
  const form = document.getElementById('form-grupo')
  const campo = document.getElementById('campo-grupo')
  const aviso = document.getElementById('aviso')
  const campoSemente = document.getElementById('campo-semente')

  form.addEventListener('submit', evento => {
    evento.preventDefault()
    const nome = normalizar(campo.value)

    if (nome === '') return

    const repetidos = grupos.filter(
      grupo => grupo.toLowerCase() === nome.toLowerCase()
    )
    if (repetidos.length > 0) {
      aviso.textContent = `O grupo "${nome}" já está na lista.`
      return
    }

    grupos = [...grupos, nome]
    salvar(CHAVE_GRUPOS, grupos)
    resultado = []
    sorteio(app)
  })

  document.querySelectorAll('.sorteio__remover').forEach(botao => {
    botao.addEventListener('click', () => {
      const alvo = Number(botao.dataset.posicao)
      grupos = grupos.filter((grupo, posicao) => posicao !== alvo)
      salvar(CHAVE_GRUPOS, grupos)
      resultado = []
      sorteio(app)
    })
  })

  document.getElementById('btn-sortear').addEventListener('click', () => {
    semente = normalizar(campoSemente.value) || 'pdm-2026'
    salvar(CHAVE_SEMENTE, semente)
    resultado = sortear(grupos, semente)
    sorteio(app)
  })

  document.getElementById('btn-limpar').addEventListener('click', () => {
    grupos = []
    resultado = []
    salvar(CHAVE_GRUPOS, grupos)
    sorteio(app)
  })
}

export default {
  url: '#sorteio',
  label: '',
  icon: 'shuffle',
  pagina: sorteio,
}
