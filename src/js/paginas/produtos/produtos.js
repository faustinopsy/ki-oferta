import './produtos.css'
import { buscarProdutos, semanaAtual } from '../../servicos/catalogo.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { cartaoProduto } from '../../componentes/cartaoProduto/cartaoProduto.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { escapar } from '../../util/formatos.js'

// Tela 2: resultado da busca.
// Parâmetros: busca (texto), categoria (nome) e ordem (preco | distancia).
function produtos(app, parametros) {
  const busca = parametros.get('busca') || ''
  const categoria = parametros.get('categoria') || ''
  const ordem = parametros.get('ordem') === 'distancia' ? 'distancia' : 'preco'

  const resultado = buscarProdutos({ busca, categoria, ordem })
  const totalMercados = new Set(
    resultado.flatMap(resumo => resumo.ofertas.map(oferta => oferta.mercadoId))
  ).size

  app.innerHTML = `
    ${cabecalho({
      voltar: '#buscar',
      meio: `
        <form class="produtos__busca" id="form-busca" role="search">
          <i data-lucide="search"></i>
          <label class="oculto" for="input-busca">Produto ou marca</label>
          <input id="input-busca" type="search" value="${escapar(busca)}"
                 placeholder="Produto ou marca" autocomplete="off">
        </form>`,
    })}

    <section class="tela produtos">
      ${categoria
        ? `<h1 class="tela__titulo">${escapar(categoria)}</h1>`
        : '<h1 class="oculto">Resultado da busca</h1>'}

      ${resultado.length === 0
        ? vazio({
            titulo: busca
              ? `Nenhuma promoção para “${escapar(busca)}”`
              : 'Nenhuma promoção nesta categoria',
            texto: `Ninguém enviou esse produto na ${semanaAtual().texto}.
                    Tente outro nome ou escolha uma categoria.`,
            acao: { href: '#buscar', texto: 'Ver categorias' },
          })
        : `
          <div class="produtos__resumo">
            <p class="apoio">
              ${resultado.length} ${resultado.length === 1 ? 'produto' : 'produtos'} ·
              ${totalMercados} ${totalMercados === 1 ? 'mercado' : 'mercados'}
            </p>
            <nav class="produtos__ordem" aria-label="Ordenar por">
              ${linkDeOrdem(parametros, 'preco', 'Preço', ordem)}
              ${linkDeOrdem(parametros, 'distancia', 'Distância', ordem)}
            </nav>
          </div>
          <ul class="lista">
            ${resultado.map(cartaoProduto).join('')}
          </ul>`}
    </section>`

  adicionarEvento(app, parametros)
}

// Mantém busca e categoria e troca só a ordem: #produtos?busca=café&ordem=distancia
function linkDeOrdem(parametros, valor, texto, ordemAtual) {
  const novos = new URLSearchParams(parametros)
  novos.set('ordem', valor)
  const ativo = valor === ordemAtual
  return `<a class="produtos__opcao ${ativo ? 'produtos__opcao--ativa' : ''}"
             href="#produtos?${novos}" ${ativo ? 'aria-current="true"' : ''}>${texto}</a>`
}

function adicionarEvento(app, parametros) {
  const form = document.getElementById('form-busca')
  const campo = document.getElementById('input-busca')

  form.addEventListener('submit', evento => {
    evento.preventDefault()
    const novos = new URLSearchParams(parametros)
    novos.set('busca', campo.value.trim())
    novos.delete('categoria')           // buscar por texto sai da categoria
    window.location.hash = `#produtos?${novos}`
  })
}

export default {
  url: '#produtos',
  label: '',
  icon: 'shopping-basket',
  aba: '#buscar',
  pagina: produtos,
}
