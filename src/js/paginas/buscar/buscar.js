import './buscar.css'
import { listarCategorias, semanaAtual } from '../../servicos/catalogo.js'
import { usuarioAtual } from '../../sessao/sessao.js'

// Tela 1: um elemento dominante, a caixa de busca.
// As categorias são o segundo caminho, para quem não sabe o que digitar.
function buscar(app) {
    const usuario = usuarioAtual()

    app.innerHTML = `
        <section class="tela buscar">
            <p class="buscar__marca"><i data-lucide="radar"></i> KiOferta</p>

            <div class="buscar__chamada">
                <h1 class="buscar__titulo">O que você quer comprar mais barato?</h1>
                <form class="buscar__form" id="form-busca" role="search">
                    <label class="buscar__campo">
                        <i data-lucide="search"></i>
                        <span class="oculto">Produto ou marca</span>
                        <input id="input-busca" type="search"
                               placeholder="Produto ou marca" autocomplete="off">
                    </label>
                    <button class="botao botao--destaque buscar__ir" aria-label="Buscar">
                        <i data-lucide="arrow-right"></i>
                    </button>
                </form>
                <p class="apoio">
                    Preços da ${semanaAtual().texto}, enviados por quem está no mercado.
                </p>
            </div>

            <section class="tela__secao">
                <h2 class="tela__subtitulo">Categorias</h2>
                <ul class="buscar__categorias">
                    ${listarCategorias()
                        .map(categoria => `
                            <li>
                                <a class="buscar__categoria"
                                   href="#produtos?categoria=${encodeURIComponent(categoria.nome)}">
                                    <i data-lucide="${categoria.icone}"></i>
                                    ${categoria.nome}
                                </a>
                            </li>`)
                        .join('')}
                </ul>
            </section>

            <footer class="buscar__rodape">
                <p>Viu uma promoção no mercado?</p>
                <a class="botao" href="${usuario ? '#enviar' : '#login?volta=enviar'}">
                    ${usuario ? 'Enviar' : 'Entrar'}
                </a>
            </footer>
        </section>`

    adicionarEvento(app)
}

function adicionarEvento(app) {
    const form = document.getElementById('form-busca')
    const campo = document.getElementById('input-busca')

    form.addEventListener('submit', evento => {
        evento.preventDefault()
        const texto = campo.value.trim()
        // a busca vira parâmetro da rota: #produtos?busca=café
        window.location.hash = texto
            ? `#produtos?busca=${encodeURIComponent(texto)}`
            : '#produtos'
    })
}

export default {
    url: '#buscar',
    label: 'Buscar',
    icon: 'search',
    pagina: buscar,
}
