import { buscarProdutos } from '../dados/produtos.js'

function escapar(texto){
    return texto.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]))
}

function produtos(app, parametros = new URLSearchParams()){
    const termo = parametros.get("q") || ""
    const categoria = parametros.get("categoria") || ""
    const encontrados = buscarProdutos({ termo, categoria })

    app.innerHTML = `
    <header>
      <h1>${categoria ? escapar(categoria) : "Produtos"}</h1>
      <p>${encontrados.length} produto(s)</p>
    </header>

    <form role="search">
      <input id="q" name="q" type="search" value="${escapar(termo)}" placeholder="Café, arroz, sabão">
      <button type="submit">Buscar</button>
    </form>

    <ul class="lista-produtos">
      ${encontrados.map(produto => `
        <li>
          <strong>${escapar(produto.nome)}</strong> - ${escapar(produto.marca)}
          <br>R$ ${produto.preco.toFixed(2)} em ${escapar(produto.mercado)}
        </li>`).join("") || "<li>Nenhum produto encontrado.</li>"}
    </ul>

    <a href="#home">Voltar para o início</a>`

    app.querySelector("form").addEventListener("submit", (evento) => {
        evento.preventDefault()
        const novoTermo = app.querySelector("#q").value.trim()
        window.location.hash = categoria
            ? `#produtos?categoria=${categoria}&q=${encodeURIComponent(novoTermo)}`
            : `#produtos?q=${encodeURIComponent(novoTermo)}`
    })
}

export default {
    url : "#produtos",
    label: "",
    pagina: produtos
}
