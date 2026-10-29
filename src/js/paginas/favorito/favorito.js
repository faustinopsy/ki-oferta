import './favorito.css'
import { lerFavoritos } from '../../armazenamento/favoritos.js'
import { resumoDoProduto } from '../../servicos/catalogo.js'
import { selo } from '../../componentes/selo/selo.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { formatarPreco, formatarDistancia, escapar } from '../../util/formatos.js'

// Tela 6. O valor da lista não é repetir o preço:
// é mostrar o que mudou desde que o item foi salvo.
function favorito(app) {
  const itens = lerFavoritos()
    .map(salvo => ({ salvo, resumo: resumoDoProduto(salvo.produtoId) }))
    .filter(item => item.resumo !== null)

  app.innerHTML = `
    <section class="tela favorito">
      <header>
        <h1 class="tela__titulo">Favoritos</h1>
        <p class="apoio">Salvos neste aparelho. Não precisa de cadastro.</p>
      </header>

      ${itens.length === 0
        ? vazio({
            icone: 'bookmark',
            titulo: 'Nenhum produto salvo',
            texto: 'Na tela de um produto, toque no marcador para acompanhar o preço aqui.',
            acao: { href: '#buscar', texto: 'Buscar produtos' },
          })
        : `<ul class="lista">${itens.map(linhaFavorito).join('')}</ul>`}
    </section>`
}

function variacao(atual, salvo) {
  if (salvo === null) return 'sem preço quando foi salvo'
  const diferenca = Math.round((atual - salvo) * 100) / 100
  if (diferenca < 0) return `caiu ${formatarPreco(-diferenca)}`
  if (diferenca > 0) return `subiu ${formatarPreco(diferenca)}`
  return 'igual a quando você salvou'
}

function linhaFavorito({ salvo, resumo }) {
  const { produto, ofertas } = resumo
  const expirou = ofertas.length === 0

  // a semana acabou: o item fica esmaecido, com preço riscado, em vez de sumir
  if (expirou) {
    return `
      <li>
        <a class="cartao favorito__item favorito__item--expirado" href="#produto?id=${produto.id}">
          <div>
            <h2 class="favorito__nome">${escapar(produto.nome)}</h2>
            ${selo('expirada')}
          </div>
          <div class="favorito__valores">
            ${salvo.precoSalvo !== null
              ? `<span class="preco preco--medio preco--riscado">${formatarPreco(salvo.precoSalvo)}</span>`
              : ''}
            <span class="apoio">semana de ${salvo.semana}</span>
          </div>
        </a>
      </li>`
  }

  const maisBarata = ofertas[0]
  return `
    <li>
      <a class="cartao favorito__item" href="#produto?id=${produto.id}">
        <div>
          <h2 class="favorito__nome">${escapar(produto.nome)}</h2>
          <p class="apoio">
            ${maisBarata.mercado.curto} · ${formatarDistancia(maisBarata.mercado.distanciaKm)}
          </p>
        </div>
        <div class="favorito__valores">
          <span class="preco preco--medio">${formatarPreco(resumo.menor)}</span>
          <span class="apoio">${variacao(resumo.menor, salvo.precoSalvo)}</span>
        </div>
      </a>
    </li>`
}

export default {
  url: '#favorito',
  label: 'Favoritos',
  icon: 'bookmark',
  pagina: favorito,
}
