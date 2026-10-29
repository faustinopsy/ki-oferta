import './produto.css'
import { createIcons, icons } from 'lucide'
import { resumoDoProduto, iconeDaCategoria, semanaAtual, confirmarOferta }
  from '../../servicos/catalogo.js'
import { estaSalvo, alternarFavorito } from '../../armazenamento/favoritos.js'
import { usuarioAtual } from '../../sessao/sessao.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { miniatura } from '../../componentes/miniatura/miniatura.js'
import { linhaOferta } from '../../componentes/linhaOferta/linhaOferta.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { mostrarEstado } from '../../componentes/estado/estado.js'
import { formatarPreco, formatarDistancia, escapar } from '../../util/formatos.js'

// "7891234567890" -> "789 1234 567 890"
function formatarCodigo(codigo) {
  return codigo.replace(/^(\d{3})(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3 $4')
}

// Tela 3, a mais importante. Parâmetro: id do produto.
// Primeiro o resumo de decisão; depois as ofertas, ordenadas por preço.
function produto(app, parametros) {
  const resumo = resumoDoProduto(parametros.get('id'))

  if (!resumo) {
    app.innerHTML = `
      ${cabecalho({ titulo: 'Produto', voltar: '#buscar' })}
      ${vazio({
        titulo: 'Produto não encontrado',
        texto: 'O endereço aponta para um produto que não está no catálogo.',
        acao: { href: '#buscar', texto: 'Voltar para a busca' },
      })}`
    return
  }

  const { produto, ofertas } = resumo
  const salvo = estaSalvo(produto.id)
  const semana = semanaAtual()

  app.innerHTML = `
    ${cabecalho({
      titulo: 'Produto',
      voltar: '#buscar',
      acoes: `
        <button class="topo__acao" id="btn-favorito" aria-pressed="${salvo}"
                aria-label="${salvo ? 'Tirar dos favoritos' : 'Salvar nos favoritos'}">
          <i data-lucide="bookmark"></i>
        </button>
        <button class="topo__acao" id="btn-compartilhar" aria-label="Compartilhar">
          <i data-lucide="share-2"></i>
        </button>`,
    })}

    <section class="produto">
      <div class="produto__identificacao">
        ${miniatura({ imagem: produto.imagem, icone: iconeDaCategoria(produto.categoria), rotulo: 'foto do produto' })}
        <div>
          <h1 class="produto__nome">${escapar(produto.nome)}</h1>
          <p class="apoio">${produto.categoria} · Cód. ${formatarCodigo(produto.codigo)}</p>
        </div>
      </div>
      <p class="estado" id="estado-produto" aria-live="polite"></p>

      ${ofertas.length === 0
        ? vazio({
            icone: 'calendar-x',
            titulo: 'Sem oferta ativa nesta semana',
            texto: `Ninguém enviou preço deste produto na ${semana.texto}.
                    Se você viu no mercado, envie a promoção.`,
            acao: { href: '#enviar', texto: 'Enviar promoção' },
          })
        : `
          <div class="produto__decisao">
            <div class="produto__menor">
              <span class="produto__rotulo">Menor preço</span>
              <span class="preco preco--grande">${formatarPreco(resumo.menor)}</span>
            </div>
            <dl class="produto__fatos">
              <div>
                <dt>${formatarPreco(resumo.economia)}</dt>
                <dd>a menos que a mais cara</dd>
              </div>
              <div>
                <dt>${formatarDistancia(resumo.maisPerto)}</dt>
                <dd>até o mercado mais perto</dd>
              </div>
            </dl>
          </div>
          <p class="produto__semana apoio">
            ${ofertas.length} ${ofertas.length === 1 ? 'oferta ativa' : 'ofertas ativas'}
            · ${semana.texto} · expira ${semana.fim.split(',')[0]}
            · <a href="#mapa?produto=${produto.id}">ver no mapa</a>
          </p>

          <section class="produto__ofertas tela__secao">
            <div class="tela__secao-topo">
              <h2 class="tela__subtitulo">Ofertas ativas</h2>
              <span class="apoio">ordenado por preço</span>
            </div>
            <ul class="lista">
              ${ofertas
                .map((oferta, posicao) =>
                  linhaOferta(oferta, { maior: resumo.maior, menorPreco: posicao === 0 }))
                .join('')}
            </ul>
          </section>`}
    </section>`

  adicionarEvento(app, parametros, resumo)
}

function adicionarEvento(app, parametros, resumo) {
  const { produto } = resumo

  document.getElementById('btn-favorito').addEventListener('click', () => {
    const ficouSalvo = alternarFavorito(produto.id, resumo.menor, semanaAtual().inicio)
    redesenhar(app, parametros)
    mostrarEstado(document.getElementById('estado-produto'), 'sucesso',
      ficouSalvo ? 'Salvo nos favoritos deste aparelho.' : 'Tirado dos favoritos.')
  })

  document.getElementById('btn-compartilhar').addEventListener('click', () => {
    compartilhar(produto)
  })

  document.querySelectorAll('[data-confirmar]').forEach(botao => {
    botao.addEventListener('click', () => {
      const ofertaId = botao.dataset.confirmar
      const usuario = usuarioAtual()

      // consultar é livre; confirmar exige conta
      if (!usuario) {
        const volta = encodeURIComponent(`produto?id=${produto.id}`)
        window.location.hash = `#login?aba=entrar&volta=${volta}`
        return
      }

      try {
        const oferta = confirmarOferta(ofertaId, usuario)
        redesenhar(app, parametros)
        mostrarEstado(document.getElementById(`estado-oferta-${ofertaId}`), 'sucesso',
          oferta.status === 'aprovada'
            ? 'Obrigado! Preço confirmado.'
            : 'Obrigado! Sua confirmação conta para a votação.')
      } catch (erro) {
        mostrarEstado(document.getElementById(`estado-oferta-${ofertaId}`), 'erro', erro.message)
      }
    })
  })

  // Lacuna do estudo de caso: o botão existe, a regra da contestação não.
  document.querySelectorAll('[data-contestar]').forEach(botao => {
    botao.addEventListener('click', () => {
      mostrarEstado(document.getElementById(`estado-oferta-${botao.dataset.contestar}`), 'vazio',
        'A contestação ainda não tem regra definida no projeto.')
    })
  })
}

// Desenha a tela de novo (depois de salvar ou confirmar) e refaz os ícones.
function redesenhar(app, parametros) {
  produto(app, parametros)
  createIcons({ icons })
}

async function compartilhar(item) {
  const estado = document.getElementById('estado-produto')
  const endereco = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({ title: item.nome, text: 'Olha esse preço no KiOferta', url: endereco })
    } catch (erro) {
      // a pessoa fechou a janela de compartilhar: nada a fazer
    }
    return
  }

  try {
    await navigator.clipboard.writeText(endereco)
    mostrarEstado(estado, 'sucesso', 'Link copiado. É só colar na conversa.')
  } catch (erro) {
    mostrarEstado(estado, 'erro', 'Não deu para copiar o link neste aparelho.')
  }
}

export default {
  url: '#produto',
  label: '',
  icon: 'package',
  aba: '#buscar',
  pagina: produto,
}
