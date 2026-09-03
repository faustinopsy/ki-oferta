function home(app){
    app.innerHTML = `
    <header>
      <h1>O que você quer comprar mais barato?</h1>
    </header>

    <section class="busca">
      <form role="search">
        <label for="q">Produto ou marca</label>
        <input id="q" name="q" type="search"
               placeholder="Café, arroz, sabão" required>
        <button type="submit">Buscar</button>
      </form>
      <p>Preços da semana, enviados por quem está no mercado.</p>
    </section>

    <section class="categorias">
      <h2>Categorias</h2>
      <ul>
        <li><button type="button" data-categoria="mercearia">Mercearia</button></li>
        <li><button type="button" data-categoria="carnes">Carnes</button></li>
      </ul>
    </section>`;

    const formulario = app.querySelector("form[role='search']")
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault()
        const termo = app.querySelector("#q").value.trim()
        if (termo === "") return
        window.location.hash = `#produtos?q=${encodeURIComponent(termo)}`
    })

    const categorias = app.querySelector(".categorias")
    categorias.addEventListener("click", (evento) => {
        const botao = evento.target.closest("button[data-categoria]")
        if (!botao) return
        window.location.hash = `#produtos?categoria=${botao.dataset.categoria}`
    })
}

export default {
    url : "#home",
    label: "Inicio",
    pagina: home
}
