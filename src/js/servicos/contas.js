// Cadastro, login e moderação de contas.
// Como o catálogo, hoje usa os dados mockados; depois, a API.
import { usuarios } from '../dadosMockados/dados.js'

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function usuarioPorEmail(email) {
  const procurado = email.trim().toLowerCase()
  return usuarios.find(usuario => usuario.email === procurado) || null
}

// Devolve o usuário, ou null quando e-mail e senha não conferem.
function entrar(email, senha) {
  const usuario = usuarioPorEmail(email)
  if (!usuario || usuario.senha !== senha) {
    return null
  }
  return usuario
}

// Quatro campos, sem telefone nem CPF. A conta nasce pendente.
function cadastrar({ nome, email, senha, cidade }) {
  if (nome.trim().length < 2) {
    throw new Error('Digite seu nome.')
  }
  if (!EMAIL_VALIDO.test(email.trim())) {
    throw new Error('Confira o e-mail: ele precisa ter @ e domínio.')
  }
  if (senha.length < 8) {
    throw new Error('A senha precisa ter pelo menos 8 caracteres.')
  }
  if (cidade.trim() === '') {
    throw new Error('Digite sua cidade ou o CEP.')
  }
  if (usuarioPorEmail(email)) {
    throw new Error('Este e-mail já tem conta. Use a aba Entrar.')
  }

  const novo = {
    id: Math.max(...usuarios.map(usuario => usuario.id)) + 1,
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
    cidade: cidade.trim(),
    reputacao: 0,
    status: 'pendente',
    perfil: 'contribuidor',
    desde: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
    horasAtras: 0,
    pedidoEm: new Date(),
  }
  usuarios.push(novo)
  return novo
}

// Tela 11: quem espera há mais tempo aparece primeiro.
function pedidosPendentes() {
  return usuarios
    .filter(usuario => usuario.status === 'pendente')
    .sort((a, b) => b.horasAtras - a.horasAtras)
}

function decidirConta(id, aprovar) {
  const usuario = usuarios.find(item => item.id === Number(id))
  if (!usuario || usuario.status !== 'pendente') {
    throw new Error('Este pedido já foi decidido.')
  }
  usuario.status = aprovar ? 'aprovado' : 'recusado'
  return usuario
}

export { entrar, cadastrar, pedidosPendentes, decidirConta }
