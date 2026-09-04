import { mapaderotas } from './rotas/rotas.js'
import { navbar } from './navbar/navbar.js'

const app = document.getElementById("app")
navbar(mapaderotas)

function renderizarPagina() {
    const hash = window.location.hash || '#home'
    const rota  = mapaderotas.find(tela => tela.url === hash)
    console.log(rota)
    if (rota) {
        rota.pagina(app)
    }
}
window.addEventListener("hashchange", ()=>{
    renderizarPagina()
})
renderizarPagina()
