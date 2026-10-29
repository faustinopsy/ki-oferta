import './reputacao.css'

// Pílula azul pequena, sempre ao lado do nome de quem enviou. Nunca vermelha.
function reputacao(pontos) {
  return `<span class="reputacao" title="Reputação">
            <span class="reputacao__ponto" aria-hidden="true"></span>${pontos}
            <span class="oculto">de reputação</span>
          </span>`
}

export { reputacao }
