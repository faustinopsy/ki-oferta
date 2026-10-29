import './login.css'
import { entrar, cadastrar } from '../../servicos/contas.js'
import { buscarCep } from '../../servicos/cep.js'
import { usuarioAtual, iniciarSessao } from '../../sessao/sessao.js'
import { cabecalho } from '../../componentes/cabecalho/cabecalho.js'
import { mostrarEstado } from '../../componentes/estado/estado.js'

// Tela 7. Cadastro e login na mesma tela, alternados por abas.
// Parâmetros: aba (criar | entrar) e volta (para onde ir depois de entrar).
function login(app, parametros) {
  if (usuarioAtual()) {
    window.location.replace('#conta')        // já entrou: não há o que fazer aqui
    return
  }

  const aba = parametros.get('aba') === 'entrar' ? 'entrar' : 'criar'

  app.innerHTML = `
    ${cabecalho({ titulo: 'Conta', voltar: '#buscar' })}

    <section class="tela login">
      <nav class="login__abas" aria-label="Escolha">
        ${linkDeAba(parametros, 'criar', 'Criar conta', aba)}
        ${linkDeAba(parametros, 'entrar', 'Entrar', aba)}
      </nav>

      ${aba === 'criar' ? formularioCriar() : formularioEntrar()}

      <a class="botao botao--texto botao--largo" href="#buscar">Continuar sem cadastro</a>
    </section>`

  adicionarEvento(app, parametros, aba)
}

// Troca de aba sem perder o "volta": #login?aba=entrar&volta=enviar
function linkDeAba(parametros, valor, texto, abaAtual) {
  const novos = new URLSearchParams(parametros)
  novos.set('aba', valor)
  const ativa = valor === abaAtual
  return `<a class="login__aba ${ativa ? 'login__aba--ativa' : ''}"
             href="#login?${novos}" ${ativa ? 'aria-current="page"' : ''}>${texto}</a>`
}

// Quatro campos, sem telefone nem CPF.
function formularioCriar() {
  return `
    <form class="login__form" id="form-conta" novalidate>
      <label class="campo">
        <span class="campo__rotulo">Nome</span>
        <input class="campo__entrada" id="campo-nome" autocomplete="name"
               placeholder="Como você aparece nas contribuições">
      </label>
      <label class="campo">
        <span class="campo__rotulo">E-mail</span>
        <input class="campo__entrada" id="campo-email" type="email" autocomplete="email"
               placeholder="voce@email.com">
      </label>
      <label class="campo">
        <span class="campo__rotulo">Senha</span>
        <input class="campo__entrada" id="campo-senha" type="password"
               autocomplete="new-password" placeholder="Mínimo de 8 caracteres">
      </label>
      <label class="campo">
        <span class="campo__rotulo">Cidade</span>
        <input class="campo__entrada" id="campo-cidade" autocomplete="address-level2"
               placeholder="Onde você costuma comprar, ou o CEP">
        <span class="estado" id="estado-cep" aria-live="polite"></span>
      </label>

      <p class="aviso">
        Contas novas passam por aprovação de um moderador antes de poder
        enviar promoções. Consultar preços não exige conta.
      </p>

      <button class="botao botao--destaque botao--largo" type="submit">Criar conta</button>
      <p class="estado" id="estado-form" aria-live="polite"></p>
    </form>`
}

function formularioEntrar() {
  return `
    <form class="login__form" id="form-conta" novalidate>
      <label class="campo">
        <span class="campo__rotulo">E-mail</span>
        <input class="campo__entrada" id="campo-email" type="email" autocomplete="email"
               placeholder="voce@email.com">
      </label>
      <label class="campo">
        <span class="campo__rotulo">Senha</span>
        <input class="campo__entrada" id="campo-senha" type="password"
               autocomplete="current-password">
      </label>

      <button class="botao botao--destaque botao--largo" type="submit">Entrar</button>
      <p class="estado" id="estado-form" aria-live="polite"></p>
    </form>`
}

// Prática 2 da aula 9: digitou um CEP no campo cidade, a ViaCEP completa.
async function preencherCidade(campo) {
  const estado = document.getElementById('estado-cep')
  mostrarEstado(estado, 'carregando', 'Procurando o CEP...')

  try {
    const endereco = await buscarCep(campo.value)
    if (endereco === null) {
      mostrarEstado(estado, 'vazio', 'CEP não encontrado. Digite o nome da cidade.')
      return
    }
    campo.value = `${endereco.cidade}, ${endereco.uf}`
    mostrarEstado(estado, 'sucesso', 'Cidade preenchida pelo CEP.')
  } catch (erro) {
    mostrarEstado(estado, 'erro', erro.message)
  }
}

function adicionarEvento(app, parametros, aba) {
  const form = document.getElementById('form-conta')
  const estadoForm = document.getElementById('estado-form')
  const volta = parametros.get('volta')

  if (aba === 'criar') {
    const campoCidade = document.getElementById('campo-cidade')
    campoCidade.addEventListener('input', () => {
      const soNumeros = /^[\d.\-\s]+$/.test(campoCidade.value)
      if (soNumeros && campoCidade.value.replace(/\D/g, '').length === 8) {
        preencherCidade(campoCidade)
      }
    })
  }

  form.addEventListener('submit', evento => {
    evento.preventDefault()
    const email = document.getElementById('campo-email').value
    const senha = document.getElementById('campo-senha').value

    if (aba === 'entrar') {
      const usuario = entrar(email, senha)
      if (!usuario) {
        mostrarEstado(estadoForm, 'erro', 'E-mail ou senha não conferem.')
        return
      }
      iniciarSessao(usuario)
      // replace: o "voltar" do aparelho não cai de novo no login
      if (usuario.status === 'pendente') {
        window.location.replace('#pendente')
      } else {
        window.location.replace(volta ? `#${volta}` : '#conta')
      }
      return
    }

    try {
      const novo = cadastrar({
        nome: document.getElementById('campo-nome').value,
        email,
        senha,
        cidade: document.getElementById('campo-cidade').value,
      })
      iniciarSessao(novo)
      window.location.replace('#pendente')
    } catch (erro) {
      mostrarEstado(estadoForm, 'erro', erro.message)
    }
  })
}

export default {
  url: '#login',
  label: '',
  icon: 'log-in',
  aba: '#conta',
  pagina: login,
}
