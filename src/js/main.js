import { mapaderotas } from './rotas/rotas.js'
import { navbar } from './navbar/navbar.js'

const app = document.getElementById('app');

function renderizar() {
  const hash = window.location.hash || '#home';
  const rota = mapaderotas.find(r => r.url === hash);

  if (rota) {
    rota.pagina(app);
  } else {
    app.innerHTML = '<div>Página não encontrada 404</div>';
  }
}

navbar(mapaderotas);
renderizar();
window.addEventListener('hashchange', renderizar);