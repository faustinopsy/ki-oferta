const listaDeProdutos = [
    { nome: "Picanha bovina", marca: "Friboi", categoria: "carnes", preco: 79.90, mercado: "Mercado Bom Preço" },
    { nome: "Alcatra bovina", marca: "Swift", categoria: "carnes", preco: 42.50, mercado: "Supermercado União" },
    { nome: "Coxão mole", marca: "Friboi", categoria: "carnes", preco: 36.90, mercado: "Atacadão da Vila" },
    { nome: "Costela bovina", marca: "Maturatta", categoria: "carnes", preco: 28.99, mercado: "Mercado Bom Preço" },
    { nome: "Filé de frango", marca: "Sadia", categoria: "carnes", preco: 18.49, mercado: "Supermercado União" },
    { nome: "Coxa e sobrecoxa", marca: "Perdigão", categoria: "carnes", preco: 12.90, mercado: "Atacadão da Vila" },
    { nome: "Linguiça toscana", marca: "Aurora", categoria: "carnes", preco: 15.75, mercado: "Mercado Bom Preço" },
    { nome: "Bisteca suína", marca: "Seara", categoria: "carnes", preco: 21.30, mercado: "Supermercado União" },
    { nome: "Carne moída", marca: "Friboi", categoria: "carnes", preco: 24.90, mercado: "Atacadão da Vila" },
    { nome: "Café torrado", marca: "Pilão", categoria: "mercearia", preco: 17.99, mercado: "Mercado Bom Preço" },
    { nome: "Arroz tipo 1", marca: "Tio João", categoria: "mercearia", preco: 22.40, mercado: "Atacadão da Vila" },
    { nome: "Feijão carioca", marca: "Kicaldo", categoria: "mercearia", preco: 8.79, mercado: "Supermercado União" },
    { nome: "Óleo de soja", marca: "Liza", categoria: "mercearia", preco: 6.49, mercado: "Mercado Bom Preço" },
    { nome: "Sabão em pó", marca: "Omo", categoria: "mercearia", preco: 19.90, mercado: "Supermercado União" },
]

function buscarProdutos({ termo = "", categoria = "" }) {
    const busca = termo.trim().toLowerCase()

    return listaDeProdutos.filter(produto => {
        const combinaCategoria = categoria === "" || produto.categoria === categoria
        const combinaTermo = busca === ""
            || produto.nome.toLowerCase().includes(busca)
            || produto.marca.toLowerCase().includes(busca)

        return combinaCategoria && combinaTermo
    })
}

export { listaDeProdutos, buscarProdutos }
