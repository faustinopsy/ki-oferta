const livros = [
    { titulo: "php", preco: 15.60, descricao: "aprenda php na prática"  },
    { titulo: "python", preco: 20.00, descricao: "aprenda python na prática" },
    { titulo: "java", preco: 30.00, descricao: "aprenda java na prática"  }
]

const livroselecionado = livros.filter(livro => livro.preco >= 20)
console.log(livroselecionado)