import './mapa.css'
import { mercadosNoMapa, listarMercados, posicaoAtual, produtoPorId } from '../../servicos/catalogo.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { formatarPreco, formatarDistancia, escapar } from '../../util/formatos.js'

// Converte latitude e longitude em posição (%) dentro do quadro do mapa.
// Mapa ilustrativo: o mapa de verdade, com GPS, entra na aula de geolocalização.
function projetar(lat, lng) {
  const pontos = [...listarMercados(), posicaoAtual()]
  const lats = pontos.map(ponto => ponto.lat)
  const lngs = pontos.map(ponto => ponto.lng)
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)]
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)]

  return {
    x: 12 + ((lng - minLng) / (maxLng - minLng)) * 76,
    y: 10 + ((maxLat - lat) / (maxLat - minLat)) * 80,   // norte em cima
  }
}

// "13,49": no marcador o preço vai sem "R$" para caber
function precoCurto(valor) {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Tela 4. Parâmetro opcional: produto. Com ele, cada marcador mostra o preço
// daquele produto; sem ele, o menor preço de cada mercado.
function mapa(app, parametros) {
  const produto = produtoPorId(parametros.get('produto'))
  const marcadores = mercadosNoMapa(produto ? produto.id : null)
  const voce = projetar(posicaoAtual().lat, posicaoAtual().lng)

  if (marcadores.length === 0) {
    app.innerHTML = `
      ${cabecalho({ titulo: 'Mercados com promoção' })}
      ${vazio({
        icone: 'map-pin-off',
        titulo: 'Nenhum mercado com promoção',
        texto: 'Ninguém enviou preços perto de você nesta semana.',
        acao: { href: '#buscar', texto: 'Buscar produtos' },
      })}`
    return
  }

  const menorPreco = Math.min(...marcadores.map(item => item.preco))
  const maisBarato = marcadores.find(item => item.preco === menorPreco)

  app.innerHTML = `
    ${cabecalho({
      titulo: 'Mercados com promoção',
      acoes: `<span class="apoio">${marcadores.length} perto de você</span>`,
    })}

    <section class="mapa">
      ${produto
        ? `<p class="mapa__filtro">
             Preços de <strong>${escapar(produto.nome)}</strong>
             <a href="#mapa">ver todos</a>
           </p>`
        : ''}

      <div class="mapa__quadro">
        <span class="mapa__selo">mapa ilustrativo</span>
        <span class="mapa__voce" style="left: ${voce.x}%; top: ${voce.y}%">
          <span class="oculto">Você está aqui</span>
        </span>
        ${marcadores
          .map(item => {
            const { x, y } = projetar(item.mercado.lat, item.mercado.lng)
            const destaque = item === maisBarato ? 'mapa__marcador--destaque' : ''
            return `
              <button class="mapa__marcador ${destaque}" style="left: ${x}%; top: ${y}%"
                      data-mercado="${item.mercado.id}"
                      aria-label="${item.mercado.nome}, ${formatarPreco(item.preco)}">
                ${precoCurto(item.preco)}
              </button>`
          })
          .join('')}
      </div>

      <a class="cartao mapa__cartao" id="cartao-mercado" href="#"></a>
    </section>`

  adicionarEvento(app, marcadores, produto)
  mostrarMercado(maisBarato, produto)
}

// Atualiza só o cartão de baixo: a tela não é desenhada de novo.
function mostrarMercado(item, produto) {
  const cartao = document.getElementById('cartao-mercado')
  cartao.href = `#mercado?id=${item.mercado.id}`
  cartao.innerHTML = `
    <div>
      <h2 class="mapa__nome">${item.mercado.nome}</h2>
      <p class="apoio">
        ${formatarDistancia(item.mercado.distanciaKm)} ·
        ${item.quantidade} ${item.quantidade === 1 ? 'promoção ativa' : 'promoções ativas'}
      </p>
    </div>
    <div class="mapa__valor">
      <span class="apoio">${produto ? 'neste mercado' : 'a partir de'}</span>
      <span class="preco preco--medio">${formatarPreco(item.preco)}</span>
    </div>`

  document.querySelectorAll('.mapa__marcador').forEach(marcador => {
    const escolhido = Number(marcador.dataset.mercado) === item.mercado.id
    marcador.classList.toggle('mapa__marcador--ativo', escolhido)
    marcador.setAttribute('aria-pressed', escolhido)
  })
}

function adicionarEvento(app, marcadores, produto) {
  document.querySelectorAll('.mapa__marcador').forEach(marcador => {
    marcador.addEventListener('click', () => {
      const item = marcadores.find(atual => atual.mercado.id === Number(marcador.dataset.mercado))
      mostrarMercado(item, produto)
    })
  })
}

export default {
  url: '#mapa',
  label: 'Mapa',
  icon: 'map',
  pagina: mapa,
}
