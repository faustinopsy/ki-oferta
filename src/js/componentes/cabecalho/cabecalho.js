import './cabecalho.css'

// Topo das telas internas: voltar, título e espaço para ações à direita.
// meio troca o título por outro conteúdo (a busca compacta da tela 2).
// voltar é o endereço de destino (#buscar, #mapa...) quando não há passo anterior.
function cabecalho({ titulo = '', voltar = '', icone = 'chevron-left', acoes = '', meio = '' }) {
  return `
    <header class="topo">
      ${voltar
        ? `<a class="topo__voltar" href="${voltar}" aria-label="Voltar">
             <i data-lucide="${icone}"></i>
           </a>`
        : ''}
      ${meio || `<h1 class="topo__titulo">${titulo}</h1>`}
      <div class="topo__acoes">${acoes}</div>
    </header>`
}

// Se a pessoa chegou navegando pelo app, "voltar" desfaz o último passo
// (e a busca volta com o texto e a ordem que ela tinha escolhido).
// Se abriu o endereço direto, vale o href do link.
let navegouNoApp = false
window.addEventListener('hashchange', () => { navegouNoApp = true })

document.addEventListener('click', evento => {
  const link = evento.target.closest('.topo__voltar')
  if (link && navegouNoApp) {
    evento.preventDefault()
    history.back()
  }
})

export { cabecalho }
