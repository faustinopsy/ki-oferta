// O único arquivo do projeto que conhece o fetch.
// Toda tela pede dados a um serviço; todo serviço pede a este arquivo.

async function buscarJson(url) {
  let resposta
  try {
    resposta = await fetch(url)
  } catch (erro) {
    // o fetch só lança quando a requisição nem chegou ao servidor
    throw new Error('Sem conexão. Confira a internet e tente de novo.')
  }

  if (resposta.status === 404) {
    return null                       // não encontrado é resposta, não falha
  }
  if (!resposta.ok) {
    throw new Error(
      `O serviço respondeu ${resposta.status}. Tente de novo em instantes.`)
  }
  return resposta.json()
}

export { buscarJson }
