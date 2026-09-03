import { mapaderotas } from './rotas/rotas.js'
import { navbar } from './navbar/navbar.js'

const app = document.getElementById("app")
navbar(mapaderotas)
function render(){
    const hash = window.location.hash || ""
    const [caminho, busca = ""] = hash.split("?")
    const parametros = new URLSearchParams(busca)
    const rota = mapaderotas.find(tela => tela.url === caminho)
    if (rota) {
        rota.pagina(app, parametros)
    } else{
        app.innerHTML = "<h1>404 - Página não encontrada</h1>"
    }
}

render()
window.addEventListener("hashchange", ()=>{
    render()
})
