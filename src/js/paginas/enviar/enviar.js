import './enviar.css'
import { createIcons, icons } from 'lucide'
import { buscarProdutoPorCodigo } from '../../servicos/produtoPorCodigo.js'
import { produtoPorCodigo, listarMercados, listarCategorias, iconeDaCategoria,
         publicaDireto, cadastrarProduto, publicarOferta, CONFIRMACOES_PARA_APROVAR }
  from '../../servicos/catalogo.js'
import { usuarioAtual } from '../../sessao/sessao.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { miniatura } from '../../componentes/miniatura/miniatura.js'
import { mostrarEstado } from '../../componentes/estado/estado.js'
import { formatarDistancia, lerPreco, escapar } from '../../util/formatos.js'

// O que já foi identificado nesta tela
let produtoEscolhido = null   // { id } do catálogo, ou { novo: true, nome, imagem, codigo }
let fotoEscolhida = ''

// Tela 9: a única feita para uso de pé, com uma mão e pressa.
// A ordem segue o gesto real: fotografar, ler o código, conferir, preço, mercado.
function enviar(app) {
  const usuario = usuarioAtual()
  if (!usuario) {
    window.location.replace('#login?volta=enviar')
    return
  }
  if (usuario.status !== 'aprovado') {
    window.location.replace('#pendente')
    return
  }

  produtoEscolhido = null
  fotoEscolhida = ''
  const direto = publicaDireto(usuario)

  app.innerHTML = `
    ${cabecalho({ titulo: 'Enviar promoção', voltar: '#buscar', icone: 'x' })}

    <form class="enviar" id="form-envio" novalidate>
      <div class="enviar__atalhos">
        <label class="enviar__atalho" id="atalho-foto">
          <input class="oculto" id="campo-foto" type="file" accept="image/*" capture="environment">
          <i data-lucide="camera"></i>
          <span id="texto-foto">Foto da etiqueta</span>
        </label>
        <button class="enviar__atalho" type="button" id="btn-ler-codigo">
          <i data-lucide="scan-barcode"></i>
          <span>Ler código de barras</span>
        </button>
      </div>

      <fieldset class="cartao enviar__bloco">
        <legend class="campo__rotulo">Produto</legend>
        <div class="enviar__codigo">
          <label class="oculto" for="campo-codigo">Código de barras</label>
          <input class="campo__entrada" id="campo-codigo" inputmode="numeric"
                 placeholder="Código de barras (13 números)" autocomplete="off">
          <button class="botao" type="button" id="btn-codigo">Buscar</button>
        </div>
        <p class="estado" id="estado-codigo" aria-live="polite"></p>
        <div id="produto-identificado"></div>
      </fieldset>

      <fieldset class="cartao enviar__bloco">
        <legend class="campo__rotulo"><label for="campo-preco">Preço na etiqueta</label></legend>
        <div class="enviar__preco">
          <span aria-hidden="true">R$</span>
          <input id="campo-preco" inputmode="decimal" placeholder="0,00" autocomplete="off">
        </div>
        <label class="enviar__marcar">
          <input type="checkbox" id="campo-cartao">
          Preço só com cartão da loja
        </label>
      </fieldset>

      <fieldset class="cartao enviar__bloco">
        <legend class="campo__rotulo"><label for="campo-mercado">Mercado</label></legend>
        <select class="campo__entrada" id="campo-mercado">
          ${listarMercados()
            .map(mercado => `
              <option value="${mercado.id}">
                ${mercado.nome} · ${formatarDistancia(mercado.distanciaKm)}
              </option>`)
            .join('')}
        </select>
        <p class="apoio">O mais perto aparece primeiro.</p>
      </fieldset>

      <div class="enviar__fim">
        <button class="botao botao--destaque botao--largo" type="submit">Enviar promoção</button>
        <p class="apoio">
          ${direto
            ? 'Sua reputação libera a publicação direta, sem votação.'
            : `Vai para votação até ${CONFIRMACOES_PARA_APROVAR} confirmações.`}
        </p>
        <p class="estado" id="estado-envio" aria-live="polite"></p>
      </div>
    </form>`

  adicionarEvento(app)
}

// Mostra o produto achado. Achado no catálogo: só confirma.
// Achado fora (ou não achado): pede a categoria, e o nome quando faltar.
function mostrarProduto({ nome = '', imagem = '', categoria = '', novo = false }) {
  const area = document.getElementById('produto-identificado')
  area.innerHTML = `
    <div class="enviar__produto">
      ${miniatura({ imagem, icone: categoria ? iconeDaCategoria(categoria) : 'package', rotulo: 'foto do produto' })}
      <div>
        <span class="enviar__rotulo">${nome ? 'Produto identificado' : 'Produto novo'}</span>
        ${nome
          ? `<p class="enviar__nome">${escapar(nome)}</p>`
          : `<input class="campo__entrada" id="campo-nome-produto"
                    placeholder="Nome do produto, como na embalagem">`}
      </div>
    </div>
    ${novo
      ? `<label class="campo">
           <span class="campo__rotulo">Categoria</span>
           <select class="campo__entrada" id="campo-categoria">
             ${listarCategorias().map(item => `<option>${item.nome}</option>`).join('')}
           </select>
         </label>`
      : ''}`
  createIcons({ icons })
}

