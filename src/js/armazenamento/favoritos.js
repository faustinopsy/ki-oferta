// Favoritos ficam salvos no aparelho (localStorage): não exigem cadastro.
// Cada item guarda o preço do dia em que foi salvo, para mostrar o que mudou.
import { favoritosDeExemplo } from '../dadosMockados/dados.js'

const CHAVE = 'kioferta:favoritos'

function lerFavoritos() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return salvo ? JSON.parse(salvo) : favoritosDeExemplo
  } catch (erro) {
    return favoritosDeExemplo        // sem acesso ao armazenamento
  }
}

function gravar(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista))
  } catch (erro) {
    // aparelho sem espaço ou modo privado: segue sem salvar
  }
}

function estaSalvo(produtoId) {
  return lerFavoritos().some(item => item.produtoId === Number(produtoId))
}

// Salva se não estava, tira se estava. Devolve true quando ficou salvo.
function alternarFavorito(produtoId, precoAtual, semana) {
  const id = Number(produtoId)
  const lista = lerFavoritos()

  if (estaSalvo(id)) {
    gravar(lista.filter(item => item.produtoId !== id))
    return false
  }
  gravar([...lista, { produtoId: id, precoSalvo: precoAtual, semana }])
  return true
}

export { lerFavoritos, estaSalvo, alternarFavorito }
