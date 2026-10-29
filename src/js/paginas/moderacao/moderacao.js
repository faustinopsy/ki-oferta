import './moderacao.css'
import { createIcons, icons } from 'lucide'
import { pedidosPendentes, decidirConta } from '../../servicos/contas.js'
import { usuarioAtual } from '../../sessao/sessao.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { vazio } from '../../componentes/vazio/vazio.js'
import { mostrarEstado } from '../../componentes/estado/estado.js'
import { tempoAtras, escapar } from '../../util/formatos.js'

// Tela 11: o único uso de computador e o único uso raro.
// A tela vira tabela: colunas fixas e ações na mesma posição em todas as linhas.
function moderacao(app) {
  const usuario = usuarioAtual()
  if (!usuario) {
    window.location.replace('#login?aba=entrar&volta=moderacao')
    return
  }
  if (usuario.perfil !== 'moderador') {
    app.innerHTML = `
      ${cabecalho({ titulo: 'Painel de contas', voltar: '#conta' })}
      ${vazio({
        icone: 'shield-check',
        titulo: 'Área dos moderadores',
        texto: 'Esta tela aprova contas novas. Sua conta é de contribuinte.',
        acao: { href: '#conta', texto: 'Voltar para a conta' },
      })}`
    return
  }

  const pedidos = pedidosPendentes()

  app.innerHTML = `
    ${cabecalho({ titulo: 'Painel de contas', voltar: '#conta' })}

    <section class="tela moderacao">
      <p class="apoio">
        ${pedidos.length} ${pedidos.length === 1 ? 'cadastro esperando' : 'cadastros esperando'}.
        Quem espera há mais tempo aparece primeiro.
      </p>
      <p class="estado" id="estado-moderacao" aria-live="polite"></p>

      ${pedidos.length === 0
        ? vazio({
            icone: 'check',
            titulo: 'Nenhum cadastro esperando',
            texto: 'Todos os pedidos foram decididos. Os novos aparecem aqui.',
          })
        : `
          <table class="moderacao__tabela">
            <thead>
              <tr>
                <th scope="col">Pessoa</th>
                <th scope="col">Pedido</th>
                <th scope="col"><span class="oculto">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              ${pedidos.map(linhaPedido).join('')}
            </tbody>
          </table>`}
    </section>`

  adicionarEvento(app)
}

// Aprovar usa a cor principal, não a de destaque: aqui não há preço,
// e vermelho em "aprovar" sinalizaria perigo numa ação de rotina.
function linhaPedido(pessoa) {
  return `
    <tr>
      <td>
        <strong>${escapar(pessoa.nome)}</strong>
        <span class="apoio">${escapar(pessoa.cidade)}</span>
      </td>
      <td class="moderacao__tempo">${tempoAtras(pessoa.horasAtras)}</td>
      <td class="moderacao__acoes">
        <button class="botao" data-recusar="${pessoa.id}">Recusar</button>
        <button class="botao botao--primario" data-aprovar="${pessoa.id}">Aprovar</button>
      </td>
    </tr>`
}

function decidir(app, id, aprovar) {
  try {
    const pessoa = decidirConta(id, aprovar)
    moderacao(app)
    createIcons({ icons })
    mostrarEstado(document.getElementById('estado-moderacao'), 'sucesso',
      aprovar
        ? `Conta de ${pessoa.nome} aprovada. Já pode enviar promoções.`
        : `Pedido de ${pessoa.nome} recusado.`)
  } catch (erro) {
    mostrarEstado(document.getElementById('estado-moderacao'), 'erro', erro.message)
  }
}

function adicionarEvento(app) {
  document.querySelectorAll('[data-aprovar]').forEach(botao => {
    botao.addEventListener('click', () => decidir(app, botao.dataset.aprovar, true))
  })
  document.querySelectorAll('[data-recusar]').forEach(botao => {
    botao.addEventListener('click', () => decidir(app, botao.dataset.recusar, false))
  })
}

export default {
  url: '#moderacao',
  label: '',
  icon: 'shield-check',
  aba: '#conta',
  pagina: moderacao,
}
