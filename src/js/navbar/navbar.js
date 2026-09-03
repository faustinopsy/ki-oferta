function navbar(rotas, atual) {
  const nav = document.getElementById('navbar');
 
  const itens = rotas
    .filter(rota => rota.label !== "")
    .map(rota => {
      const ativo = rota.url === atual;
      return `
        <li>
          <a href="${rota.url}"
             ${ativo ? 'aria-current="page"' : ''}>
            ${rota.label}
          </a>
        </li>`;
    }).join('');
 
  nav.innerHTML = `
    <nav class="menu"><ul>${itens}</ul></nav>`;
}

export { navbar }