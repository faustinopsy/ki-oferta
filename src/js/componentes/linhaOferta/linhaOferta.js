import './linhaOferta.css'
import { miniatura } from '../miniatura/miniatura.js'
import { selo } from '../selo/selo.js'
import { reputacao } from '../reputacao/reputacao.js'
import { CONFIRMACOES_PARA_APROVAR } from '../../servicos/catalogo.js'
import { formatarPreco, formatarDistancia, tempoAtras, escapar } from '../../util/formatos.js'

function textoConfirmacoes(oferta) {
  if (oferta.status === 'votacao') {
    return `${oferta.confirmacoes} de ${CONFIRMACOES_PARA_APROVAR} confirmações`
  }
  return `${oferta.confirmacoes} ${oferta.confirmacoes === 1 ? 'confirmação' : 'confirmações'}`
}

// Linha de oferta: mercado, distância, preço e economia em relação à mais cara,
// mais os sinais de confiança (foto, reputação, quando, confirmações) e o selo.
function linhaOferta(oferta, { maior, menorPreco }) {
  const economia = maior - oferta.preco
  const barra = Math.round((oferta.preco / maior) * 100)

  return `
    <li class="cartao linha-oferta ${menorPreco ? 'linha-oferta--menor' : ''}">
      <div class="linha-oferta__topo">
        <div>
          ${menorPreco ? '<span class="linha-oferta__etiqueta">Menor preço</span>' : ''}
          <a class="linha-oferta__mercado" href="#mercado?id=${oferta.mercado.id}">
            ${oferta.mercado.nome}
          </a>
          <p class="apoio">
            ${formatarDistancia(oferta.mercado.distanciaKm)} · ${oferta.mercado.endereco}
          </p>
          ${oferta.soCartao ? '<p class="apoio">Preço só com cartão da loja</p>' : ''}
        </div>
        <div class="linha-oferta__valores">
          <span class="preco preco--medio">${formatarPreco(oferta.preco)}</span>
          ${economia > 0 ? `<span class="linha-oferta__economia">−${formatarPreco(economia)}</span>` : ''}
        </div>
      </div>

      <div class="linha-oferta__barra" aria-hidden="true">
        <span style="width: ${barra}%"></span>
      </div>

      <div class="linha-oferta__confianca">
        ${miniatura({ imagem: oferta.foto, icone: 'receipt', rotulo: 'foto da etiqueta', pequena: true })}
        <div class="linha-oferta__autor">
          <p><strong>${escapar(oferta.autor.nome)}</strong> ${reputacao(oferta.autor.reputacao)}</p>
          <p class="apoio">${tempoAtras(oferta.horasAtras)} · ${textoConfirmacoes(oferta)}</p>
        </div>
        ${selo(oferta.status)}
      </div>

      <div class="linha-oferta__acoes">
        <button class="botao ${menorPreco ? 'botao--destaque' : ''}" data-confirmar="${oferta.id}">
          Confirmar este preço
        </button>
        <button class="botao" data-contestar="${oferta.id}">Contestar</button>
      </div>
      <p class="estado" id="estado-oferta-${oferta.id}" aria-live="polite"></p>
    </li>`
}

export { linhaOferta, textoConfirmacoes }
