import './estado.css'

// Os quatro estados de quem depende da rede:
// carregando, sucesso, vazio e erro.
function mostrarEstado(elemento, tipo, texto) {
  elemento.className = `estado estado--${tipo}`
  elemento.textContent = texto
}

export { mostrarEstado }
