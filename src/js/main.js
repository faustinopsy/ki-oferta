import { mapaderotas } from './rotas/rotas.js'
import { navbar } from './navbar/navbar.js'

const ROTA_PADRAO = '#home';

const app = document.getElementById('app');
const mapaDeRotas = criarMapaDeRotas(roteador);
const paginaNaoEncontrada = {
    pagina: (app) => { app.innerHTML = '<div>Página não encontrada 404</div>'; }
};

function criarMapaDeRotas(rotas) {
    const mapa = {};
    for (const rota of rotas) {
        mapa[rota.url] = rota;
    }
    return mapa;
}

async function renderizarRotaAtual() {
    const hash = window.location.hash || ROTA_PADRAO;
    const rota = mapaDeRotas[hash] || paginaNaoEncontrada;
    await rota.pagina(app);
}

function iniciar() {
    navbar(roteador);
    renderizarRotaAtual();
    window.addEventListener('hashchange', renderizarRotaAtual);
}

iniciar();