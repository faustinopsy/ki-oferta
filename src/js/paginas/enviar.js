// src/paginas/enviar.js
 
async function enviar(app) {
  app.innerHTML = `
    <header><h1>Enviar promoção</h1></header>
 
    <form class="form-oferta">
      <fieldset>
        <legend>Identificar o produto</legend>
        <button type="button" data-acao="foto">Foto da etiqueta</button>
        <button type="button" data-acao="codigo">Ler código</button>
      </fieldset>
      <label for="produto">Produto identificado</label>
      <input id="produto" name="produto" type="text"
             minlength="3" required>
      <label for="preco">Preço na etiqueta</label>
      <input id="preco" name="preco" type="number"
             min="0.01" step="0.01" required>
      <label>
        <input type="checkbox" name="soCartao" value="1">
        Preço só com cartão da loja
      </label>
      <label for="mercado">Mercado</label>
      <input id="mercado" name="mercado" type="text" required>
      <button type="submit">Enviar promoção</button>
    </form>`;
}
export default { 
    url: '#enviar', 
    label: 'Enviar', 
    pagina: enviar 
};
