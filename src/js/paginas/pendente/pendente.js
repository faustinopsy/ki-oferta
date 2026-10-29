import './pendente.css'
import { usuarioAtual } from '../../sessao/sessao.js'
import { selo } from '../../componentes/selo/selo.js'
import { tempoAtras } from '../../util/formatos.js'

// "hoje, 14h32" para quem acabou de pedir; "há 2 dias" para os pedidos antigos
function quandoPediu(usuario) {
  if (usuario.pedidoEm) {
    const hora = usuario.pedidoEm.getHours()
    const minuto = String(usuario.pedidoEm.getMinutes()).padStart(2, '0')
    return `hoje, ${hora}h${minuto}`
  }
  return tempoAtras(usuario.horasAtras)
}

// Tela 8. A espera não pode parecer erro:
// nada de vermelho, de ícone de alerta ou da palavra "bloqueado".
function pendente(app) {
  const usuario = usuarioAtual()
  if (!usuario) {
    window.location.replace('#login')
    return
  }
  if (usuario.status === 'aprovado') {
    window.location.replace('#conta')
    return
  }

  if (usuario.status === 'recusado') {
    app.innerHTML = `
      <section class="tela pendente">
        <div class="pendente__topo">
          ${selo('rejeitada')}
          <h1 class="pendente__titulo">Seu cadastro não foi aprovado</h1>
          <p class="pendente__texto">
            O moderador não conseguiu confirmar os dados. Você continua podendo
            consultar todos os preços sem conta.
          </p>
        </div>
        <a class="botao botao--largo" href="#buscar">Buscar promoções</a>
      </section>`
    return
  }

  app.innerHTML = `
    <section class="tela pendente">
      <div class="pendente__topo">
        ${selo('pendente')}
        <h1 class="pendente__titulo">Sua conta está esperando aprovação</h1>
        <p class="pendente__texto">
          Um moderador confere cadastros novos para manter o banco de preços limpo.
          Costuma levar até um dia útil. Você recebe um e-mail quando for liberado.
        </p>
      </div>

      <ol class="pendente__passos">
        <li class="pendente__passo pendente__passo--feito">
          <span class="pendente__marca"><i data-lucide="check"></i></span>
          <div><strong>Cadastro enviado</strong><p class="apoio">${quandoPediu(usuario)}</p></div>
        </li>
        <li class="pendente__passo pendente__passo--agora">
          <span class="pendente__marca"></span>
          <div><strong>Análise do moderador</strong><p class="apoio">em andamento</p></div>
        </li>
        <li class="pendente__passo">
          <span class="pendente__marca">3</span>
          <div><strong>Envio de promoções liberado</strong><p class="apoio">após a aprovação</p></div>
        </li>
      </ol>

      <footer class="pendente__rodape">
        <p class="apoio">Enquanto isso, tudo o que é consulta continua liberado.</p>
        <a class="botao botao--largo" href="#buscar">Buscar promoções</a>
      </footer>
    </section>`
}

export default {
  url: '#pendente',
  label: '',
  icon: 'hourglass',
  aba: '#conta',
  pagina: pendente,
}
