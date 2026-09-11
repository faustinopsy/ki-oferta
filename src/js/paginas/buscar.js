import produtos from '../dadosMockados/produtos.js'
function buscar(app){
    app.innerHTML = `
        <div class="container-buscar">
            <h2>Radar de Promoções</h2>
            <p class="subtitulo-buscar"> O que Você quer Comprar mais barato?</p>
            <div class="grupo-input">
            <label for="input-busca"><i data-lucide="search" id="icone-busca"></i> </label>
                <input 
                    type="text" 
                    id="input-busca" 
                    placeholder="Produto ou marca"
                    aria-label="campo busca de produto"
                >
                <button id="btn-busca"> 
                    <i data-lucide="arrow-right"></i>
                </button>
                
            </div>
            <p class="busca-atencao">Preços da semana de 10 a 16 de agosto, enviado por que mestá no mercado</p>
            <div class="categorias-busca">
                <p>Categoria</p>
                <ul class="categoria-lista">
                    <li class="lista-categoria">
                        Mercearia
                    </li>
                    <li class="lista-categoria">
                        Carnes
                    </li>
                    <li class="lista-categoria">
                        Hortifrúti
                    </li>
                    <li class="lista-categoria">
                        Bebidas
                    </li>
                    <li class="lista-categoria">
                        Limpeza
                    </li>
                    <li class="lista-categoria">
                        Higiene
                    </li>
                </ul>
            </div>

        </div>

    `
    adicionarEvento(app)
}

function adicionarEvento(app){
    const botaoBusca = document.getElementById("btn-busca")
    const listaCategoria = document.querySelectorAll(".lista-categoria")
    botaoBusca.addEventListener("click",()=>{
       produtos.pagina(app)
    })

    listaCategoria.forEach(item => item.addEventListener("click", ()=>{
        produtos.pagina(app)
    }))
}

export default {
    url: "#buscar",
    label: "Buscar",
    icon: "search",
    pagina: buscar
}