// Primeiro procura no catálogo (sem rede). Não achou: Open Food Facts (aula 9).
async function preencherPeloCodigo(botao) {
  const codigo = document.getElementById('campo-codigo').value
  const estado = document.getElementById('estado-codigo')
  document.getElementById('produto-identificado').innerHTML = ''
  produtoEscolhido = null

  const doCatalogo = produtoPorCodigo(codigo)
  if (doCatalogo) {
    produtoEscolhido = { id: doCatalogo.id }
    mostrarProduto(doCatalogo)
    mostrarEstado(estado, 'sucesso', 'Produto do catálogo do KiOferta.')
    return
  }

  botao.disabled = true
  mostrarEstado(estado, 'carregando', 'Buscando o produto...')
  try {
    const encontrado = await buscarProdutoPorCodigo(codigo)
    if (encontrado === null) {
      produtoEscolhido = { novo: true, nome: '', imagem: '', codigo }
      mostrarProduto({ novo: true })
      mostrarEstado(estado, 'vazio', 'Código não encontrado. Digite o nome do produto.')
      return
    }
    const { nome, imagem } = encontrado
    produtoEscolhido = { novo: true, nome, imagem, codigo }
    mostrarProduto({ ...encontrado, novo: true })
    mostrarEstado(estado, 'sucesso', 'Encontrado no Open Food Facts. Escolha a categoria.')
  } catch (erro) {
    mostrarEstado(estado, 'erro', erro.message)
  } finally {
    botao.disabled = false
  }
}

function mostrarFoto(campo) {
  const arquivo = campo.files[0]
  if (!arquivo) return
  // endereço temporário da foto, válido enquanto o app está aberto
  fotoEscolhida = URL.createObjectURL(arquivo)
  document.getElementById('texto-foto').textContent = 'Foto anexada'
  document.getElementById('atalho-foto').classList.add('enviar__atalho--feito')
}

// Monta o produto que vai na oferta: o do catálogo ou um novo.
function produtoParaEnviar() {
  if (!produtoEscolhido) {
    throw new Error('Leia o código de barras do produto.')
  }
  if (!produtoEscolhido.novo) {
    return produtoEscolhido.id
  }
  const campoNome = document.getElementById('campo-nome-produto')
  const nome = campoNome ? campoNome.value.trim() : produtoEscolhido.nome
  if (nome.length < 3) {
    throw new Error('Digite o nome do produto.')
  }
  const novo = cadastrarProduto({
    nome,
    imagem: produtoEscolhido.imagem,
    codigo: produtoEscolhido.codigo,
    categoria: document.getElementById('campo-categoria').value,
  })
  produtoEscolhido = { id: novo.id }     // se o envio falhar, não cadastra duas vezes
  return novo.id
}

function adicionarEvento(app) {
  const botaoCodigo = document.getElementById('btn-codigo')
  const campoCodigo = document.getElementById('campo-codigo')

  botaoCodigo.addEventListener('click', () => preencherPeloCodigo(botaoCodigo))
  campoCodigo.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') {
      evento.preventDefault()
      preencherPeloCodigo(botaoCodigo)
    }
  })

  // O leitor pela câmera entra com o plugin do Capacitor.
  // Por enquanto o atalho leva ao campo onde o código é digitado.
  document.getElementById('btn-ler-codigo').addEventListener('click', () => {
    campoCodigo.focus()
  })

  document.getElementById('campo-foto').addEventListener('change', evento => {
    mostrarFoto(evento.target)
  })

  document.getElementById('form-envio').addEventListener('submit', evento => {
    evento.preventDefault()
    const estado = document.getElementById('estado-envio')

    try {
      const preco = lerPreco(document.getElementById('campo-preco').value)
      if (!produtoEscolhido) {
        throw new Error('Leia o código de barras do produto.')
      }
      if (Number.isNaN(preco)) {
        throw new Error('Digite o preço como está na etiqueta, por exemplo 13,49.')
      }
      const oferta = publicarOferta({
        produtoId: produtoParaEnviar(),
        mercadoId: document.getElementById('campo-mercado').value,
        preco,
        soCartao: document.getElementById('campo-cartao').checked,
        foto: fotoEscolhida,
      }, usuarioAtual())

      window.location.hash = `#conta?enviada=${oferta.id}`
    } catch (erro) {
      mostrarEstado(estado, 'erro', erro.message)
    }
  })
}

export default {
  url: '#enviar',
  label: 'Enviar',
  icon: 'plus',
  pagina: enviar,
}
