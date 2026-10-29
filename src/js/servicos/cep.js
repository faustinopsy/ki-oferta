import { buscarJson } from './http.js'

// Consulta o CEP na ViaCEP e devolve o endereço com os nomes do KiOferta.
async function buscarCep(texto) {
  const cep = texto.replace(/\D/g, '')          // tira traço, ponto e espaço
  if (cep.length !== 8) {
    throw new Error('O CEP tem 8 números.')
  }

  const dados = await buscarJson(`https://viacep.com.br/ws/${cep}/json/`)
  if (dados === null || dados.erro) {
    return null                                 // formato certo, CEP inexistente
  }

  return {                                      // traduz para os nomes do app
    rua: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    uf: dados.uf,
  }
}

export { buscarCep }
