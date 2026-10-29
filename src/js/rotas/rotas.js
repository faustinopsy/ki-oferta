// Mapa de rotas: a lista única que o roteador e a navbar leem.
// Com label, a tela entra no menu (na ordem desta lista).
// Com label "", a tela existe, mas só é aberta por link.
import buscar from '../paginas/buscar/buscar.js'
import mapa from '../paginas/mapa/mapa.js'
import enviar from '../paginas/enviar/enviar.js'
import favorito from '../paginas/favorito/favorito.js'
import conta from '../paginas/conta/conta.js'
import produtos from '../paginas/produtos/produtos.js'
import produto from '../paginas/produto/produto.js'
import mercado from '../paginas/mercado/mercado.js'
import login from '../paginas/login/login.js'
import pendente from '../paginas/pendente/pendente.js'
import moderacao from '../paginas/moderacao/moderacao.js'
import sorteio from '../paginas/sorteio/sorteio.js'

const mapaderotas = [
    buscar,      // tela 1   menu
    mapa,        // tela 4   menu
    enviar,      // tela 9   menu
    favorito,    // tela 6   menu
    conta,       // tela 10  menu
    produtos,    // tela 2
    produto,     // tela 3
    mercado,     // tela 5
    login,       // tela 7
    pendente,    // tela 8
    moderacao,   // tela 11
    sorteio,
]

export { mapaderotas }
