// Quem está usando o app agora. Fica só na memória:
// fechou ou recarregou o app, volta a ser visitante.
let usuario = null

function usuarioAtual() {
  return usuario
}

function iniciarSessao(usuarioQueEntrou) {
  usuario = usuarioQueEntrou
}

function encerrarSessao() {
  usuario = null
}

export { usuarioAtual, iniciarSessao, encerrarSessao }
