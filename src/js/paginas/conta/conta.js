import './conta.css'
import { ofertasDoAutor, pontosDaOferta, REPUTACAO_SEM_VOTACAO } from '../../servicos/catalogo.js'
import { pedidosPendentes } from '../../servicos/contas.js'
import { usuarioAtual, encerrarSessao } from '../../sessao/sessao.js'
import { selo } from '../../componentes/selo/selo.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { mostrarEstado } from '../../componentes/estado/estado.js'
import { textoConfirmacoes } from '../../componentes/linhaOferta/linhaOferta.js'
import { formatarPreco, tempoAtras, escapar } from '../../util/formatos.js'

// Estado sem motivo gera reclamação: cada item diz o porquê.
function motivo(oferta) {
  if (oferta.status === 'votacao') return textoConfirmacoes(oferta)
  if (oferta.status === 'aprovada') {
    return `${textoConfirmacoes(oferta)} · +${pontosDaOferta(oferta)} de reputação`
  }
  if (oferta.status === 'rejeitada') return oferta.motivo
  return 'fim da semana'
}

function textoPedidos(quantidade) {
  return `${quantidade} ${quantidade === 1 ? 'pedido' : 'pedidos'}`
}

// Tela 10: minhas contribuições. Parâmetro opcional: enviada (id da oferta nova).
function conta(app, parametros) {
  const usuario = usuarioAtual()
  if (!usuario) {
    window.location.replace('#login?volta=conta')
    return
  }
  if (usuario.status !== 'aprovado') {
    window.location.replace('#pendente')
    return
  }

  const ofertas = ofertasDoAutor(usuario.id)
  const faltam = Math.max(REPUTACAO_SEM_VOTACAO - usuario.reputacao, 0)
  const progresso = Math.min(usuario.reputacao / REPUTACAO_SEM_VOTACAO, 1) * 100
  const moderador = usuario.perfil === 'moderador'

  app.innerHTML = `
    <section class="conta">
      <header class="conta__topo">
        <div class="conta__pessoa">
          <div>
            <h1 class="tela__titulo">${escapar(usuario.nome)}</h1>
            <p class="apoio">
              ${moderador ? 'Moderador' : 'Contribuinte verificado'} desde ${usuario.desde}
            </p>
          </div>
          <p class="conta__reputacao">
            <strong>${usuario.reputacao}</strong>
            <span class="apoio">reputação</span>
          </p>
        </div>

        <!-- responde a pergunta que a regra cria: quanto falta para sair da fila -->
        <div class="conta__meta">
          <div class="conta__meta-topo">
            <strong>${faltam > 0 ? `Faltam ${faltam} pontos` : 'Publicação direta liberada'}</strong>
            <span class="apoio">${Math.min(usuario.reputacao, REPUTACAO_SEM_VOTACAO)} / ${REPUTACAO_SEM_VOTACAO}</span>
          </div>
          <div class="conta__barra" role="progressbar" aria-valuemin="0"
               aria-valuemax="${REPUTACAO_SEM_VOTACAO}" aria-valuenow="${usuario.reputacao}">
            <span style="width: ${progresso}%"></span>
          </div>
          <p class="apoio">
            ${faltam > 0
              ? `A partir de ${REPUTACAO_SEM_VOTACAO}, suas promoções são publicadas direto, sem passar pela votação.`
              : 'Suas promoções entram aprovadas, sem passar pela votação.'}
          </p>
        </div>

        ${moderador
          ? `<a class="botao botao--largo" href="#moderacao">
               <i data-lucide="shield-check"></i>
               Painel de contas · ${textoPedidos(pedidosPendentes().length)}
             </a>`
          : ''}
      </header>

      <section class="tela">
        <p class="estado" id="estado-conta" aria-live="polite"></p>
        <div class="tela__secao">
          <h2 class="tela__subtitulo">Minhas contribuições</h2>
          ${ofertas.length === 0
            ? vazio({
                icone: 'receipt',
                titulo: 'Você ainda não enviou promoções',
                texto: 'Viu um preço bom no mercado? Fotografe a etiqueta e envie.',
                acao: { href: '#enviar', texto: 'Enviar promoção' },
              })
            : `<ul class="lista">${ofertas.map(linhaContribuicao).join('')}</ul>`}
        </div>

        <button class="botao botao--largo" id="btn-sair">
          <i data-lucide="log-out"></i> Sair da conta
        </button>
      </section>
    </section>`

  adicionarEvento(app, parametros)
}

function linhaContribuicao(oferta) {
  const encerrada = oferta.status === 'rejeitada' || oferta.status === 'expirada'
  return `
    <li class="cartao conta__item ${encerrada ? 'conta__item--encerrado' : ''}"
        id="contribuicao-${oferta.id}">
      <div class="conta__item-topo">
        <div>
          <a class="conta__produto" href="#produto?id=${oferta.produto.id}">
            ${escapar(oferta.produto.nome)}
          </a>
          <p class="apoio">${oferta.mercado.curto} · ${
            oferta.status === 'expirada' ? `semana de ${oferta.semana}` : tempoAtras(oferta.horasAtras)
          }</p>
        </div>
        <span class="preco ${encerrada ? 'preco--riscado' : ''}">${formatarPreco(oferta.preco)}</span>
      </div>
      <p class="conta__motivo">${selo(oferta.status)} <span class="apoio">${escapar(motivo(oferta))}</span></p>
    </li>`
}

function adicionarEvento(app, parametros) {
  const enviada = parametros.get('enviada')
  if (enviada && document.getElementById(`contribuicao-${enviada}`)) {
    document.getElementById(`contribuicao-${enviada}`).classList.add('conta__item--nova')
    mostrarEstado(document.getElementById('estado-conta'), 'sucesso',
      'Promoção enviada. Ela já aparece na busca.')
  }

  document.getElementById('btn-sair').addEventListener('click', () => {
    encerrarSessao()
    window.location.hash = '#buscar'
  })
}

export default {
  url: '#conta',
  label: 'Conta',
  icon: 'user-round',
  pagina: conta,
}
