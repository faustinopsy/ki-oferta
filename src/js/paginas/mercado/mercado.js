import './mercado.css'
import { mercadoPorId, ofertasDoMercado, semanaAtual } from '../../servicos/catalogo.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { selo } from '../../componentes/selo/selo.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { textoConfirmacoes } from '../../componentes/linhaOferta/linhaOferta.js'
import { formatarPreco, formatarDistancia, tempoAtras, escapar } from '../../util/formatos.js'

// Tela 5. Parâmetro: id do mercado.
// A pergunta aqui é outra: se eu for até esse mercado, o que mais eu aproveito?
function mercado(app, parametros) {
  const escolhido = mercadoPorId(parametros.get('id'))

  if (!escolhido) {
    app.innerHTML = `
      ${cabecalho({ titulo: 'Mercado', voltar: '#mapa' })}
      ${vazio({
        icone: 'store',
        titulo: 'Mercado não encontrado',
        texto: 'O endereço aponta para um mercado que não está no KiOferta.',
        acao: { href: '#mapa', texto: 'Ver o mapa' },
      })}`
    return
  }

  const ofertas = ofertasDoMercado(escolhido.id)

  app.innerHTML = `
    ${cabecalho({ titulo: 'Mercado', voltar: '#mapa' })}

    <section class="mercado">
      <div class="mercado__dados">
        <h1 class="tela__titulo">${escolhido.nome}</h1>
        <p class="apoio">${escolhido.endereco} — ${escolhido.bairro}</p>
        <p class="mercado__numeros">
          <strong>${formatarDistancia(escolhido.distanciaKm)}</strong>
          <span class="apoio">
            ${ofertas.length} ${ofertas.length === 1 ? 'promoção ativa' : 'promoções ativas'} nesta semana
          </span>
        </p>
      </div>

      <section class="tela__secao mercado__lista">
        <h2 class="tela__subtitulo">Promoções aqui</h2>
        ${ofertas.length === 0
          ? vazio({
              titulo: 'Nenhuma promoção ativa aqui',
              texto: `Ninguém enviou preço deste mercado na ${semanaAtual().texto}.`,
              acao: { href: '#enviar', texto: 'Enviar promoção' },
            })
          : `
            <ul class="cartao mercado__ofertas">
              ${ofertas.map(linhaDoMercado).join('')}
            </ul>
            <p class="apoio">
              Mostrando ${ofertas.length} de ${ofertas.length}.
              Todas expiram ${semanaAtual().fim}.
            </p>`}
      </section>
    </section>`
}

// Linha compacta: cada uma é um produto, não uma oferta a ser auditada.
// O selo só aparece quando não é "aprovada": o normal não precisa de rótulo.
function linhaDoMercado(oferta) {
  return `
    <li>
      <a class="mercado__oferta" href="#produto?id=${oferta.produto.id}">
        <div>
          <h3 class="mercado__produto">${escapar(oferta.produto.nome)}</h3>
          <p class="apoio">
            ${oferta.status !== 'aprovada' ? selo(oferta.status) : ''}
            ${tempoAtras(oferta.horasAtras)} · ${textoConfirmacoes(oferta)}
          </p>
        </div>
        <span class="preco">${formatarPreco(oferta.preco)}</span>
      </a>
    </li>`
}

export default {
  url: '#mercado',
  label: '',
  icon: 'store',
  aba: '#mapa',
  pagina: mercado,
}
