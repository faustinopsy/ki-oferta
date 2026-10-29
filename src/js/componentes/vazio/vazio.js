import './vazio.css'

// Estado vazio: nunca só uma frase.
// Diz o que faltou, em que semana, e oferece uma saída.
function vazio({ icone = 'search-x', titulo, texto, acao }) {
  return `
    <div class="vazio">
      <i data-lucide="${icone}" class="vazio__icone"></i>
      <h2 class="vazio__titulo">${titulo}</h2>
      <p class="vazio__texto">${texto}</p>
      ${acao ? `<a class="botao" href="${acao.href}">${acao.texto}</a>` : ''}
    </div>`
}

export { vazio }
