import './navbar.css'

// Monta o menu a partir do mesmo mapa de rotas usado pelo roteador.
// Só entra no menu quem tem label; ativa é a url do item que fica aceso.
function navbar(item_menu, ativa) {
  const navbar = document.getElementById('navbar')
  navbar.innerHTML = `
    <nav class="navbar" aria-label="Menu principal">
      <ul class="navbar__lista">
        ${item_menu
          .filter(menu => menu.label !== '')
          .map(item => `
            <li>
              <a href="${item.url}"
                 class="navbar-item ${item.url === ativa ? 'navbar-item--ativo' : ''}"
                 ${item.url === ativa ? 'aria-current="page"' : ''}>
                <i data-lucide="${item.icon}"></i>
                <span class="navbar-item__rotulo">${item.label}</span>
              </a>
            </li>`)
          .join('')}
      </ul>
    </nav>`
}

export { navbar }
