import { createIcons, icons } from 'lucide'
import { mapaderotas } from './rotas/rotas.js'
import { navbar } from './navbar/navbar.js'
import naoEncontrada from './paginas/naoEncontrada/naoEncontrada.js'

const app = document.getElementById('app')

function renderizarPagina() {
    const hash = window.location.hash || '#buscar'
    const [url, query] = hash.split('?')            // "#produto", "id=3"
    const parametros = new URLSearchParams(query)   // .get("id") -> "3"
    const rota = mapaderotas.find(tela => tela.url === url)

    // telas fora do menu dizem, em "aba", qual item do menu fica aceso
    navbar(mapaderotas, rota ? (rota.aba || rota.url) : '')
    window.scrollTo(0, 0)

    if (!rota) {
        naoEncontrada.pagina(app, parametros)
    } else {
        rota.pagina(app, parametros)
    }
    createIcons({ icons })                          // depois de cada tela
}

window.addEventListener('hashchange', () => {
    renderizarPagina()
})
renderizarPagina()
