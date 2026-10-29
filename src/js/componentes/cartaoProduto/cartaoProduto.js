import './cartaoProduto.css'
import { miniatura } from '../miniatura/miniatura.js'
import { iconeDaCategoria } from '../../servicos/catalogo.js'
import { formatarPreco, formatarDistancia, escapar } from '../../util/formatos.js'

// Cartão de produto: miniatura, nome, cobertura e distância; preço à direita.
// Responde na ordem: que produto é, quanto custa no mínimo,
// em quantos mercados está e a que distância.
function cartaoProduto(resumo) {
  const { produto } = resumo
  return `
    <li>
      <a class="cartao cartao-produto"
         href="#produto?id=${produto.id}">
        ${miniatura({ imagem: produto.imagem, icone: iconeDaCategoria(produto.categoria), rotulo: 'foto do produto' })}
        <div class="cartao-produto__info">
          <h2 class="cartao-produto__nome">${escapar(produto.nome)}</h2>
          <p class="apoio">
            ${resumo.mercados} ${resumo.mercados === 1 ? 'mercado' : 'mercados'} · mais perto
            ${formatarDistancia(resumo.maisPerto)}
          </p>
        </div>
        <div class="cartao-produto__valores">
          <span class="preco preco--medio">${formatarPreco(resumo.menor)}</span>
          ${resumo.economia > 0
            ? `<span class="apoio">até −${formatarPreco(resumo.economia)}</span>`
            : ''}
        </div>
      </a>
    </li>`
}

export { cartaoProduto }
