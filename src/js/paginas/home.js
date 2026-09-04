async function home(app) {
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
        <li><a href="#busca/mercearia">Mercearia</a></li>
        <li><a href="#busca/carnes">Carnes</a></li>
      </ul>
    </section>`;
}
export default { url: '#home', label: 'home', pagina: home };
