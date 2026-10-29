import './selo.css'

const TEXTOS = {
  votacao: 'Em votação',
  aprovada: 'Aprovada',
  rejeitada: 'Rejeitada',
  expirada: 'Expirada',
  pendente: 'Conta em análise',
}

// Selo de estado: tinta + fundo lavado. Nunca a cor de destaque.
function selo(status) {
  return `<span class="selo selo--${status}">${TEXTOS[status]}</span>`
}

export { selo }
